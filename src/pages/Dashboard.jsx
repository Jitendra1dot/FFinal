// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllProfessionals } from "../data.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const savedHistory = JSON.parse(
        localStorage.getItem(`bookingHistory_${currentUser.email}`) || "[]"
      );
      setHistory(savedHistory);

      const savedFavorites = JSON.parse(
        localStorage.getItem(`favorites_${currentUser.email}`) || "[]"
      );
      setFavorites(savedFavorites);
    }
  }, [currentUser]);

  if (!currentUser) {
    // if somehow reached here without a user, redirect to signin
    navigate("/signin");
    return null;
  }

  const completed = history.filter(
    (h) => h.status && h.status.toLowerCase().includes("completed")
  );
  const active = history.filter((h) => !completed.includes(h));

  const totalSpent = history.reduce(
    (sum, h) => sum + (parseFloat(h.rate) || 0),
    0
  );

  // load professionals for recommendations
  const allProfessionals = getAllProfessionals();

  const upcoming = active
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

  return (
    <div className="main-content" style={{ maxWidth: "1000px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Welcome back, {currentUser.name.split(" ")[0]}!
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "var(--muted)",
          marginBottom: "25px",
        }}
      >
        Here's what's happening with your bookings
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px" }}>�</div>
          <h3
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              color: "var(--muted)",
            }}
          >
            Active Bookings
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "5px 0",
            }}
          >
            {active.length}
          </p>
        </div>

        <div
          style={{
            background: "var(--surface)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px" }}>✔️</div>
          <h3
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              color: "var(--muted)",
            }}
          >
            Completed
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "5px 0",
            }}
          >
            {completed.length}
          </p>
        </div>

        <div
          style={{
            background: "var(--surface)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px" }}>🌟</div>
          <h3
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              color: "var(--muted)",
            }}
          >
            Saved Pros
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "5px 0",
            }}
          >
            {favorites.length}
          </p>
        </div>

        <div
          style={{
            background: "var(--surface)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px" }}>�</div>
          <h3
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              color: "var(--muted)",
            }}
          >
            Total Spent
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "5px 0",
            }}
          >
            ₹{totalSpent}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: 1,
            background: "var(--surface)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            minWidth: "300px",
          }}
        >
          <h2 style={{ margin: "0 0 15px" }}>Upcoming Bookings</h2>
          {upcoming.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No upcoming bookings.</p>
          ) : (
            upcoming.map((h, i) => (
              <div key={i} style={{ marginBottom: "15px" }}>
                <h4 style={{ margin: "0 0 5px" }}>{h.proName}</h4>
                <p style={{ margin: "0", color: "var(--muted)" }}>{h.service}</p>
                <p style={{ margin: "0", color: "var(--muted)" }}>
                  {h.date
                    ? new Date(h.date).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
                <span
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                >
                  {h.status || "pending"}
                </span>
              </div>
            ))
          )}
        </div>
        <div
          style={{
            flex: 1,
            background: "var(--surface)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            minWidth: "300px",
          }}
        >
          <h2 style={{ margin: "0 0 15px" }}>Recommended for You</h2>
          {allProfessionals
            .filter((p) => !favorites.includes(p.id))
            .slice(0, 2)
            .map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={p.image || "/avatar.svg"}
                  alt={p.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: "600" }}>{p.name}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                    {p.profession}
                  </div>
                </div>
                <Link
                  to={`/professional/${p.id}`}
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  View
                </Link>
              </div>
            ))}
          {allProfessionals.filter((p) => !favorites.includes(p.id)).length ===
            0 && <p style={{ color: "var(--muted)" }}>No recommendations yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
