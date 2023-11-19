import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  redirect,
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db, folders, recipes } from "db";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";

const schema = z
  .object({
    folderId: z.string(),
    image: z.string().url(),
    title: z.string().min(1),
    description: z.string(),
    ingredients: z.string().array(),
    directions: z.string().array(),
  })
  .required({
    title: true,
  });

export const action = async (args: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await args.request.formData());
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    return json({ error: parsed.error.format() });
  }

  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const [recipe] = await db
    .insert(recipes)
    .values({
      ...parsed.data,
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
  const data = useActionData<typeof action>();
  const folders = useLoaderData<typeof loader>();

  return (
    <div>
      <Form method="post">
        <Label htmlFor="title">Title</Label>
        <Input type="text" name="title" />
        {data && data.error && <p>{data.error.title?._errors[0]}</p>}
        <Label htmlFor="description">Description</Label>
        <Input type="text" name="description" />
        {data && data.error && <p>{data.error.description?._errors[0]}</p>}
        <Label htmlFor="folder">Folder</Label>
        <Select name="folderId">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Add recipe</Button>
      </Form>
    </div>
  );
}

export default Add;
