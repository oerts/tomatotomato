import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { eq } from "drizzle-orm";

import { db, recipes } from "~/db";
import { Button } from "~/components/ui";
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-3xl font-bold">All recipes</p>
        <Link to="/dashboard/add">
          <Button className="hidden md:block">Add recipe</Button>
          <Button className="block md:hidden">
            <PlusIcon />
          </Button>
        </Link>
      </div>
      <div className="grid gap-2 place-content-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Index;
