import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const notify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");
        const data = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/all-products`
        );
        setProducts(data.data.all_products);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Could not load your products");
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

  function handleCategoryChange(e) {
    setCategory(e.target.value);
  }

  function handleDeleteOpen(product) {
    setDeleteTarget(product);
  }

  function handleDeleteClose() {
    setDeleteTarget(null);
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/product/${
          deleteTarget.id
        }`,
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        notify(response.data.message);
        setDeleteTarget(null);
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
      errorNotify(error?.response?.data?.message || "Could not delete the product");
    } finally {
      setDeleting(false);
    }
  }

  function stockChip(stock) {
    if (typeof stock !== "number") {
      return <span className="admin-chip admin-chip-grey">Not tracked</span>;
    }

    if (stock === 0) {
      return <span className="admin-chip admin-chip-red">Out of stock</span>;
    }

    if (stock <= 5) {
      return <span className="admin-chip admin-chip-amber">Low stock</span>;
    }

    return <span className="admin-chip admin-chip-green">In stock</span>;
  }

  const categories = ["All"].concat(
    products
      .map((item) => item.category)
      .filter((item, index, list) => item && list.indexOf(item) === index)
      .sort()
  );

  const visibleProducts = products.filter((item) => {
    const matchesSearch = item.title
      ? item.title.toLowerCase().includes(search.toLowerCase())
      : false;
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex flex-wrap gap-2">
          <div
            className="d-flex bg-white text-black rounded-3 border border-grey"
            style={{ minWidth: "240px" }}
          >
            <input
              type="text"
              className="bg-white text-black py-2 px-3 rounded-3 border-0"
              style={{ outline: "none", width: "100%" }}
              placeholder="Search products..."
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
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((item) => {
              return (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              );
            })}
          </select>
        </div>

        <Button
          variant="contained"
          sx={{ height: "40px", backgroundColor: "black" }}
          onClick={() => {
            navigate("/admin/products/add");
          }}
        >
          <AddIcon fontSize="small" className="me-1" />
          Add Product
        </Button>
      </div>

      <div className="admin-card p-3">
        {loading || error || visibleProducts.length === 0 ? (
          <AdminState
            loading={loading}
            error={error}
            empty={!loading && !error && visibleProducts.length === 0}
            emptyText={
              products.length === 0
                ? "You have not added any products yet."
                : "No products match your search or filter."
            }
            onRetry={handleRetry}
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={`/Products Images/${item.image_url?.[0]}.jpg`}
                            alt={item.title}
                            loading="lazy"
                            className="admin-thumb"
                          />
                          <div>
                            <div>{item.title}</div>
                            {item.best_selling ? (
                              <span className="admin-chip admin-chip-blue">
                                Best selling
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="admin-muted">{item.category}</td>
                      <td className="admin-muted">{item.brand || "—"}</td>
                      <td>Rs {item.price}</td>
                      <td>
                        {typeof item.stock === "number" ? item.stock : "—"}
                      </td>
                      <td>{stockChip(item.stock)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link
                            to="/product-detail"
                            state={{ id: item.id }}
                            title="View on store"
                            style={{ color: "#444" }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </Link>
                          <EditIcon
                            fontSize="small"
                            titleAccess="Edit"
                            sx={{ cursor: "pointer", color: "#444" }}
                            onClick={() => {
                              navigate(`/admin/products/edit/${item.id}`);
                            }}
                          />
                          <DeleteIcon
                            fontSize="small"
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", color: "#b02a2a" }}
                            onClick={() => {
                              handleDeleteOpen(item);
                            }}
                          />
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

      <Dialog open={Boolean(deleteTarget)} onClose={handleDeleteClose}>
        <DialogTitle>Delete this product?</DialogTitle>
        <DialogContent>
          <p className="mb-0">
            {deleteTarget?.title} will be removed from the store and from every
            customer cart it is sitting in. This cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#444" }} onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#b02a2a" }}
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
