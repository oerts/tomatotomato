import { useState } from "react";
import { UserButton, useUser } from "@clerk/remix";
import { Link } from "@remix-run/react";
import { type SerializeFrom } from "@remix-run/node";
import { type InferSelectModel } from "drizzle-orm";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { type folders } from "~/db";
import { Button } from "./ui";
import Folders from "./folders";
import logo from "../../public/tomatotomatologo.svg";

type Props = {
  folders: SerializeFrom<InferSelectModel<typeof folders>>[];
};

function Sidebar({ folders }: Props) {
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  return (
    <nav className="bg-primary text-white flex flex-col px-2 py-4 md:px-8 md:py-12 md:border-r-2 md:border-dashed md:border-secondary">
      <div className={`flex items-center ${open && "mb-6"} md:mb-12`}>
        <Link className="flex items-center gap-2 mr-auto" to="/dashboard">
          <img
            className="w-16"
            src={logo}
            alt="tomato by Made from Noun Project (CC BY 3.0)"
          />
          <p className="text-lg md:text-2xl leading-none">
            tomato <br />
            <strong className="text-xl md:text-3xl">tomato</strong>
          </p>
        </Link>
        <div className="flex items-center md:hidden">
          <UserButton />
          <Button variant="ghost" onClick={() => setOpen(!open)}>
            <HamburgerMenuIcon width={24} height={24} />
          </Button>
        </div>
      </div>

      {open && <Folders folders={folders} />}

      <Folders folders={folders} desktop />

      <div className="hidden md:flex items-center gap-2">
        <div className="border-2 border-dashed w-min rounded-full">
          <UserButton />
        </div>
        <span>{user?.fullName}</span>
      </div>
    </nav>
  );
}

export default Sidebar;
