import React from "react";
import { Separator } from "@/components/ui/separator";
import NavDropdown from "./NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import { LogOut, Settings, Wrench } from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import ProfileAvatar, { UserAvatar } from "./ProfileAvatar";

const NavProfile = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  return (
    isLoaded && (
      <NavDropdown
        path="/user"
        icon={<UserAvatar />}
        setIsDim={setIsDim}
        profile={true}
        className="p-4"
      >
        <ProfileAvatar />
        <Separator className="my-2" />
        <div className="space-y-2">
          <Link
            to="/user"
            className={buttonVariants({
              variant: "ghost",
              className: "w-full lg:justify-start",
            })}
          >
            <Settings className="w-4 h-4 mr-2" />{" "}
            <span>{t("navbar.profile.setting")}</span>
          </Link>
          <div
            className={`${
              user?.publicMetadata.role === "CUSTOMER" && "hidden"
            }`}
          >
            <Link
              to="/dashboard"
              className={buttonVariants({
                variant: "ghost",
                className: "w-full lg:justify-start",
              })}
            >
              <Wrench className="w-4 h-4 mr-2" />{" "}
              <span>{t("navbar.profile.dashboard")}</span>
            </Link>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut(() => navigate("/login"))}
          >
            <LogOut className="w-4 h-4 mr-2" /> {t("navbar.profile.logout")}
          </Button>
        </div>
      </NavDropdown>
    )
  );
};

export default NavProfile;
