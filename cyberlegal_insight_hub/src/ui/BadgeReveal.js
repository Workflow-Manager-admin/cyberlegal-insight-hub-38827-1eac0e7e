import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
// Animated badge reveal - displays badge with animated entry and optional description.
function BadgeReveal({ badge, onClose, duration = 2500, floating = false }) {
  // Animate pop-in, then auto-dismiss (unless onClose omitted)
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    if (onClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 340);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  if (!badge) return null;

  return (
    <div
      className={`badge-reveal${visible ? " badge-reveal-show" : ""}${floating ? " badge-reveal-float" : ""}`}
      style={{
        position: floating ? "fixed" : "relative",
        left: floating ? "50%" : undefined,
        top: floating ? "20%" : undefined,
        transform: floating ? "translateX(-50%)" : undefined,
        zIndex: floating ? 4000 : 1,
        background: "linear-gradient(93deg,var(--accent,#fbbf24) 60%,var(--primary,#2563eb) 130%)",
        color: "#fff",
        padding: "18px 32px",
        borderRadius: "20px",
        fontSize: 21,
        boxShadow: "0 6px 38px #e87a4139, 0 1.5px 8px #2563eb44",
        minWidth: 168,
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity .29s cubic-bezier(.65,0,.67,1),transform .45s cubic-bezier(.41,0,.67,1)",
        pointerEvents: "none",
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{
        fontSize: 36,
        filter: "drop-shadow(0 3.5px 7px #111c22a9)",
        marginBottom: 4
      }}>
        {badge.emoji}
      </div>
      <b style={{ fontSize: 19 }}>{badge.displayName}</b>
      <div style={{
        fontSize: 14.2,
        fontWeight: 400,
        marginTop: 4,
        color: "rgba(255,255,255,0.93)",
        minHeight: 22
      }}>
        {badge.description}
      </div>
      <style>
        {`
        .badge-reveal { opacity:0; transform:scale(.87) translateY(30px); pointer-events:none;}
        .badge-reveal-show { opacity:1; transform:scale(1.08) translateY(0); transition:transform .33s cubic-bezier(.61,0,.49,1),opacity .32s;}
        .badge-reveal-float { position:fixed !important; left:50%; top:20%; pointer-events:none;}
        `}
      </style>
    </div>
  );
}
export default BadgeReveal;
