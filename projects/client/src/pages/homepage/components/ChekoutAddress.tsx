import AddressModalSkeleton from "@/components/skeleton/AddressModalSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModalAddress } from "@/hooks/useAddress";
import { useToggleAddress } from "@/hooks/useAddressMutation";
import { Check, Loader } from "lucide-react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const ChekoutAddress = ({
  add,
  getId,
  handleToggleDialog,
}: {
  userId: number;
  add: ModalAddress;
  getId: (id: number) => void;
  handleToggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
}) => {
  const toggleActiveAddress = useToggleAddress(add.id!, "isActive");
  const toggleMainAddress = useToggleAddress(add.id!, "isMain");

  const handleToggleActiveAddress = () => {
    toggleActiveAddress.mutate();
  };

  const handleToggleMainAddress = () => {
    toggleMainAddress.mutate();
  };

  useEffect(() => {
    if (toggleActiveAddress.isSuccess) {
      handleToggleDialog();

      toast(
        () => (
          <span className="bg-black text-background">
            Address succesfully changed
          </span>
        ),
        {
          style: {
            background: "#000",
          },
        }
      );
    }
  }, [toggleActiveAddress.isSuccess]);

  return !toggleMainAddress.isPending ? (
    <div
      className={`flex gap-2 ${
        add.isActive && "bg-primary/[0.03] border border-primary"
      }   rounded-md shadow-md`}
    >
      <div className="flex-1 p-4 flex flex-col">
        <span className="font-semibold text-muted-foreground flex items-center gap-2">
          {add.label}
          {add.isMain && (
            <Badge
              className="rounded-sm font-normal border border-primary text-primary"
              variant="outline"
            >
              Primary
            </Badge>
          )}
        </span>
        <span className="font-bold text-lg">{add.recepient}</span>
        <p>{add.phone}</p>
        <p className="text-ellipsis overflow-hidden whitespace-nowrap text-sm lg:max-w-[400px]">
          {`${add.address}, ${add["city.cityName"]}, ${add["city.province"]}`}
        </p>
        <div className="flex items-center gap-2 h-max">
          <Button
            onClick={() => {
              getId(add.id!);
              handleToggleDialog(false, false, true);
            }}
            variant="ghost"
            className="font-semibold text-primary/95 hover:bg-transparent hover:text-primary"
          >
            Change Address
          </Button>
          <Separator orientation="vertical" />
          {!add.isMain && (
            <Button
              onClick={handleToggleMainAddress}
              variant="ghost"
              className="font-semibold text-primary/95 hover:bg-transparent hover:text-primary"
            >
              Make Main Address
            </Button>
          )}
        </div>
      </div>
      {add.isActive ? (
        <span className="p-2 px-4 self-center">
          <Check className="text-primary" />
        </span>
      ) : (
        <div className="p-2 px-4 self-center">
          <Button onClick={handleToggleActiveAddress}>
            {toggleActiveAddress.isPending ? (
              <Loader className="animate-spin h-4 h4" />
            ) : (
              "Pick Address"
            )}
          </Button>
        </div>
      )}
    </div>
  ) : (
    <AddressModalSkeleton />
  );
};

export default ChekoutAddress;
