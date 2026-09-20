import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/customers`,
          {
            withCredentials: true,
          }
        );
        setCustomers(response.data.customers);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Could not load your customers");
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

  const visibleCustomers = customers.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      (item.full_name || "").toLowerCase().includes(keyword) ||
      (item.email || "").toLowerCase().includes(keyword)
    );
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
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearchChange}
          ></input>
          <div className="d-flex justify-content-center p-2 align-items-center">
            <Search size={18} className="me-1" />
          </div>
        </div>
      </div>

      <div className="admin-card p-3">
        {loading || error || visibleCustomers.length === 0 ? (
          <AdminState
            loading={loading}
            error={error}
            empty={!loading && !error && visibleCustomers.length === 0}
            emptyText={
              customers.length === 0
                ? "No customers have signed up yet."
                : "No customers match your search."
            }
            onRetry={handleRetry}
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Profile</th>
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map((item) => {
                  return (
                    <tr key={item._id}>
                      <td>
                        <div>{item.full_name || "Not provided"}</div>
                        <div className="admin-muted">{item.email}</div>
                      </td>
                      <td className="admin-muted">{item.phone_number || "—"}</td>
                      <td className="admin-muted">
                        {item.city || item.state
                          ? `${item.city || ""}${
                              item.city && item.state ? ", " : ""
                            }${item.state || ""}`
                          : "—"}
                      </td>
                      <td>{item.total_orders}</td>
                      <td>Rs {item.total_spent}</td>
                      <td>
                        <span
                          className={
                            item.profile_completed
                              ? "admin-chip admin-chip-green"
                              : "admin-chip admin-chip-grey"
                          }
                        >
                          {item.profile_completed ? "Complete" : "Incomplete"}
                        </span>
                        {item.Google_Login ? (
                          <span className="admin-chip admin-chip-blue ms-1">Google</span>
                        ) : null}
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
