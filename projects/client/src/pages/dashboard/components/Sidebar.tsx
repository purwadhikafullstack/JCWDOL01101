import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  Shirt,
  Users,
  Warehouse,
  UserCog,
  ClipboardList,
  Package,
  FileText,
  LucideIcon,
  Home,
  ChevronLeft,
} from "lucide-react";
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DashboardLink, DropdownLink } from "./SidebarLink";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useBoundStore } from "@/store/client/useStore";
import { cn } from "@/lib/utils";

type Link = {
  title: string;
  Icon: LucideIcon;
  path: string;
  children?: Link[];
};

const links = [
  {
    title: "Overview",
    Icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Warehouse",
    Icon: Warehouse,
    path: "/dashboard/warehouse",
  },
  {
    title: "Mutation",
    Icon: FileText,
    path: "/dashboard/manage-mutation",
  },
  {
    title: "User",
    Icon: Users,
    path: "/dashboard/user",
    children: [
      {
        title: "Manage Admin",
        Icon: UserCog,
        path: "/dashboard/manage-admin",
      },
    ],
  },
  {
    title: "Product",
    Icon: Shirt,
    path: "/dashboard/product",
    children: [
      {
        title: "Category",
        Icon: Shirt,
        path: "/dashboard/product/category",
      },
    ],
  },
  {
    title: "Order",
    Icon: Package,
    path: "/dashboard/order",
  },
  {
    title: "Report",
    Icon: ClipboardList,
    path: "/dashboard/report",
  },
];

const DashboardSidebar = () => {
  const isResizing = useBoundStore((state) => state.isResizing);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const ROLE = user?.publicMetadata?.role;
  return (
    <div className="p-4 flex w-full h-full flex-col justify-between items-start relative">
      <div className="w-full">
        <Link to="/dashboard">
          <div className="mb-4 flex flex-col shrink-0">
            <span
              className={cn(
                "font-bold text-3xl text-primary flex shrink-0 items-center",
                isResizing && "text-lg text-center"
              )}
            >
              {!isResizing ? "当店 | Toten" : "当店"}
            </span>
            <p
              className={cn(
                "text-base text-muted-foreground tracking-widest ",
                isResizing && "hidden"
              )}
            >
              Dashboard
            </p>
          </div>
        </Link>
        <div className="my-4 space-y-1 w-full">
          {links.map((link, i) => {
            if (
              ROLE !== "ADMIN" &&
              (link.title === "User" || link.title === "Warehouse")
            ) {
              return null;
            }
            return link.children ? (
              <DropdownLink
                key={link.title}
                title={link.title}
                Icon={link.Icon}
                path={link.path}
                children={link.children}
                state={location.pathname === link.path}
              />
            ) : (
              <DashboardLink
                key={link.title}
                title={link.title}
                Icon={link.Icon}
                path={link.path}
                state={location.pathname === link.path}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Link to="/" className="w-full">
          <Button
            variant="ghost"
            className="text-muted-foreground w-full justify-start"
          >
            <Home className={cn("w-4 h-4", !isResizing && "mr-2")} />
            {!isResizing && "Main page"}
          </Button>
        </Link>
        <Button
          onClick={() => signOut(() => navigate("/login"))}
          variant="ghost"
          className="text-muted-foreground w-full justify-start"
        >
          <LogOut className={cn("w-4 h-4", !isResizing && "mr-2")} />
          {!isResizing && "Log Out"}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
