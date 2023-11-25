import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { type SerializeFrom } from "@remix-run/node";
import { type InferSelectModel } from "drizzle-orm";

import { type folders } from "db";
import { Button, Dialog, DialogTrigger } from "./ui";
import CreateFolder from "./create-folder";

type Props = {
  folders: SerializeFrom<InferSelectModel<typeof folders>>[];
  desktop?: boolean;
};

export default function Folders({ folders, desktop }: Props) {
  return (
    <div
      className={`${
        desktop ? "hidden md:flex" : "flex md:hidden"
      } flex-col flex-grow`}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold tracking-tight">Folders</h4>
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost">
              <PlusIcon />
            </Button>
          </DialogTrigger>
          <CreateFolder />
        </Dialog>
      </div>
      <Link className="mb-1" to="/dashboard">
        All recipes
      </Link>
      {folders.map(({ id, name }) => (
        <Link className="mb-1" key={id} to={`/dashboard/f/${id}`}>
          <p>{name}</p>
        </Link>
      ))}
    </div>
  );
}
