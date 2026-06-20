import { createBrowserRouter } from "react-router-dom";
import { AuthRedirect } from "./routeGuards/AuthRedirect";
import { ProtectedRoute } from "./routeGuards/ProtectedRoute";
import { PublicRoute } from "./routeGuards/PublicRoute";
import { LoginPage, Dashboard, TaskPage } from "../pages/index.js";
import AppLayout from "../layouts/AppLayout.jsx";

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
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/tasks",
        element: <TaskPage />,
      },
    ],
  },
]);

export default router;
