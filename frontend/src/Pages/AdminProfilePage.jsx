import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/me`,
          {
            withCredentials: true,
          }
        );
        setAdmin(response.data.admin);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Could not load your profile");
      } finally {
        setLoading(false);
      }
    }

    fetchdata();
  }, [reload]);

  function handleRetry() {
    setReload(!reload);
  }

  if (loading || error) {
    return (
      <div className="admin-card p-3">
        <AdminState loading={loading} error={error} onRetry={handleRetry} />
      </div>
    );
  }

  const initial = admin.full_name
    ? admin.full_name.charAt(0).toUpperCase()
    : admin.email.charAt(0).toUpperCase();

  return (
    <div className="admin-card p-3 p-md-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Avatar sx={{ bgcolor: "black", width: 64, height: 64, fontSize: "26px" }}>
          {initial}
        </Avatar>
        <div>
          <h2 className="h5 mb-1">{admin.full_name || "Administrator"}</h2>
          <span className="admin-chip admin-chip-blue">{admin.role}</span>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="admin-muted">First Name</div>
          <div>{admin.first_name || "Not provided"}</div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="admin-muted">Last Name</div>
          <div>{admin.last_name || "Not provided"}</div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="admin-muted">Email</div>
          <div style={{ wordBreak: "break-all" }}>{admin.email}</div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="admin-muted">Phone</div>
          <div>{admin.phone_number || "Not provided"}</div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="admin-muted">City</div>
          <div>{admin.city || "Not provided"}</div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="admin-muted">State</div>
          <div>{admin.state || "Not provided"}</div>
        </Grid>
      </Grid>

      <p className="admin-muted mt-4 mb-0">
        Admin details are edited from the existing Complete Profile page on the store,
        so there is no duplicate edit form here.
      </p>
    </div>
  );
}
