import AuthPage from "@/features/auth/presentation/pages/Auth.page";
import { PathManager } from "./path_manager.route";
import ClientsPage from "@/features/clients/presentation/pages/Clients.page";
import OrdersPage from "@/features/orders/presentation/pages/Orders.page";
import AssemblyPage from "@/features/assembly/presentation/pages/Assembly.page";
import DashboardPage from "@/features/dashboard/presentation/pages/Dashboard.page";

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
  {
    path: PathManager.CLIENTS_PAGE,
    children: <ClientsPage />,
  },
  {
    path: PathManager.ORDERS_PAGE,
    children: <OrdersPage />,
  },
  {
    path: PathManager.ASSEMBLY_PAGE,
    children: <AssemblyPage />,
  },
];
