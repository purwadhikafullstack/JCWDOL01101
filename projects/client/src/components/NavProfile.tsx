import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import NavDropdown from "./NavDropdown";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import {
  Car,
  LogOut,
  Settings,
  ShoppingCartIcon,
  Verified,
} from "lucide-react";

const NavProfile = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  return (
    <NavDropdown icon={<NavAvatar />} setIsDim={setIsDim} className="p-4">
      <div className="flex gap-2 items-start">
        <NavAvatar />
        <div className="flex flex-col text-sm">
          <span className="font-bold flex items-center">
            <p>putu</p>
            <Verified className="ml-2 w-4 h-4 text-primary" />
          </span>

          <p className="text-xs">putuhendramahendra@gmail.com</p>
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
            className: "w-full",
          })}
        >
          <Settings className="w-4 h-4 mr-2" /> <span>Setting</span>
        </Link>
        <Button variant="ghost" className="w-full">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </NavDropdown>
  );
};

const NavAvatar = () => {
  return (
    <>
      <Avatar className="w-8 h-8">
        <AvatarImage src="https://github.com/putuhema.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </>
  );
};

export default NavProfile;
