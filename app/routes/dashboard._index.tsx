import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { db, recipes } from "db";
import { Button } from "~/components/ui";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  return await db.select().from(recipes).where(eq(recipes.userId, userId));
};

function Index() {
  const recipes = useLoaderData<typeof loader>();

  return (
    <div>
      <p>All recipes</p>
      <Link to="/dashboard/add">
        <Button>Add recipe</Button>
      </Link>
      {recipes.map((recipe) => (
        <Link key={recipe.id} to={`/dashboard/${recipe.id}`}>
          <p>{recipe.title}</p>
        </Link>
      ))}
    </div>
  );
}

export default Index;
