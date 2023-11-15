import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

type NavDropdownProps = {
  className?: string;
  icon: React.ReactElement;
  title?: string;
  setIsDim: (isDim: boolean) => void;
  children: React.ReactNode;
};

const NavDropdown = ({
  className,
  icon,
  title,
  setIsDim,
  children,
}: NavDropdownProps) => {
  return (
    <div
      onMouseEnter={() => setIsDim(true)}
      onMouseLeave={() => setIsDim(false)}
      className="relative group"
    >
      <div className={buttonVariants({ variant: "ghost", className: "z-40" })}>
        <span>{icon}</span> <span className="lg:ml-2">{title}</span>
      </div>
      <div
        className={cn(
          "absolute z-50 scale-y-0 group-hover:scale-y-100 origin-top left-1/2 -translate-x-[86%] md:-translate-x-1/2 translate-y-0 w-max transition-all duration-200 bg-white shadow-md rounded-b-md p-2",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default NavDropdown;
