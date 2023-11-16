import React from "react"
import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"

const DashboardPage = () => {
  return (
    <>
      <div className="flex lg:flex-row gap-4 mt-8">
        <div className="w-full lg:w-[280px]">
          <h3 className="mb-2">
            <Link
              to="/dashboard"
              className="uppercase tracking-wide font-bold text-lg"
            >
              Dashboard
            </Link>
          </h3>
          <Link
            to="/dashboard/manage-user"
            className="text-xs md:text-base font-bold hover:text-gray-500"
          >
            Manage User
          </Link>
        </div>
        <div className="flex flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default DashboardPage
