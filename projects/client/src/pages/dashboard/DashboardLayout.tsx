import React, { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DashboardLayout = () => {
  const setIsResizing = useBoundStore((state) => state.setIsResizing);
  const isResizing = useBoundStore((state) => state.isResizing);
  const panelRef = React.useRef<ImperativePanelHandle>(null);
  const [size, setSize] = React.useState("w-[15%]");
  const onCollapse = () => {
    setIsResizing(true);
  };

  const onExpand = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (panelRef.current) {
      setSize(`w-[${panelRef.current.getSize()}%]`);
    }
  }, [isResizing, panelRef.current]);

  const handleToggle = () => {
    if (panelRef.current) {
      if (isResizing) {
        panelRef.current.expand();
      } else {
        panelRef.current.collapse();
      }
    }
  };
  return (
    <ThemeProvider>
      <ResizablePanelGroup autoSaveId="persistence" direction="horizontal">
        <ResizablePanel
          ref={panelRef}
          collapsible
          collapsedSize={6}
          minSize={15}
          defaultSize={15}
          maxSize={15}
          onCollapse={onCollapse}
          onExpand={onExpand}
          className="relative"
        >
          <div className={`fixed ${size} h-full`}>
            <DashboardSidebar />
          </div>
          <Button
            onClick={handleToggle}
            variant="outline"
            className=" rounded-full shadow z-50 absolute translate-x-1/2 right-0 top-4"
          >
            {!isResizing ? (
              <ChevronLeft className="w-4 h-4 transform -translate-x-2" />
            ) : (
              <ChevronRight className="w-4 h-4 transform -translate-x-2" />
            )}
          </Button>
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
  );
};

export default DashboardLayout;
