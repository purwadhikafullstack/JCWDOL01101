import React from "react";
import { cn } from "@/lib/utils";
import {
  Heart,
  Pin,
  ScrollText,
  Settings,
  Verified,
  X,
  User,
  Cog,
} from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import LanguageSelector from "./LanguageSelector";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const nav = [
  {
    link: "/user",
    label: "My Profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    link: "/user/address",
    label: "My Address",
    icon: <Pin className="w-5 h-5" />,
  },
  {
    link: "/transactions",
    label: "Transactions",
    icon: <ScrollText className="w-5 h-5" />,
  },
  {
    link: "/wishlist",
    label: "Wishlist",
    icon: <Heart className="w-5 h-5" />,
  },
];

type ProfileMenuCardProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const MobileMenuCard = ({ open, setOpen }: ProfileMenuCardProps) => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const isDesktop = useMediaQuery("(min-width: 768px");
  return (
    isLoaded && (
      <div
        className={cn(
          "fixed bottom-0 left-0 overflow-auto duration-300 bg-white z-50 w-full h-screen transform  transition-all",
          open && !isDesktop ? "translate-y-0 top-0" : "translate-y-full"
        )}
      >
        <div className="p-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            <X />
          </Button>
          <div className="p-4 container flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-2 items-start">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                      {user ? user.username?.substring(0, 2) : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm">
                    <span className="font-bold flex items-center">
                      <p>{user?.username || user?.firstName || "-"}</p>
                      {user?.hasVerifiedEmailAddress && (
                        <Verified className="ml-2 w-4 h-4 text-primary" />
                      )}
                    </span>
                    <p className="text-xs">
                      {user?.emailAddresses[0].emailAddress}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate("/user");
                  }}
                  variant="ghost"
                >
                  <Settings />
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                {nav.map((n) => (
                  <Link
                    key={n.label}
                    to={n.link}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2"
                  >
                    <span className="text-muted-foreground">{n.icon}</span>
                    {n.label}
                  </Link>
                ))}
                {(user?.publicMetadata.role === "ADMIN" ||
                  "WAREHOUSE ADMIN") && (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2"
                  >
                    <span className="text-muted-foreground">
                      <Cog />
                    </span>
                    Dashboard
                  </Link>
                )}
              </div>
              <Separator className="my-2" />
              <LanguageSelector align="start" />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default MobileMenuCard;
