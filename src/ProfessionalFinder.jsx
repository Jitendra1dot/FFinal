// src/ProfessionalFinder.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { getAllProfessionals } from "./data.js";
import PopularCategories from "./components/PopularCategories.jsx";
import StarRating from "./components/StarRating.jsx";
import FilterModal from "./components/FilterModal.jsx";
import useDebounce from "./hooks/useDebounce.js";

/**
 * ProfessionalFinder
 * -------------------------------------------------------
 * Main search + filter page for UnifyHub.
 * - Loads professionals (from static data for now)
 * - Provides search, city filter, profession filter
 * - Filters by rating and price range
 * - Allows sorting, saving favorites, AND BLOCKING professionals (NEW)
 * - Shows booking modal (front-end only)
 */

const ProfessionalFinder = () => {
  // ---------- RAW DATA ----------
  const [allProfessionals, setAllProfessionals] = useState([]);

  // ---------- FILTER STATES ----------
  const [searchText, setSearchText] = useState("");
  const [professionFilter, setProfessionFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const [minRating, setMinRating] = useState("0");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // ---------- SORT STATES ----------
  const [sortByRating, setSortByRating] = useState(false);
  const [sortByPriceAsc, setSortByPriceAsc] = useState(false);

  // ---------- FAVORITES & BLOCK LIST STATES (NEW) ----------
  const [favoritesVersion, setFavoritesVersion] = useState(0);
  const [blockListVersion, setBlockListVersion] = useState(0);

  // ---------- MODAL STATES ----------
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // debounce the search text so we don't filter on every keypress
  const debouncedSearch = useDebounce(searchText, 250);

  // ---------- CURRENT USER ----------
  const currentUser = useMemo(() => {
    try {
      const json = localStorage.getItem("currentUser");
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }, []);

  const favoritesKey = currentUser?.email
    ? `favorites_${currentUser.email}`
    : null;

  const blockedKey = currentUser?.email
    ? `blocked_${currentUser.email}`
    : null;

  const favoriteIds = useMemo(() => {
    if (!favoritesKey) return [];
    try {
      return JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    } catch {
      return [];
    }
  }, [favoritesKey, favoritesVersion]);

  const blockedIds = useMemo(() => {
    if (!blockedKey) return [];
    try {
      return JSON.parse(localStorage.getItem(blockedKey) || "[]");
    } catch {
      return [];
    }
  }, [blockedKey, blockListVersion]);

  // ---------- INITIAL DATA LOAD ----------
  useEffect(() => {
    // For now only static/frontend data
    // Backend can be plugged later easily.
    const list = getAllProfessionals();
    // Merge any user-submitted professionals saved to localStorage
    const saved = JSON.parse(localStorage.getItem("newProfessionals") || "[]");
    const merged = [...list, ...saved];
    setAllProfessionals(merged);

    // Listen for immediate add events from JoinProfessional to update UI
    const handler = (e) => {
      const newPro = e.detail;
      setAllProfessionals((prev) => [newPro, ...prev]);
    };
    window.addEventListener("newProfessional", handler);
    return () => window.removeEventListener("newProfessional", handler);
  }, []);

  // ---------- HELPER: toggle favorite ----------
  const toggleFavorite = (e, proId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser || !favoritesKey) {
      alert("Please sign in to use favorites.");
      return;
    }

    let updated = [];
    try {
      const existing = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
      if (existing.includes(proId)) {
        updated = existing.filter((id) => id !== proId);
      } else {
        updated = [...existing, proId];
      }
    } catch {
      updated = [proId];
    }

    localStorage.setItem(favoritesKey, JSON.stringify(updated));
    setFavoritesVersion((prev) => prev + 1);
  };

  // NEW: HELPER: toggle block
  const toggleBlock = (e, proId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser || !blockedKey) {
      alert("Please sign in to use the block feature.");
      return;
    }

    let updated = [];
    try {
      const existing = JSON.parse(localStorage.getItem(blockedKey) || "[]");
      if (existing.includes(proId)) {
        updated = existing.filter((id) => id !== proId);
        alert(`Unblocked professional ID: ${proId}`);
      } else {
        updated = [...existing, proId];
        // OPTIONAL: If blocking, automatically remove from favorites
        const updatedFavorites = favoriteIds.filter((id) => id !== proId);
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
        setFavoritesVersion((prev) => prev + 1);

        alert(`Blocked professional ID: ${proId}`);
      }
    } catch {
      updated = [proId];
    }

    localStorage.setItem(blockedKey, JSON.stringify(updated));
    setBlockListVersion((prev) => prev + 1);
  };

  // ---------- CLEAR FILTERS ----------
  const clearAllFilters = () => {
    setSearchText("");
    setProfessionFilter("");
    setCityFilter("");
    setMinRating("0");
    setMinPrice("");
    setMaxPrice("");
    setVerifiedOnly(false);
    setSortByRating(false);
    setSortByPriceAsc(false);
  };

  // (City suggestions removed - city filter now only accessible via modal)

  // ---------- FILTER + SORT PIPELINE ----------
  const filteredProfessionals = useMemo(() => {
    let list = [...allProfessionals];

    // 0) Block list filter (NEW: filter out blocked professionals first)
    list = list.filter((p) => !blockedIds.includes(p.id));

    // 1) Search by text (name / profession / description)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) => {
        const text =
          `${p.name} ${p.profession} ${p.desc || ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    // 2) Profession filter
    if (professionFilter) {
      list = list.filter((p) => p.profession === professionFilter);
    }

    // 3) City filter
    if (cityFilter.trim()) {
      const c = cityFilter.toLowerCase();
      list = list.filter(
        (p) => p.location && p.location.toLowerCase().includes(c)
      );
    }

    // 4) Rating filter
    const minR = parseFloat(minRating) || 0;
    if (minR > 0) {
      list = list.filter((p) => p.rating >= minR);
    }

    // 5) Price range
    const minP = parseInt(minPrice) || 0;
    const maxP = maxPrice ? parseInt(maxPrice) : Infinity;
    list = list.filter((p) => p.rate >= minP && p.rate <= maxP);

    // 6) Verified only toggle
    if (verifiedOnly) {
      list = list.filter((p) => p.isVerified);
    }

    // 7) Sorting (rating then price if enabled)
    if (sortByRating) {
      list.sort((a, b) => b.rating - a.rating);
    }
    if (sortByPriceAsc) {
      list.sort((a, b) => a.rate - b.rate);
    }

    return list;
  }, [
    allProfessionals,
    debouncedSearch,
    professionFilter,
    cityFilter,
    minRating,
    minPrice,
    maxPrice,
    verifiedOnly,
    sortByRating,
    sortByPriceAsc,
    blockedIds,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (professionFilter) count++;
    if (cityFilter) count++;
    if ((parseInt(minPrice) || 0) > 0) count++;
    if (maxPrice) count++;
    if ((parseFloat(minRating) || 0) > 0) count++;
    if (verifiedOnly) count++;
    if (sortByRating) count++;
    if (sortByPriceAsc) count++;
    return count;
  }, [professionFilter, cityFilter, minPrice, maxPrice, minRating, verifiedOnly, sortByRating, sortByPriceAsc]);

  // ---------- BOOKING MODAL OPEN ----------
  const openBooking = (e, pro) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPro(pro);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setSelectedPro(null);
  };

  const confirmBooking = () => {
    setBookingOpen(false);
    if (!selectedPro) return;
    alert(
      `Booking request sent to ${selectedPro.name}! (Front-end demo only – no real backend yet)`
    );
    setSelectedPro(null);
  };

  // ---------- RENDER ----------
  return (
    <main className="main-content">
      {/* TITLE */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: "#222",
          marginBottom: "18px",
          textAlign: "center",
        }}
      >
        Find & Hire Trusted Professionals
      </h1>
      <p
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#555",
        }}
      >
        Search by skill, city, rating, and price. Filter verified experts and
        save your favorites.
      </p>

      {/* POPULAR CATEGORIES (chips row) */}
      <PopularCategories
        onSelectCategory={(catName) => {
          // When a category is selected, apply it as a profession filter
          // and also update the search box for UX clarity.
          setProfessionFilter(catName);
          setSearchText(catName);
        }}
      />

      {/* FILTER CONTROLS */}
      <section className="controls-section" style={{ alignItems: 'center', gap: 12 }}>
        {/* Search bar */}
        <div style={{ position: "relative", flexBasis: "250px", flexGrow: 1 }}>
          <input
            className="search-input"
            type="text"
            placeholder="Search name, skill or service..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Hidden: City, profession, price, rating, verified - all accessible through Filter modal */}

        {/* Filter modal open button (professional) */}
        <button
          type="button"
          className="filter-open-btn"
          onClick={() => setFilterOpen(true)}
          style={{ background: "#fff", border: "1px solid #e6e9ee", padding: "10px 14px", borderRadius: 8, fontWeight: 700 }}
        >
          Filter{activeFiltersCount > 0 && (
            <span style={{ marginLeft: 8, background: '#007bff', color: '#fff', padding: '0 8px', borderRadius: 16, fontSize: 12 }}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort and Clear hidden - use Filter modal to adjust sorting and clear filters */}
      </section>

      {/* COUNT SUMMARY */}
      <h2
        style={{
          fontSize: "22px",
          margin: "10px 0 20px",
          color: "#333",
        }}
      >
        Showing {filteredProfessionals.length} of {allProfessionals.length - blockedIds.length}{" "}
        professionals
      </h2>

      {/* RESULTS GRID */}
      <section className="results-grid">
        {filteredProfessionals.length === 0 && (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#777",
              fontSize: "18px",
              marginTop: "40px",
            }}
          >
            No matches found. Try changing your filters.
          </p>
        )}

        {filteredProfessionals.map((p) => {
          const isFav = favoriteIds.includes(p.id);
          const isBlocked = blockedIds.includes(p.id);

          // If the professional is blocked, do not render the card.
          // Note: The filteredProfessionals array already excludes blocked professionals, 
          // but this check is a safeguard.
          if (isBlocked) return null;

          return (
            <article
              key={p.id}
              className="professional-card"
              style={{ position: "relative" }}
            >
              {/* FAVORITE TOGGLE (Moved outside the Link for correct positioning) */}
              <button
                onClick={(e) => toggleFavorite(e, p.id)}
                title={isFav ? "Remove from favorites" : "Add to favorites"}
                className="favorite-btn" // Applies the absolute positioning from app.css
              >
                <span style={{ fontSize: "20px" }}>
                  {isFav ? "❤️" : "🤍"}
                </span>
              </button>

              {/* Main clickable content */}
              <Link
                to={`/professional/${p.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Image */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="card-image"
                />

                {/* Text Content */}
                <div className="card-content">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "28px" }}>👤</span>
                    <div>
                      <h3
                        // REMOVED INLINE STYLE: Let app.css handle this
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        {p.name}
                      </h3>
                      <p
                        // REMOVED INLINE STYLE: Let app.css handle this
                        style={{
                          margin: 0,
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {p.profession}
                        {p.experience !== undefined && (
                          <span style={{ marginLeft: 8, fontWeight: 500, color: '#6b7280', fontSize: '13px' }}>{p.experience} yrs</span>
                        )}
                      </p>
                    </div>
                    {p.isVerified && (
                      <span
                        className="verified" // Uses the green style from app.css
                        title="Verified professional"
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  {p.skills && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      {p.skills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: "12px",
                            background: "#f1f3f5",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            color: "#555",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    {p.desc}
                  </p>

                  {/* Rating + Price row */}
                  <div className="card-details">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <StarRating rating={p.rating} />
                      <span
                        style={{
                          fontSize: "14px",
                          marginLeft: "4px",
                          color: "#333",
                        }}
                      >
                        ({p.rating.toFixed(1)})
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "14px" }}>
                        💰 ₹{p.rate}/hr
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS: Using correct classes from app.css */}
                  <div className="card-btn-group">
                    <button
                      className="hire-btn" // Use existing green 'hire-btn' style
                      onClick={(e) => openBooking(e, p)}
                    >
                      Quick Book
                    </button>

                    <button
                      className="block-btn" // Red button from app.css
                      onClick={(e) => toggleBlock(e, p.id)}
                    >
                      Block Professional
                    </button>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </section>

      {/* BOOKING MODAL (No Change) */}
      {bookingOpen && selectedPro && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginTop: 0 }}>Confirm Booking</h2>
            <p style={{ marginBottom: "15px" }}>
              You are about to send a booking request to:
            </p>

            <div className="summary-box">
              <p>
                <strong>{selectedPro.name}</strong> – {selectedPro.profession}
              </p>
              <p>📍 {selectedPro.location}</p>
              <p>⭐ {selectedPro.rating} rating</p>
              <p>💰 ₹{selectedPro.rate} per hour</p>
            </div>

            <p style={{ fontSize: "14px", color: "#555" }}>
              This is a <strong>frontend demo</strong>. In the full project,
              this action would contact the backend and notify the professional.
            </p>

            <div className="modal-actions">
              <button
                onClick={closeBooking}
                style={{ backgroundColor: "#e9ecef" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                style={{ backgroundColor: "#28a745", color: "#fff" }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER MODAL */}
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => {
          // Map modal fields to main filters
          setCityFilter(f.cityFilter || "");
          setProfessionFilter(f.professionFilter || "");
          setMinRating(f.minRating || "0");
          setMinPrice(f.minPrice || "");
          setMaxPrice(f.maxPrice || "");
          setVerifiedOnly(!!f.verifiedOnly);
          setSortByRating(!!f.sortByRating);
          setSortByPriceAsc(!!f.sortByPriceAsc);
        }}
        initialFilters={{
          cityFilter,
          professionFilter,
          minRating,
          minPrice,
          maxPrice,
          verifiedOnly,
          sortByRating,
          sortByPriceAsc,
        }}
        professions={[...new Set(allProfessionals.map((p)=>p.profession))]}
      />
    </main>
  );
};

export default ProfessionalFinder;