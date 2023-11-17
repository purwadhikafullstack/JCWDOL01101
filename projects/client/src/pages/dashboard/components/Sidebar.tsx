import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Shirt, Warehouse } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: "/dashboard",
  },
  {
    title: "Warehouse",
    icon: <Warehouse className="w-4 h-4" />,
    path: "/dashboard/warehouse",
  },
  {
    title: "Product",
    icon: <Shirt className="w-4 h-4" />,
    path: "/dashboard/product",
  },
];

const DashboardSidebar = () => {
  const location = useLocation();
  return (
    <div className="p-4 flex h-full flex-col justify-between items-start">
      <div className="w-full">
        <div className="w-max">
          <span className="font-bold text-xl text-primary">当店 | Toten</span>
          <p className="text-sm  text-muted-foreground tracking-widest">
            Dashboard
          </p>
        </div>
        <ul className="my-4 space-y-1 w-full">
          {links.map((link) => (
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
      <Button
        variant="ghost"
        className="text-muted-foreground w-full justify-start"
      >
        <LogOut className="w-h h-4 mr-4 group-hover:translate-x-1" /> Log out
      </Button>
    </div>
  );
};

const DashboardLink = ({
  title,
  icon,
  state = false,
  path,
}: {
  title: string;
  path: string;
  icon: React.ReactElement;
  state?: boolean;
}) => {
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

export default DashboardSidebar;
