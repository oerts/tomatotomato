import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  redirect,
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { eq } from "drizzle-orm";
import { conform, list, useFieldList, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";

import { db, folders, recipes } from "db";
import {
  Button,
  Input,
  Label,
  SelectGroup,
  SelectItem,
  Textarea,
} from "~/components/ui";
import Select from "~/components/select";
import { addSchema } from "lib/validation";
import { TrashIcon } from "@radix-ui/react-icons";

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const submission = parse(formData, { schema: addSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  const [recipe] = await db
    .insert(recipes)
    .values({
      ...submission.value,
      userId: userId,
    })
    .returning({ id: recipes.id });

  return redirect(`/dashboard/${recipe.id}`);
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  return await db.select().from(folders).where(eq(folders.userId, userId));
};

function Add() {
  const lastSubmission = useActionData<typeof action>();
  const folders = useLoaderData<typeof loader>();

  const [form, fields] = useForm({
    id: "add-recipe",
    lastSubmission,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: addSchema });
    },
  });

  const ingredients = useFieldList(form.ref, fields.ingredients);
  const directions = useFieldList(form.ref, fields.directions);

  return (
    <Form method="post" className="max-w-lg" {...form.props}>
      <div>
        <Label htmlFor={fields.href.id}>Link</Label>
        <Input {...conform.input(fields.href, { type: "url" })} />
        <p>{fields.href.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.title.id}>Title</Label>
        <Input {...conform.input(fields.title, { type: "text" })} />
        <p>{fields.title.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.description.id}>Description</Label>
        <Textarea {...conform.input(fields.description)} />
        <p>{fields.description.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.image.id}>Image</Label>
        <Input {...conform.input(fields.image, { type: "url" })} />
        <p>{fields.image.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.folderId.id}>Image</Label>
        <Select
          placeholder="Choose a folder"
          {...conform.input(fields.folderId)}
        >
          <SelectGroup>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </Select>
        <p>{fields.folderId.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.ingredients.id}>Ingredients</Label>
        <ul className="flex flex-col gap-4">
          {ingredients.map((ingredient, index) => (
            <li key={ingredient.key}>
              <div className="flex gap-2">
                <Input name={ingredient.name} />
                <Button
                  variant="destructive"
                  size="icon"
                  {...list.remove(fields.ingredients.name, { index })}
                >
                  <TrashIcon />
                </Button>
              </div>
              <p>{ingredient.error}</p>
            </li>
          ))}
        </ul>
        <div>
          <Button variant="secondary" {...list.insert(fields.ingredients.name)}>
            Add ingredient
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor={fields.directions.id}>Directions</Label>

        <ul className="flex flex-col gap-4">
          {directions.map((direction, index) => (
            <li key={direction.key}>
              <div className="flex gap-2">
                <Input name={direction.name} />
                <Button
                  variant="destructive"
                  size="icon"
                  {...list.remove(fields.directions.name, { index })}
                >
                  <TrashIcon />
                </Button>
              </div>
              <p>{direction.error}</p>
            </li>
          ))}
        </ul>
        <div>
          <Button variant="secondary" {...list.insert(fields.directions.name)}>
            Add direction
          </Button>
        </div>
      </div>

      <Button type="submit">Add recipe</Button>
    </Form>
  );
}

export default Add;
