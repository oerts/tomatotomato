import { UserButton } from "@clerk/remix";
import { Link } from "@remix-run/react";

type Props = {
  folders: {
    folder: string | null;
  }[];
};

function Sidebar({ folders }: Props) {
  return (
    <nav className="flex flex-col px-4 py-6 border-r-2 border-border justify-between">
      <Link to="/recipes">
        <p>Qukbuk</p>
      </Link>
      <div className="flex flex-col gap-2">
        {folders.map(({ folder }) => (
          <Link key={folder} to={`/recipes/folder/${folder}`}>
            <p className="capitalize">{folder}</p>
          </Link>
        ))}
      </div>
      <UserButton />
    </nav>
  );
}

export default Sidebar;
