import { LayoutDashboard, Users, ClipboardList, Factory } from "lucide-react";
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
  {
    path: PathManager.SIDEBAR_NAVIGATION_CLIENTS,
    title: "Clients",
    icon: <Users />,
  },
  {
    path: PathManager.SIDEBAR_NAVIGATION_ORDERS,
    title: "Orders",
    icon: <ClipboardList />,
  },
  {
    path: PathManager.SIDEBAR_NAVIGATION_ASSEMBLY,
    title: "Assembly Line",
    icon: <Factory />,
  },
];
