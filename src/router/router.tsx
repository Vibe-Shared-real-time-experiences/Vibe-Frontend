import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/public-pages/auth/LoginPage";
import HomePage from "../pages/protected-pages/chat/HomePage";
import DashboardLayout from "../components/layouts/DashBroadLayout";
import RegisterPage from "../pages/public-pages/auth/RegisterPage";
import PublicRoute from "../pages/public-pages/PublicRoute";
import ProtectedRoute from "../pages/protected-pages/ProtectedRoute";

export const router = createBrowserRouter([

  /**
   * Public Routes
   */
  {
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ]
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          }
        ]
      },
    ]
  },

  // Redirect any unknown routes to /login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
])