"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "./ui/sidebar";

const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile({ MOBILE_BREAKPOINT: 1024 });

  return (
    <Sidebar
      key={isMobile ? "mobile" : "desktop"}
      collapsible="icon"
      variant={isMobile ? "floating" : "inset"}
      side={isMobile ? "right" : "left"}
    >
      {children}
    </Sidebar>
  );
};

export default SidebarWrapper;
