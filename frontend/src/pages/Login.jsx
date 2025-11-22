import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../utils/api.js";
import { FaEnvelope, FaLock, FaUser, FaKey } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

// Google Sign In Button Component
function GoogleSignInButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Google Sign In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      const res = await API.post("/users/google-auth", {
        credential: response.credential,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/places");
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      alert(err.response?.data?.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontSize: "1rem",
        fontWeight: "600",
        transition: "all 0.2s",
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
    >
      <FcGoogle size={24} />
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
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

      {/* Google Sign In Button */}
      <GoogleSignInButton />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          margin: "2vh 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
        <span style={{ padding: "0 1vw", color: "#666", fontSize: "0.9rem" }}>
          OR
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
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

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  async function handleRequestOTP() {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await API.post("/users/request-otp", { email });

      setStep(2);
      setResendTimer(60);

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    setError("");

    if (!otp || otp.length !== 6) {
      return setError("Please enter the 6-digit OTP");
    }

    try {
      setLoading(true);

      const signupRes = await API.post("/users/signup", {
        username: name,
        email,
        password,
        otp,
      });

      if (signupRes.data.success) {
        localStorage.setItem("token", signupRes.data.token);
        navigate("/places");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or signup failed");
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
      {step === 1 ? (
        <>
          <h2
            style={{ color: "#1C3144", fontSize: "3.5vh", marginBottom: "1vh" }}
          >
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

          <GoogleSignInButton />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              margin: "2vh 0",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}
            ></div>
            <span
              style={{ padding: "0 1vw", color: "#666", fontSize: "0.9rem" }}
            >
              OR
            </span>
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}
            ></div>
          </div>

          {error && (
            <p
              style={{ color: "red", marginBottom: "1vh", fontSize: "0.9rem" }}
            >
              {error}
            </p>
          )}

          <div style={{ width: "100%", marginBottom: "2vh" }}>
            <label
              style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}
            >
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <FaUser
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  marginTop: "0.5vh",
                  width: "100%",
                  padding: "1.5vh 1vw 1.5vh 2.5vw",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "2vh",
                  backgroundColor: "#FFFFFF",
                  color: "#1C3144",
                  outlineColor: "#3F88C5",
                }}
              />
            </div>
          </div>

          <div style={{ width: "100%", marginBottom: "2vh" }}>
            <label
              style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}
            >
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <FaEnvelope
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  marginTop: "0.5vh",
                  width: "100%",
                  padding: "1.5vh 1vw 1.5vh 2.5vw",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "2vh",
                  backgroundColor: "#FFFFFF",
                  color: "#1C3144",
                  outlineColor: "#3F88C5",
                }}
              />
            </div>
          </div>

          <div style={{ width: "100%", marginBottom: "2vh" }}>
            <label
              style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <FaLock
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  marginTop: "0.5vh",
                  width: "100%",
                  padding: "1.5vh 1vw 1.5vh 2.5vw",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "2vh",
                  backgroundColor: "#FFFFFF",
                  color: "#1C3144",
                  outlineColor: "#3F88C5",
                }}
              />
            </div>
          </div>

          <div style={{ width: "100%", marginBottom: "4vh" }}>
            <label
              style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <FaLock
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  marginTop: "0.5vh",
                  width: "100%",
                  padding: "1.5vh 1vw 1.5vh 2.5vw",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "2vh",
                  backgroundColor: "#FFFFFF",
                  color: "#1C3144",
                  outlineColor: "#3F88C5",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleRequestOTP}
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
            {loading ? "Sending OTP..." : "Continue →"}
          </button>
        </>
      ) : (
        <>
          <h2
            style={{ color: "#1C3144", fontSize: "3.5vh", marginBottom: "1vh" }}
          >
            Verify Your Email
          </h2>
          <p
            style={{
              color: "#546677",
              fontSize: "2vh",
              textAlign: "center",
              marginBottom: "3vh",
            }}
          >
            We've sent a 6-digit code to
            <br />
            <strong>{email}</strong>
          </p>

          {error && (
            <p
              style={{ color: "red", marginBottom: "1vh", fontSize: "0.9rem" }}
            >
              {error}
            </p>
          )}

          <div style={{ width: "100%", marginBottom: "2vh" }}>
            <label
              style={{ fontWeight: "600", fontSize: "2vh", color: "#1C3144" }}
            >
              Enter OTP
            </label>
            <div style={{ position: "relative" }}>
              <FaKey
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                style={{
                  marginTop: "0.5vh",
                  width: "100%",
                  padding: "1.5vh 1vw 1.5vh 2.5vw",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "2.5vh",
                  backgroundColor: "#FFFFFF",
                  color: "#1C3144",
                  outlineColor: "#3F88C5",
                  letterSpacing: "0.5rem",
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          {resendTimer > 0 ? (
            <p
              style={{ fontSize: "0.9rem", color: "#666", marginBottom: "2vh" }}
            >
              Resend OTP in {resendTimer}s
            </p>
          ) : (
            <button
              onClick={handleRequestOTP}
              style={{
                background: "transparent",
                border: "none",
                color: "#3F88C5",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "2vh",
                textDecoration: "underline",
              }}
            >
              Resend OTP
            </button>
          )}

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            style={{
              backgroundColor: otp.length === 6 ? "#D00000" : "#ccc",
              color: "#F3F7F0",
              border: "none",
              borderRadius: "12px",
              padding: "1.8vh 0",
              fontWeight: "bold",
              fontSize: "2.2vh",
              width: "100%",
              cursor: otp.length === 6 ? "pointer" : "not-allowed",
              transition: "all 0.2s ease-in-out",
              opacity: loading ? 0.7 : 1,
              marginBottom: "1vh",
            }}
          >
            {loading ? "Verifying..." : "Verify & Sign Up"}
          </button>

          <button
            onClick={() => setStep(1)}
            style={{
              background: "transparent",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ← Back to form
          </button>
        </>
      )}
    </div>
  );
}
