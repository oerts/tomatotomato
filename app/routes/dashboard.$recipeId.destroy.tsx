import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

import { db, recipes } from "db";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.recipeId, "Missing recipeId param");
  await db.delete(recipes).where(eq(recipes.id, params.recipeId));
  return redirect("/dashboard");
};
