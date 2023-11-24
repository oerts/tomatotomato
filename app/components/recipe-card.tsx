import { Form, Link } from "@remix-run/react";
import { type SerializeFrom } from "@remix-run/node";
import { type InferSelectModel } from "drizzle-orm";

import { type recipes } from "db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
} from "./ui";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

type Props = {
  recipe: SerializeFrom<InferSelectModel<typeof recipes>>;
};

function RecipeCard({
  recipe: { id, image, title, href, description, servings, cookTime },
}: Props) {
  return (
    <Card className="overflow-hidden max-w-xs">
      <Link to={href || `/dashboard/${id}`}>
        {image && (
          <img
            src={image}
            alt={description || "A photo of the prepared dish"}
            className="h-36 w-full object-cover"
          />
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
          <Button variant="destructive" size="icon" type="submit">
            <TrashIcon width={16} height={16} />
          </Button>
        </Form>
        <Link to={`${id}/edit`}>
          <Button size="icon">
            <Pencil1Icon width={16} height={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default RecipeCard;
