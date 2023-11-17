import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import NavProfile from "./NavProfile";
import NavDelivery from "./NavDelivery";
import NavCart from "./NavCart";
import NavCategory from "./NavCategory";
import { useUser } from "@clerk/clerk-react";
import { buttonVariants } from "./ui/button";
import NavDropdown from "./NavDropdown";
import { User2 } from "lucide-react";

const Navbar = () => {
  const [isDim, setIsDim] = useState(false);
  const { isSignedIn } = useUser();
  return (
    <>
      <nav className="w-full sticky top-0 p-2 border-b bg-background z-50">
        <div className="container flex gap-2 items-center">
          <Link to="/">
            <span className="text-lg font-bold text-primary flex gap-2 items-center">
              当店 <p className="hidden lg:block">| Toten</p>
            </span>
          </Link>
          <NavCategory setIsDim={setIsDim} />
          <SearchInput />
          <div className="flex items-center">
            {isSignedIn ? (
              <>
                <div className="items-center hidden lg:flex">
                  <NavCart setIsDim={setIsDim} />
                  <NavDelivery setIsDim={setIsDim} />
                </div>
                <NavProfile setIsDim={setIsDim} />
              </>
            ) : (
              <>
                <div className="hidden lg:flex items-center gap-2 ">
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
                <div className="block lg:hidden">
                  <NavDropdown icon={<User2 />} setIsDim={setIsDim}>
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