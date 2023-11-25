import React from "react"
import DashboardNavbar from "./components/Navbar"
import { Outlet } from "react-router-dom"
import DashboardSidebar from "./components/Sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useClerk, useUser } from "@clerk/clerk-react"

const DashboardLayout = () => {
  const { user } = useUser()
  const { redirectToHome } = useClerk()
  return user?.publicMetadata.role !== "CUSTOMER" &&
    user?.publicMetadata.status !== ("DEACTIVATED" || "DELETED") ? (
    <>
      <div className="flex relative">
        <aside className="fixed h-full top-0 left-0 w-[300px] border-r">
          <DashboardSidebar />
        </aside>
        <div className="h-full w-[calc((100%_-_300px))] ml-[300px]">
          <DashboardNavbar />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </>
  ) : (
    <>{redirectToHome()}</>
  )
}

export default DashboardLayout
