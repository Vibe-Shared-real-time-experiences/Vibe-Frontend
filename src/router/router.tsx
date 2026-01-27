import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/public-pages/auth/LoginPage";
import HomePage from "../pages/protected-pages/HomePage";
import DashboardLayout from "../components/layouts/DashBroadLayout";
import RegisterPage from "../pages/public-pages/auth/RegisterPage";
import PublicRoute from "../pages/public-pages/PublicRoute";
import ProtectedRoute from "../pages/protected-pages/ProtectedRoute";
import DMChannelPage from "../pages/protected-pages/chat/dm/DMChannelPage";
import ChannelPage from "../pages/protected-pages/chat/channel/ChannelPage";
import ChannelChatArea from "../pages/protected-pages/chat/channel/components/ChannelChatArea";

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
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ]
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/channels",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "@me",
            element: <HomePage />,
            children: [
              {
                path: ":dmChannelId",
                element: <DMChannelPage />
              }
            ]
          },
          {
            path: ":serverId",
            element: <ChannelPage />,
            children: [
              {
                path: ":channelId",
                element: <ChannelChatArea />
              }
            ]
          },
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