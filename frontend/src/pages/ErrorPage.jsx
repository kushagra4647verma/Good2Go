import { useNavigate } from "react-router-dom";

export function Errorpage() {
  const baseTextStyle = {
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };
  const navigate = useNavigate();
  return (
    <div
      style={{
        ...baseTextStyle,
        backgroundColor: "#F3F7F0",
        height: "100vh",
        width: "100vw",
        fontWeight: "bold",
        fontSize: "7vh",
      }}
    >
      <div style={{ color: "black" }}>
        Sorry! The page isn't available right now!
      </div>
      <br></br>
      <div>
        <button
          onClick={() => {
            navigate("/");
          }}
          style={{
            backgroundColor: "#D00000",
            color: "#F3F7F0",
            border: "transparent",
            borderRadius: "30px",
            height: "7vh",
            width: "20vw",
            fontWeight: "bold",
            fontSize: "2.5vh",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
          }}
        >
          Return to Homepage!
        </button>
      </div>
    </div>
  );
}
