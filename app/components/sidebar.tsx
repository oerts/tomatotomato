import { UserButton } from "@clerk/remix";
import { Link } from "@remix-run/react";
import { type SerializeFrom } from "@remix-run/node";
import { type InferSelectModel } from "drizzle-orm";

import { type folders } from "db";

type Props = {
  folders: SerializeFrom<InferSelectModel<typeof folders>>[];
};

function Sidebar({ folders }: Props) {
  return (
    <nav className="flex flex-col px-4 py-6 border-r-2 border-border justify-between">
      <Link to="/dashboard">
        <p>Qukbuk</p>
      </Link>
      <div className="flex flex-col gap-2">
        {folders.map(({ id, name }) => (
          <Link key={id} to={`/dashboard/f/${id}`}>
            <p>{name}</p>
          </Link>
        ))}
      </div>
      <UserButton />
    </nav>
  );
}

export default Sidebar;
