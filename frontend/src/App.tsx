import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./core/routes/Protected.route";
import { protectedRoute, publicRoute } from "./core/routes/routes.route";
import SidebarLayout from "./components/sidebar/Sidebar.layout";

const App = () => {
  return (
    <Routes>
      {publicRoute.map((route) => (
        <Route key={route.path} path={route.path} element={route.children} />
      ))}
      <Route element={<ProtectedRoute />}>
        {protectedRoute.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<SidebarLayout>{route.children}</SidebarLayout>}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default App;
