import type { PropsWithChildren, ReactNode } from "react";

type Props = {
  sidebar: ReactNode;
};

function Container({ children, sidebar }: PropsWithChildren<Props>) {
  return (
    <div className="h-full md:grid md:grid-cols-sidebar">
      {sidebar}
      {children}
    </div>
  );
}

export default Container;
