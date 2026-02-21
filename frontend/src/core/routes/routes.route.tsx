import AuthPage from "@/features/auth/presentation/pages/Auth.page";
import { PathManager } from "./path_manager.route";
import DashboardPage from "@/features/dashboard/presentation/components/Dashboard.page";

interface Route {
  path: string;
  children: React.ReactNode;
}

export const publicRoute: Route[] = [
  {
    path: PathManager.PUBLIC_LOGIN_PAGE,
    children: <AuthPage />,
  },
];

export const protectedRoute: Route[] = [
  {
    path: PathManager.DASHBOARD_PAGE,
    children: <DashboardPage />,
  },
];
