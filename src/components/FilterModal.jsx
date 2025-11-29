import React, { useState, useEffect } from "react";

const FilterModal = ({
  open,
  onClose,
  onApply,
  initialFilters,
  cities,
  professions,
}) => {
  const [local, setLocal] = useState({ ...initialFilters });

  useEffect(() => {
    if (open) setLocal({ ...initialFilters });
  }, [open, initialFilters]);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="filter-modal">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>Refine search</h3>
            <div style={{ color: "#6b7280", fontSize: 13 }}>Fine tune results by applying these filters</div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close filters">✕</button>
        </header>

        <div className="filter-grid">
          <div className="form-row">
            <label className="label">City</label>
            <input
              className="input-box"
              placeholder="City / Area"
              value={local.cityFilter}
              onChange={(e) => setLocal({ ...local, cityFilter: e.target.value })}
            />
          </div>

          <div className="form-row">
            <label className="label">Profession</label>
            <select
              className="input-box"
              value={local.professionFilter}
              onChange={(e) => setLocal({ ...local, professionFilter: e.target.value })}
            >
              <option value="">All Services</option>
              {professions?.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label className="label">Price range</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input-box"
                type="number"
                placeholder="Min ₹/hr"
                value={local.minPrice}
                onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
              />
              <input
                className="input-box"
                type="number"
                placeholder="Max ₹/hr"
                value={local.maxPrice}
                onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="label">Minimum rating</label>
            <select
              className="input-box"
              value={local.minRating}
              onChange={(e) => setLocal({ ...local, minRating: e.target.value })}
            >
              <option value="0">Any rating</option>
              <option value="3.5">3.5 ★ & above</option>
              <option value="4.0">4.0 ★ & above</option>
              <option value="4.5">4.5 ★ & above</option>
            </select>
          </div>

          <div className="form-row" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label className="label">Verified</label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={local.verifiedOnly}
                onChange={(e) => setLocal({ ...local, verifiedOnly: e.target.checked })}
              />
              <span style={{ fontSize: 14 }}>Only verified professionals</span>
            </label>
          </div>

          <div className="form-row" style={{ display: "flex", flexDirection: "column" }}>
            <label className="label">Sort</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className={"filter-sort-btn " + (local.sortByRating ? "active" : "")} onClick={() => setLocal({ ...local, sortByRating: !local.sortByRating })}>
                Rating
              </button>
              <button className={"filter-sort-btn " + (local.sortByPriceAsc ? "active" : "")} onClick={() => setLocal({ ...local, sortByPriceAsc: !local.sortByPriceAsc })}>
                Price
              </button>
            </div>
          </div>

        </div>

        <footer style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 16 }}>
          <button className="filter-reset-btn" onClick={() => setLocal({
            cityFilter: "",
            professionFilter: "",
            minRating: "0",
            minPrice: "",
            maxPrice: "",
            verifiedOnly: false,
            sortByRating: false,
            sortByPriceAsc: false,
          })}>Reset</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="filter-apply-btn" onClick={() => { onApply(local); onClose(); }}>Apply</button>
            <button className="filter-cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FilterModal;
