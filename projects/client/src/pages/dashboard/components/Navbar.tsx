import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashboardNavbar = () => {
  const { user } = useUser();
  const [site, setSite] = useState("Dashboard");
  const location = useLocation();

  useEffect(() => {
    const paths = location.pathname.split("/");
    const site = paths[paths.length - 1];
    setSite(site || "Dashboard");
  }, [location.pathname]);

  return (
    <nav className="w-full sticky top-0 z-50">
      <div className="flex justify-between items-center bg-white p-6 border-b">
        <h1 className="capitalize text-2xl font-medium">{site}</h1>
        <div className="flex items-center gap-4">
          <p className="text-lg font-medium">
            Welcome, {user?.fullName || "Admin"}
          </p>
          <Link
            to="/dashboard/admin-notification"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
          >
            <Bell />
          </Link>
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.imageUrl as string} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
