export function Loader() {
  const loaderStyle = {
    width: "80px",
    height: "80px",
    border: "5px solid rgba(0, 0, 0, 0.1)",
    borderTop: "5px solid black",
    borderRadius: "50%",
    animation: "spin 1.4s linear infinite",
    margin: "auto",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div style={loaderStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `}
      </style>
    </div>
  );
}
