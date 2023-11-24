import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { db, recipes } from "db";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.recipeId, "Missing recipeId param");

  const [recipe] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, params.recipeId));

  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }

  return recipe;
};

export default function Recipe() {
  const recipe = useLoaderData<typeof loader>();

  return <div>{recipe.title}</div>;
}
