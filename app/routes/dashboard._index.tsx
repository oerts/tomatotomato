import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { db, recipes } from "~/db";
import { Button } from "~/components/ui";
import RecipeCard from "~/components/recipe-card";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  return await db.select().from(recipes).where(eq(recipes.userId, userId));
};

function Index() {
  const recipes = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 py-12">
      <div className="flex justify-between items-center">
        <p className="text-3xl font-bold">All recipes</p>
        <Link to="/dashboard/add">
          <Button>Add recipe</Button>
        </Link>
      </div>
      <div className="grid grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Index;
