import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { db, folders } from "~/db";
import RecipeCard from "~/components/recipe-card";

export const loader = async (args: LoaderFunctionArgs) => {
  const folderId = args.params.folderId;

  if (!folderId) return;

  return await db.query.folders.findFirst({
    columns: {
      name: true,
      id: true,
    },
    with: {
      recipes: true,
    },
    where: eq(folders.id, folderId),
  });
};

function Folder() {
  const folder = useLoaderData<typeof loader>();

  return (
    <div className="grid gap-2 place-content-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {folder.recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

export default Folder;
