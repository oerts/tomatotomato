import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

import { db, folders } from "~/db";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.folderId, "Missing folderId param");
  await db.delete(folders).where(eq(folders.id, params.folderId));
  return redirect("/dashboard");
};
