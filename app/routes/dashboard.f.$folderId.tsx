import { type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db, folders } from "db";
import { eq } from "drizzle-orm";

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
    <div>
      <h2 className="capitalize font-bold text-4xl">{folder.name}</h2>
      {folder.recipes.map((recipe) => (
        <Link key={recipe.id} to={`/dashboard/${recipe.id}`}>
          <p>{recipe.title}</p>
        </Link>
      ))}
    </div>
  );
}

export default Folder;
