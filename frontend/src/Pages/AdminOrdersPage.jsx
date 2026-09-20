import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Search } from "lucide-react";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

const orderStatus = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/orders`,
          {
            withCredentials: true,
          }
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Could not load your orders");
      } finally {
        setLoading(false);
      }
    }

    fetchdata();
  }, [reload]);

  function handleRetry() {
    setReload(!reload);
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function handleStatusChange(e) {
    setStatus(e.target.value);
  }

  function formatDate(value) {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function statusClass(value) {
    if (value === "Delivered") return "admin-chip admin-chip-green";
    if (value === "Cancelled") return "admin-chip admin-chip-red";
    if (value === "Pending") return "admin-chip admin-chip-amber";
    return "admin-chip admin-chip-blue";
  }

  const visibleOrders = orders.filter((item) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      item.customer_name.toLowerCase().includes(keyword) ||
      item.customer_email.toLowerCase().includes(keyword) ||
      item._id.toLowerCase().includes(keyword);
    const matchesStatus = status === "All" || item.order_status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div
          className="d-flex bg-white text-black rounded-3 border border-grey"
          style={{ minWidth: "240px" }}
        >
          <input
            type="text"
            className="bg-white text-black py-2 px-3 rounded-3 border-0"
            style={{ outline: "none", width: "100%" }}
            placeholder="Search by customer or order id..."
            value={search}
            onChange={handleSearchChange}
          ></input>
          <div className="d-flex justify-content-center p-2 align-items-center">
            <Search size={18} className="me-1" />
          </div>
        </div>

        <select
          className="form-select p-2"
          style={{ width: "auto" }}
          value={status}
          onChange={handleStatusChange}
        >
          {orderStatus.map((item) => {
            return (
              <option key={item} value={item}>
                {item === "All" ? "All Statuses" : item}
              </option>
            );
          })}
        </select>
      </div>

      <div className="admin-card p-3">
        {loading || error || visibleOrders.length === 0 ? (
          <AdminState
            loading={loading}
            error={error}
            empty={!loading && !error && visibleOrders.length === 0}
            emptyText={
              orders.length === 0
                ? "No orders have been placed yet."
                : "No orders match your search or filter."
            }
            onRetry={handleRetry}
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((item) => {
                  return (
                    <tr key={item._id}>
                      <td className="admin-muted">
                        #{item._id.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div>{item.customer_name}</div>
                        <div className="admin-muted">{item.customer_email}</div>
                      </td>
                      <td>{item.total_items}</td>
                      <td>Rs {item.total_amount}</td>
                      <td>
                        <span
                          className={
                            item.payment_status === "Paid"
                              ? "admin-chip admin-chip-green"
                              : "admin-chip admin-chip-grey"
                          }
                        >
                          {item.payment_status}
                        </span>
                      </td>
                      <td>
                        <span className={statusClass(item.order_status)}>
                          {item.order_status}
                        </span>
                      </td>
                      <td className="admin-muted">{formatDate(item.created_at)}</td>
                      <td>
                        <Button
                          size="small"
                          sx={{ color: "black" }}
                          onClick={() => {
                            navigate(`/admin/orders/${item._id}`);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
