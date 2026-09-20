import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupIcon from "@mui/icons-material/Group";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AdminStatCard from "../Components/Admin/AdminStatCard";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/stats`,
          {
            withCredentials: true,
          }
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
        setError(
          error?.response?.data?.message || "Could not load the dashboard right now"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchdata();
  }, [reload]);

  function handleRetry() {
    setReload(!reload);
  }

  function formatDate(value) {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function statusClass(status) {
    if (status === "Delivered") return "admin-chip admin-chip-green";
    if (status === "Cancelled") return "admin-chip admin-chip-red";
    if (status === "Pending") return "admin-chip admin-chip-amber";
    return "admin-chip admin-chip-blue";
  }

  if (loading || error) {
    return <AdminState loading={loading} error={error} onRetry={handleRetry} />;
  }

  const stats = data.stats;
  const highestRevenue = data.sales_overview.reduce(
    (accumulator, item) => Math.max(accumulator, item.revenue),
    0
  );
  const totalStatusCount = data.status_distribution.reduce(
    (accumulator, item) => accumulator + item.count,
    0
  );

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <AdminStatCard
            label="Total Products"
            value={stats.total_products}
            icon={<Inventory2Icon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <AdminStatCard
            label="Total Orders"
            value={stats.total_orders}
            icon={<ReceiptLongIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <AdminStatCard
            label="Pending Orders"
            value={stats.pending_orders}
            icon={<PendingActionsIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <AdminStatCard
            label="Completed Orders"
            value={stats.completed_orders}
            icon={<CheckCircleIcon />}
            note="Orders marked as Delivered"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <AdminStatCard
            label="Total Customers"
            value={stats.total_customers}
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <AdminStatCard
            label="Revenue"
            value={`Rs ${stats.revenue}`}
            icon={<CurrencyRupeeIcon />}
            note="Total value of all placed orders"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} className="mt-1">
        <Grid size={{ xs: 12, lg: 7 }}>
          <div className="admin-card p-3 h-100">
            <h2 className="h6 mb-1">Sales Overview</h2>
            <p className="admin-muted">Revenue over the last 6 months</p>

            {highestRevenue === 0 ? (
              <p className="admin-muted mb-0">No orders in this period yet.</p>
            ) : (
              <div className="d-flex align-items-end gap-2" style={{ height: "180px" }}>
                {data.sales_overview.map((item) => {
                  return (
                    <div key={item.label} className="admin-column h-100">
                      <div className="admin-muted" style={{ fontSize: "12px" }}>
                        {item.revenue > 0 ? item.revenue : ""}
                      </div>
                      <div
                        className="admin-column-fill"
                        style={{
                          height: `${(item.revenue / highestRevenue) * 100}%`,
                        }}
                        title={`${item.orders} order(s), Rs ${item.revenue}`}
                      ></div>
                      <div className="admin-muted mt-1">{item.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <div className="admin-card p-3 h-100">
            <h2 className="h6 mb-1">Order Status</h2>
            <p className="admin-muted">How current orders are split</p>

            {totalStatusCount === 0 ? (
              <p className="admin-muted mb-0">No orders yet.</p>
            ) : (
              data.status_distribution.map((item) => {
                return (
                  <div key={item.status} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span style={{ fontSize: "15px" }}>{item.status}</span>
                      <span className="admin-muted">{item.count}</span>
                    </div>
                    <div className="admin-bar-track mt-1">
                      <div
                        className="admin-bar-fill"
                        style={{
                          width: `${(item.count / totalStatusCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2} className="mt-1">
        <Grid size={{ xs: 12, lg: 7 }}>
          <div className="admin-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 mb-0">Recent Orders</h2>
              <Link to="/admin/orders" className="admin-muted">
                View all
              </Link>
            </div>

            {data.recent_orders.length === 0 ? (
              <p className="admin-muted mb-0">No orders have been placed yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table" style={{ minWidth: "480px" }}>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_orders.map((item) => {
                      return (
                        <tr key={item._id}>
                          <td>
                            <Link
                              to={`/admin/orders/${item._id}`}
                              style={{ color: "black" }}
                            >
                              {item.customer_name}
                            </Link>
                          </td>
                          <td className="admin-muted">{formatDate(item.created_at)}</td>
                          <td>Rs {item.total_amount}</td>
                          <td>
                            <span className={statusClass(item.order_status)}>
                              {item.order_status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <div className="admin-card p-3 mb-3">
            <h2 className="h6 mb-2">Recently Added Products</h2>

            {data.recent_products.length === 0 ? (
              <p className="admin-muted mb-0">No products yet.</p>
            ) : (
              data.recent_products.map((item) => {
                return (
                  <div key={item._id} className="d-flex align-items-center gap-2 mb-2">
                    <img
                      src={`/Products Images/${item.image_url?.[0]}.jpg`}
                      alt={item.title}
                      loading="lazy"
                      className="admin-thumb"
                    />
                    <div className="flex-grow-1">
                      <div style={{ fontSize: "15px" }}>{item.title}</div>
                      <div className="admin-muted">{item.category}</div>
                    </div>
                    <div>Rs {item.price}</div>
                  </div>
                );
              })
            )}
          </div>

          <div className="admin-card p-3">
            <h2 className="h6 mb-1">Low Stock</h2>
            <p className="admin-muted">Products with 5 or fewer left</p>

            {data.low_stock_products.length === 0 ? (
              <p className="admin-muted mb-0">
                {stats.untracked_stock > 0
                  ? `Nothing is low. ${stats.untracked_stock} product(s) have no stock value set yet.`
                  : "Every product is well stocked."}
              </p>
            ) : (
              data.low_stock_products.map((item) => {
                return (
                  <div key={item._id} className="d-flex align-items-center gap-2 mb-2">
                    <img
                      src={`/Products Images/${item.image_url?.[0]}.jpg`}
                      alt={item.title}
                      loading="lazy"
                      className="admin-thumb"
                    />
                    <div className="flex-grow-1" style={{ fontSize: "15px" }}>
                      {item.title}
                    </div>
                    <span
                      className={
                        item.stock === 0
                          ? "admin-chip admin-chip-red"
                          : "admin-chip admin-chip-amber"
                      }
                    >
                      {item.stock} left
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
