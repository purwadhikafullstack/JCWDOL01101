import { useUser } from "@clerk/clerk-react";
import React from "react";
import Homepage from "./homepage/content/Homepage";
import UserContext from "@/context/UserContext";
import { useCurrentUser } from "@/hooks/useUser";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { data: userBackend } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  });
  return (
    <>
      {isLoaded && isSignedIn ? (
        <UserContext.Provider value={{ user: userBackend }}>
          {children}
        </UserContext.Provider>
      ) : (
        <Homepage />
      )}
    </>
  );
};

export default ProtectedRoute;
