import { LayoutDashboard } from "lucide-react";
import { PathManager } from "./path_manager.route";

interface Navigation {
  path: string;
  title: string;
  icon: React.ReactNode;
}

export const sidebarNavigation: Navigation[] = [
  {
    path: PathManager.SIDEBAR_NAVIGATION_DASHBOARD,
    title: "Dashboard",
    icon: <LayoutDashboard />,
  },
];
