import { getAuth } from "@clerk/remix/ssr.server";
import { parse } from "@conform-to/zod";
import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";

import { db, folders } from "db";
import { folderSchema } from "lib/validation";

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const submission = parse(formData, { schema: folderSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  const [folder] = await db
    .insert(folders)
    .values({ name: submission.value.name, userId: userId })
    .returning({ id: folders.id });

  return redirect(`/dashboard/f/${folder.id}`);
};
