import React from "react";
import NavDropdown from "./NavDropdown";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

const NavWishlist = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  const { data } = useWishlist();
  const counter: number =
    data && data.pages.length > 0 ? data.pages[0].totalWishlist : 0;
  return (
    <NavDropdown
      counter={counter}
      icon={<Heart />}
      path="/wishlist"
      setIsDim={setIsDim}
    />
  );
};

export default NavWishlist;
