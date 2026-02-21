import { useState, type ReactNode } from "react";
import { SidebarContext } from "./hooks/useSidebar";

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) setCollapsed((prev) => !prev);
    else setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
