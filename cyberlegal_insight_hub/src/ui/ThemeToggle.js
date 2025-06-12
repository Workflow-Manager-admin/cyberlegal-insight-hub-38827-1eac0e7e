import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * ThemeToggle: toggle between light/dark modes.
 * - Adds/removes the "dark" class to <body> and :root.
 * - Persists preference to localStorage.
 * - Shows appropriate emoji icon (🌙 for dark, ☀️ for light).
 */
function getPreferredTheme() {
  if (typeof window === "undefined") return "light";
  // Use localStorage or system preference
  const stored = window.localStorage.getItem("themeMode");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// PUBLIC_INTERFACE
function ThemeToggle() {
  const [mode, setMode] = useState(getPreferredTheme);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    window.localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Toggle logic
  const handleToggle = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Accessible label
  const label =
    mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
  const icon = mode === "dark" ? "🌙" : "☀️";

  return (
    <button
      className="theme-toggle-btn"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      type="button"
    >
      {icon}
    </button>
  );
}

export default ThemeToggle;
