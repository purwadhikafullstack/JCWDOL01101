import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

const orderStatuses = [
  {
    label: "All",
    status: "ALL",
  },
  {
    label: "Ongoing",
    status: "ONGOING",
  },
  {
    label: "Successful",
    status: "SUCCESS",
  },
  {
    label: "Unsuccessful",
    status: "FAILED",
  },
];

const onGoingStatus = [
  {
    label: "Waiting",
    status: "WAITING",
  },
  {
    label: "Process",
    status: "PROCESS",
  },
  {
    label: "Shipped",
    status: "SHIPPED",
  },
  {
    label: "Delivered",
    status: "DELIVERED",
  },
];
const OrderStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const status = searchParams.get("status");

  React.useEffect(() => {
    setSearchParams((params) => {
      params.set("status", orderStatuses[0].status);
      return params;
    });
  }, []);

  React.useEffect(() => {
    if (status === "ONGOING") {
      setSearchParams((params) => {
        params.set("status", onGoingStatus[0].status);
        return params;
      });
    }
  }, [status]);

  return (
    <>
      <div className="flex items-center gap-2">
        <p>Status</p>
        {orderStatuses.map(({ status, label }) => (
          <button
            type="button"
            onClick={() => {
              setSearchParams((params) => {
                params.set("status", status);
                return params;
              });
            }}
            key={status}
            className={cn(
              "p-2 border border-muted text-muted-foreground",
              status === searchParams.get("status") && "border-primary"
            )}
          >
            {label}
          </button>
        ))}
        <Button
          onClick={() => {
            setSearchParams((params) => {
              params.set("status", orderStatuses[0].status);
              params.delete("q");
              return params;
            });
          }}
          variant="ghost"
        >
          Reset Filter
        </Button>
      </div>
      {(searchParams.get("status") === "ONGOING" ||
        onGoingStatus.some(
          (og) => og.status === searchParams.get("status")
        )) && (
        <div className="flex items-center gap-2">
          {onGoingStatus.map(({ status, label }) => (
            <button
              type="button"
              onClick={() => {
                setSearchParams((params) => {
                  params.set("status", status);
                  return params;
                });
              }}
              key={status}
              className={cn(
                "p-2 border border-muted text-muted-foreground",
                status === searchParams.get("status") && "border-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default OrderStatus;
