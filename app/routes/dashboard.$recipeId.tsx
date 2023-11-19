import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { db, recipes } from "db";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.recipeId;

  if (!id) return;

  const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));

  return recipe;
};

export default function Recipe() {
  const recipe = useLoaderData<typeof loader>();

  return <div>{recipe.title}</div>;
}
