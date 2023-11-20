import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Homepage from "./homepage/content/Homepage";
import MainLayout from "./MainLayout";
import Register from "./auth/Register";
import Login from "./auth/Login";
import CategoryPage from "./homepage/content/Category";
import SSOCallback from "./auth/SSOCallback";
import Verification from "./auth/Verification";

import DashboardLayout from "./dashboard/DashboardLayout";
import NotFound from "./dashboard/NotFound";
import Product from "./dashboard/content/Product";
import User from "./dashboard/content/User";
import Dashboard from "./dashboard/content/Dashboard";
import Warehouse from "./dashboard/content/Warehouse";
import NewProductForm from "./dashboard/components/NewProductForm";
import EditProductForm from "./dashboard/components/EditProductForm";
import ProductDetail from "./homepage/content/ProductDetail";

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
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "/category",
        element: <CategoryPage />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetail />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "warehouse",
        element: <Warehouse />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/:slug",
        element: <EditProductForm />,
      },
      {
        path: "product/create",
        element: <NewProductForm />,
      },
    ],
  },
]);

export default router;
