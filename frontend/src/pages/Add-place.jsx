import { useState } from "react";
import API from "../../utils/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function AddPlace() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    image: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          padding: "1rem",
          backgroundColor: "#F3F7F0",
        }}
      >
        <h1 style={{ marginBottom: "1rem", fontSize: "3vh" }}>Add New Place</h1>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
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
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Cafe, Park)"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />

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
              background: "#D00000",
              color: "#fff",
              padding: "0.8rem",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
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
};
