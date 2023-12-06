import React, { useState } from "react";
import NavDropdown from "./NavDropdown";
import { Heart } from "lucide-react";

const NavWishlist = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  return (
    <NavDropdown icon={<Heart />} path="/wishlist" setIsDim={setIsDim}>
      <p>wishlist</p>
    </NavDropdown>
  );
};

export default NavWishlist;
