// src/pages/FavoritesPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllProfessionals } from "../data.js";
import StarRating from "../components/StarRating.jsx";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [professionals] = useState(getAllProfessionals());

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const saved = JSON.parse(
        localStorage.getItem(`favorites_${currentUser.email}`) || "[]"
      );
      setFavoriteIds(saved);
    }
  }, [currentUser]);

  const favoriteProfessionals = useMemo(() => {
    return professionals.filter((p) => favoriteIds.includes(p.id));
  }, [professionals, favoriteIds]);

  const removeFavorite = (id) => {
    if (!currentUser) return;

    const updated = favoriteIds.filter((f) => f !== id);
    localStorage.setItem(
      `favorites_${currentUser.email}`,
      JSON.stringify(updated)
    );
    setFavoriteIds(updated);
  };

  if (!currentUser) {
    return (
      <div className="main-content" style={{ textAlign: "center", padding: "60px" }}>
        <h2 style={{ color: "#c0392b" }}>Access Restricted</h2>
        <p>You must be logged in to view favorites.</p>
        <button
          onClick={() => navigate("/signin")}
          className="signin-btn"
          style={{ marginTop: "20px" }}
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
          margin: "25px 0",
        }}
      >
        ❤️ My Favorites ({favoriteProfessionals.length})
      </h1>

      {favoriteProfessionals.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "70px" }}>
          <p style={{ fontSize: "18px", color: "#666" }}>
            Your favorite list is empty 🚫
          </p>
          <button
            className="signin-btn"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/")}
          >
            Explore Professionals
          </button>
        </div>
      ) : (
        <section className="results-grid">
          {favoriteProfessionals.map((p) => (
            <div key={p.id} className="professional-card" style={{ position: "relative" }}>
              
              {/* remove favourite */}
              <button
                onClick={() => removeFavorite(p.id)}
                title="Remove from favorites"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                ❌
              </button>

              <Link
                to={`/professional/${p.id}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div className="card-content">
                  <h3 style={{ margin: "5px 0" }}>{p.name}</h3>
                  <p style={{ color: "#007bff", fontWeight: "600", fontSize: "14px" }}>
                    {p.profession}
                  </p>

                  <StarRating rating={p.rating} />

                  <p style={{ margin: "10px 0", color: "#666" }}>
                    {p.desc.substring(0, 70)}...
                  </p>

                  <p style={{ fontWeight: "bold" }}>₹{p.rate}/hr</p>

                  <button className="hire-btn" style={{ marginTop: "10px" }}>
                    View Profile
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default FavoritesPage;
