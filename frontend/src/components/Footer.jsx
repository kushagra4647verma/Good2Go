export function Footer() {
  return (
    <footer
      style={{
        height: "8vh",
        backgroundColor: "#1C3144",
        marginTop: "2vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        fontSize: "14px",
        fontWeight: "500",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      © {new Date().getFullYear()} Good2Go App
    </footer>
  );
}
