import React, { useEffect } from "react";

import AddressModalSkeleton from "@/components/skeleton/AddressModalSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModalAddress } from "@/hooks/useAddress";
import { useToggleAddress } from "@/hooks/useAddressMutation";
import { cn } from "@/lib/utils";
import { Check, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslation();
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
          <span className="bg-black text-white">
            Address succesfully changed
          </span>
        ),
        {
          duration: 1000,
          style: {
            background: "#000",
          },
        }
      );
    }
  }, [toggleActiveAddress.isSuccess]);

  return !toggleMainAddress.isPending ? (
    <div
      onClick={() => {
        if (!isDesktop) {
          handleToggleActiveAddress();
        }
      }}
      className={cn(
        "flex flex-col lg:flex-row gap-2 rounded-md shadow-md border border-border",
        add.isActive && "bg-primary/[0.03] dark:bg-background border-primary"
      )}
    >
      <div className="flex-1 p-4 flex flex-col">
        <span className="font-semibold text-muted-foreground flex items-center gap-2">
          {add.label}
          {add.isMain ? (
            <Badge
              className="rounded-sm font-normal border border-primary text-primary"
              variant="outline"
            >
              {t("checkoutPage.addressModal.main.primaryBadge")}
            </Badge>
          ) : null}
        </span>
        <span className="font-bold text-lg">{add.recepient}</span>
        <p>{add.phone}</p>
        <p className="text-ellipsis overflow-hidden whitespace-nowrap text-sm lg:max-w-[400px]">
          {`${add.address}, ${add["city.cityName"]}, ${add["city.province"]}`}
        </p>
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              getId(add.id!);
              handleToggleDialog(false, false, true);
            }}
            variant="ghost"
            className="font-semibold text-primary/95 px-0 hover:bg-transparent hover:text-primary"
          >
            {t("checkoutPage.addressModal.main.changeBtn")}
          </Button>
          <Separator orientation="vertical" />
          {!add.isMain && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleMainAddress();
              }}
              variant="ghost"
              className="font-semibold text-primary/95 px-0 py-0 h-2 hover:bg-transparent hover:text-primary"
            >
              {t("checkoutPage.addressModal.main.makeMainBtn")}
            </Button>
          )}
        </div>
      </div>
      {add.isActive ? (
        <span className="p-2 px-4 self-center hidden md:block">
          <Check className="text-primary" />
        </span>
      ) : (
        <div className="p-2 px-4 self-center hidden md:block">
          <Button onClick={handleToggleActiveAddress}>
            {toggleActiveAddress.isPending ? (
              <Loader className="animate-spin h-4 h4" />
            ) : (
              t("checkoutPage.addressModal.main.pickBtn")
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
