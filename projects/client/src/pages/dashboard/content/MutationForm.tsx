import React from "react"
import { useCurrentUser } from "@/hooks/useUser"
import { useUser } from "@clerk/clerk-react"
import WarehouseMutationForm from "../components/warehouse/WarehouseMutationForm"
import AdminMutationForm from "../components/warehouse/AdminMutationForm"

function MutationForm() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  })
  const ROLE = userAdmin?.role

  return ROLE === "WAREHOUSE ADMIN" ? (
    <WarehouseMutationForm />
  ) : (
    <AdminMutationForm />
  )
}

export default MutationForm
