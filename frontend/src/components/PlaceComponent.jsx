import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

export function PlaceComponent({
  id,
  image = "",
  title = "Untitled",
  category = "Unknown",
  location = "Not specified",
  description = "",
  rating = 0,
  reviews = 0,
  tags = [],
  coordinates = null,
}) {
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : "N/A";
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        maxWidth: "350px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onClick={() => navigate(`/places/${id}`)}
    >
      <div style={{ position: "relative" }}>
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            backgroundColor: "#f0f0f0",
          }}
        />
        {coordinates && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#3F88C5",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaMapMarkerAlt /> Map Available
          </div>
        )}
      </div>

      <div
        style={{ backgroundColor: "#F3F7F0", padding: "15px", color: "black" }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "5px 0",
            fontSize: "0.9rem",
            color: "#666",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <FaMapMarkerAlt size={12} color="#3F88C5" />
          {location}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: "0.75rem",
                  background: "#FFBE0B",
                  padding: "3px 8px",
                  borderRadius: "12px",
                  color: "#000",
                  fontWeight: "500",
                }}
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#e0e0e0",
                  padding: "3px 8px",
                  borderRadius: "12px",
                  color: "#666",
                  fontWeight: "500",
                }}
              >
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <p
          style={{
            margin: "8px 0",
            fontSize: "0.85rem",
            color: "#555",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>

        <p
          style={{
            margin: "8px 0 12px 0",
            fontSize: "0.95rem",
            fontWeight: "600",
          }}
        >
          ⭐ {displayRating}{" "}
          <span style={{ color: "#666", fontWeight: "normal" }}>
            ({reviews} reviews)
          </span>
        </p>

        <ButtonRow id={id} onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}

function ButtonRow({ id, onClick }) {
  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    gap: "10px",
  };

  return (
    <div style={rowStyle} onClick={onClick}>
      <HoverButton
        text="View Details"
        bg="#D00000"
        color="#F3F7F0"
        border="transparent"
        page={`places/${id}`}
      />
      <HoverButton
        text="Write Review"
        bg="#ffffff"
        color="#3F88C5"
        border="#3F88C5"
        page={`reviews/${id}`}
      />
    </div>
  );
}

function HoverButton({ text, bg, color, border, page }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const style = {
    borderRadius: "20px",
    backgroundColor: bg === "#ffffff" && hovered ? "#FFBA08" : bg,
    color: color,
    padding: "10px 15px",
    fontWeight: "bold",
    fontSize: "0.85rem",
    border: `2px solid ${border}`,
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    flex: "1",
    minWidth: "120px",
    textAlign: "center",
  };

  return (
    <button
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        navigate("/" + page);
      }}
    >
      {text}
    </button>
  );
}
