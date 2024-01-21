import React from "react"
import { Outlet } from "react-router-dom"
import UserSidebar from "./components/UserSidebar"
import UserHeader from "./components/UserHeader"
import { Helmet } from "react-helmet"

const UserLayout = () => {
  return (
    <>
      <Helmet>
        <title>Profile | TOTEN</title>
      </Helmet>
      <div className="w-full flex justify-start">
        <aside className="w-[300px] hidden md:block border-r">
          <UserSidebar />
        </aside>
        <div className="flex flex-col w-full">
          <UserHeader />
          <main className="p-6 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default UserLayout
