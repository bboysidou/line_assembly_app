import type { ReactNode } from "react";
import SideBarContentComponent from "./components/Sidebar_content.component";
import { SidebarProvider } from "./context/Sidebar.context";

interface Props {
  children: ReactNode;
}

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <SideBarContentComponent>{children}</SideBarContentComponent>
    </SidebarProvider>
  );
};

export default SidebarLayout;
