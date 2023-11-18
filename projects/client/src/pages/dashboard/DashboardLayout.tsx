import React from "react";
import DashboardNavbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./components/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const DashboardLayout = () => {
  return (
    <>
      <div className="flex">
        <aside className="fixed h-full top-0 left-0 w-[250px] border-r">
          <DashboardSidebar />
        </aside>
        <div className="h-full w-[calc((100%_-_250px))] ml-[250px]">
          <DashboardNavbar />
          <main className="p-4">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default DashboardLayout;
