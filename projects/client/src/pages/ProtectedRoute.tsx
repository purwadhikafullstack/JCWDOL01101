import { useUser, useClerk } from "@clerk/clerk-react"
import React from "react"
import Homepage from "./homepage/content/Homepage"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser()
  return <>{isLoaded && isSignedIn ? children : <Homepage />}</>
}

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser()
  const { redirectToHome } = useClerk()
  return (
    <>
      {isLoaded && user?.publicMetadata.role !== "CUSTOMER"
        ? children
        : redirectToHome()}
    </>
  )
}
