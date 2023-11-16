import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Homepage from "./homepage/Homepage";
import MainLayout from "./MainLayout";
import Register from "./auth/Register";
import Login from "./auth/Login";
import CategoryPage from "./category/CategoryPage";
import SSOCallback from "./auth/SSOCallback";
import Verification from "./auth/Verification";

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
]);

export default router;
