import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { db, recipes } from "~/db";
import RecipeCard from "~/components/recipe-card";
import LoadingPage from "~/components/loading-page";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  return await db.select().from(recipes).where(eq(recipes.userId, userId));
};

function Index() {
  const navigation = useNavigation();
  const recipes = useLoaderData<typeof loader>();

  return navigation.state === "loading" ? (
    <LoadingPage />
  ) : (
    <div className="grid gap-2 place-content-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

export default Index;
