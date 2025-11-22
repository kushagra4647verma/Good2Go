import { useState } from "react";
import API from "../../utils/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const AVAILABLE_TAGS = [
  "Café",
  "Historical Spot",
  "Adventure",
  "Nightlife",
  "Hidden Gem",
  "Food",
  "Nature",
  "Restaurant",
  "Park",
  "Museum",
  "Beach",
  "Shopping",
  "Art",
  "Music",
  "Sports",
];

export function AddPlace() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    image: "",
    description: "",
    tags: [],
    coordinates: null, // { lat, lng }
    googleMapsUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleTagToggle(tag) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  function extractCoordinatesFromUrl(url) {
    // Extract coordinates from Google Maps URLs
    // Format: https://www.google.com/maps?q=lat,lng or /@lat,lng
    try {
      const qMatch = url.match(/q=([-\d.]+),([-\d.]+)/);
      const atMatch = url.match(/@([-\d.]+),([-\d.]+)/);

      if (qMatch) {
        return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
      }
      if (atMatch) {
        return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  function handleMapsUrlChange(e) {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, googleMapsUrl: url }));

    const coords = extractCoordinatesFromUrl(url);
    if (coords) {
      setFormData((prev) => ({ ...prev, coordinates: coords }));
      setError("");
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Good2go");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dpxhxppb3/image/upload`,
        { method: "POST", body: data }
      );
      const result = await res.json();
      setFormData({ ...formData, image: result.secure_url });
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (formData.tags.length === 0) {
      setError("Please select at least one tag");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/places", formData, {
        headers: { token: `${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        alert("Place added successfully!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add place");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          padding: "1rem",
          backgroundColor: "#F3F7F0",
        }}
      >
        <h1 style={{ marginBottom: "1rem", fontSize: "3vh", color: "black" }}>
          Add New Place
        </h1>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "1rem",
              padding: "10px",
              background: "#ffe6e6",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Place Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="location"
            placeholder="Location (e.g., Downtown, City Name)"
            value={formData.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Cafe, Park, Restaurant)"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Google Maps Location (Optional) */}
          <div style={{ marginTop: "1rem" }}>
            <label
              style={{
                fontWeight: "bold",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              <FaMapMarkerAlt style={{ marginRight: "5px" }} />
              Google Maps Location (Optional)
            </label>
            <input
              type="text"
              placeholder="Paste Google Maps URL here"
              value={formData.googleMapsUrl}
              onChange={handleMapsUrlChange}
              style={inputStyle}
            />
            {formData.coordinates && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "green",
                  marginTop: "5px",
                }}
              >
                ✓ Location detected: {formData.coordinates.lat.toFixed(4)},{" "}
                {formData.coordinates.lng.toFixed(4)}
              </p>
            )}
            <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "5px" }}>
              To add location: Open Google Maps → Right-click on location → Copy
              link
            </p>
          </div>

          {/* Tags Selection */}
          <div style={{ marginTop: "1rem" }}>
            <label
              style={{
                fontWeight: "bold",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Tags (Select at least one) *
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    border: formData.tags.includes(tag)
                      ? "2px solid #D00000"
                      : "1px solid #ccc",
                    background: formData.tags.includes(tag)
                      ? "#D00000"
                      : "#fff",
                    color: formData.tags.includes(tag) ? "#fff" : "#333",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: formData.tags.includes(tag) ? "bold" : "normal",
                    transition: "all 0.2s",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "green",
                  marginTop: "10px",
                }}
              >
                Selected: {formData.tags.join(", ")}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={inputStyle}
          />
          {uploading && <p>Uploading image...</p>}
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px",
                backgroundColor: "white",
              }}
            />
          )}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading || uploading}
            style={{
              background: loading || uploading ? "#ccc" : "#D00000",
              color: "#fff",
              padding: "0.8rem",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: loading || uploading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Adding..." : "Add Place"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

const inputStyle = {
  padding: "0.8rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "1rem",
  width: "100%",
  backgroundColor: "white",
};
