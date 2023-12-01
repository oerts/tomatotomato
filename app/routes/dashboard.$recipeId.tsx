import { Link, useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { db, recipes } from "~/db";
import invariant from "tiny-invariant";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui";
import {
  CaretSortIcon,
  CheckCircledIcon,
  ExternalLinkIcon,
  Pencil1Icon,
  Share1Icon,
} from "@radix-ui/react-icons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.recipeId, "Missing recipeId param");

  const [recipe] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, params.recipeId));

  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }

  return recipe;
};

export default function Recipe() {
  const {
    title,
    description,
    image,
    href,
    servings,
    cookTime,
    ingredients,
    directions,
  } = useLoaderData<typeof loader>();

  return (
    <div className="p-6 md:max-w-screen-xl md:mx-auto md:p-12 grid place-content-start md:grid-cols-3 md:gap-12">
      <img
        className="col-span-2 md:col-span-1 h-full object-cover rounded-2xl"
        src={image || ""}
        alt="The end result of the recipe"
      />
      <div
        className={`col-span-2 mt-6 md:mt-0 md:col-span-1 md:row-start-2 ${
          ingredients &&
          "bg-secondary px-6 py-4 rounded-2xl border-2 border-dashed sticky top-6"
        }`}
      >
        {ingredients && (
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full flex justify-between items-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Ingredients
              </h2>
              <CaretSortIcon />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <ul>
                {ingredients?.map((ingredient, index) => (
                  <li className="flex items-center gap-2 mb-2" key={index}>
                    <CheckCircledIcon className="text-primary" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
      <div className="col-span-2 md:row-start-1 md:row-end-3">
        <h1 className="text-4xl font-extrabold tracking-tight mt-6 mb-8 lg:text-5xl">
          {title}
        </h1>
        <div className="flex items-center mt-6 px-6 py-4 rounded-2xl bg-secondary border-2 border-primary border-dashed">
          <div className="flex flex-col gap-2 md:flex-row md:gap-8">
            <span>
              Servings: <br /> <strong>{servings}</strong>
            </span>
            <span>
              Time: <br /> <strong>{cookTime} mins</strong>
            </span>
          </div>

          {href && (
            <Button className="flex items-center gap-1 ml-auto" variant="link">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex gap-2 items-center"
              >
                <ExternalLinkIcon />
                <span>Source</span>
              </a>
            </Button>
          )}

          <Button className={`${!href && "ml-auto"}`} variant="outline">
            <Link to="edit">
              <Pencil1Icon />
            </Link>
          </Button>

          <Button className="ml-2">
            <Share1Icon />
          </Button>
        </div>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{description}</p>

        {directions && (
          <>
            <h2 className="scroll-m-20 mt-12 text-3xl font-semibold tracking-tight mb-6">
              How to make it
            </h2>

            <ol className="flex flex-col gap-6">
              {directions?.map((direction, index) => {
                return (
                  <li
                    className="flex items-center justify-start gap-2"
                    key={index}
                  >
                    <div className="bg-secondary border-2 border-dashed w-10 h-10 rounded-full flex justify-end items-end">
                      <span className="text-3xl font-black w-10 h-10">
                        {index + 1}
                      </span>
                    </div>
                    <span>{direction}</span>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
