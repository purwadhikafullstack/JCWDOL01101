import Sidebar from "./Sidebar"
import React from "react"
import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
  return (
    <>
      <div className="flex lg:flex-row p-[2rem] gap-4">
        <Sidebar />
        <div className="flex flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
