import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Homepage from "./homepage/content/Homepage";
import MainLayout from "./MainLayout";
import Register from "./auth/Register";
import Login from "./auth/Login";
import SSOCallback from "./auth/SSOCallback";
import Verification from "./auth/Verification";
import DashboardLayout from "./dashboard/DashboardLayout";
import NotFound from "./dashboard/NotFound";
import Dashboard from "./dashboard/content/Dashboard";
import User from "./dashboard/content/User";
import ManageAdmin from "./dashboard/content/Admin";
import Product from "./dashboard/content/Product";
import Warehouse from "./dashboard/content/Warehouse";
import ManageMutation from "./dashboard/content/ManageMutation";
import EditAdminForm from "./dashboard/components/EditAdminForm";
import Cart from "./homepage/content/Cart";
import { ProtectedRoute, AdminRoute, DashboardRoute } from "./ProtectedRoute";
import UserLayout from "./user/UserLayout";
import Profile from "./user/content/Profile";
import Address from "./user/content/Address";
import Checkout from "./homepage/content/Checkout";
import CreateProductForm from "./dashboard/components/product/CreateProductForm";
import EditProductForm from "./dashboard/components/product/EditProductForm";
import Order from "./homepage/content/Order";
import ManageCategory from "./dashboard/content/Category";
import ProductsPage from "./homepage/content/Products";
import ProductDetail from "./homepage/content/ProductDetail";
import ReviewForm from "./homepage/content/ReviewForm";
import Reviews from "./homepage/content/Reviews";
import Wishlist from "./homepage/content/Wishlist";
import ProductReviews from "./dashboard/content/ProductReviews";
import MutationForm from "./dashboard/content/MutationForm";
import DashboardOrder from "./dashboard/content/DashboardOrder";
import UserOrder from "./homepage/content/Order";
import ResetPassword from "./auth/ResetPassword";

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
    path: "/resetPassword",
    element: <ResetPassword />,
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
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/product/:slug/reviews/new",
        element: <ReviewForm />,
      },
      {
        path: "/product/:slug/reviews",
        element: <Reviews />,
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
        path: "/order",
        element: (
          <ProtectedRoute>
            <UserOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
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
      <DashboardRoute>
        <DashboardLayout />
      </DashboardRoute>
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
        path: "mutation-form/:slug",
        element: <MutationForm />,
      },
      {
        path: "manage-mutation",
        element: <ManageMutation />,
      },
      {
        path: "user",
        element: (
          <AdminRoute>
            <User />
          </AdminRoute>
        ),
      },
      {
        path: "manage-admin",
        element: (
          <AdminRoute>
            <ManageAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "manage-admin/:userId",
        element: (
          <AdminRoute>
            <EditAdminForm />
          </AdminRoute>
        ),
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
        path: "product/reviews/:slug",
        element: <ProductReviews />,
      },
      {
        path: "product/create",
        element: <CreateProductForm />,
      },
      {
        path: "product/edit/:slug",
        element: <EditProductForm />,
      },
      {
        path: "order",
        element: <DashboardOrder />,
      },
    ],
  },
]);

export default router;
