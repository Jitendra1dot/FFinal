// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/react.svg"; // Replace later with real UnifyHub logo
import ThemePicker from "./ThemePicker.jsx";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    alert("Signed out successfully!");
    window.location.reload();
  };

    return (
    <header className="app-header">
      {/* Brand + Logo */}
        <Link
        to="/"
        className="app-title"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          color: "var(--text)",
          fontSize: "26px",
          fontWeight: "bold",
        }}
      >
        <img
          src={logo}
          alt="UH"
          style={{ width: "38px", height: "38px", borderRadius: "4px" }}
        />
        UnifyHub
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <Link
          to="/join"
          className="become-pro-btn"
          style={{ textDecoration: "none", fontWeight: "700" }}
        >
          Become a Pro
        </Link>

        {currentUser?.isLoggedIn ? (
          <>
            <Link
              to="/history"
              style={{ textDecoration: "none", fontWeight: "bold", color: "var(--text)" }}
            >
              🕒 History
            </Link>

            <Link
              to="/favorites"
              style={{ textDecoration: "none", fontWeight: "bold", color: "var(--text)" }}
            >
              ❤️ Favorites
            </Link>

            <span style={{ fontWeight: "bold", color: "var(--text)" }}>
              👋 {currentUser.name.split(" ")[0]}
            </span>

            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: "var(--danger)",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                color: "var(--btn-on-danger)",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/signin"
            style={{
              background: "linear-gradient(90deg, var(--accent), var(--primary))",
              padding: "8px 14px",
              borderRadius: "6px",
              color: "var(--btn-on-primary)",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Sign In / Register
          </Link>
        )}
      <ThemePicker />
      </div>
    </header>
  );
};

export default Header;
