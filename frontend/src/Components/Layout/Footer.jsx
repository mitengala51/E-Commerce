import React from "react";
import { Link } from "react-router";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="px-3">
      {/* <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
    <div className="col mb-3">
      <a href="/" className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none" aria-label="Bootstrap">
        <svg className="bi me-2" width="40" height="32" aria-hidden="true"><use></use></svg>
      </a>
      <p className="text-body-secondary">© 2025</p>
    </div>

    <div className="col mb-3">

    </div>

    <div className="col mb-3">
      <h5>Section</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><Link to="http://localhost:5173/" className="nav-link p-0 text-body-secondary">Home</Link></li>
        <li className="nav-item mb-2"><Link to="http://localhost:5173/About-Us" className="nav-link p-0 text-body-secondary">About</Link></li>
        <li className="nav-item mb-2"><Link to="http://localhost:5173/Contact-Us" className="nav-link p-0 text-body-secondary">Contact</Link></li>
        <li className="nav-item mb-2"><Link to="http://localhost:5173/shopping-cart" className="nav-link p-0 text-body-secondary">Cart</Link></li>
      </ul>
    </div>

    <div className="col mb-3">
      <h5>Social Media </h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-body-secondary">Facebook</Link></li>
        <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-body-secondary">Instagram</Link></li>
        <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-body-secondary">Email</Link></li>
      </ul>
    </div> */}

      {/* <div className="col mb-3">
      <h5>Social Media </h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-body-secondary">Facebook</Link></li>
        <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-body-secondary">Instagram</Link></li>
        <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-body-secondary">Email</Link></li>
      </ul>
    </div> */}

      {/* </footer> */}

      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        {" "}
        <p className="col-md-4 mb-0 text-body-secondary">
          © 2026 Company, Inc
        </p>{" "}
        <Link
          to="/"
          className="col-md-4 d-flex align-items-center justify-content-center mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          aria-label="Bootstrap"
        >
          {" "}
          <h4 className="mb-0">Divya Collection</h4>
        </Link>{" "}
        <ul className="nav col-md-4 justify-content-end">
          {" "}
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-body-secondary">
              Home
            </Link>
          </li>{" "}
          <li className="nav-item">
            <Link to="/about-Us" className="nav-link px-2 text-body-secondary">
              About
            </Link>
          </li>{" "}
          <li className="nav-item">
            <Link
              to="/contact-Us"
              className="nav-link px-2 text-body-secondary"
            >
              Contact
            </Link>
          </li>{" "}
          <li className="nav-item">
            <Link to="/shopping" className="nav-link px-2 text-body-secondary">
              Shopping
            </Link>
          </li>{" "}
          <li className="nav-item">
            <Link
              to="/shopping-cart"
              className="nav-link px-2 text-body-secondary"
            >
              Cart
            </Link>
          </li>{" "}
        </ul>{" "}
      </footer>
    </div>
  );
}
