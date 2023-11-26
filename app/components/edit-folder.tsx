import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form } from "@remix-run/react";

import { folderSchema } from "lib/validation";
import {
  Button,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "./ui";

type Props = {
  name: string;
};

export default function EditFolder({ name }: Props) {
  const [form, fields] = useForm({
    id: "edit-folder",
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: folderSchema });
    },
    defaultValue: {
      name: name,
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Folder</DialogTitle>
      </DialogHeader>
      <Form
        action="edit"
        method="post"
        {...form.props}
        className="flex flex-col gap-4"
      >
        <div>
          <Label htmlFor={fields.name.id}>Name</Label>
          <Input {...conform.input(fields.name, { type: "text" })} />
          <p>{fields.name.errors}</p>
        </div>
        <div className="flex gap-2 justify-between">
          <DialogClose asChild>
            <Form
              action="destroy"
              method="post"
              onSubmit={(event) => {
                const response = confirm(
                  "Do you really want to delete this folder?"
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <Button variant="destructive" type="submit">
                Delete Folder
              </Button>
            </Form>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit">Save Changes</Button>
          </DialogClose>
        </div>
      </Form>
    </DialogContent>
  );
}
