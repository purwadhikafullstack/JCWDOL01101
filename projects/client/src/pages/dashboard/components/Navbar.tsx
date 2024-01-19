import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, LogOut, MapPin, Settings } from "lucide-react";
import { useUserContext } from "@/context/UserContext";

const DashboardNavbar = () => {
  const { signOut } = useClerk();
  const { user } = useUserContext();
  return (
    user && (
      <nav className="w-full sticky top-0 z-30">
        <div className="flex justify-end items-center bg-background p-4 px-6 border-b">
          <div className="flex items-center gap-4">
            {user.role !== "ADMIN" && (
              <span className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" /> {user.warehouse.name},{" "}
                {user.warehouse.warehouseAddress?.cityWarehouse?.cityName}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-8 h-8 hover:ring-2 ring-primary transition-all duration-200">
                  <AvatarImage src={user?.imageUrl as string} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="capitalize">
                        {user.username
                          ? `@${user.username}`
                          : user.firstname || user.email}
                      </p>
                      <span className="text-xs border px-2 text-primary border-primary">
                        {user.role === "ADMIN" ? "SUPER ADMIN" : "ADMIN"}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-normal">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/">
                  <DropdownMenuItem className="text-muted-foreground">
                    <Home className="w-4 h-4 mr-2" /> Go To MainPage
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="text-muted-foreground">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-muted-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    )
  );
};

export default DashboardNavbar;
