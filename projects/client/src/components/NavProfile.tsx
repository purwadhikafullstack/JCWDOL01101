import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import NavDropdown from "./NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Car,
  LogOut,
  Settings,
  ShoppingCartIcon,
  Verified,
  Wrench,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";

const NavProfile = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  return (
    isLoaded && (
      <NavDropdown
        path="/profile"
        icon={<NavAvatar imageUrl={user?.imageUrl as string} />}
        setIsDim={setIsDim}
        className="p-4"
      >
        <div className="flex gap-2 items-start">
          <NavAvatar imageUrl={user?.imageUrl as string} />
          <div className="flex flex-col text-sm">
            <span className="font-bold flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p>{user?.username || user?.firstName || "no username"}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-sm font-normal max-w-[200px] text-center">
                      you can complete your profile in user setting
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {user?.hasVerifiedEmailAddress && (
                <Verified className="ml-2 w-4 h-4 text-primary" />
              )}
            </span>
            <p className="text-xs">{user?.emailAddresses[0].emailAddress}</p>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="space-y-2">
          <div className="flex flex-col w-full gap-2 md:hidden">
            <Link
              to="/user/cart"
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
              })}
            >
              <ShoppingCartIcon className="w-4 h-4 mr-2" />
              <span>Cart</span>
            </Link>
            <Link
              to="/user/delivery"
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
              })}
            >
              <Car className="w-4 h-4 mr-2" />
              <span>Delivery</span>
            </Link>
          </div>
          <Link
            to="/user/profile"
            className={buttonVariants({
              variant: "ghost",
              className: "w-full lg:justify-start",
            })}
          >
            <Settings className="w-4 h-4 mr-2" /> <span>Setting</span>
          </Link>
          <div
            className={`${user?.publicMetadata.role !== "ADMIN" && "hidden"}`}
          >
            <Link
              to="/dashboard"
              className={buttonVariants({
                variant: "ghost",
                className: "w-full lg:justify-start",
              })}
            >
              <Wrench className="w-4 h-4 mr-2" /> <span>Admin Dashboard</span>
            </Link>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut(() => navigate("/register"))}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </NavDropdown>
    )
  );
};

const NavAvatar = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <>
      <Avatar className="w-8 h-8">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </>
  );
};

export default NavProfile;
