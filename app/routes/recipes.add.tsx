import { getAuth } from "@clerk/remix/ssr.server";
import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";

import { db } from "db";
import { recipes } from "db/schema";
import { Button, Input, Label } from "~/components/ui";

const schema = z
  .object({
    title: z.string().min(1),
    description: z.string(),
    folder: z.string(),
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

  const recipe = await db
    .insert(recipes)
    .values({
      ...parsed.data,
      userId: userId,
      folder: parsed.data.folder.toLowerCase(),
    })
    .returning({ id: recipes.id });

  return redirect(`/recipes/${recipe[0].id}`);
};

function Add() {
  const data = useActionData<typeof action>();

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
        <Input type="text" name="folder" />
        {data && data.error && <p>{data.error.folder?._errors[0]}</p>}
        <Button>Add recipe</Button>
      </Form>
    </div>
  );
}

export default Add;
