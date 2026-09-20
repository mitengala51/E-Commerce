import { NavLink, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import toast from "react-hot-toast";

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon fontSize="small" /> },
  {
    label: "Products",
    path: "/admin/products",
    icon: <Inventory2Icon fontSize="small" />,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: <CategoryIcon fontSize="small" />,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: <ReceiptLongIcon fontSize="small" />,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: <GroupIcon fontSize="small" />,
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: <AccountCircleIcon fontSize="small" />,
  },
];

export default function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate();

  const notify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  async function handleLogOut() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/Logout`,
        {},
        {
          withCredentials: true,
        }
      );
      notify(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      errorNotify("Could not log you out, please try again");
    }
  }

  return (
    <div className="admin-sidebar d-flex flex-column p-3">
      <div className="px-2 py-3">
        <div className="h5 admin-brand mb-0">Divya Collection</div>
        <div className="admin-muted">Admin Panel</div>
      </div>

      <div className="mt-2 flex-grow-1">
        {adminLinks.map((link) => {
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className="admin-link"
              onClick={onNavigate}
            >
              {link.icon}
              {link.label}
            </NavLink>
          );
        })}
      </div>

      <div className="pt-2">
        <NavLink to="/" className="admin-link" onClick={onNavigate}>
          <StorefrontIcon fontSize="small" />
          View Store
        </NavLink>

        <button type="button" className="admin-link admin-logout" onClick={handleLogOut}>
          <LogoutIcon fontSize="small" />
          Logout
        </button>
      </div>
    </div>
  );
}
