import { useUser } from "@clerk/clerk-react";
import React from "react";
import Homepage from "./homepage/content/Homepage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  return <>{isLoaded && isSignedIn ? children : <Homepage />}</>;
};

export default ProtectedRoute;
