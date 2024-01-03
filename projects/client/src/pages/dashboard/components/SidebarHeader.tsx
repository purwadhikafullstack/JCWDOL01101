import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBoundStore } from "@/store/client/useStore";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const SidebarHeader = () => {
  const isCollapsed = useBoundStore((state) => state.isResizing);
  return (
    <>
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link to="/dashboard">
                <img
                  src="/t10logo.png"
                  className="w-6 mx-auto cursor-pointer mb-6"
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              <span className="ml-auto text-muted-foreground text-xs">
                当店 | Toten
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Link to="/dashboard">
          <div
            className={cn(
              "mb-4  px-4 flex flex-col shrink-0",
              isCollapsed && "items-center"
            )}
          >
            <span
              className={cn(
                "font-bold text-xl text-primary flex shrink-0 items-center",
                isCollapsed && "text-base font-bold text-center"
              )}
            >
              当店 | Toten
            </span>
            <p
              className={cn(
                "text-sm text-muted-foreground tracking-widest ",
                isCollapsed && "hidden"
              )}
            >
              Dashboard
            </p>
          </div>
        </Link>
      )}
    </>
  );
};

export default SidebarHeader;
