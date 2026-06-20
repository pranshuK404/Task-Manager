import { createBrowserRouter } from "react-router-dom";
import { AuthRedirect } from "./routeGuards/AuthRedirect";
import { ProtectedRoute } from "./routeGuards/ProtectedRoute";
import { PublicRoute } from "./routeGuards/PublicRoute";
import {LoginPage , Dashboard} from "../pages/index.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;
