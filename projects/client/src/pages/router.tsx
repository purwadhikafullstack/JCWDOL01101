import React from "react"
import { createBrowserRouter } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { Route } from 'react-router-dom';


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
import ProductDetail from "./homepage/content/ProductDetail"
import Cart from "./homepage/content/Cart"
import { ProtectedRoute, AdminRoute } from "./ProtectedRoute"
import UserLayout from "./user/UserLayout"
import Profile from "./user/content/Profile"
import Address from "./user/content/Address"
import Checkout from "./homepage/content/Checkout"
import ManageCategory from "./dashboard/content/Category";
import AssignAdminForm from "./dashboard/components/AssignAdminForm"

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
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        ),
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
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
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
        path: "assign-admin/:userId",
        element: <AssignAdminForm />,
      },
      
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/category",
        element: <ManageCategory />,
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
])

export default router
