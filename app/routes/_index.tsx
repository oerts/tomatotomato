import { UserButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in");
  }

  return {};
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Qukbuk</h1>
      <p>You are signed in!</p>
      <UserButton />
    </div>
  );
}
