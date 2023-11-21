import type { PropsWithChildren, ReactNode } from "react";

type Props = {
  sidebar: ReactNode;
};

function Container({ children, sidebar }: PropsWithChildren<Props>) {
  return (
    <div className="h-full md:grid md:grid-cols-sidebar md:gap-8 md:pr-8">
      {sidebar}
      {children}
    </div>
  );
}

export default Container;
