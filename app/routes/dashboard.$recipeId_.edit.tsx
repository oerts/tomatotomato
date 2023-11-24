import {
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { eq } from "drizzle-orm";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { conform, list, useFieldList, useForm } from "@conform-to/react";
import { TrashIcon } from "@radix-ui/react-icons";
import { parse } from "@conform-to/zod";
import { getAuth } from "@clerk/remix/ssr.server";

import { db, folders, recipes } from "db";
import {
  Input,
  Textarea,
  Button,
  Label,
  SelectGroup,
  SelectItem,
} from "~/components/ui";
import { addSchema } from "lib/validation";
import Select from "~/components/select";

export const action = async (args: ActionFunctionArgs) => {
  invariant(args.params.recipeId, "Missing recipeId param");
  const formData = await args.request.formData();
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const submission = parse(formData, { schema: addSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  const [recipe] = await db
    .update(recipes)
    .set({ ...submission.value })
    .where(eq(recipes.id, args.params.recipeId))
    .returning({ id: recipes.id });

  return redirect(`/dashboard/${recipe.id}`);
};

export const loader = async (args: LoaderFunctionArgs) => {
  invariant(args.params.recipeId, "Missing recipeId param");
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const [recipe] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, args.params.recipeId));

  const folderSelection = await db
    .select()
    .from(folders)
    .where(eq(folders.userId, userId));

  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }

  return { recipe, folders: folderSelection };
};

export default function Edit() {
  const { recipe, folders } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "add-recipe",
    defaultValue: {
      ...recipe,
    },
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

      <div className="flex gap-4">
        <div className="flex-grow">
          <Label htmlFor={fields.servings.id}>Servings</Label>
          <Input {...conform.input(fields.servings)} />
          <p>{fields.servings.errors}</p>
        </div>

        <div className="flex-grow">
          <Label htmlFor={fields.cookTime.id}>Cook time</Label>
          <div className="flex items-center gap-2">
            <Input {...conform.input(fields.cookTime)} />
            <span>mins</span>
          </div>
          <p>{fields.cookTime.errors}</p>
        </div>
      </div>

      <div>
        <Label htmlFor={fields.image.id}>Image</Label>
        <Input {...conform.input(fields.image, { type: "url" })} />
        <p>{fields.image.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.folderId.id}>Folder</Label>
        <Select
          placeholder={
            folders.find((folder) => folder.id === recipe.folderId)?.name ||
            "Choose a folder"
          }
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
                <Input
                  name={ingredient.name}
                  defaultValue={ingredient.defaultValue}
                />
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
                <Input
                  name={direction.name}
                  defaultValue={direction.defaultValue}
                />
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

      <Button type="submit">Save changes</Button>
    </Form>
  );
}
