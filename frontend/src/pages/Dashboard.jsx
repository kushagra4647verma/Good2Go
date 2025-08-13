import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader } from "./Loader";
import {
  FaPlus,
  FaHeart,
  FaStar,
  FaCalendar,
  FaMapMarkerAlt,
  FaEllipsisV,
  FaTrash,
  FaPen,
} from "react-icons/fa";

export function Dashboard() {
  const [user, setUser] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [myPlaces, setMyPlaces] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("saved");
  const [editingPlace, setEditingPlace] = useState(null);

  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem("token");

      const profileRes = await API.get("/users/me", { headers: { token } });
      setUser(profileRes.data.data);

      const savedRes = await API.get("/users/saved", { headers: { token } });
      setSavedPlaces(savedRes.data.data);

      const myPlacesRes = await API.get("/places/my-places", {
        headers: { token },
      });
      setMyPlaces(myPlacesRes.data.data);

      const reviewsRes = await API.get("/reviews/my-reviews", {
        headers: { token },
      });
      setMyReviews(reviewsRes.data.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deletePlace(id) {
    if (!window.confirm("Delete this place?")) return;
    try {
      await API.delete(`/places/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setMyPlaces((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete place", err);
    }
  }

  async function updatePlace(id, updatedData) {
    try {
      const res = await API.put(`/places/${id}`, updatedData, {
        headers: { token: localStorage.getItem("token") },
      });
      setMyPlaces((prev) =>
        prev.map((p) => (p._id === id ? res.data.data : p))
      );
      setEditingPlace(null);
    } catch (err) {
      console.error("Failed to update place", err);
    }
  }

  async function deleteReview(id) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/reviews/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setMyReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f8fdf6",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div
        style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                background: "#ccc",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user?.username || "User"}</h2>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                {user?.email}
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#aaa" }}>
                Member since{" "}
                {new Date(user?.createdAt).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            style={{
              background: "#D00000",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.5rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <StatCard
            icon={<FaPlus />}
            color="#ff4d4d"
            number={myPlaces.length}
            text="Places Added"
          />
          <StatCard
            icon={<FaHeart />}
            color="#ffb347"
            number={savedPlaces.length}
            text="Places Saved"
          />
          <StatCard
            icon={<FaStar />}
            color="#4db6ff"
            number={myReviews.length}
            text="Reviews Written"
          />
          <StatCard
            icon={<FaCalendar />}
            color="#ccc"
            number={new Date(user?.createdAt).getFullYear()}
            text="Member Since"
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
            borderBottom: "2px solid #eee",
          }}
        >
          <button
            style={{ ...tabBtnStyle, color: "black" }}
            onClick={() => setActiveTab("saved")}
          >
            Saved Places ({savedPlaces.length})
          </button>
          <button
            style={{ ...tabBtnStyle, color: "black" }}
            onClick={() => setActiveTab("my")}
          >
            My Places ({myPlaces.length})
          </button>
          <button
            style={{ ...tabBtnStyle, color: "black" }}
            onClick={() => setActiveTab("reviews")}
          >
            My Reviews ({myReviews.length})
          </button>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          {activeTab === "saved" && (
            <div style={gridStyle}>
              {savedPlaces.map((place) => (
                <PlaceCard
                  key={place._id}
                  place={place}
                  type="saved"
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}

          {activeTab === "my" && (
            <div style={gridStyle}>
              {myPlaces.map((place) => (
                <PlaceCard
                  key={place._id}
                  place={place}
                  type="my"
                  onDelete={deletePlace}
                  onEdit={(place) => setEditingPlace(place)}
                />
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={gridStyle}>
              {myReviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onDelete={deleteReview}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editingPlace && (
        <EditPlaceModal
          place={editingPlace}
          onUpdate={updatePlace}
          onClose={() => setEditingPlace(null)}
        />
      )}

      <Footer />
    </div>
  );
}

function StatCard({ icon, color, number, text }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        padding: "1rem",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color }}>
        {icon}
      </div>
      <h3 style={{ margin: 0, color: "black" }}>{number}</h3>
      <p style={{ margin: 0, color: "#666" }}>{text}</p>
    </div>
  );
}

function PlaceCard({ place, type, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={place.image || "/placeholder.jpg"}
        alt={place.name}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />

      <div style={{ padding: "0.8rem", position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0, color: "black" }}>{place.name}</h4>
          <div
            style={{ cursor: "pointer", padding: "4px" }}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FaEllipsisV />
          </div>
        </div>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "10px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            {type === "my" && (
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => {
                  setShowMenu(false);
                  onEdit(place);
                }}
              >
                <FaPen /> Edit Place
              </div>
            )}
            <div
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => {
                setShowMenu(false);
                onDelete(place._id);
              }}
            >
              <FaTrash /> {type === "my" ? "Delete Place" : "Remove Bookmark"}
            </div>
          </div>
        )}

        <p
          style={{
            margin: "4px 0",
            fontSize: "0.85rem",
            color: "#666",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <FaMapMarkerAlt /> {place.location}
        </p>
        <span
          style={{
            fontSize: "0.75rem",
            background: "#FFBE0B",
            padding: "0.2rem 0.5rem",
            borderRadius: "5px",
            color: "#000",
            display: "inline-block",
            marginTop: "4px",
          }}
        >
          {place.category}
        </span>
        <div
          style={{ marginTop: "0.3rem", fontSize: "0.85rem", color: "black" }}
        >
          ⭐ {place.averageRating?.toFixed(1) || 0}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const place = review.placeId;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={place?.image || "/placeholder.jpg"}
        alt={place?.name || "Deleted Place"}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />

      <div style={{ padding: "0.8rem", position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0, color: "black" }}>
            {place?.name || "Deleted Place"}
          </h4>
          <div
            style={{ cursor: "pointer", padding: "4px" }}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FaEllipsisV />
          </div>
        </div>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "10px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => {
                setShowMenu(false);
                onDelete(review._id);
              }}
            >
              <FaTrash /> Delete Review
            </div>
          </div>
        )}

        <p
          style={{
            margin: "4px 0",
            fontSize: "0.85rem",
            color: "#666",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <FaMapMarkerAlt /> {place?.location || "Unknown Location"}
        </p>
        <div style={{ margin: "4px 0", fontSize: "0.85rem", color: "black" }}>
          ⭐ {review.rating.toFixed(1)}
        </div>
        <p style={{ margin: "6px 0", fontSize: "0.9rem", color: "#333" }}>
          {review.comment}
        </p>
      </div>
    </div>
  );
}

function EditPlaceModal({ place, onUpdate, onClose }) {
  const [formData, setFormData] = useState({
    name: place.name,
    category: place.category,
    location: place.location,
    description: place.description,
    image: place.image || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(place._id, formData);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          width: "400px",
          maxWidth: "90%",
        }}
      >
        <h3 style={{ margin: "0 0 1rem" }}>Edit Place</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            style={inputStyle}
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            style={{ ...inputStyle, height: "100px" }}
            required
          />
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            style={inputStyle}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#ccc",
                color: "#333",
                padding: "10px 15px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "#3F88C5",
                color: "#fff",
                padding: "10px 15px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "1rem",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "1.5rem",
};

const tabBtnStyle = {
  background: "transparent",
  border: "none",
  padding: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
};
