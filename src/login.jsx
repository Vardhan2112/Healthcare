import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import "./login.css";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleGoogleSuccess = async (response) => {
    const token = response.credential;
  
    try {
      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
  
      if (res.ok) {
        console.log("User authenticated:", data.user);
        // Redirect user to the next page
      } else {
        console.error("Authentication failed:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed: ", error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Success:", data);
        // Redirect user to the next page
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="976545222025-surqnkane8rr2o7lpl0cldr1p9pg38bq.apps.googleusercontent.com">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img
              src="https://cdn.auth0.com/styleguide/latest/lib/logos/img/logo-black.svg"
              alt="Logo"
              className="login-logo"
            />
            <h2>Welcome</h2>
            <p>Log in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Continue</button>
          </form>
          <div className="divider">
            <span></span>
          </div>
          <div className="social-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              text="signin_with"
            />
          </div>
          <p className="signup-text">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
