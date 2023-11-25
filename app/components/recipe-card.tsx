import { Form, Link } from "@remix-run/react";
import { type SerializeFrom } from "@remix-run/node";
import { type InferSelectModel } from "drizzle-orm";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

import { type recipes } from "db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
} from "./ui";
import fallback from "../../public/fallback.svg";

type Props = {
  recipe: SerializeFrom<InferSelectModel<typeof recipes>>;
};

function RecipeCard({
  recipe: { id, image, title, href, description, servings, cookTime },
}: Props) {
  return (
    <Card className="overflow-hidden max-w-xs">
      <Link className="flex-grow" to={href || `/dashboard/${id}`}>
        {image ? (
          <img
            src={image}
            alt={description || "Prepared dish"}
            className="h-36 w-full object-cover"
          />
        ) : (
          <div className="h-36 w-full bg-secondary grid place-content-center">
            <img className="h-24" src={fallback} alt="" />
          </div>
        )}
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Link>
      <CardFooter>
        <div>
          <p className="text-sm leading-none mb-2">
            <strong>Serving size:</strong> {servings}
          </p>
          <p className="text-sm leading-none">
            <strong>Cook time:</strong> {cookTime} mins
          </p>
        </div>
        <Form
          className="mr-2 ml-auto"
          action={`${id}/destroy`}
          method="post"
          onSubmit={(event) => {
            const response = confirm(
              "Please confirm you want to delete this record."
            );
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <Button size="icon" type="submit">
            <TrashIcon width={16} height={16} />
          </Button>
        </Form>
        <Link to={`${id}/edit`}>
          <Button variant="secondary" size="icon">
            <Pencil1Icon width={16} height={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default RecipeCard;
