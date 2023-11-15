import React from "react";
import NavDropdown from "./NavDropdown";
import { ShoppingCartIcon } from "lucide-react";

const NavCart = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  return (
    <NavDropdown icon={<ShoppingCartIcon />} title="Cart" setIsDim={setIsDim}>
      <div className="p-2 w-[280px]">
        <img
          className="w-[120px] mx-auto"
          src="/ilus/empty.svg"
          alt="cart ilustration"
        />
        <p className="font-bold text-center">Cart is empty.</p>
        <p className="text-center text-xs text-muted-foreground">
          Your cart is feeling light as a feather – ready and waiting for your
          delightful picks to fill it with joy!
        </p>
      </div>
    </NavDropdown>
  );
};

export default NavCart;
