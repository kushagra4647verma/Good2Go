import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Places } from "./pages/Places";
import { PlaceDetails } from "./pages/PlaceDetails.jsx";
import { ReviewPage } from "./pages/ReviewPage.jsx";
import { Errorpage } from "./pages/ErrorPage";
import { Dashboard } from "./pages/Dashboard.jsx";
import { AddPlace } from "./pages/Add-place.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/reviews/:id" element={<ReviewPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-place" element={<AddPlace />} />
          <Route path="*" element={<Errorpage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function Landing() {
  const baseTextStyle = {
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const headingStyle = {
    ...baseTextStyle,
    fontWeight: "bold",
    fontSize: "7vh",
    paddingTop: "7vh",
  };

  const subheadingStyle = {
    ...baseTextStyle,
    color: "#D00000",
    fontWeight: "900",
    fontSize: "6vh",
    marginTop: "2vh",
    marginBottom: "5vh",
  };

  const paragraphStyle = {
    ...baseTextStyle,
    color: "#546677ff",
    fontSize: "3vh",
    marginTop: "2vh",
    marginLeft: "20vw",
    marginRight: "20vw",
    textAlign: "center",
  };

  const statsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15vw",
    paddingTop: "10vh",
    textAlign: "center",
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background:
          " linear-gradient(180deg, #FFFAF0 0%, #F3F7F0 40%, #E3F2FD 100%)",
      }}
    >
      <div>
        <div style={{ ...headingStyle, color: "#1C3144" }}>
          Discover Hidden Places
        </div>
        <div style={subheadingStyle}>Loved by Locals, Missed by Tourists</div>
        <div style={paragraphStyle}>
          Find and share authentic places that locals love but tourists haven't
          discovered yet. From cozy cafés to secret viewpoints. You've got it!
        </div>

        <ButtonRow />

        <div style={statsContainerStyle}>
          <StatBlock img="/1.png" label="Hidden Places" />
          <StatBlock img="/2.png" label="Real Explorers" />
          <StatBlock img="/3.png" label="Authentic Reviews" />
        </div>
      </div>
    </div>
  );
}
console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
function ButtonRow() {
  const rowStyle = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "15vh",
    marginLeft: "25vw",
    marginRight: "25vw",
  };

  return (
    <div style={rowStyle}>
      <HoverButton
        text="Start Exploring →"
        bg="#D00000"
        color="#F3F7F0"
        border="transparent"
        page="login"
      />
      <HoverButton
        text="Browse Places"
        bg="#ffffff"
        color="#3F88C5"
        border="#3F88C5"
        page="places"
      />
    </div>
  );
}

function HoverButton({ text, bg, color, border, page }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const style = {
    borderRadius: "30px",
    backgroundColor: bg == "#ffffff" && hovered ? "#FFBA08" : bg,
    color: color,
    height: hovered ? "7.5vh" : "7vh",
    width: "20vw",
    fontWeight: "bold",
    fontSize: "2.5vh",
    border: `2px solid ${border}`,
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
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

function StatBlock({ img, label }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        src={img}
        style={{
          width: "60px",
          height: "60px",
          marginBottom: "1vh", // spacing between image and text
        }}
      />
      <div
        style={{
          color: "#1C3144",
          fontWeight: "500",
          fontSize: "2.5vh",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default App;
