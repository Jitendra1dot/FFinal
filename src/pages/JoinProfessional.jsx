// src/pages/JoinProfessional.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simple Email Validation
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const JoinProfessional = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    rate: "",
    experience: "",
    desc: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const professions = [
    "Plumber",
    "Web Developer",
    "Electrician",
    "Photographer",
    "Appliance Technician",
    "Graphic Designer",
    "Deep Cleaner",
    "Car Mechanic",
  ];

  const validate = () => {
    let e = {};

    if (formData.name.trim().length < 3)
      e.name = "Enter full name (min 3 characters)";
    if (!isValidEmail(formData.email))
      e.email = "Enter a valid email";
    if (!formData.profession)
      e.profession = "Select a profession";
    if (!formData.rate || parseFloat(formData.rate) <= 0)
      e.rate = "Enter a valid rate in ₹";
    if (!formData.experience || Number(formData.experience) < 0)
      e.experience = "Enter your years of experience (0 if new)";
    if (formData.desc.trim().length < 20)
      e.desc = "Description must be at least 20 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // If the user is logged in, pre-fill name/email to save time
  useEffect(() => {
    try {
      const j = localStorage.getItem("currentUser");
      if (!j) return;
      const u = JSON.parse(j);
      setFormData((f) => ({ ...f, name: u.name || f.name, email: u.email || f.email }));
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const newPro = {
        id: Date.now(),
        ...formData,
        rating: 4.8,
        image:
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        skills: [formData.profession],
        location: "Not Provided",
        isVerified: false,
        experience: formData.experience,
      };

      const old = JSON.parse(localStorage.getItem("newProfessionals") || "[]");
      old.push(newPro);
      localStorage.setItem("newProfessionals", JSON.stringify(old));

      // Notify the app immediately that a new professional was added so the list can update.
      try {
        window.dispatchEvent(new CustomEvent("newProfessional", { detail: newPro }));
      } catch {
        // fallback: do nothing if dispatch not supported
      }

      alert(
        `${newPro.name} is now registered and visible to all users 🥳`
      );

      setLoading(false);
      navigate("/");
    }, 900);
  };

  const inputBase = {
    padding: "12px",
    borderRadius: "6px",
    border: "1.5px solid var(--border)",
    width: "100%",
    marginBottom: "6px",
    outline: "none",
    transition: "0.2s",
  };

  return (
    <div className="signin-page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "var(--surface)",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            marginBottom: "10px",
            color: "var(--text)",
          }}
        >
          🚀 Register as a Professional
        </h2>
        <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: "25px" }}>
          Get hired by thousands of users! 👥✨
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <input
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              ...inputBase,
              borderColor: errors.name ? "var(--danger)" : "var(--border)",
            }}
          />
          {errors.name && (
            <small style={{ color: "var(--danger)" }}>{errors.name}</small>
          )}

          {/* Email */}
          <input
            placeholder="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            style={{
              ...inputBase,
              borderColor: errors.email ? "var(--danger)" : "var(--border)",
            }}
          />
          {errors.email && (
            <small style={{ color: "var(--danger)" }}>{errors.email}</small>
          )}

          {/* Profession */}
          <select
            name="profession"
            value={formData.profession}
            onChange={(e) =>
              setFormData({ ...formData, profession: e.target.value })
            }
            style={{
              ...inputBase,
              borderColor: errors.profession ? "var(--danger)" : "var(--border)",
            }}
          >
            <option value="">Select Profession</option>
            {professions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          {errors.profession && (
            <small style={{ color: "var(--danger)" }}>{errors.profession}</small>
          )}

          {/* Rate */}
          <input
            placeholder="Hourly Rate (₹)"
            name="rate"
            type="number"
            value={formData.rate}
            onChange={(e) =>
              setFormData({ ...formData, rate: e.target.value })
            }
            style={{
              ...inputBase,
              borderColor: errors.rate ? "var(--danger)" : "var(--border)",
            }}
          />
          {errors.rate && (
            <small style={{ color: "var(--danger)" }}>{errors.rate}</small>
          )}

          {/* Experience */}
          <input
            placeholder="Years of Experience"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
            style={{
              ...inputBase,
              borderColor: errors.experience ? "var(--danger)" : "var(--border)",
            }}
          />
          {errors.experience && (
            <small style={{ color: "var(--danger)" }}>{errors.experience}</small>
          )}

          {/* Description */}
          <textarea
            placeholder="Your Service Description (Min 20 chars)"
            name="desc"
            rows="4"
            value={formData.desc}
            onChange={(e) =>
              setFormData({ ...formData, desc: e.target.value })
            }
            style={{
              ...inputBase,
              borderColor: errors.desc ? "var(--danger)" : "var(--border)",
              resize: "none",
            }}
          />
          {errors.desc && (
            <small style={{ color: "var(--danger)" }}>{errors.desc}</small>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="signin-submit-btn"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "var(--pill-bg)" : "var(--primary)",
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinProfessional;
