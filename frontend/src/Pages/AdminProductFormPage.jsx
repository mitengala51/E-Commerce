import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import AdminState from "../Components/Admin/AdminState";
import axios from "axios";

export default function AdminProductFormPage() {
  const [product, setProduct] = useState({
    title: "",
    price: "",
    short_description: "",
    detail_description: "",
    category: "",
    brand: "",
    size: "",
    stock: "",
    best_selling: false,
    image_url: [""],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(params.id);

  const notify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        setError("");

        const all = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/all-products`
        );

        setCategories(
          all.data.all_products
            .map((item) => item.category)
            .filter((item, index, list) => item && list.indexOf(item) === index)
            .sort()
        );

        if (!params.id) return;

        const existing = all.data.all_products.find((item) => item.id === params.id);

        if (!existing) {
          return setError("That product could not be found");
        }

        setProduct({
          title: existing.title || "",
          price: existing.price ?? "",
          short_description: existing.short_description || "",
          detail_description: existing.detail_description || "",
          category: existing.category || "",
          brand: existing.brand || "",
          size: existing.size ?? "",
          stock: existing.stock ?? "",
          best_selling: Boolean(existing.best_selling),
          image_url:
            existing.image_url && existing.image_url.length > 0
              ? existing.image_url
              : [""],
        });
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Could not load the product");
      } finally {
        setLoading(false);
      }
    }

    fetchdata();
  }, [params.id]);

  function handleChange(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  function handleBestSellingChange(e) {
    setProduct({
      ...product,
      best_selling: e.target.checked,
    });
  }

  function handleImageChange(e, index) {
    const images = [...product.image_url];
    images[index] = e.target.value;
    setProduct({
      ...product,
      image_url: images,
    });
  }

  function handleAddImage() {
    setProduct({
      ...product,
      image_url: [...product.image_url, ""],
    });
  }

  function handleRemoveImage(index) {
    const images = product.image_url.filter((item, position) => position !== index);
    setProduct({
      ...product,
      image_url: images.length > 0 ? images : [""],
    });
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      if (product.title.trim() == "") {
        return errorNotify("Please enter a product title");
      }

      if (product.category.trim() == "") {
        return errorNotify("Please enter a category");
      }

      if (product.price === "" || Number(product.price) < 0) {
        return errorNotify("Please enter a valid price");
      }

      if (product.stock !== "" && Number(product.stock) < 0) {
        return errorNotify("Stock cannot be negative");
      }

      const images = product.image_url
        .map((item) => item.trim())
        .filter((item) => item !== "");

      if (images.length === 0) {
        return errorNotify("Please add at least one image name");
      }

      setSaving(true);

      const body = {
        title: product.title.trim(),
        price: product.price,
        short_description: product.short_description,
        detail_description: product.detail_description,
        category: product.category.trim(),
        brand: product.brand.trim(),
        size: product.size,
        stock: product.stock,
        best_selling: product.best_selling,
        image_url: images,
      };

      const response = isEdit
        ? await axios.put(
            `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/product/${params.id}`,
            body,
            {
              withCredentials: true,
            }
          )
        : await axios.post(
            `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/product`,
            body,
            {
              withCredentials: true,
            }
          );

      if (response.status == 200) {
        notify(response.data.message);
        navigate("/admin/products");
      }
    } catch (error) {
      console.log(error);

      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return errorNotify("Your admin session has expired, please sign in again");
      }

      errorNotify(error?.response?.data?.message || "Could not save the product");
    } finally {
      setSaving(false);
    }
  }

  if (loading || error) {
    return (
      <div className="admin-card p-3">
        <AdminState loading={loading} error={error} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card p-3 p-md-4 mb-3">
        <h2 className="h6 mb-3">Product Details</h2>

        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label lc text-dark fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="form-control p-2"
              placeholder="Enter product title"
              value={product.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label lc text-dark fw-semibold">Price (Rs)</label>
            <input
              type="number"
              name="price"
              className="form-control p-2"
              placeholder="0"
              value={product.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label lc text-dark fw-semibold">Category</label>
            <input
              type="text"
              name="category"
              list="admin-category-list"
              className="form-control p-2"
              placeholder="Enter or pick a category"
              value={product.category}
              onChange={handleChange}
            />
            <datalist id="admin-category-list">
              {categories.map((item) => {
                return <option key={item} value={item} />;
              })}
            </datalist>
          </div>

          <div className="col-md-4">
            <label className="form-label lc text-dark fw-semibold">Brand</label>
            <input
              type="text"
              name="brand"
              className="form-control p-2"
              placeholder="Enter brand"
              value={product.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label lc text-dark fw-semibold">Size</label>
            <input
              type="number"
              name="size"
              className="form-control p-2"
              placeholder="Optional"
              value={product.size}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label lc text-dark fw-semibold">
              Short Description
            </label>
            <input
              type="text"
              name="short_description"
              className="form-control p-2"
              placeholder="Shown on the product card"
              value={product.short_description}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label lc text-dark fw-semibold">
              Detail Description
            </label>
            <textarea
              name="detail_description"
              rows="4"
              className="form-control p-2"
              placeholder="Shown on the product detail page"
              value={product.detail_description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="admin-card p-3 p-md-4 mb-3">
        <h2 className="h6 mb-1">Inventory</h2>
        <p className="admin-muted">
          Leave stock empty to keep this product untracked, the way it was before.
        </p>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label lc text-dark fw-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control p-2"
              placeholder="Not tracked"
              value={product.stock}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-8 d-flex align-items-end">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="best_selling"
                checked={product.best_selling}
                onChange={handleBestSellingChange}
              />
              <label className="form-check-label" htmlFor="best_selling">
                Show in the Best Selling section on the home page
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card p-3 p-md-4 mb-3">
        <h2 className="h6 mb-1">Images</h2>
        <p className="admin-muted">
          Images are served from <code>frontend/public/Products Images/</code>. Enter the
          file name without the <code>.jpg</code> extension, for example{" "}
          <code>p_1</code>. Upload the file to that folder first.
        </p>

        {product.image_url.map((item, index) => {
          return (
            <div key={index} className="d-flex align-items-center gap-2 mb-2">
              <img
                src={`/Products Images/${item}.jpg`}
                alt=""
                loading="lazy"
                className="admin-thumb"
              />
              <input
                type="text"
                className="form-control p-2"
                placeholder="Image file name"
                value={item}
                onChange={(e) => {
                  handleImageChange(e, index);
                }}
              />
              <DeleteIcon
                fontSize="small"
                titleAccess="Remove image"
                sx={{ cursor: "pointer", color: "#b02a2a" }}
                onClick={() => {
                  handleRemoveImage(index);
                }}
              />
            </div>
          );
        })}

        <Button sx={{ color: "black" }} onClick={handleAddImage}>
          <AddIcon fontSize="small" className="me-1" />
          Add another image
        </Button>
      </div>

      <div className="d-flex gap-2">
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{ height: "40px", backgroundColor: "black" }}
        >
          {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </Button>

        <Button
          sx={{ height: "40px", color: "#444" }}
          onClick={() => {
            navigate("/admin/products");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
