import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchInput from "./SearchInput";
import NavProfile from "./NavProfile";
import NavDelivery from "./NavDelivery";
import NavCart from "./NavCart";
import { useUser } from "@clerk/clerk-react";
import { buttonVariants } from "./ui/button";
import NavDropdown from "./NavDropdown";
import { ChevronDown, MapPin, User2 } from "lucide-react";
import { useActiveAddress } from "@/hooks/useAddress";
import SelectAddressDialog from "./SelectAddressDialog";
import NavWishlist from "./NavWishlist";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isDim, setIsDim] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { data: activeAddress } = useActiveAddress(isSignedIn);

  return (
    <>
      <nav className="w-full sticky top-0 p-2 border-b bg-background z-50">
        <div className="container flex flex-col">
          <div className="flex gap-2 items-center">
            <Link to="/">
              <span className="text-lg font-bold text-primary flex gap-2 items-center">
                当店 <p className="hidden lg:block">| Toten</p>
              </span>
            </Link>
            <Link
              to="/products"
              className={buttonVariants({
                variant: "ghost",
                className: "hidden md:block",
              })}
            >
              {t("navbar.productBtn")}
            </Link>
            <SearchInput />
            <div className="flex items-center">
              {isLoaded && isSignedIn ? (
                <>
                  <div className="items-center hidden lg:flex">
                    <NavCart setIsDim={setIsDim} />
                    <NavDelivery setIsDim={setIsDim} />
                    <NavWishlist setIsDim={setIsDim} />
                  </div>
                  <NavProfile setIsDim={setIsDim} />
                </>
              ) : (
                <>
                  <div className="hidden lg:flex items-center gap-2 ">
                    <Link
                      to="/login"
                      state={{ redirectTo: location }}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={buttonVariants({ variant: "default" })}
                    >
                      Register
                    </Link>
                  </div>
                  <div className="block lg:hidden">
                    <NavDropdown path="/" icon={<User2 />} setIsDim={setIsDim}>
                      <div className="flex gap-2 items-center">
                        <Link
                          to="/login"
                          className={buttonVariants({ variant: "outline" })}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className={buttonVariants({ variant: "default" })}
                        >
                          Register
                        </Link>
                      </div>
                    </NavDropdown>
                  </div>
                </>
              )}
            </div>
          </div>
          {isSignedIn && (
            <div className="flex flex-col items-end cursor-pointer">
              <SelectAddressDialog>
                <div className="flex gap-2 text-xs items-center text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {activeAddress ? (
                    <>
                      {t("navbar.address")}
                      <span className="flex  items-center text-foreground">
                        <b
                          className={`${
                            activeAddress && activeAddress.recepient.length > 8
                              ? "text-ellipsis overflow-hidden whitespace-nowrap w-[150px]"
                              : "w-max"
                          }`}
                        >
                          {activeAddress?.label}, {activeAddress?.recepient}
                        </b>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </>
                  ) : (
                    <p>setup address</p>
                  )}
                </div>
              </SelectAddressDialog>
            </div>
          )}
        </div>
      </nav>
      <div
        className={`fixed left-0 top-0 overflow-auto ${
          isDim && "w-full h-screen"
        } transition-all duration-300 bg-black/30 z-30`}
      />
    </>
  );
};

export default Navbar;
