import React from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import NavDropdown from "./NavDropdown";

const NavCategory = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  return (
    <div className="hidden lg:block">
      <NavDropdown
        icon={
          <Button variant="ghost">
            Category <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        }
        setIsDim={setIsDim}
      >
        <div className="container">
          <div className="w-full grid grid-cols-2 gap-2">
            <div>
              <ul>
                <li>Men's Clothing</li>
                <li>Woment's Apparel</li>
                <li>Footwear</li>
                <li>Accessoriesand Jewelry</li>
                <li>Seasonal Collections</li>
                <li>Athleisure and Activewear</li>
              </ul>
            </div>
          </div>
        </div>
      </NavDropdown>
    </div>
  );
};

export default NavCategory;
