import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { eq } from "drizzle-orm";
import { db, folders } from "~/db";

import Container from "~/components/container";
import Sidebar from "~/components/sidebar";
import { Button, Dialog, DialogTrigger } from "~/components/ui";
import EditFolder from "~/components/edit-folder";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/sign-in");

  const userFolders = await db
    .select()
    .from(folders)
    .where(eq(folders.userId, userId));

  return {
    userFolders,
  };
};

function Dashboard() {
  const { userFolders: folders } = useLoaderData<typeof loader>();
  const params = useParams();

  const folder = folders.find((folder) => folder.id === params.folderId);

  return (
    <Container sidebar={<Sidebar folders={folders} />}>
      <div className="flex flex-col gap-4">
        <div className="pt-4 md:pt-8 pb-2 md:pb-4 flex items-center border-b border-secondary">
          {folder ? (
            <>
              <h2 className="ml-4 md:ml-12 text-3xl font-bold capitalize">
                {folder.name}
              </h2>
              <Dialog>
                <DialogTrigger>
                  <Button className="md:ml-2" variant="ghost">
                    <Pencil1Icon />
                  </Button>
                </DialogTrigger>
                <EditFolder name={folder.name} />
              </Dialog>
            </>
          ) : (
            <p className="ml-4 md:ml-12 text-3xl font-bold">All recipes</p>
          )}
          <Link className="mr-4 md:mr-12 ml-auto" to="/dashboard/add">
            <Button className="hidden md:block">Add recipe</Button>
            <Button className="block md:hidden">
              <PlusIcon />
            </Button>
          </Link>
        </div>
        <div className="px-4 md:px-12 py-6 md:py-6">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
