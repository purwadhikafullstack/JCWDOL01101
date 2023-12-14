import React from "react"
import { Home, User } from "lucide-react"
import { useLocation } from "react-router-dom"
import { DashboardLink } from "@/pages/dashboard/components/SidebarLink"
import { useUser } from "@clerk/clerk-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"

const UserSidebar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user } = useUser()
  const links = [
    {
      title: t("profileSettingsPage.sidebar.profile"),
      icon: <User className="w-4 h-4" />,
      path: "/user",
    },
    {
      title: t("profileSettingsPage.sidebar.address"),
      icon: <Home className="w-4 h-4" />,
      path: "/user/address",
    },
  ]
  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-2xl text-primary overflow-hidden overflow-ellipsis max-w-[130px] whitespace-nowrap">
            {user?.username || user?.firstName || "no username"}
          </span>
          <p className="text-sm text-muted-foreground tracking-widest">
            User Settings
          </p>
        </div>
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
