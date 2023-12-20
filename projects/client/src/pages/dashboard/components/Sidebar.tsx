import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  LogOut,
  Shirt,
  Users,
  Warehouse,
  UserCog,
  ClipboardList,
  Package,
  PackagePlus,
  PackageSearch,
  Settings,
  ArrowLeftFromLine,
} from "lucide-react"
import React from "react"
import { useLocation, Link } from "react-router-dom"
import { DashboardLink, DropdownLink } from "./SidebarLink"

const links = [
  {
    title: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: "/dashboard",
  },
  {
    title: "Warehouse",
    icon: <Warehouse className="w-4 h-4" />,
    path: "/dashboard/warehouse",
    children: [
      {
        title: "Mutation Form",
        icon: <PackagePlus className="w-4 h-4" />,
        path: "/dashboard/mutation-form",
      },
      {
        title: "Manage Mutation",
        icon: <PackageSearch className="w-4 h-4" />,
        path: "/dashboard/manage-mutation",
      },
    ],
  },
  {
    display: "ADMIN",
    title: "User",
    icon: <Users className="w-4 h-4" />,
    path: "/dashboard/user",
    children: [
      {
        title: "Manage Admin",
        icon: <UserCog className="w-4 h-4" />,
        path: "/dashboard/manage-admin",
      },
    ],
  },
  {
    title: "Product",
    icon: <Shirt className="w-4 h-4" />,
    path: "/dashboard/product",
    children: [
      {
        title: "Category",
        icon: <Shirt className="w-4 h-4" />,
        path: "/dashboard/product/category",
      },
    ],
  },
  {
    title: "Order",
    icon: <Package className="w-4 h-4" />,
    path: "/dashboard/order",
  },
  {
    title: "Report",
    icon: <ClipboardList className="w-4 h-4" />,
    path: "/dashboard/report",
  },
]

const DashboardSidebar = () => {
  const location = useLocation()
  return (
    <div className="p-4 flex h-full flex-col justify-between items-start">
      <div className="w-full">
        <Link to="/dashboard">
          <div className="w-max mb-4">
            <span className="font-bold text-3xl text-primary">
              当店 | Toten
            </span>
            <p className="text-base text-muted-foreground tracking-widest">
              Dashboard
            </p>
          </div>
        </Link>
        <ul className="my-4 space-y-1 w-full">
          {links.map((link) =>
            link.children ? (
              <DropdownLink
                key={link.title}
                title={link.title}
                icon={link.icon}
                path={link.path}
                children={link.children}
                state={location.pathname === link.path}
                display={link.display}
              />
            ) : (
              <DashboardLink
                key={link.title}
                title={link.title}
                icon={link.icon}
                path={link.path}
                state={location.pathname === link.path}
                display={link.display}
              />
            )
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Link to="/user" className="w-full">
          <Button
            variant="ghost"
            className="text-muted-foreground w-full justify-start"
          >
            <Settings className="w-4 h-4 mr-4 group-hover:translate-x-1" />
            Setting
          </Button>
        </Link>
        <Link to="/" className="w-full">
          <Button
            variant="ghost"
            className="text-muted-foreground w-full justify-start"
          >
            <ArrowLeftFromLine className="w-4 h-4 mr-4 group-hover:translate-x-1" />
            Main page
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-4 group-hover:translate-x-1" /> Log out
        </Button>
      </div>
    </div>
  )
}

export default DashboardSidebar
