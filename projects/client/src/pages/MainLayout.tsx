import ButtomNav from "@/components/ButtomNav";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import UserContext from "@/context/UserContext";
import { useCurrentUser } from "@/hooks/useUser";
import { useBoundStore } from "@/store/client/useStore";
import { useUser } from "@clerk/clerk-react";
import {
  Box,
  Cog,
  Heart,
  Home,
  Settings,
  Settings2,
  ShoppingCart,
} from "lucide-react";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Link, Outlet } from "react-router-dom";
import PurchasedReviewModal from "./homepage/components/reviews/PurchasedReviewModal";

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
        <div className="flex relative flex-col min-h-screen">
          <ScrollToTop />
          <Navbar />
          <main className="container  mt-24  flex-auto mb-32 lg:mb-0">
            <Outlet />
          </main>
          <ButtomNav />
          <Footer />
          <div className="flex-shrink-0">
            <Toaster />
          </div>
        </div>
      </UserContext.Provider>
    )
  );
};

export default MainLayout;
