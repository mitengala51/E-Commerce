import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const notify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/categories`,
          {
            withCredentials: true,
          }
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Could not load your categories");
      } finally {
        setLoading(false);
      }
    }

    fetchdata();
  }, [reload]);

  function handleRetry() {
    setReload(!reload);
  }

  function handleRenameOpen(category) {
    setRenameTarget(category);
    setNewCategory(category._id);
  }

  function handleRenameClose() {
    setRenameTarget(null);
    setNewCategory("");
  }

  function handleNewCategoryChange(e) {
    setNewCategory(e.target.value);
  }

  async function handleRename() {
    try {
      if (newCategory.trim() == "") {
        return errorNotify("Please enter a category name");
      }

      setSaving(true);

      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/category`,
        {
          old_category: renameTarget._id,
          new_category: newCategory.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        notify(response.data.message);
        handleRenameClose();
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
      errorNotify(error?.response?.data?.message || "Could not rename the category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-card p-3 mb-3">
        <p className="admin-muted mb-0">
          Categories are not stored separately in this project, they live on the
          products themselves. So a category exists for as long as at least one product
          uses it. Renaming a category here updates every product in it, and a category
          disappears once you move its last product elsewhere.
        </p>
      </div>

      <div className="admin-card p-3">
        {loading || error || categories.length === 0 ? (
          <AdminState
            loading={loading}
            error={error}
            empty={!loading && !error && categories.length === 0}
            emptyText="No categories yet, they appear once you add products."
            onRetry={handleRetry}
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table" style={{ minWidth: "520px" }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Tracked Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item) => {
                  return (
                    <tr key={item._id}>
                      <td>{item._id || "Uncategorised"}</td>
                      <td>{item.product_count}</td>
                      <td className="admin-muted">{item.total_stock}</td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <EditIcon
                            fontSize="small"
                            titleAccess="Rename"
                            sx={{ cursor: "pointer", color: "#444" }}
                            onClick={() => {
                              handleRenameOpen(item);
                            }}
                          />
                          <Button
                            size="small"
                            sx={{ color: "#444" }}
                            onClick={() => {
                              navigate("/admin/products");
                            }}
                          >
                            View products
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={Boolean(renameTarget)} onClose={handleRenameClose} fullWidth>
        <DialogTitle>Rename category</DialogTitle>
        <DialogContent>
          <p className="admin-muted">
            This will update {renameTarget?.product_count} product(s) currently in{" "}
            {renameTarget?._id}.
          </p>
          <input
            type="text"
            className="form-control p-2"
            placeholder="New category name"
            value={newCategory}
            onChange={handleNewCategoryChange}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#444" }} onClick={handleRenameClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "black" }}
            disabled={saving}
            onClick={handleRename}
          >
            {saving ? "Saving..." : "Rename"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
