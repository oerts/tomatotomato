import { type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { db, folders } from "db";
import RecipeCard from "~/components/recipe-card";
import { Button } from "~/components/ui";
import { Pencil1Icon } from "@radix-ui/react-icons";

export const loader = async (args: LoaderFunctionArgs) => {
  const folderId = args.params.folderId;

  if (!folderId) return;

  return await db.query.folders.findFirst({
    columns: {
      name: true,
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
    <div className="flex flex-col gap-4 py-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="capitalize font-bold text-3xl">{folder.name}</h2>
          <Link to="edit">
            <Button variant="ghost">
              <Pencil1Icon />
            </Button>
          </Link>
        </div>
        <Link to="/dashboard/add">
          <Button>Add recipe</Button>
        </Link>
      </div>
      <div className="grid grid-cols-4">
        {folder.recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Folder;
