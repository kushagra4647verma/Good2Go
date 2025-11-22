import { useEffect, useState } from "react";
import API from "../../utils/api.js";
import { Navbar } from "@/components/Navbar.jsx";
import { Footer } from "@/components/Footer.jsx";
import { PlaceComponent } from "@/components/PlaceComponent.jsx";
import { Loader } from "./Loader.jsx";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";

const AVAILABLE_TAGS = [
  "All",
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

export function Places() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const fetchPlaces = async () => {
    try {
      const res = await API.get("/places");
      if (res.data && Array.isArray(res.data.data)) {
        setPlaces(res.data.data);
        setFilteredPlaces(res.data.data);
      } else {
        console.error("Unexpected API response:", res.data);
        setPlaces([]);
        setFilteredPlaces([]);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setPlaces([]);
      setFilteredPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    filterPlaces();
  }, [searchQuery, selectedTag, places]);

  function filterPlaces() {
    let filtered = [...places];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.location.toLowerCase().includes(query) ||
          place.category.toLowerCase().includes(query) ||
          place.description?.toLowerCase().includes(query) ||
          place.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tag
    if (selectedTag !== "All") {
      filtered = filtered.filter((place) => place.tags?.includes(selectedTag));
    }

    setFilteredPlaces(filtered);
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSelectedTag("All");
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #FFFAF0 0%, #F3F7F0 40%, #E3F2FD 100%)",
        minHeight: "100vh",
        margin: 0,
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* Search and Filter Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 2rem auto",
          padding: "1rem",
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <FaSearch
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, location, tags, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 45px",
                borderRadius: "25px",
                border: "2px solid #ddd",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3F88C5")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
            {searchQuery && (
              <FaTimes
                onClick={handleClearSearch}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: "12px 20px",
              borderRadius: "25px",
              border: "2px solid #3F88C5",
              background: showFilters ? "#3F88C5" : "#fff",
              color: showFilters ? "#fff" : "#3F88C5",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s",
            }}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {/* Filter Tags */}
        {showFilters && (
          <div
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ margin: "0 0 1rem 0", color: "#1C3144" }}>
              Filter by Category
            </h4>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    border:
                      selectedTag === tag
                        ? "2px solid #D00000"
                        : "1px solid #ccc",
                    background: selectedTag === tag ? "#D00000" : "#fff",
                    color: selectedTag === tag ? "#fff" : "#333",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: selectedTag === tag ? "bold" : "normal",
                    transition: "all 0.2s",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Info */}
        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.95rem",
            color: "#666",
          }}
        >
          Showing {filteredPlaces.length} of {places.length} places
          {selectedTag !== "All" && ` in "${selectedTag}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      {/* Places Grid */}
      {loading ? (
        <Loader />
      ) : filteredPlaces.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#666",
          }}
        >
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            No places found
          </p>
          {(searchQuery || selectedTag !== "All") && (
            <button
              onClick={handleClearSearch}
              style={{
                padding: "10px 20px",
                background: "#3F88C5",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            padding: "0 1rem",
            margin: "0 auto",
            maxWidth: "1200px",
            width: "100%",
            minHeight: "calc(100vh - 30vh)",
          }}
        >
          {filteredPlaces.map((place) => (
            <PlaceComponent
              key={place._id}
              id={place._id}
              image={place.image || "/placeholder.jpg"}
              title={place.name}
              category={place.category}
              location={place.location}
              description={place.description}
              rating={place.averageRating || 0}
              reviews={place.reviews.length}
              tags={place.tags || []}
            />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
