import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
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
    isLoaded && (
      <UserContext.Provider value={{ user: userBackend }}>
        <ThemeProvider>
          <div className="flex relative flex-col min-h-screen">
            <ScrollToTop />
            <Navbar />
            <main className="container  mt-24  flex-auto mb-32 lg:mb-0">
              <Outlet />
            </main>
            <MobileNav />
            <Footer />
            <div className="flex-shrink-0">
              <Toaster />
            </div>
          </div>
        </ThemeProvider>
      </UserContext.Provider>
    )
  );
};

export default MainLayout;
