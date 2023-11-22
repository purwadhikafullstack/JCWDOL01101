import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import UserContext from "@/context/UserContext";
import { useCurrentUser } from "@/hooks/useUser";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { user, isSignedIn } = useUser();
  const { data: userBackend } = useCurrentUser({
    externalId: user?.id!,
    enabled: !!isSignedIn,
  });
  return (
    <UserContext.Provider value={{ user: userBackend }}>
      <ScrollToTop />
      <Navbar />
      <main className="container mt-4">
        <Outlet />
      </main>
      <Footer />
    </UserContext.Provider>
  );
};

export default MainLayout;
