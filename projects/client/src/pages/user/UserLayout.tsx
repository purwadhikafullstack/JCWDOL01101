import React from "react"
import { Outlet } from "react-router-dom"
import UserSidebar from "./components/UserSidebar"
import UserHeader from "./components/UserHeader"

const UserLayout = () => {
  return (
    <>
      <div className="w-full flex justify-start">
        <aside className="w-[300px] border-r">
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
