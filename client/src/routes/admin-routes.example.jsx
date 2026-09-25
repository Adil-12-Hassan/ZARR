/**
 * Example only — shows how these files plug into react-router-dom.
 * Merge this into your existing router setup; don't mount it twice.
 */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { OrdersProvider } from "./admin/context/OrdersContext";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/adminDashboard";
import ManageProducts from "./admin/pages/manageProduct";
import ManageOrders from "./admin/pages/manageOrders";
import ManageMessages from "./admin/pages/manageMessage";
import ManageUsers from "./admin/pages/manageUsers";
import AdminSettings from "./admin/pages/adminSetting";

const router = createBrowserRouter([
  // ...your existing storefront routes here...
  {
    path: "/admin",
    element: (
      <OrdersProvider>
        <AdminLayout />
      </OrdersProvider>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <ManageProducts /> },
      { path: "orders", element: <ManageOrders /> },
      { path: "messages", element: <ManageMessages /> },
      { path: "users", element: <ManageUsers /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);

export default function AdminRoutesExample() {
  return <RouterProvider router={router} />;
}
