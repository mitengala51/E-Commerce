import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "../Common/Loader";
import axios from "axios";

export default function AdminRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchdata() {
      try {
        setChecking(true);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/me`,
          {
            withCredentials: true,
          }
        );

        if (response.status == 200) {
          setAllowed(true);
        }
      } catch (error) {
        console.log(error);
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    }

    fetchdata();
  }, []);

  if (checking) {
    return <Loader />;
  }

  if (!allowed) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center px-3"
        style={{ height: "100vh" }}
      >
        <h1 className="h3 admin-brand">Divya Collection</h1>
        <h2 className="h5 mt-3">Admin access only</h2>
        <p className="admin-muted">
          You need to be signed in with an administrator account to open this page.
        </p>
        <button
          className="btn btn-dark mt-2"
          type="button"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to Store
        </button>
      </div>
    );
  }

  return children;
}
