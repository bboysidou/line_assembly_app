import AuthPage from "@/features/auth/presentation/pages/Auth.page";
import { PathManager } from "./path_manager.route";
import ClientsPage from "@/features/clients/presentation/pages/Clients.page";
import CreateEditClientPage from "@/features/clients/presentation/pages/CreateEditClient.page";
import OrdersPage from "@/features/orders/presentation/pages/Orders.page";
import CreateEditOrderPage from "@/features/orders/presentation/pages/CreateEditOrder.page";
import OrderDetailPage from "@/features/orders/presentation/pages/OrderDetail.page";
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
    path: PathManager.CLIENTS_CREATE_PAGE,
    children: <CreateEditClientPage />,
  },
  {
    path: PathManager.CLIENTS_EDIT_PAGE,
    children: <CreateEditClientPage />,
  },
  {
    path: PathManager.ORDERS_PAGE,
    children: <OrdersPage />,
  },
  {
    path: PathManager.ORDERS_CREATE_PAGE,
    children: <CreateEditOrderPage />,
  },
  {
    path: PathManager.ORDERS_EDIT_PAGE,
    children: <CreateEditOrderPage />,
  },
  {
    path: PathManager.ORDER_DETAIL_PAGE,
    children: <OrderDetailPage />,
  },
];
