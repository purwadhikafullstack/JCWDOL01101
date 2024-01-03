import React from "react";

import { useBoundStore } from "@/store/client/useStore";
import { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  links: {
    title: string;
    label?: string | undefined;
    icon: LucideIcon;
    variant: "default" | "ghost";
    link: string;
  }[];
}

const Nav = ({ links }: Props) => {
  const location = useLocation();
  const isCollapsed = useBoundStore((state) => state.isResizing);
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-2 py-2 data-[collapsed=true]:py-2 w-full"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={link.link}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9 text-muted-foreground rounded-[.3rem]",
                      link.variant === "default",
                      location.pathname === link.link &&
                        "bg-muted text-primary/80 hover:text-primary"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4 rounded-[.3rem] bg-background/30 backdrop-blur-sm"
                >
                  {link.title}
                  {link.label && (
                    <span className="ml-auto text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              to={link.link}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                "justify-start text-muted-foreground rounded-[.3rem]",
                link.variant === "default",
                location.pathname === link.link &&
                  "bg-muted text-primary/80 hover:text-primary font-bold"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
};

export default Nav;
