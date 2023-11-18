import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { db } from "db";
import { recipes } from "db/schema";
import { eq } from "drizzle-orm";
import Container from "~/components/container";
import Sidebar from "~/components/sidebar";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const folders = await db
    .selectDistinct({ folder: recipes.folder })
    .from(recipes)
    .where(eq(recipes.userId, userId));

  return folders;
};

function Recipes() {
  const folders = useLoaderData<typeof loader>();

  return (
    <Container sidebar={<Sidebar folders={folders} />}>
      <Outlet />
    </Container>
  );
}

export default Recipes;
