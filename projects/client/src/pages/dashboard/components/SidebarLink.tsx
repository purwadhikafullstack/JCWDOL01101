import { useCurrentUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { useBoundStore } from "@/store/client/useStore";
import { useUser } from "@clerk/clerk-react";
import { ChevronDown, LucideIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarLink = {
  title: string;
  path: string;
  Icon: LucideIcon;
  state?: boolean;
};

type Children = {
  title: string;
  path: string;
  Icon: LucideIcon;
  state?: boolean;
};

export const DashboardLink = ({
  title,
  Icon,
  state = false,
  path,
}: SidebarLink) => {
  const isResizing = useBoundStore((state) => state.isResizing);
  return (
    <div>
      <Link to={path}>
        <li
          className={`flex w-full items-center gap-2 cursor-pointer py-2 hover:bg-muted/80 rounded-md ${
            state && "text-primary font-bold bg-muted"
          }`}
        >
          <span
            className={`ml-2 w-4 ${
              state ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className={cn("w-4 h-4", isResizing && "h-5 w-5")} />
          </span>
          <span
            className={cn(
              state ? "text-primary" : "text-muted-foreground",
              isResizing && "hidden"
            )}
          >
            {title}
          </span>
        </li>
      </Link>
    </div>
  );
};

export const DropdownLink = ({
  title,
  Icon,
  state = false,
  children,
  path,
}: SidebarLink & { children: Children[] }) => {
  const isResizing = useBoundStore((state) => state.isResizing);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const ROLE = user?.publicMetadata?.role;
  return (
    <>
      <Link to={path}>
        <li
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            state && "text-primary font-bold bg-muted"
          } flex gap-2 justify-between items-center cursor-pointer p-2 hover:bg-muted/80 capitalize select-none`}
        >
          <span
            className={`flex gap-2 items-center w-4 ${
              state ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div>
              <Icon className={cn("w-4 h-4", isResizing && "h-5 w-5")} />
            </div>
            <div className={isResizing ? "hidden" : ""}>{title}</div>
          </span>
          {ROLE === "ADMIN" && (
            <span className={state ? "text-primary" : "text-muted-foreground"}>
              <ChevronDown
                className={`w-5 h-5 transform ${
                  isOpen && "-rotate-180"
                } transition-all duration-300`}
              />
            </span>
          )}
        </li>
      </Link>
      {ROLE === "ADMIN" && (
        <div className={`${isOpen ? "flex" : "hidden"}`}>
          <div className="flex-col flex-grow ml-3 my-1 border-l-2 p-1 border-gray-300">
            {children.map((link, i) => (
              <DashboardLink
                key={link.title + i}
                title={link.title}
                Icon={link.Icon}
                path={link.path}
                state={location.pathname === link.path}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
