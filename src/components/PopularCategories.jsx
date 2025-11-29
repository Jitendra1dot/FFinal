import React, { useState } from "react";
import "../App.css";
 // Create this CSS or add styles in App.css

const categories = [
  { id: 1, name: "Web Developer", icon: "💻" },
  { id: 2, name: "Plumber", icon: "🛠️" },
  { id: 3, name: "Electrician", icon: "⚡" },
  { id: 4, name: "Appliance Technician", icon: "⚙️" },
  { id: 5, name: "Deep Cleaner", icon: "🧼" },
  { id: 6, name: "Car Mechanic", icon: "🚗" },
  { id: 7, name: "Graphic Designer", icon: "🎨" }
];

const PopularCategories = ({ onSelectCategory }) => {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      
      {/* Toggle Button */}
      <button
        onClick={() => setShowCategories(!showCategories)}
        className="toggle-categories-btn"
      >
        {showCategories ? "Hide Categories" : "Most Popular Categories"}
      </button>

      {/* Category Buttons */}
      {showCategories && (
        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-btn"
              onClick={() => onSelectCategory(cat.name)}
            >
              <span style={{ fontSize: "20px" }}>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default PopularCategories;
