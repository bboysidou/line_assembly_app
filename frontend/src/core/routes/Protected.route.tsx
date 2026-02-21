import { useQuery } from "@tanstack/react-query";
import PageLoaderLayout from "@/components/loaders/Page_loader.layout";
import { Navigate, Outlet } from "react-router-dom";
import { GET_USER_INFO } from "../http/type";
import { sessionUsecase } from "../dependency_injections/auth.di";

interface Props {
  redirectPath?: string;
}

const ProtectedRoute = ({ redirectPath = "/login" }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: [GET_USER_INFO],
    queryFn: async () => await sessionUsecase.execute(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) {
    return <PageLoaderLayout />;
  }

  return data ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
