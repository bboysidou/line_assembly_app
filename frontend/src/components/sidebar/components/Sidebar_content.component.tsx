import { cn } from "@/lib/utils";
import { useSidebar } from "../context/hooks/useSidebar";
import SidebarComponent from "./Sidebar.component";
import TopbarComponent from "./Topbar.component";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SideBarContentComponent = ({ children }: Props) => {
  const { collapsed } = useSidebar();

  return (
    <div className="h-dvh flex flex-row relative bg-background dark:bg-black">
      <SidebarComponent />
      <main
        className={cn(
          "flex-1 flex flex-col bg-muted/30 dark:bg-zinc-950 m-2 ml-0 rounded-2xl transition-all duration-300 overflow-hidden",
          collapsed
            ? "md:ml-0"
            : "md:ml-0 lg:ml-0",
        )}
      >
        <TopbarComponent />
        <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      </main>
    </div>
  );
};

export default SideBarContentComponent;
