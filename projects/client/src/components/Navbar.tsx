import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import NavProfile from "./NavProfile";
import NavDelivery from "./NavDelivery";
import NavCart from "./NavCart";
import { useUser } from "@clerk/clerk-react";
import { Button, buttonVariants } from "./ui/button";
import NavDropdown from "./NavDropdown";
import {
  ChevronDown,
  MapPin,
  Menu,
  ShoppingCart,
  User2,
  X,
} from "lucide-react";
import { useActiveAddress } from "@/hooks/useAddress";
import SelectAddressDialog from "./SelectAddressDialog";
import NavWishlist from "./NavWishlist";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import MobileMenuCard from "./MobileMenuCard";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isDim, setIsDim] = useState(false);
  const [open, setOpen] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { data: activeAddress } = useActiveAddress(isSignedIn);

  return (
    <>
      <nav className="w-full fixed top-0 p-2 border-b bg-background z-50">
        <div className="lg:container flex flex-col">
          <div className="flex gap-2 items-center">
            <Link to="/" className="hidden lg:block">
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
            <SearchInput
              expandSearch={expandSearch}
              setExpandSearch={setExpandSearch}
            />
            <div className="flex items-center">
              {isLoaded && isSignedIn ? (
                <>
                  <div className="items-center flex">
                    {!expandSearch && (
                      <>
                        <div className="h-8 lg:hidden flex items-center gap-2">
                          <NavCart setIsDim={setIsDim} />
                          <Button
                            onClick={() => setOpen(true)}
                            variant="ghost"
                            size="sm"
                          >
                            <Menu />
                          </Button>
                        </div>
                      </>
                    )}
                    <div className="hidden lg:flex items-center">
                      <NavCart setIsDim={setIsDim} />
                      <NavDelivery setIsDim={setIsDim} />
                      <NavWishlist setIsDim={setIsDim} />
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <NavProfile setIsDim={setIsDim} />
                  </div>
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
            <div className="flex flex-col items-start lg:items-end cursor-pointer">
              <SelectAddressDialog>
                <div className="flex gap-2 text-xs mt-2 md:mt-0 items-center text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {activeAddress ? (
                    <>
                      {t("navbar.address")}
                      <span className="flex items-center text-foreground">
                        <b
                          className={`${
                            activeAddress && activeAddress.recepient.length > 8
                              ? "text-ellipsis overflow-hidden whitespace-nowrap  md:w-[150px]"
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
      <MobileMenuCard open={open} setOpen={setOpen} />
      <div
        className={cn(
          "fixed left-0 hidden md:block top-0 overflow-auto transition-all duration-300 bg-black/30 z-30",
          isDim && "w-full h-screen"
        )}
      />
    </>
  );
};

export default Navbar;
