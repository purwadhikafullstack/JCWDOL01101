import { useCurrentUser } from "@/hooks/useUser"
import { useUser } from "@clerk/clerk-react"
import { ChevronDown } from "lucide-react"
import React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

type SidebarLink = {
  title: string
  path: string
  icon: React.ReactElement
  state?: boolean
  display?: string
}

type Children = {
  title: string
  path: string
  icon: React.ReactElement
  state?: boolean
}

export const DashboardLink = ({
  title,
  icon,
  state = false,
  path,
  display,
}: SidebarLink) => {
  const { user, isSignedIn, isLoaded } = useUser()
  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  })
  return (
    <div
      className={display ? `${display !== userAdmin?.role && "hidden"}` : ""}
    >
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
    </div>
  )
}

export const DropdownLink = ({
  title,
  icon,
  state = false,
  children,
  path,
  display,
}: {
  title: string
  path: string
  icon: React.ReactElement
  children: Children[]
  state?: boolean
  display?: string
}) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { user, isSignedIn, isLoaded } = useUser()
  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  })
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
          <span className={state ? "text-primary" : "text-muted-foreground"}>
            <ChevronDown
              className={`w-5 h-5 transform ${
                isOpen && "-rotate-180"
              } transition-all duration-300`}
            />
          </span>
        </li>
      </Link>
      <div className={`${isOpen ? "flex" : "hidden"}`}>
        <ul className="flex-col flex-grow ml-3 my-1 border-l-2 p-1 border-gray-300">
          {children.map((link) => (
            <div
              className={
                display ? `${display !== userAdmin?.role && "hidden"}` : ""
              }
            >
              <DashboardLink
                key={link.title}
                title={link.title}
                icon={link.icon}
                path={link.path}
                state={location.pathname === link.path}
              />
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}
