import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div
      style={{
        height: "8vh",
        backgroundColor: "#1C3144",
        marginBottom: "2vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="Good2Go Logo"
          style={{
            width: "4vw",
            height: "4vh",
            objectFit: "contain",
            marginRight: "1vw",
          }}
        />
        <h1 style={{ fontSize: "2.4vh", fontWeight: 600 }}>Good2Go</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
        <div style={{ display: "flex", gap: "1vw", alignItems: "center" }}>
          <Link
            to="/places"
            style={{
              textDecoration: "none",
              backgroundColor: "#2B445A",
              color: "white",
              borderRadius: "1vw",
              padding: "1vh 2vw",
              fontSize: "1.6vh",
              fontWeight: 600,
            }}
          >
            Explore
          </Link>

          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              backgroundColor: "#2B445A",
              color: "white",
              borderRadius: "1vw",
              padding: "1vh 2vw",
              fontSize: "1.6vh",
              fontWeight: 600,
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/add-place"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5vw",
              backgroundColor: "#D00000",
              color: "white",
              borderRadius: "1vw",
              padding: "1vh 2.2vw",
              fontSize: "1.6vh",
              fontWeight: 600,
            }}
          >
            <FaPlus size="1.6vh" />
            Add Place
          </Link>
        </div>
      </div>
    </div>
  );
}
