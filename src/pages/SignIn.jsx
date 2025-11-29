// src/pages/SignIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const SignIn = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    let current = {};

    if (!validateEmail(formData.email)) current.email = "Invalid email format.";
    if (formData.password.length < 6) current.password = "Min 6 characters required.";
    if (isRegistering && formData.name.trim().length < 3) current.name = "Name must be min 3 chars";

    setErrors(current);
    return Object.keys(current).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      setIsLoading(false);

      if (!user) {
        alert("Incorrect credentials! Please register first.");
        setIsRegistering(true);
      } else {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name: user.name, email: user.email, isLoggedIn: true })
        );
        navigate("/");
        window.location.reload();
      }
    }, 800);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      let users = JSON.parse(localStorage.getItem("users") || "[]");

      if (users.some((u) => u.email === formData.email)) {
        alert("Email already exists! Please sign in.");
        setIsLoading(false);
        setIsRegistering(false);
        return;
      }

      const newUser = {
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ name: newUser.name, email: newUser.email, isLoggedIn: true })
      );

      setIsLoading(false);
      alert("Account created successfully!");
      navigate("/");
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="signin-page-container">
      <div className="signin-card">
        <div className="signin-brand">
          <div className="signin-logo">U</div>
          <div>
            <div className="signin-title">UnifyHub</div>
            <div className="signin-subtitle">Find & hire trusted professionals</div>
          </div>
        </div>

        <h2 style={{ textAlign: "left", fontWeight: "700", marginBottom: "6px" }}>
          {isRegistering ? "Create your account" : "Welcome back!"}
        </h2>
        <p style={{ textAlign: "left", color: "#6b7280", marginBottom: "14px" }}>
          {isRegistering ? "Create a new account to get started" : "Sign in to continue"}
        </p>

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-row">
              <label className="label" htmlFor="name">Full name</label>
              <input id="name" className="input-box" type="text" name="name"
                placeholder="Your full name" onChange={handleChange} aria-invalid={!!errors.name} />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
          )}

          <div className="form-row">
            <label className="label" htmlFor="email">Email address</label>
            <input id="email" className="input-box" type="email" name="email"
              placeholder="you@company.com" onChange={handleChange} aria-invalid={!!errors.email} />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input-box" type="password" name="password"
              placeholder="At least 6 characters" onChange={handleChange} aria-invalid={!!errors.password} />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div className="remember-forgot">
            <label style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span style={{fontSize:'13px', color:'#374151'}}>Remember me</span>
            </label>
            <a className="forgot-link" onClick={() => alert('Password reset placeholder')}>Forgot?</a>
          </div>

          <button className="signin-submit-btn" type="submit" style={{ marginTop: "16px" }} disabled={isLoading}>
            {isLoading ? "Loading..." : isRegistering ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="divider"><span>or continue with</span></div>
        <div className="social-btns">
          <button className="social-btn" onClick={() => alert('Google sign-in placeholder')}>🌐 Sign in with Google</button>
          <button className="social-btn" onClick={() => alert('GitHub sign-in placeholder')}>🐙 Sign in with GitHub</button>
        </div>

        <p style={{ textAlign: "center", marginTop: "18px" }}>
          {isRegistering ? "Already have an account?" : "New here?"}{" "}
          <span onClick={() => setIsRegistering(!isRegistering)}
            style={{ color: "#007bff", cursor: "pointer", fontWeight: "700" }}>
            {isRegistering ? "Sign in instead" : "Create an account"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
