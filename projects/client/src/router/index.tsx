import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/pages/MainLayout";
import { ProtectedRoute, DashboardRoute } from "@/pages/ProtectedRoute";
import { Login, Register, SSOCallback, Verification } from "@/pages/auth";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import NotFound from "@/pages/dashboard/NotFound";
import { CheckoutPage } from "@/pages/homepage";
import MainPageRouter from "./MainPageRouter";
import DashboardPageRouter from "./DashboardPageRouter";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verification />,
  },
  {
    path: "/sso-callback",
    element: <SSOCallback />,
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: MainPageRouter,
  },
  {
    path: "checkout",
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <DashboardRoute>
        <DashboardLayout />
      </DashboardRoute>
    ),
    children: DashboardPageRouter,
  },
]);

export default router;
