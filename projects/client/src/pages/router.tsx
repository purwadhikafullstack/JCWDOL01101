import React from "react"
import { createBrowserRouter } from "react-router-dom"

import Homepage from "./homepage/Homepage"
import MainLayout from "./MainLayout"
import Register from "./auth/Register"
import Login from "./auth/Login"
import CategoryPage from "./category/CategoryPage"
import SSOCallback from "./auth/SSOCallback"
import Verification from "./auth/Verification"

import DashboardLayout from "./dashboard/DashboardLayout"
import NotFound from "./dashboard/NotFound"
import Dashboard from "./dashboard/content/Dashboard"
import User from "./dashboard/content/User"
import ManageAdmin from "./dashboard/content/Admin"
import Product from "./dashboard/content/Product"
import NewProductForm from "./dashboard/components/NewProductForm"
import EditProductForm from "./dashboard/components/EditProductForm"
import Warehouse from "./dashboard/content/Warehouse"

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
        path: "manage-admin",
        element: <ManageAdmin />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/:productId",
        element: <EditProductForm />,
      },
      {
        path: "product/create",
        element: <NewProductForm />,
      },
    ],
  },
])

export default router
