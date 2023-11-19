import { getAuth } from "@clerk/remix/ssr.server";
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Qukbuk" },
    { name: "description", content: "Open source recipe organizer" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (userId) {
    return redirect("/dashboard");
  }

  return {};
};

export default function Index() {
  return (
    <div>
      Qukbuk
      <Link to="/sign-in">
        <Button>Sign in</Button>
      </Link>
    </div>
  );
}
