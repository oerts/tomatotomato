import { getAuth } from "@clerk/remix/ssr.server";
import { parse } from "@conform-to/zod";
import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

import { db, folders } from "db";
import { folderSchema } from "lib/validation";

export const action = async (args: ActionFunctionArgs) => {
  invariant(args.params.folderId, "Missing folderId param");
  const formData = await args.request.formData();
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const submission = parse(formData, { schema: folderSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  const [folder] = await db
    .update(folders)
    .set({ name: submission.value.name })
    .where(eq(folders.id, args.params.folderId))
    .returning({ id: folders.id });

  return redirect(`/dashboard/f/${folder.id}`);
};
