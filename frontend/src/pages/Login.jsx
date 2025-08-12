import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../utils/api.js";

export function Login() {
  const [incard, setIncard] = useState("signup");

  const baseStyle = {
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
  };

  return (
    <>
      <div style={baseStyle}>
        <div
          style={{
            height: "100%",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F3F7F0",
          }}
        >
          {incard === "signup" ? (
            <SignUpCard changestate={() => setIncard("signin")} />
          ) : (
            <SignInCard changestate={() => setIncard("signup")} />
          )}
        </div>

        <div
          style={{
            height: "100%",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <About />
        </div>
      </div>
    </>
  );
}

function About() {
  return (
    <div style={{ textAlign: "center", padding: "2vh 2vw" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1vw",
          marginBottom: "2vh",
        }}
      >
        <img
          src="/logo.png"
          alt="Good2Go Logo"
          style={{ width: "40px", height: "40px" }}
        />
        <h2 style={{ fontSize: "3vh", color: "#1C3144", margin: 0 }}>
          Good2Go
        </h2>
      </div>
      <h3 style={{ fontSize: "2.5vh", color: "#1C3144", marginBottom: "1vh" }}>
        Discover the extraordinary in the ordinary
      </h3>
      <p style={{ fontSize: "2vh", color: "#546677", marginBottom: "3vh" }}>
        Join a community of local explorers sharing authentic places and hidden
        gems.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "1vw" }}>
          <img
            src="/place1.png"
            alt="place1"
            style={{ width: "15vw", height: "12vh", borderRadius: "1vw" }}
          />
          <img
            src="/place2.png"
            alt="place2"
            style={{ width: "15vw", height: "12vh", borderRadius: "1vw" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1vw" }}>
          <img
            src="/place3.png"
            alt="place3"
            style={{ width: "15vw", height: "12vh", borderRadius: "1vw" }}
          />
          <img
            src="/place4.png"
            alt="place4"
            style={{ width: "15vw", height: "12vh", borderRadius: "1vw" }}
          />
        </div>
      </div>
    </div>
  );
}

function SignInCard({ changestate }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");

  async function handleSignin() {
    setError("");

    if (!username || !password) {
      return setError("Please fill in both fields");
    }

    try {
      setLoading(true);
      const res = await API.post("/users/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/places");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        width: "30vw",
        padding: "4vh 3vw",
        borderRadius: "20px",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "#1C3144", fontSize: "3.5vh", marginBottom: "1vh" }}>
        Welcome back
      </h2>
      <p
        style={{
          color: "#546677",
          fontSize: "2vh",
          textAlign: "center",
          marginBottom: "3vh",
        }}
      >
        Sign in to discover more places
      </p>

      <div
        style={{
          display: "flex",
          gap: "1vw",
          backgroundColor: "#F5F6F7",
          padding: "0.5vh",
          borderRadius: "10px",
          marginBottom: "4vh",
        }}
      >
        <button
          style={{
            padding: "1vh 2vw",
            backgroundColor: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            color: "#1C3144",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
        <button
          onClick={changestate}
          style={{
            padding: "1vh 2vw",
            backgroundColor: "transparent",
            border: "none",
            fontWeight: "600",
            color: "#1C3144",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: "1vh" }}>{error}</p>}

      <div style={{ width: "100%", marginBottom: "2vh" }}>
        <label style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}>
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            marginTop: "0.5vh",
            width: "100%",
            padding: "1.5vh 1vw",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "2vh",
            backgroundColor: "#FFFFFF",
            color: "#1C3144",
            outlineColor: "#3F88C5",
          }}
        />
      </div>

      <div style={{ width: "100%", marginBottom: "4vh" }}>
        <label style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginTop: "0.5vh",
            width: "100%",
            padding: "1.5vh 1vw",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "2vh",
            backgroundColor: "#FFFFFF",
            color: "#1C3144",
            outlineColor: "#3F88C5",
          }}
        />
      </div>

      <button
        onClick={handleSignin}
        disabled={loading}
        style={{
          backgroundColor: "#D00000",
          color: "#F3F7F0",
          border: "none",
          borderRadius: "12px",
          padding: "1.8vh 0",
          fontWeight: "bold",
          fontSize: "2.2vh",
          width: "100%",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </div>
  );
}

function SignUpCard({ changestate }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await API.post("/users/signup", {
        username: name,
        email,
        password,
      });

      const res = await API.post("/users/login", {
        username: name,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/places");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        width: "30vw",
        padding: "4vh 3vw",
        borderRadius: "20px",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "#1C3144", fontSize: "3.5vh", marginBottom: "1vh" }}>
        Register Now!
      </h2>
      <p
        style={{
          color: "#546677",
          fontSize: "2vh",
          textAlign: "center",
          marginBottom: "3vh",
        }}
      >
        Start exploring hidden gems today
      </p>

      <div
        style={{
          display: "flex",
          gap: "1vw",
          backgroundColor: "#F5F6F7",
          padding: "0.5vh",
          borderRadius: "10px",
          marginBottom: "4vh",
        }}
      >
        <button
          onClick={changestate}
          style={{
            padding: "1vh 2vw",
            backgroundColor: "transparent",
            border: "none",
            fontWeight: "600",
            color: "#1C3144",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
        <button
          style={{
            padding: "1vh 2vw",
            backgroundColor: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            color: "#1C3144",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: "1vh" }}>{error}</p>}

      <div style={{ width: "100%", marginBottom: "2vh" }}>
        <label style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}>
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginTop: "0.5vh",
            width: "100%",
            padding: "1.5vh 1vw",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "2vh",
            backgroundColor: "#FFFFFF",
            color: "#1C3144",
            outlineColor: "#3F88C5",
          }}
        />
      </div>

      <div style={{ width: "100%", marginBottom: "2vh" }}>
        <label style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}>
          Email address
        </label>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            marginTop: "0.5vh",
            width: "100%",
            padding: "1.5vh 1vw",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "2vh",
            backgroundColor: "#FFFFFF",
            color: "#1C3144",
            outlineColor: "#3F88C5",
          }}
        />
      </div>

      <div style={{ width: "100%", marginBottom: "2vh" }}>
        <label style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Enter a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginTop: "0.5vh",
            width: "100%",
            padding: "1.5vh 1vw",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "2vh",
            backgroundColor: "#FFFFFF",
            color: "#1C3144",
            outlineColor: "#3F88C5",
          }}
        />
      </div>

      <div style={{ width: "100%", marginBottom: "4vh" }}>
        <label style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}>
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            marginTop: "0.5vh",
            width: "100%",
            padding: "1.5vh 1vw",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "2vh",
            backgroundColor: "#FFFFFF",
            color: "#1C3144",
            outlineColor: "#3F88C5",
          }}
        />
      </div>

      <button
        onClick={handleSignup}
        disabled={loading}
        style={{
          backgroundColor: "#D00000",
          color: "#F3F7F0",
          border: "none",
          borderRadius: "12px",
          padding: "1.8vh 0",
          fontWeight: "bold",
          fontSize: "2.2vh",
          width: "100%",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </div>
  );
}
