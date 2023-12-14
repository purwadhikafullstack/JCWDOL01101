import { cn } from "@/lib/utils";
import { Heart, Home, ScrollText, Shirt } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const nav = [
  {
    link: "/",
    label: "Home",
    icon: <Home />,
  },
  {
    link: "/products",
    label: "Products",
    icon: <Shirt />,
  },
  {
    link: "/wishlist",
    label: "Wishlist",
    icon: <Heart />,
  },
  {
    link: "/transactions",
    label: "Transactions",
    icon: <ScrollText />,
  },
];

const MobileNav = () => {
  const location = useLocation();
  return (
    <div className="bottom-0 block md:hidden left-0 p-2 bg-background fixed border w-full">
      <div className="flex items-center justify-evenly">
        {nav.map((n) => (
          <Link key={n.label} to={n.link}>
            <div
              className={cn(
                "flex flex-col items-center p-2",
                location.pathname === n.link && "text-primary"
              )}
            >
              {n.icon}
              <p className="text-xs">{n.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
