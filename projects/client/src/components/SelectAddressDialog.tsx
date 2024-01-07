import { useUserContext } from "@/context/UserContext";
import AddNewAddressDialog from "@/pages/homepage/components/checkout/AddNewAddressDialog";
import AddressModal from "@/pages/homepage/components/checkout/AddressModal";
import EditAddressDialog from "@/pages/homepage/components/checkout/EditAddressDialog";
import React, { useState } from "react";

const SelectAddressDialog = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const [mainDialog, setMainDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [modifyAddressId, setModifyAddressId] = useState<number | null>(null);
  const toggleDialog = (main = false, add = false, edit = false) => {
    setMainDialog(main);
    setAddDialog(add);
    setEditDialog(edit);
  };
  return (
    <>
      <AddressModal
        addressProps={{
          userId: user?.id!,
          mainDialog,
          toggleDialog,
          setMainDialog,
          setModifyAddressId,
          handleToggleDialog: toggleDialog,
        }}
      >
        {children}
      </AddressModal>
      <AddNewAddressDialog
        open={addDialog}
        name={user?.firstname || ""}
        userId={user?.id!}
        setAddDialog={setAddDialog}
        handleToggleDialog={toggleDialog}
      />
      <EditAddressDialog
        open={editDialog}
        userId={user?.id!}
        addressId={modifyAddressId}
        setEditDialog={setEditDialog}
        handleToggleDialog={toggleDialog}
      />
    </>
  );
};

export default SelectAddressDialog;
