import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { and, eq } from "drizzle-orm";
import { getAuth } from "@clerk/remix/ssr.server";

import { db } from "db";
import { recipes } from "db/schema";

export const loader = async (args: LoaderFunctionArgs) => {
  const folder = args.params.folder;
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");
  if (!folder) return;

  return {
    folder,
    recipes: await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.userId, userId), eq(recipes.folder, folder))),
  };
};

function RecipesFolder() {
  const { recipes, folder } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="capitalize font-bold text-4xl">{folder}</h2>
      {recipes.map((recipe) => (
        <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
          <p>{recipe.title}</p>
        </Link>
      ))}
    </div>
  );
}

export default RecipesFolder;
