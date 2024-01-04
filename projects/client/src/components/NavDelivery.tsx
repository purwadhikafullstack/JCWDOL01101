import React, { useContext } from "react";
import NavDropdown from "./NavDropdown";
import { Car, Clock, RefreshCcw, MapPin, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import UserContext from "@/context/UserContext";
import { Order, useOrders } from "@/hooks/useOrder";

const process = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Waiting for confirmation",
    id: "WAITING",
  },
  {
    icon: <RefreshCcw />,
    title: "Processing",
    id: "PROCESS",
  },
  {
    icon: <Car />,
    title: "Shipped",
    id: "SHIPPED",
  },
  {
    id: "DELIVERED",
    icon: <MapPin />,
    title: "Delivered",
  },
];

const NavDelivery = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("User must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: userOrders, isLoading } = useOrders(user?.id);
  const waitingPayment = userOrders
    ? userOrders.filter((order) => order.status === "PENDING").length
    : 0;
  return (
    <NavDropdown
      path="/order"
      icon={<ScrollText />}
      title="Orders"
      setIsDim={setIsDim}
      counter={userOrders ? userOrders.length : 0}
    >
      {isLoading ? (
        <div>
          <p>loading...</p>
        </div>
      ) : (
        userOrders && (
          <div className="min-w-[300px] px-2 space-y-2">
            <span className="flex justify-between">
              <p className="font-bold ">Orders ({userOrders.length})</p>
              <Link
                className="text-sm text-primary hover:text-primary/80"
                to="/order"
              >
                See All
              </Link>
            </span>
            {waitingPayment > 0 && (
              <p>Waiting for payment ({waitingPayment})</p>
            )}
            <div className="flex items-center">
              {process.map((p) => (
                <DeliveryDropdownItem
                  id={p.id}
                  key={p.id}
                  icon={p.icon}
                  title={p.title}
                  order={userOrders}
                />
              ))}
            </div>
          </div>
        )
      )}
    </NavDropdown>
  );
};

const DeliveryDropdownItem = ({
  id,
  icon,
  title,
  order,
}: {
  id: string;
  icon: React.ReactElement;
  title: string;
  order: Order[] | undefined;
}) => {
  const findOrders = order
    ? order.filter(
        (order) => order.status === id && order.status !== "DELIVERED"
      )
    : [];
  return (
    <div className="relative flex  justify-between p-2 flex-col gap-2  items-center rounded-md cursor-pointer">
      <span className="text-primary/60">{icon}</span>
      <p className="text-xs text-wrap w-[80px] text-center">{title}</p>
    </div>
  );
};

export default NavDelivery;
