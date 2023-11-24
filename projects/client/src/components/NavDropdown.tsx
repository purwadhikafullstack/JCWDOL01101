import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link } from "react-router-dom";

type NavDropdownProps = {
  className?: string;
  totalProduct?: number;
  icon: React.ReactElement;
  title?: string;
  setIsDim: (isDim: boolean) => void;
  children: React.ReactNode;
  path: string;
};

const NavDropdown = ({
  totalProduct,
  className,
  icon,
  title,
  setIsDim,
  children,
  path,
}: NavDropdownProps) => {
  return (
    <div
      onMouseEnter={() => setIsDim(true)}
      onMouseLeave={() => setIsDim(false)}
      className="relative group cursor-pointer"
    >
      {totalProduct
        ? totalProduct >= 1 && (
            <span
              className={`${
                totalProduct < 10 ? "px-[6px]" : null
              } absolute -top-1 left-2 text-xs  bg-primary rounded-full text-primary-foreground font-semibold p-[2px] border-2 border-background`}
            >
              {totalProduct}
            </span>
          )
        : null}
      <Link to={path}>
        <div
          className={buttonVariants({
            variant: "ghost",
            className: "z-40",
          })}
        >
          <span>{icon}</span>
          <span className="lg:ml-2">{title}</span>
        </div>
      </Link>
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
