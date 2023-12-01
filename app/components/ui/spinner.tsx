import { ShadowIcon } from "@radix-ui/react-icons";

import { cn } from "~/lib/utils";

type Props = {
  className?: string;
};

export default function Spinner({ className }: Props) {
  return (
    <ShadowIcon
      className={cn("animate-spin text-primary w-6 h-6", className)}
    />
  );
}
