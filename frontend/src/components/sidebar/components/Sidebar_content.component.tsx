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
    <div className="h-dvh flex flex-row relative bg-white dark:bg-black">
      <SidebarComponent />
      <main
        className={cn(
          "w-full flex flex-col bg-neutral-100 dark:bg-zinc-900 m-2 ml-0 rounded-2xl p-6 transition-all duration-300",
          collapsed
            ? "w-full"
            : "md:w-[calc(100%-70px)] lg:w-[calc(100%-300px)]",
        )}
      >
        <TopbarComponent />
        <div className="h-full overflow-y-scroll px-4">{children}</div>
      </main>
    </div>
  );
};

export default SideBarContentComponent;
