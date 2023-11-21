import { Link } from "@remix-run/react";
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
  recipe: { id, image, title, href, description },
}: Props) {
  return (
    <Link to={href || `/dashboard/${id}`} className="max-w-xs">
      <Card className="overflow-hidden">
        <img
          src={image}
          alt={description || "A photo of the prepared dish"}
          className="h-36 w-full object-cover"
        />
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <div>
            <p className="text-sm leading-none mb-2">
              <strong>Serving size:</strong> 2 people
            </p>
            <p className="text-sm leading-none">
              <strong>Cook time:</strong> 60 mins
            </p>
          </div>
          <Button variant="destructive" size="icon" className="mr-2 ml-auto">
            <TrashIcon width={16} height={16} />
          </Button>
          <Button size="icon">
            <Pencil1Icon width={16} height={16} />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default RecipeCard;
