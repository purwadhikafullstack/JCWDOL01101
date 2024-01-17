import React from "react";

import { AdminRoute } from "@/pages/ProtectedRoute";
import EditAdminForm from "@/pages/dashboard/components/EditAdminForm";
import CreateProductForm from "@/pages/dashboard/components/product/CreateProductForm";
import EditProductForm from "@/pages/dashboard/components/product/EditProductForm";
import {
  DashboardOrderPage,
  DashboardPage,
  ManageAdminPage,
  ManageCategoryPage,
  ManageMutationPage,
  MutationFormPage,
  ProductPage,
  ProductReviewsPage,
  UserPage,
  WarehousePage,
} from "@/pages/dashboard";
import Report from "@/pages/dashboard/content/Report";

export default [
  {
    path: "",
    element: <DashboardPage />,
  },
  {
    path: "warehouse",
    element: <WarehousePage />,
  },
  {
    path: "mutation-form/:slug",
    element: <MutationFormPage />,
  },
  {
    path: "manage-mutation",
    element: <ManageMutationPage />,
  },
  {
    path: "user",
    element: (
      <AdminRoute>
        <UserPage />
      </AdminRoute>
    ),
  },
  {
    path: "manage-admin",
    element: (
      <AdminRoute>
        <ManageAdminPage />
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
    element: <ProductPage />,
  },
  {
    path: "product/category",
    element: <ManageCategoryPage />,
  },
  {
    path: "product/reviews/:slug",
    element: <ProductReviewsPage />,
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
    element: <DashboardOrderPage />,
  },
  {
    path: "report",
    element: <Report />,
  },
];
