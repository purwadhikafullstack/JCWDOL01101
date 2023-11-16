import React from "react"
import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    <>
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
    </>
  )
}

export default Sidebar
