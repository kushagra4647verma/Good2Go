import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { FaStar } from "react-icons/fa";
import { Loader } from "./Loader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const res = await API.get(`/places/${id}`);
        setPlace(res.data.data);
      } catch (err) {
        console.error("Error fetching place:", err);
      }
    }
    fetchPlace();
  }, [id]);

  async function handleSubmit() {
    if (!rating) return setError("Please select a rating");
    if (comment.trim().length < 10)
      return setError("Comment must be at least 10 characters");

    try {
      setLoading(true);
      setError("");
      await API.post(
        `/reviews/${id}`,
        { comment, rating },
        {
          headers: { token: `${localStorage.getItem("token")}` },
        }
      );
      navigate(`/places/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  if (!place) return <Loader />;

  return (
    <div style={{ backgroundColor: "#F3F7F0", color: "black" }}>
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        style={{
          border: "none",
          background: "transparent",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "15px",
          color: "#3F88C5",
          fontWeight: "bold",
        }}
      >
        ← Back
      </button>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          padding: "2rem",
          maxWidth: "700px",
          margin: "auto",
          borderRadius: "1vw",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <img
            src={place.image || "/placeholder.jpg"}
            alt={place.name}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <div>
            <h3 style={{ margin: 0 }}>{place.name}</h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
              {place.location}
            </p>
            <span
              style={{
                fontSize: "0.8rem",
                background: "#FFBE0B",
                padding: "0.2rem 0.5rem",
                borderRadius: "5px",
                color: "#000",
              }}
            >
              {place.category}
            </span>
          </div>
        </div>

        <h2 style={{ fontSize: "1.5rem" }}>Share Your Experience</h2>
        <p
          style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1.5rem" }}
        >
          Help others discover this place by sharing your honest review
        </p>

        <p style={{ fontWeight: "500" }}>How would you rate this place?</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <FaStar
                key={index}
                size={28}
                style={{ cursor: "pointer" }}
                color={currentRating <= (hover || rating) ? "#FFD700" : "#ccc"}
                onClick={() => setRating(currentRating)}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
          {rating > 0 && (
            <p style={{ fontSize: "3vh", color: "#666", marginLeft: "1vw" }}>
              {rating}/5
            </p>
          )}
        </div>

        <label style={{ fontWeight: "500" }}>
          Tell us about your experience
        </label>
        <textarea
          placeholder="Share what you loved, what made it special, and any tips..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            marginTop: "0.5rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            padding: "0.8rem",
            fontFamily: "inherit",
            fontSize: "1rem",
            resize: "none",
            outlineColor: "#3F88C5",
          }}
        />

        <div
          style={{
            backgroundColor: "#F9FAFB",
            padding: "1rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            color: "#555",
            marginBottom: "1.5rem",
          }}
        >
          <strong>Review Guidelines</strong>
          <ul
            style={{
              marginTop: "0.5rem",
              paddingLeft: "1.2rem",
              paddingTop: "0.5rem",
              paddingBottom: "2rem",
            }}
          >
            <li>Be honest and helpful to other visitors</li>
            <li>Focus on your personal experience</li>
            <li>Avoid offensive language or personal attacks</li>
            <li>Include specific details about what made your visit special</li>
          </ul>
        </div>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              flex: 1,
              border: "1px solid #ccc",
              background: "transparent",
              padding: "0.8rem",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: "#D00000",
              color: "#fff",
              border: "none",
              padding: "0.8rem",
              borderRadius: "8px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader /> : "Submit Review"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
