import { type PropsWithChildren } from "react";
import {
  Select as SelectBase,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui";

type Props = {
  name: string;
  placeholder: string;
};

function Select({ name, placeholder, children }: PropsWithChildren<Props>) {
  return (
    <SelectBase name={name}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </SelectBase>
  );
}

export default Select;
