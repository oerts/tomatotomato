import { getAuth } from "@clerk/remix/ssr.server";
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import logo from "../../public/tomatotomatologo-black.svg";

export const meta: MetaFunction = () => {
  return [
    { title: "Tomatotomato" },
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
    <div className="max-w-6xl px-2 mx-auto">
      <nav className="flex justify-between items-center pt-8">
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
        <Link to="/sign-in">
          <Button>Sign in</Button>
        </Link>
      </nav>

      <h1 className="text-3xl md:text-6xl font-bold leading-none mt-8 md:mt-32">
        No more frantic searches for that amazing recipe you stumbled upon last
        week.
      </h1>
      <h2 className="text-xl md:text-3xl font-light tracking-wide mt-3 md:mt-6">
        Say hello to tomatotomato, the ultimate solution to streamline your
        culinary adventures!
      </h2>
      <span className="block text-sm mt-4">
        pronounced /təˈmeɪtoʊ təˈmɑːtəʊ/
      </span>
    </div>
  );
}
