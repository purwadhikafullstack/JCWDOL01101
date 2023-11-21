import React from "react"
import { Outlet } from "react-router-dom"
import UserSidebar from "./components/UserSidebar"

const UserLayout = () => {
  return (
    <>
      <div className="w-[1120px] mx-auto">
        <aside className="w-[300px] border-r">
          <UserSidebar />
        </aside>
        <div className="h-full w-[calc((100%_-_300px))] ml-[300px]">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default UserLayout
