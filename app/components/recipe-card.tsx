import { Form, Link } from "@remix-run/react";
import { type SerializeFrom } from "@remix-run/node";
import { type InferSelectModel } from "drizzle-orm";
import {
  ExternalLinkIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { type recipes } from "~/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
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
      <Link className="flex-grow" to={`/dashboard/${id}`}>
        {image ? (
          <div className="h-36 relative">
            <img
              src={image}
              alt={description || "Prepared dish"}
              className="h-full w-full object-cover"
            />
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 right-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="secondary">
                  <ExternalLinkIcon />
                </Button>
              </a>
            )}
          </div>
        ) : (
          <div className="h-36 w-full bg-secondary grid place-content-center">
            <img className="h-24" src={fallback} alt="" />
          </div>
        )}
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-4">
            {description}
          </CardDescription>
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
        <Dialog>
          <DialogTrigger className="mr-2 ml-auto">
            <Button size="icon" variant="destructive" type="submit">
              <TrashIcon width={16} height={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Recipe</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this recipe?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Form action={`${id}/destroy`} method="post">
                <Button variant="destructive">Delete</Button>
              </Form>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Link to={`/dashboard/${id}/edit`}>
          <Button size="icon">
            <Pencil1Icon width={16} height={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default RecipeCard;
