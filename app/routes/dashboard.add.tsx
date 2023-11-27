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
    <div className="p-4 md:py-12">
      <Form
        method="post"
        {...form.props}
        className="grid gap-4 md:grid-cols-2 md:gap-12"
      >
        <div className="flex flex-col gap-2 md:gap-4">
          <Label htmlFor={fields.href.id}>Link</Label>
          <Input {...conform.input(fields.href, { type: "url" })} />
          <span className="text-sm font-medium leading-none text-destructive">
            {fields.href.errors}
          </span>

          <Label htmlFor={fields.title.id}>Title</Label>
          <Input {...conform.input(fields.title, { type: "text" })} />
          <span className="text-sm font-medium leading-none text-destructive">
            {fields.title.errors}
          </span>

          <Label htmlFor={fields.description.id}>Description</Label>
          <Textarea {...conform.input(fields.description)} />
          <span className="text-sm font-medium leading-none text-destructive">
            {fields.description.errors}
          </span>

          <div className="grid gap-2 md:grid-cols-3 md:gap-4">
            <div>
              <Label htmlFor={fields.folderId.id}>Folder</Label>
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
              <span className="text-sm font-medium leading-none text-destructive">
                {fields.folderId.errors}
              </span>
            </div>

            <div>
              <Label htmlFor={fields.servings.id}>Servings</Label>
              <Input {...conform.input(fields.servings)} />
              <span className="text-sm font-medium leading-none text-destructive">
                {fields.servings.errors}
              </span>
            </div>

            <div>
              <Label htmlFor={fields.cookTime.id}>Cook time</Label>
              <div className="flex items-center gap-2">
                <Input {...conform.input(fields.cookTime)} />
                <span>mins</span>
              </div>
              <span className="text-sm font-medium leading-none text-destructive">
                {fields.cookTime.errors}
              </span>
            </div>
          </div>

          <Label htmlFor={fields.image.id}>Image</Label>
          <Input {...conform.input(fields.image, { type: "url" })} />
          <span className="text-sm font-medium leading-none text-destructive">
            {fields.image.errors}
          </span>
        </div>

        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex flex-col gap-4">
            <Label htmlFor={fields.ingredients.id}>Ingredients</Label>
            <Button
              variant="secondary"
              {...list.insert(fields.ingredients.name)}
            >
              Add ingredient
            </Button>
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
                  <span className="text-sm font-medium leading-none text-destructive">
                    {ingredient.error}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor={fields.directions.id}>Directions</Label>
            <Button
              variant="secondary"
              {...list.insert(fields.directions.name)}
            >
              Add direction
            </Button>
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
                  <span className="text-sm font-medium leading-none text-destructive">
                    {direction.error}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col items-start gap-2">
          <span className="text-sm font-medium leading-none text-destructive">
            {form.error}
          </span>
          <Button type="submit">Add recipe</Button>
        </div>
      </Form>
    </div>
  );
}

export default Add;
