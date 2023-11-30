import { conform, useForm } from "@conform-to/react";

import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "./ui";
import { folderSchema } from "~/lib/validation";
import { parse } from "@conform-to/zod";
import { Form } from "@remix-run/react";

export default function CreateFolder() {
  const [form, fields] = useForm({
    id: "create-folder",
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: folderSchema });
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Folder</DialogTitle>
        <DialogDescription>
          What would you like to name your new folder?
        </DialogDescription>
      </DialogHeader>
      <Form
        action={`f/add`}
        method="post"
        {...form.props}
        className="flex flex-col gap-4"
      >
        <div>
          <Label htmlFor={fields.name.id}>Name</Label>
          <Input {...conform.input(fields.name, { type: "text" })} />
          <p>{fields.name.errors}</p>
        </div>
        <DialogClose asChild>
          <Button type="submit" className="ml-auto">
            Save
          </Button>
        </DialogClose>
      </Form>
    </DialogContent>
  );
}
