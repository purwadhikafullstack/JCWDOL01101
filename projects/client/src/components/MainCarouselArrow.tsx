import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = React.PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

export const DotButton = ({ children, ...props }: Props) => {
  return (
    <button className="w-2 h-2 rounded-full bg-muted-foreground" {...props}>
      {children}
    </button>
  );
};

export const PrevButton = ({ children, ...props }: Props) => {
  return (
    <button
      className="absolute top-1/2 left-8 group-hover:-left-3 opacity-0 group-hover:opacity-100  transition-all duration-400 -translate-y-1/2 bg-background p-2 text-muted-foreground shadow-md hover:scale-105 z-40"
      type="button"
      {...props}
    >
      <ChevronLeft />
      {children}
    </button>
  );
};

export const NextButton = ({ children, ...props }: Props) => {
  return (
    <button
      className="absolute top-1/2 right-8 group-hover:-right-3 opacity-0 group-hover:opacity-100  transition-all duration-400 -translate-y-1/2 bg-background p-2 text-muted-foreground shadow-md hover:scale-105 z-40"
      type="button"
      {...props}
    >
      <ChevronRight />
      {children}
    </button>
  );
};
