import React from "react"
import { Home, User } from "lucide-react"
import { useLocation } from "react-router-dom"
import { DashboardLink } from "@/pages/dashboard/components/SidebarLink"

const links = [
  {
    title: "Profile",
    icon: <User className="w-4 h-4" />,
    path: "/user",
  },
  {
    title: "Address",
    icon: <Home className="w-4 h-4" />,
    path: "/user/address",
  },
]

const UserSidebar = () => {
  const location = useLocation()
  return (
    <div className="w-full p-4">
      <div className="w-max mb-4">
        <span className="font-bold text-3xl text-primary">MIKHAIL</span>
        <p className="text-base text-muted-foreground tracking-widest">Image</p>
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
  )
}

export default UserSidebar
