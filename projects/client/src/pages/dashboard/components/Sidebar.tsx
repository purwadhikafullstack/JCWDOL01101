import React from "react";

import {
  LayoutDashboard,
  Shirt,
  Users,
  Warehouse,
  UserCog,
  ClipboardList,
  FileText,
  Layers,
  ListPlus,
  HelpCircle,
  Settings,
  Tag,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Separator } from "@/components/ui/separator";
import Nav from "./Nav";
import SidebarHeader from "./SidebarHeader";

const DashboardSidebar = () => {
  const { user } = useUser();
  const ROLE = user?.publicMetadata?.role;
  return (
    <div className="p-4 flex w-full h-full flex-col justify-between items-start relative">
      <div className="w-full">
        <SidebarHeader />
        <Nav
          links={[
            {
              title: "Overview",
              icon: LayoutDashboard,
              link: "/dashboard",
              variant: "ghost",
            },
            {
              title: "Warehouses",
              icon: Warehouse,
              link: "/dashboard/warehouse",
              variant: "ghost",
            },
            {
              title: "Mutations",
              icon: FileText,
              link: "/dashboard/manage-mutation",
              variant: "ghost",
            },
          ]}
        />
        {ROLE === "ADMIN" && (
          <>
            <Separator />
            <Nav
              links={[
                {
                  title: "Users",
                  icon: Users,
                  link: "/dashboard/user",
                  variant: "ghost",
                },
                {
                  title: "Manage Admin",
                  icon: UserCog,
                  link: "/dashboard/manage-admin",
                  variant: "ghost",
                },
              ]}
            />
          </>
        )}
        {ROLE !== "ADMIN" ? (
          <Nav
            links={[
              {
                title: "Product",
                icon: Shirt,
                link: "/dashboard/product",
                variant: "ghost",
              },
            ]}
          />
        ) : (
          <>
            <Separator />
            <Nav
              links={[
                {
                  title: "Products",
                  icon: Shirt,
                  link: "/dashboard/product",
                  variant: "ghost",
                },
                {
                  title: "Categories",
                  icon: Tag,
                  link: "/dashboard/product/category",
                  variant: "ghost",
                },
              ]}
            />
          </>
        )}
        <Separator />
        <Nav
          links={[
            {
              title: "Orders",
              icon: Layers,
              link: "/dashboard/order",
              variant: "ghost",
            },
            {
              title: "Reports",
              icon: ClipboardList,
              link: "#",
              variant: "ghost",
            },
          ]}
        />
        <Separator />
        <Nav
          links={[
            {
              title: "Get Help",
              icon: HelpCircle,
              link: "#",
              variant: "ghost",
            },
            {
              title: "Settings",
              icon: Settings,
              link: "#",
              variant: "ghost",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DashboardSidebar;
