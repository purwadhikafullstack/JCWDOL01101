import React from "react";

import UserLayout from "@/pages/user/UserLayout";
import Profile from "@/pages/user/content/Profile";
import Address from "@/pages/user/content/Address";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import {
  CartPage,
  Homepage,
  ProductDetailPage,
  ProductsPage,
  ReviewFormPage,
  ReviewsPage,
  WishlistPage,
  OrderPage,
} from "@/pages/homepage";

export default [
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
    element: <ProductDetailPage />,
  },
  {
    path: "/product/:slug/reviews/new",
    element: <ReviewFormPage />,
  },
  {
    path: "/product/:slug/reviews",
    element: <ReviewsPage />,
  },
  {
    path: "cart",
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order",
    element: (
      <ProtectedRoute>
        <OrderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "wishlist",
    element: (
      <ProtectedRoute>
        <WishlistPage />
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
        <CartPage />
      </ProtectedRoute>
    ),
  },
];
