import React from "react"
import DashboardNavbar from "./components/Navbar"
import { Outlet } from "react-router-dom"
import DashboardSidebar from "./components/Sidebar"

const DashboardLayout = () => {
  return (
    <>
      <div className="flex">
        <aside className="fixed h-full top-0 left-0 w-[300px] border-r">
          <DashboardSidebar />
        </aside>
        <div className="h-full w-[calc((100%_-_300px))] ml-[300px]">
          <DashboardNavbar />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
