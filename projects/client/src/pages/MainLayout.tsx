import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import UserContext from "@/context/UserContext";
import { useCurrentUser } from "@/hooks/useUser";
import { useBoundStore } from "@/store/client/useStore";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { data: userBackend } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  });

  const setLocation = useBoundStore((state) => state.setLocation);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);
  return (
    <UserContext.Provider value={{ user: userBackend }}>
      <ScrollToTop />
      <Navbar />
      <main className="container mt-4">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </UserContext.Provider>
  );
};

export default MainLayout;
