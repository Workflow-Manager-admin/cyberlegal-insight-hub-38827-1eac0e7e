import React, { useEffect, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * PhishingNewsFeed
 * Animated, cycling fake news/phishing headline marquee for dashboard.
 * - Cycles through simulated security news, alerts, and "phishing" headlines.
 * - Animated sliding transitions between items (carousel/marquee).
 * - Glassmorphism design, floating or embeddable in dashboard.
 * - Mobile friendly, accessible, modern effects.
 */
const FAKE_HEADLINES = [
  {
    type: "alert", emoji: "🚨",
    text: "Phishing Alert: Multiple users report suspicious emails claiming urgent legal action required.",
  },
  {
    type: "phishing", emoji: "🎣",
    text: "You’ve won a ‘Crypto SuperBonus!’ Click here to claim – Don’t fall for it. 🚫",
  },
  {
    type: "news", emoji: "📰",
    text: "Breaking: 4 out of 5 data breaches start with a simple phishing email. Stay vigilant!",
  },
  {
    type: "alert", emoji: "⚠️",
    text: "Security Notice: Fake HR notifications ask for password resets. Always verify sender.",
  },
  {
    type: "news", emoji: "🔔",
    text: "Cyber Hygiene: Employees with strong passwords are 80% less likely to suffer account compromise.",
  },
  {
    type: "phishing", emoji: "💰",
    text: "Urgent Payment Needed! Your invoice is overdue. (Another classic phishing tactic.)",
  },
  {
    type: "alert", emoji: "🔒",
    text: "Two-factor authentication stops over 90% of account hacks. Enable it today!",
  },
  {
    type: "phishing", emoji: "🔗",
    text: "Beware: 'Click here to update your benefits info!' emails could be phishing attempts.",
  },
  {
    type: "news", emoji: "👀",
    text: "Did you know? Hovering on suspicious links reveals their true destination!",
  },
];

/**
 * Helper to shuffle headlines (for variety per user session).
 */
function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// PUBLIC_INTERFACE
function PhishingNewsFeed({ floating = false, intervalMs = 5100, style }) {
  const [queue, setQueue] = useState(() =>
    shuffleArray(FAKE_HEADLINES)
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef();

  // Advance headline
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIdx(idx => (idx + 1) % queue.length);
        setAnimating(false);
      }, 350); // duration of slide-out
    }, intervalMs);
    return () => clearTimeout(timerRef.current);
  }, [activeIdx, queue, intervalMs]);

  // Shuffle on mount for variety
  useEffect(() => {
    setQueue(shuffleArray(FAKE_HEADLINES));
    setActiveIdx(0);
  }, []);

  // Pause on hover (optional)
  const [paused, setPaused] = useState(false);
  const handleMouseEnter = () => {
    setPaused(true);
    clearTimeout(timerRef.current);
  };
  const handleMouseLeave = () => {
    setPaused(false);
  };

  // Responsive, glassmorphic style
  const containerStyles = floating
    ? {
        position: "fixed",
        bottom: 29,
        right: 14,
        zIndex: 31,
        maxWidth: 340,
        minWidth: 185,
        width: "92vw",
        boxShadow: "0 8px 32px rgba(19,22,34,0.13), 0 1px 2.3px #fbbf2415",
        background:
          "linear-gradient(99deg, var(--glass-bg,#fff7), #e1e6f755 108%)",
        border: "1.5px solid var(--glass-border,#ececec)",
        borderRadius: 17,
        backdropFilter: "blur(var(--glass-blur,22px))",
        padding: "11px 14px 12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 13,
        color: "var(--text-color,#222)",
        fontWeight: 500,
        fontSize: 15,
        transition: "box-shadow .32s, background .26s",
        cursor: "pointer",
        ...style
      }
    : {
        position: "relative",
        width: "100%",
        margin: "0 auto 18px auto",
        boxShadow: "0 8px 22px #2563eb17, 0 2.5px 6.5px #fbbf2414",
        background:
          "linear-gradient(99deg, var(--glass-bg,#fff7) 76%, #fbbf2411 170%)",
        border: "1.2px solid var(--glass-border,#ececec)",
        borderRadius: 18,
        backdropFilter: "blur(var(--glass-blur,22px))",
        padding: "12px 17px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: "var(--text-color,#222)",
        fontWeight: 500,
        fontSize: 16,
        cursor: "default",
        ...style
      };

  return (
    <div
      className={`phishing-news-feed${floating ? " phishing-widget" : ""}${animating ? " anim-slide" : ""}`}
      style={containerStyles}
      aria-live="polite"
      role="status"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        aria-label={queue[activeIdx]?.type || "news"}
        style={{
          fontSize: 21,
          marginRight: 7,
          filter: queue[activeIdx]?.type === "alert"
            ? "saturate(1.5) drop-shadow(0 2.5px 6px #e87a418c)"
            : queue[activeIdx]?.type === "phishing"
            ? "drop-shadow(0 3px 6px #fbbf242c)"
            : "grayscale(.15)"
        }}
      >
        {queue[activeIdx]?.emoji}
      </span>
      <span style={{
        whiteSpace: "pre-line",
        flex: 1,
        transition: "color .19s",
        fontWeight: "bold"
      }}>
        {queue[activeIdx]?.text}
      </span>
      {/* CSS animation for sliding headline */}
      <style>
        {`
          .phishing-news-feed {
            overflow: hidden;
            min-height: 38px;
            opacity: 0.95;
            user-select: none;
          }
          .phishing-news-feed.anim-slide span:nth-child(2) {
            animation: slide-out-left .32s cubic-bezier(.46,0,.68,1) both;
          }
          .phishing-news-feed:not(.anim-slide) span:nth-child(2) {
            animation: slide-in-right .42s cubic-bezier(.46,0,.68,1) both;
          }
          @keyframes slide-in-right {
            0% { opacity: 0; transform: translateX(60px) scale(0.96);}
            88% { opacity: 1; transform: translateX(-6px) scale(1.01);}
            100% { opacity: 1; transform: translateX(0) scale(1);}
          }
          @keyframes slide-out-left {
            0% { opacity: 1; transform: translateX(0) scale(1);}
            70% { opacity: 0.6; transform: translateX(-90px) scale(0.96);}
            100% { opacity: 0; transform: translateX(-140px) scale(0.92);}
          }
          @media (max-width: 568px) {
            .phishing-news-feed, .phishing-widget {
              font-size: 13px;
              min-width: 124px;
              max-width: 98vw;
              padding: 7px 5vw 7px 10px;
            }
            .phishing-news-feed span[aria-label] { font-size: 17px;}
          }
        `}
      </style>
    </div>
  );
}

export default PhishingNewsFeed;
