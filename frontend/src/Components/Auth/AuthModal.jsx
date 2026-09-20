import * as React from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import "./AuthModal.css";
import { Link } from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "none",
//   outline: "none",
//   boxShadow: 24,
//   p: 4,
// };

export default function LoginModal({ open, handleClose, setLoggedIn }) {
  const [isLogin, setLogin] = React.useState(true);
  // const [loggedIn, setLoggedIn] = React.useState(false)

  let navigate = useNavigate();

  const notify = (message) => toast.error(message);
  const success = (message) => toast.success(message);

  const [LoginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  const [SignUpForm, setSignUpForm] = React.useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  function handleLoginChange(e) {
    if (e.target.name == "email") {
      // console.log(e.target.value);
      setLoginForm({
        ...LoginForm,
        email: e.target.value,
      });
    }

    if (e.target.name == "password") {
      // console.log(e.target.value);
      setLoginForm({
        ...LoginForm,
        password: e.target.value,
      });
    }
  }

  async function handleLoginSubmit(e) {
    try {
      e.preventDefault();

      if (
        LoginForm.email == "" ||
        (LoginForm.email == "" && LoginForm.password == "")
      ) {
        return notify("Please enter your email");
      }

      if (LoginForm.password == "") {
        return notify("Please enter your password");
      }

      // if(LoginForm.password.length < 8){
      //   return notify("Password must have atleast 8 characters");
      // }

      // if(!/[A-Z]/.test(LoginForm.password)){
      //   return notify("Password must have atleast 1 Uppercase characters");
      // }

      // if(!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(LoginForm.password)){
      //   return notify("Password must have atleast 1 special characters");
      // }

      // if(!/[0-9]/.test(LoginForm.password)){
      //   return notify("Password must have atleast 1 number");
      // }

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/login`, {
        email: LoginForm.email,
        Inputpassword: LoginForm.password,
      },{
        withCredentials: true
      });

      if (response.status == 200) {
        success(response.data.message)
        handleClose();
        setLoggedIn(true)

        if (response.data.role === "admin") {
          navigate("/admin");
        }
      }
    } catch (error) {
      if (error.status == 400) {
        notify(error.response.data.message);
      }

      if (error.status == 404) {
        notify(error.response.data.message);
      }

      console.log(error);
    }
  }

  function handleSignUpChange(e) {
    if (e.target.name == "email") {
      // console.log(e.target.value);
      setSignUpForm({
        ...SignUpForm,
        email: e.target.value,
      });
    }

    if (e.target.name == "password") {
      // console.log(e.target.value);
      setSignUpForm({
        ...SignUpForm,
        password: e.target.value,
      });
    }

    if (e.target.name == "confrim-password") {
      // console.log(e.target.value);
      setSignUpForm({
        ...SignUpForm,
        confirm_password: e.target.value,
      });
    }
  }

  async function handleSignUpSubmit(e) {
    try {
      e.preventDefault();

      if (SignUpForm.email == "") {
        return notify("Please enter your email");
      }

      if (SignUpForm.password == "") {
        return notify("Please enter your password");
      }

      if(SignUpForm.password.length < 8){
        return notify("Password must have atleast 8 characters");
      }

      if(!/[A-Z]/.test(SignUpForm.password)){
        return notify("Password must have atleast 1 Uppercase characters");
      }

      if(!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(SignUpForm.password)){
        return notify("Password must have atleast 1 special characters");
      }

      if(!/[0-9]/.test(SignUpForm.password)){
        return notify("Password must have atleast 1 number");
      }

      if (SignUpForm.password == SignUpForm.confirm_password) {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/sign-up`, {
          email: SignUpForm.email,
          password: SignUpForm.password,
        });

        if (response.status == 200) {
          // console.log(response.data.message);
          navigate("/complete-profile", { state: SignUpForm.email });
        }
      } else {
        notify("Confirm Password does not match");
      }
    } catch (error) {
      if (error.status == 400) {
        notify(error.response.data.message);
      }

      if (error.status == 404) {
        notify(error.response.data.message);
      }

      console.log(error);
    }
  }

  return (
    <div>
      <Toaster />

      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="border-0"
        sx={{ outline: "none", border: "none" }}
      >
        <Box  className="rounded-3 border-0 p-4 auth">
          <div className="d-flex justify-content-between mb-3">
            <h3 className="h4">{isLogin ? "Login" : "Sign Up"}</h3>
            <CloseIcon
              className="my-2"
              sx={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label lc text-dark fw-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control p-2"
                  // id="exampleInputEmail1"
                  // aria-describedby="emailHelp"
                  placeholder="Enter your email"
                  onChange={handleLoginChange}
                  //   required
                />
              </div>
              <div className="mb-3">
                <label className="form-label lc text-dark fw-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control p-2"
                  id="exampleInputPassword1"
                  placeholder="Enter your password"
                  onChange={handleLoginChange}
                  //   required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
              <h6 className="seperator  my-4 px-5">
                <span>OR</span>
              </h6>
              {/* <button
                type="submit"
                className="btn btn-primary w-100"
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              >
                Google
              </button> */}
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const credential = jwtDecode(credentialResponse.credential);
                    const response = await axios.post(
                      `${import.meta.env.VITE_REACT_APP_API_URL}/api/google-login`,
                      {
                        name: credential.name,
                        email: credential.email,
                      },
                      {
                        withCredentials: true
                      }
                    );

                    if(response.status == 200){
                      success(response.data.message)
                      handleClose()
                      setLoggedIn(prev=>prev=true)

                      if (response.data.role === "admin") {
                        navigate("/admin");
                      }
                    }
                  } catch (error) {
                    console.log(error)
                    if (error.status == 404) {
                      notify(error.response.data.message);
                    }
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />

              <p className="mb-1 mt-3 text-center">
                Dont have an account?{" "}
                <Link
                  onClick={() => {
                    setLogin(false);
                  }}
                  className="text-decoration-none"
                  style={{ cursor: "pointer" }}
                >
                  Sign up
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit}>
              <div className="mb-3">
                <label className="form-label lc text-dark fw-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control p-2"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter your email"
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label lc text-dark fw-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control p-2"
                  id="exampleInputPassword1"
                  placeholder="Enter your password"
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label lc text-dark fw-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confrim-password"
                  className="form-control p-2"
                  id="exampleInputPassword1"
                  placeholder="Enter your password"
                  onChange={handleSignUpChange}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign up
              </button>
              <h6 className="seperator  my-4 px-5">
                <span>OR</span>
              </h6>
              {/* <button
                // type="submit"
                className="btn btn-primary w-100"
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              >
                Google
              </button> */}
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const credential = jwtDecode(credentialResponse.credential);
                  await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/google-signup`, {
                    name: credential.name,
                    email: credential.email,
                  });
                  navigate("/complete-profile");
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                text="signup_with"
              />

              <p className="mb-1 mt-3 text-center">
                Already have an account?{" "}
                <Link
                  onClick={() => {
                    setLogin(true);
                  }}
                  className="text-decoration-none"
                  style={{ cursor: "pointer" }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
}
