import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import Homepage from "./homepage/content/Homepage";
import { UserContext } from "@/context/UserContext";
import { useCurrentUser } from "@/hooks/useUser";
import { Link, useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { data: userBackend } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  });
  return (
    isLoaded && (
      <>
        {isSignedIn ? (
          <UserContext.Provider value={{ user: userBackend }}>
            {children}
          </UserContext.Provider>
        ) : (
          <Homepage />
        )}
      </>
    )
  );
};
export const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const ROLE = user?.publicMetadata.role;
  useEffect(() => {
    if (isLoaded && (!user || ROLE === "CUSTOMER")) {
      return navigate("/");
    }
  }, [ROLE, isLoaded, user]);
  return <>{children}</>;
};
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  return (
    <>
      {isLoaded && user?.publicMetadata.role === "ADMIN" ? (
        children
      ) : (
        <div>
          <Link to="/dashboard">
            <div className="text-center">
              <img
                className="w-[750px] mx-auto"
                src="/placeholder/restricted.jpg"
                alt="directions ilustration"
              />
              <p>Oops, you're reaching a restricted area! </p>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};
