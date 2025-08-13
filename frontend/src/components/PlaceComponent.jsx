import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function PlaceComponent({
  id,
  image = "",
  title = "Untitled",
  category = "Unknown",
  location = "Not specified",
  description = "",
  rating = 0,
  reviews = 0,
}) {
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : "N/A";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        maxWidth: "350px",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          backgroundColor: "#ffffffff",
        }}
      />

      <div
        style={{ backgroundColor: "#F3F7F0", padding: "10px", color: "black" }}
      >
        <h3 style={{ margin: 0, fontWeight: "bold" }}>{title}</h3>
        <p style={{ margin: "5px 0" }}>{category}</p>
        <p style={{ margin: "5px 0" }}>{location}</p>
        <p style={{ margin: "5px 0" }}>{description}</p>
        <p style={{ margin: "5px 0" }}>
          ⭐ {displayRating} ({reviews} reviews)
        </p>
        <ButtonRow id={id} />
      </div>
    </div>
  );
}

function ButtonRow({ id }) {
  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    gap: "10px",
  };

  return (
    <div style={rowStyle}>
      <HoverButton
        text="View Details"
        bg="#D00000"
        color="#F3F7F0"
        border="transparent"
        page={`places/${id}`}
      />
      <HoverButton
        text="Write a Review"
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
    borderRadius: "30px",
    backgroundColor: bg === "#ffffff" && hovered ? "#FFBA08" : bg,
    color: color,
    padding: "10px 20px",
    fontWeight: "bold",
    fontSize: "14px",
    border: `2px solid ${border}`,
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    flex: "1",
    minWidth: "130px",
    textAlign: "center",
  };

  return (
    <button
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        navigate("/" + page);
      }}
    >
      {text}
    </button>
  );
}
