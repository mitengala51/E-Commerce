import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { Toaster } from "react-hot-toast";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./AdminLayout.css";
import axios from "axios";

const pageTitles = [
  { path: "/admin/products/add", title: "Add Product", subtitle: "Products / Add" },
  { path: "/admin/products/edit", title: "Edit Product", subtitle: "Products / Edit" },
  { path: "/admin/products", title: "Products", subtitle: "Manage your catalogue" },
  {
    path: "/admin/categories",
    title: "Categories",
    subtitle: "Categories used by your products",
  },
  { path: "/admin/orders", title: "Orders", subtitle: "Track and update orders" },
  { path: "/admin/customers", title: "Customers", subtitle: "People who shop with you" },
  { path: "/admin/profile", title: "Profile", subtitle: "Your admin account" },
];

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  const location = useLocation();

  useEffect(() => {
    async function fetchdata() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/me`,
          {
            withCredentials: true,
          }
        );
        setAdmin(response.data.admin);
      } catch (error) {
        console.log(error);
      }
    }

    fetchdata();
  }, []);

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  const current = pageTitles.find((item) => location.pathname.startsWith(item.path));

  return (
    <div>
      <Toaster />

      <div className="admin-sidebar-desktop">
        <AdminSidebar />
      </div>

      <Drawer open={drawerOpen} onClose={handleDrawerClose}>
        <AdminSidebar onNavigate={handleDrawerClose} />
      </Drawer>

      <div className="admin-main">
        <AdminHeader
          title={current ? current.title : "Dashboard"}
          subtitle={current ? current.subtitle : "Overview of your store"}
          onMenuClick={handleDrawerOpen}
          admin={admin}
        />

        <div className="p-3 p-md-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
