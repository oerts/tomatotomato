import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db, folders } from "~/db";
import { eq } from "drizzle-orm";

import Container from "~/components/container";
import Sidebar from "~/components/sidebar";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  return await db.select().from(folders).where(eq(folders.userId, userId));
};

function Dashboard() {
  const folders = useLoaderData<typeof loader>();

  return (
    <Container sidebar={<Sidebar folders={folders} />}>
      <Outlet />
    </Container>
  );
}

export default Dashboard;
