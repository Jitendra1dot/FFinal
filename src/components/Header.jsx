// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/react.svg"; // Replace later with real UnifyHub logo
import ThemePicker from "./ThemePicker.jsx";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

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
        ProConnect
      </Link>

      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = searchText.trim();
          if (q) {
            navigate(`/?q=${encodeURIComponent(q)}`);
          }
        }}
        style={{ flexGrow: 1, maxWidth: "400px", marginRight: "20px" }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="What service do you need? e.g. Website developer, Electrician"
            style={{
              width: "100%",
              padding: "8px 40px 8px 12px",
              borderRadius: "20px",
              border: "none",
              fontSize: "14px",
              background: "#fff",
              boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
            }}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "var(--muted)",
            }}
          >
            🔍
          </button>
        </div>
      </form>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <Link
          to="/join"
          className="become-pro-btn"
          style={{ textDecoration: "none", fontWeight: "700" }}
        >
          Join as Professional
        </Link>

        {currentUser?.isLoggedIn ? (
          <>
            <Link
              to="/history"
              style={{ textDecoration: "none", fontWeight: "bold", color: "#fff" }}
            >
              � History
            </Link>

            <Link
              to="/favorites"
              style={{ textDecoration: "none", fontWeight: "bold", color: "#fff" }}
            >
              ⭐ Favorites
            </Link>

            <Link
              to="/dashboard"
              style={{ textDecoration: "none", fontWeight: "bold", color: "#fff" }}
            >
              👤 {currentUser.name.split(" ")[0]}
            </Link>

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
