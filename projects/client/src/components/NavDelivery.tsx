import React from "react";
import NavDropdown from "./NavDropdown";
import { Car, Clock, RefreshCcw, MapPin, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import { Order, useOrders } from "@/hooks/useOrder";
import { useUserContext } from "@/context/UserContext";

const process = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Waiting for confirmation",
    id: "WAITING",
    link: "/order?status=WAITING",
  },
  {
    icon: <RefreshCcw />,
    title: "Processing",
    id: "PROCESS",
    link: "/order?status=PROCESS",
  },
  {
    icon: <Car />,
    title: "Shipped",
    id: "SHIPPED",
    link: "/order?status=SHIPPED",
  },
  {
    id: "DELIVERED",
    icon: <MapPin />,
    title: "Delivered",
    link: "/order?status=DELIVERED",
  },
];

const NavDelivery = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  const { user } = useUserContext();
  const { data: userOrders, isLoading } = useOrders(user?.id);
  const waitingPayment = userOrders
    ? userOrders.filter((order) => order.status === "PENDING").length
    : 0;
  const orderBeforeSuccess = userOrders?.filter(
    (order) => order.status !== "SUCCESS"
  );
  return (
    <NavDropdown
      path="/order"
      icon={<ScrollText />}
      title="Orders"
      setIsDim={setIsDim}
      counter={orderBeforeSuccess ? orderBeforeSuccess.length : 0}
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
                  link={p.link}
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
  link,
}: {
  id: string;
  icon: React.ReactElement;
  title: string;
  order: Order[] | undefined;
  link: string;
}) => {
  const findOrders = order
    ? order.filter(
        (order) => order.status === id && order.status !== "DELIVERED"
      )
    : [];
  return (
    <Link
      to={link}
      className="relative flex  justify-between p-2 flex-col gap-2  items-center rounded-md cursor-pointer"
    >
      <span className="text-primary/60">{icon}</span>
      <p className="text-xs text-wrap w-[80px] text-center">{title}</p>
    </Link>
  );
};

export default NavDelivery;
