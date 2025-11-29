// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/react.svg"; // Replace later with real UnifyHub logo

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
    <header
      className="app-header"
      style={{
        background: "linear-gradient(90deg, #4b6cb7, #182848)",
        padding: "12px 35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        color: "white",
      }}
    >
      {/* Brand + Logo */}
      <Link
        to="/"
        className="app-title"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          color: "#fff",
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
          style={{
            textDecoration: "none",
            fontWeight: "bold",
            color: "#ffc107",
          }}
        >
          Become a Pro
        </Link>

        {currentUser?.isLoggedIn ? (
          <>
            <Link
              to="/history"
              style={{ textDecoration: "none", fontWeight: "bold", color: "#fff" }}
            >
              🕒 History
            </Link>

            <Link
              to="/favorites"
              style={{ textDecoration: "none", fontWeight: "bold", color: "#fff" }}
            >
              ❤️ Favorites
            </Link>

            <span style={{ fontWeight: "bold", color: "#fff" }}>
              👋 {currentUser.name.split(" ")[0]}
            </span>

            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: "#ff3b57",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                color: "white",
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
              backgroundColor: "#00c6ff",
              padding: "8px 14px",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Sign In / Register
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
