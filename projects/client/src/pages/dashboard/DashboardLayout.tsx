import React from "react";
import DashboardNavbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useBoundStore } from "@/store/client/useStore";
import { cn } from "@/lib/utils";
import { UserContext } from "@/context/UserContext";
import { useUser } from "@clerk/clerk-react";
import { useCurrentUser } from "@/hooks/useUser";

const DashboardLayout = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { data: userBackend } = useCurrentUser({
    externalId: user?.id,
    enabled: isLoaded && !!isSignedIn,
  });
  const setIsResizing = useBoundStore((state) => state.setIsResizing);
  const isResizing = useBoundStore((state) => state.isResizing);
  const panelRef = React.useRef<ImperativePanelHandle>(null);

  const onCollapse = () => {
    setIsResizing(true);
  };

  const onExpand = () => {
    setIsResizing(false);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user: userBackend }}>
      <ThemeProvider>
        <ResizablePanelGroup autoSaveId="persistence" direction="horizontal">
          <ResizablePanel
            ref={panelRef}
            collapsible
            collapsedSize={4}
            minSize={15}
            defaultSize={15}
            maxSize={20}
            onCollapse={onCollapse}
            onExpand={onExpand}
            className={cn(
              "relative",
              isResizing &&
                "min-w-[50px] transition-all duration-200 ease-in-out"
            )}
          >
            <DashboardSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="h-screen overflow-y-auto">
              <DashboardNavbar />
              <main className="p-6">
                <Outlet />
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <Toaster />
      </ThemeProvider>
    </UserContext.Provider>
  );
};

export default DashboardLayout;
