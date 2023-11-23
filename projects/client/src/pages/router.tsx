import React from "react"
import { createBrowserRouter } from "react-router-dom"

import Homepage from "./homepage/content/Homepage"
import MainLayout from "./MainLayout"
import Register from "./auth/Register"
import Login from "./auth/Login"
import CategoryPage from "./homepage/content/Category"
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
import EditAdminForm from "./dashboard/components/EditAdminForm"
import UserLayout from "./user/UserLayout"
import Profile from "./user/content/Profile"
import Address from "./user/content/Address"

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
        path: "/user",
        element: <UserLayout />,
        errorElement: <NotFound />,
        children: [
          {
            path: "",
            element: <Profile />,
          },
          {
            path: "address",
            element: <Address />,
          },
        ],
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
        path: "manage-admin/:userId",
        element: <EditAdminForm />,
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
