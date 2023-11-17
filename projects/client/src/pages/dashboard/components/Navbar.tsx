import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardNavbar = () => {
  return (
    <nav className="w-full sticky top-0 z-50">
      <div className="flex justify-end items-center bg-white p-4 border-b">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
