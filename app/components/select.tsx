import { type PropsWithChildren } from "react";
import {
  Select as SelectBase,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui";
import { type SelectProps } from "@radix-ui/react-select";

type Props = SelectProps & {
  name: string;
  placeholder?: string;
};

function Select({
  name,
  children,
  placeholder,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <SelectBase name={name} {...props}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </SelectBase>
  );
}

export default Select;
