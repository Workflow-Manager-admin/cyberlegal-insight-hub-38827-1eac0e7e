import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * AuthenticationModal: Handles login, signup, and continue-as-guest UI.
 * - Purely client-side (no backend, just local/session state).
 * - Allows "guest" mode for anonymous use.
 */
function AuthenticationModal({ isOpen, onClose, onAuthenticate }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Simulate authentication: Save user in session storage
  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Very simple validation
    if (!form.username.trim() || !form.password.trim()) {
      setError("Username and password required.");
      return;
    }
    // Store user (simulate login/signup)
    const user = { username: form.username.trim(), isGuest: false };
    window.localStorage.setItem("cyberlegalUser", JSON.stringify(user));
    onAuthenticate(user);
    onClose();
  }
  // Handle "Continue as Guest"
  function handleGuest() {
    // Use fixed guest name
    const guest = { username: "Guest", isGuest: true };
    window.localStorage.setItem("cyberlegalUser", JSON.stringify(guest));
    onAuthenticate(guest);
    onClose();
  }
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function switchMode(newMode) {
    setMode(newMode);
    setError("");
    setForm({ username: "", password: "" });
  }

  return (
    <div
      className="auth-modal-backdrop"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        background: "rgba(30,33,50,0.33)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="glass-card"
        style={{
          minWidth: 320, maxWidth: 375, padding: "2.1rem 1.6rem",
          boxShadow: "0 10px 34px 0 #2563eb29",
          position: "relative",
          borderRadius: 18,
          zIndex: 100,
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            position: "absolute",
            top: 9, right: 12,
            fontSize: 23,
            color: "var(--text-secondary)",
            cursor: "pointer"
          }}
          aria-label="Close"
          onClick={onClose}
        >✖</button>
        <div style={{
          textAlign: "center",
          marginBottom: 14,
          marginTop: 2
        }}>
          <span style={{
            fontSize: 37,
            color: "var(--primary,#2563eb)"
          }}>🔐</span>
          <h3 style={{
            margin: "6px 0 8px 0",
            fontWeight: 700,
            fontSize: "1.29rem",
            letterSpacing: "-0.5px"
          }}>
            {mode === "login" ? "Sign in" : "Create an account"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label style={{ fontWeight: 500, color: "var(--primary)", fontSize: 14 }}>
            Username
            <input
              style={{
                width: "100%",
                marginTop: 2,
                marginBottom: 13,
                fontSize: 15,
                padding: "8px 12px",
                borderRadius: 7,
                border: "1.2px solid var(--border-color,#ccc)",
                background: "rgba(255,255,255,0.6)",
                color: "var(--text-color)",
                outline: "none",
                transition: "border .15s"
              }}
              type="text"
              name="username"
              autoFocus
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
          <label style={{ fontWeight: 500, color: "var(--primary)", fontSize: 14 }}>
            Password
            <input
              style={{
                width: "100%",
                marginTop: 2,
                marginBottom: 13,
                fontSize: 15,
                padding: "8px 12px",
                borderRadius: 7,
                border: "1.2px solid var(--border-color,#ccc)",
                background: "rgba(255,255,255,0.6)",
                color: "var(--text-color)",
                outline: "none",
                transition: "border .15s"
              }}
              type="password"
              name="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && (
            <div style={{ color: "#B82727", margin: "0 0 9px 0", fontSize: 13 }}>
              {error}
            </div>
          )}
          <button
            className="btn btn-large"
            type="submit"
            style={{
              marginTop: 6,
              width: "100%",
              fontWeight: 700,
              background: "linear-gradient(93deg,var(--primary),var(--accent))"
            }}
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div
          style={{ fontSize: 13, color: "var(--text-secondary)", margin: "10px 0 6px", textAlign: "center" }}>
          or
        </div>
        <button
          className="btn"
          style={{
            width: "100%",
            background: "rgba(232,122,65,0.15)",
            color: "var(--kavia-orange,#E87A41)",
            borderRadius: 7,
            fontWeight: 700,
            marginBottom: 8
          }}
          onClick={handleGuest}
          title="Continue as guest; progress isn't saved."
        >
          Continue as Guest
        </button>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  color: "var(--primary,#2563eb)",
                  cursor: "pointer",
                  fontSize: 13
                }}
                onClick={() => switchMode("signup")}
                tabIndex={0}
              >Sign Up</button>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  color: "var(--primary,#2563eb)",
                  cursor: "pointer",
                  fontSize: 13
                }}
                onClick={() => switchMode("login")}
                tabIndex={0}
              >Login</button>
            </>
          )}
        </div>
      </div>
      {/* Slight blur effect for the rest of the app when modal is open */}
      <style>{`
        .auth-modal-backdrop {
          animation: auth-fadein 0.18s cubic-bezier(.42,0,.58,1) both;
        }
        @keyframes auth-fadein {
          0% {opacity:0;}
          100% {opacity:1;}
        }
      `}</style>
    </div>
  );
}

export default AuthenticationModal;
