import { useEffect, useState } from "react";
import API from "../../utils/api.js";
import { Navbar } from "@/components/Navbar.jsx";
import { Footer } from "@/components/Footer.jsx";
import { Container } from "@chakra-ui/react";
import { PlaceComponent } from "@/components/PlaceComponent.jsx";
import { Loader } from "./Loader.jsx";

export function Places() {
  return (
    <>
      <Layout />
    </>
  );
}

function Layout() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = async () => {
    try {
      const res = await API.get("/places");
      if (res.data && Array.isArray(res.data.data)) {
        setPlaces(res.data.data);
      } else {
        console.error("Unexpected API response:", res.data);
        setPlaces([]);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <div style={{ backgroundColor: "#ffffff", maxHeight: "100vh" }}>
      <Navbar />

      {loading ? (
        <Loader />
      ) : places.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No places found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            padding: "1.5rem",
          }}
        >
          {places.map((place) => (
            <PlaceComponent
              key={place._id}
              id={place._id}
              image={place.image || "/placeholder.jpg"}
              title={place.name}
              liked={false}
              category={place.category}
              location={place.location}
              description={place.description}
              rating={place.averageRating || 0}
              reviews={place.reviews.length}
            />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
