import { useUser } from "@clerk/clerk-react";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarLink = {
  title: string;
  path: string;
  icon: React.ReactElement;
  state?: boolean;
};

type Children = {
  title: string;
  path: string;
  icon: React.ReactElement;
  state?: boolean;
};

export const DashboardLink = ({
  title,
  icon,
  state = false,
  path,
}: SidebarLink) => {
  return (
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
          {icon}
        </span>
        <span className={state ? "text-primary" : "text-muted-foreground"}>
          {title}
        </span>
      </li>
    </Link>
  );
};

export const DropdownLink = ({
  title,
  icon,
  state = false,
  children,
  path,
}: {
  title: string;
  path: string;
  icon: React.ReactElement;
  children: Children[];
  state?: boolean;
}) => {
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
            <div>{icon}</div>
            <div>{title}</div>
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
          <ul className="flex-col flex-grow ml-3 my-1 border-l-2 p-1 border-gray-300">
            {children.map((link) => (
              <DashboardLink
                key={link.title}
                title={link.title}
                icon={link.icon}
                path={link.path}
                state={location.pathname === link.path}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
