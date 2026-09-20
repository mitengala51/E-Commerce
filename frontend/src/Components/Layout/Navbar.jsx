import React, { useContext } from "react";
import "./Navbar.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router";
import LoginModal from "../Auth/AuthModal";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { LoggedIn } from "../context/loggedIn";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { loggedIn, setLoggedIn } = useContext(LoggedIn);

  const Menuopen = Boolean(anchorEl);

  const notify = (message) => toast.success(message);

  // Modal Funcitons

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Menu Functions

  const MenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const MenuClose = () => {
    setAnchorEl(null);
  };

  async function handleLogOut() {
    try {
      // console.log("iamclicked");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/Logout`, {},
        {
          withCredentials: true,
        }
      );
      notify(response.data.message);
      // const logon = false;
      setLoggedIn(false);
    } catch (error) {}
  }

  return (
    <div className="d-flex py-4 px-5 justify-content-between shadow-sm">
      <Link
        to="/"
        className="h4 Link"
        style={{ fontFamily: "Playwrite RO, cursive" }}
      >
        Divya Collection
      </Link>
      <div className="row row-cols-auto">
        <Link to="/" className="Link hide">
          <div className=" nav-links">Home</div>
        </Link>
        <Link to="/Shopping" className="Link hide">
          <div className=" nav-links">Shopping</div>
        </Link>
        <Link to="/About-Us" className="Link hide">
          <div className=" nav-links">About</div>
        </Link>
        <Link to="/Contact-Us" className="Link hide">
          <div className="me-5 nav-links">Contact Us</div>
        </Link>
        <div className="ps-1">
          <Link to="/shopping-cart" className="hide">
            <ShoppingCartIcon
              sx={{ color: "black", fontSize: "x-larger", cursor: "pointer" }}
            />
          </Link>
        </div>
        {loggedIn ? (
          <div className="ps-1 hide">
            <LogoutIcon
              onClick={handleLogOut}
              sx={{ fontSize: "x-larger", cursor: "pointer" }}
            />
          </div>
        ) : (
          <div className="ps-1 hide">
            <AccountCircleIcon
              onClick={handleOpen}
              sx={{ fontSize: "x-larger", cursor: "pointer" }}
            />
          </div>
        )}
        <LoginModal
          open={open}
          handleClose={handleClose}
          setLoggedIn={setLoggedIn}
        />

        <div className="menuDiv">
          <Button
            id="basic-button"
            aria-controls={Menuopen ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Menuopen ? "true" : undefined}
            onClick={MenuClick}
            sx={{ color: "black" }}
          >
            <MenuIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Menuopen}
            onClose={MenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {" "}
            <Link to="/" className="Link ">
              <MenuItem onClick={MenuClose}>
                <div className=" nav-links">Home</div>
              </MenuItem>
            </Link>{" "}
            <Link to="/about-Us" className="Link ">
              <MenuItem onClick={MenuClose}>
                <div className=" nav-links">About</div>
              </MenuItem>
            </Link>{" "}
            <Link to="/contact-Us" className="Link ">
              <MenuItem onClick={MenuClose}>
                <div className="me-5 nav-links">Contact Us</div>
              </MenuItem>
            </Link>
            <Link to="/shopping-cart" className="Link nav-links">
              <MenuItem onClick={MenuClose}>Cart</MenuItem>
            </Link>
            <Link to="/shopping" className="Link nav-links">
              <MenuItem onClick={MenuClose}>Shopping</MenuItem>
            </Link>
            {loggedIn ? (
              <MenuItem onClick={()=>{MenuClose(),handleClick()}}>
                <div
                  className="ps-1 "
                  // onClick={handleClick}
                  style={{ fontSize: "x-larger", cursor: "pointer" }}
                >
                  Logout
                </div>
              </MenuItem>
            ) : (
              <MenuItem onClick={()=>{MenuClose(),handleOpen()}}>
                <div
                  className="ps-1 "
                  style={{ fontSize: "x-larger", cursor: "pointer" }}
                >
                  Login
                </div>
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}
