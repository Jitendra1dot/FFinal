// src/components/StarRating.jsx
import React from "react";

const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div style={{ display: "flex", gap: "2px", fontSize: "20px" }}>
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} style={{ color: "var(--star)" }} title={`${rating} out of 5`}>
          ★
        </span>
      ))}

      {/* Half Star */}
      {halfStar && (
        <span key="half" style={{ color: "var(--star)", position: "relative" }} title={`${rating} out of 5`}>
          <span
            style={{
              width: "50%",
              overflow: "hidden",
              display: "inline-block",
              position: "absolute",
              left: "0",
              color: "var(--star)",
            }}
          >
            ★
          </span>
          <span style={{ color: "var(--star-muted)" }}>★</span>
        </span>
      )}

      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} style={{ color: "var(--star-muted)" }} title={`${rating} out of 5`}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
