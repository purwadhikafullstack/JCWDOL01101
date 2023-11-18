import React from "react";
import NavDropdown from "./NavDropdown";
import { Car, Clock, MapPin, Package, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

const process = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Waiting for confirmation",
  },
  {
    icon: <RefreshCcw />,
    title: "Processing",
  },
  {
    icon: <Car />,
    title: "Shipped",
  },
  {
    icon: <MapPin />,
    title: "Delivered",
  },
];

const NavDelivery = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  return (
    <NavDropdown icon={<Package />} title="Delivery" setIsDim={setIsDim}>
      <div className="min-w-[300px] px-2 space-y-2">
        <span className="flex justify-between">
          <p className="font-bold hidden">Delivery</p>
          <Link
            className="text-sm text-primary hover:text-primary/80"
            to="/order-list"
          >
            See All
          </Link>
        </span>
        <p className="text-left text-sm">Waiting for payment</p>
        <div className="flex  items-center">
          {process.map((p) => (
            <DeliveryDropdownItem key={p.title} icon={p.icon} title={p.title} />
          ))}
        </div>
      </div>
    </NavDropdown>
  );
};

const DeliveryDropdownItem = ({
  icon,
  title,
}: {
  icon: React.ReactElement;
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-2 items-center rounded-md hover:bg-muted cursor-pointer">
      <span className="text-primary/60">{icon}</span>
      <p className="text-xs text-wrap w-[80px] text-center">{title}</p>
    </div>
  );
};

export default NavDelivery;
