import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

const orderStatus = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const notify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/orders/${params.id}`,
          {
            withCredentials: true,
          }
        );
        setOrder(response.data.order);
        setStatus(response.data.order.order_status);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Could not load this order");
      } finally {
        setLoading(false);
      }
    }

    fetchdata();
  }, [params.id, reload]);

  function handleRetry() {
    setReload(!reload);
  }

  function handleStatusChange(e) {
    setStatus(e.target.value);
  }

  async function handleStatusSave() {
    try {
      setSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/orders/${
          params.id
        }/status`,
        { order_status: status },
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        notify(response.data.message);
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
      errorNotify(error?.response?.data?.message || "Could not update the status");
    } finally {
      setSaving(false);
    }
  }

  function formatDate(value) {
    return new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading || error) {
    return (
      <div className="admin-card p-3">
        <AdminState loading={loading} error={error} onRetry={handleRetry} />
      </div>
    );
  }

  const customer = order.customer;

  return (
    <div>
      <Button
        sx={{ color: "#444", paddingLeft: 0 }}
        onClick={() => {
          navigate("/admin/orders");
        }}
      >
        <ArrowBackIcon fontSize="small" className="me-1" />
        Back to Orders
      </Button>

      <Grid container spacing={2} className="mt-1">
        <Grid size={{ xs: 12, lg: 8 }}>
          <div className="admin-card p-3 mb-3">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
              <div>
                <h2 className="h6 mb-1">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <div className="admin-muted">Placed on {formatDate(order.created_at)}</div>
              </div>
              <span
                className={
                  order.payment_status === "Paid"
                    ? "admin-chip admin-chip-green"
                    : "admin-chip admin-chip-grey"
                }
              >
                Payment {order.payment_status}
              </span>
            </div>
          </div>

          <div className="admin-card p-3">
            <h2 className="h6 mb-2">Products</h2>

            <div className="admin-table-wrap">
              <table className="admin-table" style={{ minWidth: "480px" }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.productDetails.map((item) => {
                    return (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={`/Products Images/${item.image_url}.jpg`}
                              alt={item.title}
                              loading="lazy"
                              className="admin-thumb"
                            />
                            <div>
                              <div>{item.title}</div>
                              <div className="admin-muted">{item.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td>Rs {item.price}</td>
                        <td>{item.quantity}</td>
                        <td>Rs {item.price * item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <span className="fw-semibold">Total Amount</span>
              <span className="fw-semibold">Rs {order.total_amount}</span>
            </div>
          </div>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <div className="admin-card p-3 mb-3">
            <h2 className="h6 mb-2">Order Status</h2>

            <select
              className="form-select p-2 mb-2"
              value={status}
              onChange={handleStatusChange}
            >
              {orderStatus.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>

            <Button
              variant="contained"
              fullWidth
              disabled={saving || status === order.order_status}
              sx={{ backgroundColor: "black" }}
              onClick={handleStatusSave}
            >
              {saving ? "Updating..." : "Update Status"}
            </Button>
          </div>

          <div className="admin-card p-3">
            <h2 className="h6 mb-2">Customer</h2>

            <div className="mb-2">
              <div className="admin-muted">Name</div>
              <div>{customer.full_name}</div>
            </div>

            <div className="mb-2">
              <div className="admin-muted">Email</div>
              <div style={{ wordBreak: "break-all" }}>{customer.email || "—"}</div>
            </div>

            <div className="mb-2">
              <div className="admin-muted">Phone</div>
              <div>{customer.phone_number || "—"}</div>
            </div>

            <div>
              <div className="admin-muted">Location</div>
              <div>
                {customer.city || customer.state
                  ? `${customer.city || ""}${
                      customer.city && customer.state ? ", " : ""
                    }${customer.state || ""} ${customer.zip_code || ""}`
                  : "Not provided"}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
