// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const key = `bookingHistory_${currentUser.email}`;
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      setHistory(saved);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="main-content" style={{ textAlign: "center", padding: "60px" }}>
        <h2 style={{ color: "var(--danger)" }}>Access Denied</h2>
        <p>You must be signed in to check Booking History</p>
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
    <div className="main-content" style={{ maxWidth: "900px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        📜 Booking History
      </h1>

      <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: "25px" }}>
        View your service hire history — ({currentUser.email})
      </p>

      {history.length === 0 ? (
        <div
          style={{
            padding: "50px",
            textAlign: "center",
              background: "var(--surface)",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ fontSize: "18px", color: "var(--muted)" }}>
            No bookings yet. Hire services to view them here!
          </p>
            <button
            onClick={() => navigate("/")}
            className="signin-btn"
            style={{ background: "var(--primary)", marginTop: "15px" }}
          >
            Browse Professionals
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {history
            .slice()
            .reverse()
            .map((h, i) => (
              <div
                key={i}
                style={{
                    background: "var(--surface)",
                  padding: "18px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {/* Service info */}
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "var(--text)",
                    }}
                  >
                    {h.proName}
                  </h3>
                  <p style={{ margin: "3px 0", fontSize: "14px", color: "var(--primary)" }}>
                    {h.service}
                  </p>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
                    📅 {h.date}
                  </p>
                </div>

                {/* Status and Cost */}
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      margin: "0 0 5px",
                      color: "var(--success)",
                    }}
                  >
                    ₹{h.rate}
                  </p>
                  <span
                    style={{
                      background: "var(--success-bg)",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--success)",
                    }}
                  >
                    {h.status || "Completed"}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
