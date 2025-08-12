import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api.js";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { Errorpage } from "./ErrorPage.jsx";
import { Loader } from "./Loader.jsx";
import { Navbar } from "@/components/Navbar.jsx";
import { Footer } from "@/components/Footer.jsx";

function RatingStars({ rating }) {
  return (
    <span
      style={{
        color: "#FFBA08",
        display: "inline-flex",
        gap: "2px",
        verticalAlign: "middle",
      }}
    >
      {Array(5)
        .fill(0)
        .map((_, i) =>
          i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
        )}
    </span>
  );
}

export function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const [placeRes, reviewsRes, savedRes] = await Promise.all([
          API.get(`/places/${id}`),
          API.get(`/reviews/${id}`),
          API.get("/users/saved", { headers: { token } }),
        ]);
        setPlace(placeRes.data.data);
        setReviews(reviewsRes.data.data);

        if (savedRes.data.data.some((p) => p._id === id)) {
          setIsBookmarked(true);
        }
      } catch (err) {
        console.error("Error fetching place details or reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function toggleBookmark() {
    try {
      const token = localStorage.getItem("token");
      if (isBookmarked) {
        await API.delete(`/users/save/${id}`, { headers: { token } });
        setIsBookmarked(false);
      } else {
        await API.post(`/users/save/${id}`, {}, { headers: { token } });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  }

  if (loading) return <Loader />;
  if (!place) return <Errorpage />;

  return (
    <>
      <Navbar />
      <div
        style={{ background: "#F3F7F0", minHeight: "100vh", padding: "20px" }}
      >
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
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={place.image || "/placeholder.jpg"}
              alt={place.name}
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
              }}
            />
            <div
              onClick={toggleBookmark}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                cursor: "pointer",
                fontSize: "1.8rem",
                color: isBookmarked ? "red" : "white",
                textShadow: "0 0 5px rgba(0,0,0,0.5)",
              }}
            >
              {isBookmarked ? <FaHeart /> : <FaRegHeart />}
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            <h1 style={{ margin: "0 0 5px", color: "#1C3144" }}>
              {place.name}
            </h1>
            <p style={{ color: "#3F88C5", margin: "5px 0" }}>
              {place.location}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "5px 0",
              }}
            >
              <RatingStars rating={place.averageRating} />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#FFBA08",
                }}
              >
                {place.averageRating.toFixed(1)}
              </span>
              <span style={{ fontSize: "14px", color: "#555" }}>
                ({reviews.length} reviews)
              </span>
            </div>
            <p style={{ margin: "15px 0", color: "#555" }}>
              {place.description}
            </p>

            <div style={{ marginTop: "30px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ margin: 0, color: "#1C3144" }}>
                  Reviews ({reviews.length})
                </h2>
                <button
                  style={{
                    background: "#D00000",
                    color: "#fff",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate(`/reviews/${id}`)}
                >
                  Write Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <p style={{ marginTop: "10px" }}>No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    style={{
                      background: "#F3F7F0",
                      padding: "15px",
                      borderRadius: "8px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          color: "#1C3144",
                        }}
                      >
                        {review.userId.username}
                      </p>
                      <RatingStars rating={review.rating} />
                    </div>
                    <p style={{ margin: "5px 0", color: "#333" }}>
                      {review.comment}
                    </p>
                    <small style={{ color: "#666" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
