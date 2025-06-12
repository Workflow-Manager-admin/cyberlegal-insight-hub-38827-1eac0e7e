import React, { useRef, useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * SidebarAssistant: Persistent chat-style sidebar assistant for legal/safety Q&A.
 * - Floating button to open/close
 * - Remembers message history this session
 * - Simulated "AI" legal/safety stub answers
 * - Modern glassmorphic/neumorphic design, responsive and accessible
 * - Overlay/modal for mobile
 */
const defaultGreetings = [
  {
    sender: "ai",
    text: "Hi! I’m your CyberLegal Assistant. Ask me about safety, privacy, contracts, risks, or digital best practices.",
    id: "init-ai"
  }
];

// Answer stubs (rotates or matches keyword)
function getStubbedResponse(text) {
  const lower = text.toLowerCase();
  if (/privacy|personal data|gdpr|ccpa|coppa|pii/.test(lower))
    return "Take care not to share your personal or sensitive information online or in contracts, and always confirm a site's privacy policy. For GDPR/CCPA, ensure you know your data rights!";
  if (/password|phishing|account|login|mfa|2fa|auth/i.test(lower))
    return "Use strong, unique passwords and enable two-factor authentication (2FA) where possible. If you suspect phishing, never click suspicious links!";
  if (/liability|indemnity|contract|terms|termination|legal/.test(lower))
    return "Review liability and indemnity clauses in all contracts. Negotiate for mutual termination rights and clarify vague legal terms. Consult a legal expert for critical documents.";
  if (/risk|cyber|threat|attack|hacker/.test(lower))
    return "Stay alert: use updated software, avoid risky downloads, and do not respond to suspicious emails. Assess vendors for cyber, legal, and privacy risks.";
  if (/children|minor/.test(lower))
    return "Special laws protect children’s online privacy (COPPA). Never collect or share a minor’s information without consent.";
  // Default/simulate elaborate "AI" response (for demo)
  const DEMO_ANSWERS = [
    "Great question! If you’re unsure about a contract term, always seek clarification before signing.",
    "Cyber risks can be minimized with regular software updates, careful link-clicking, and periodic password changes.",
    "Remember: you have a right to ask how your data is used. Read privacy notices carefully.",
    "If in doubt, consult your organization’s legal/compliance advisor for a formal opinion.",
    "Try searching for official government publications or reputable security blogs for more info."
  ];
  return DEMO_ANSWERS[Math.floor(Math.random() * DEMO_ANSWERS.length)];
}

function usePersistentMessages(storageKey = "sidebarAssistantMessages") {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultGreetings.slice();
    } catch {
      return defaultGreetings.slice();
    }
  });
  useEffect(() => {
    window.sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);
  return [messages, setMessages];
}

function SidebarAssistant() {
  // Open/closed state (persistent for UX)
  const [open, setOpen] = useState(() => {
    try {
      const stored = window.sessionStorage.getItem("sidebarAssistantOpen");
      return stored === "true";
    } catch { return false; }
  });
  useEffect(() => {
    window.sessionStorage.setItem("sidebarAssistantOpen", open ? "true" : "false");
  }, [open]);

  // Chat messages (persisted per session for scrollback)
  const [messages, setMessages] = usePersistentMessages();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to last message
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Handle sending a user message (then simulate AI reply)
  function handleSend(e) {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const msg = {
      sender: "user",
      text: trimmed,
      id: Date.now() + "-u"
    };
    setMessages(msgs => [...msgs, msg]);
    setInput("");
    setTyping(true);
    // Simulate AI "typing" then reply
    setTimeout(() => {
      const aiReply = {
        sender: "ai",
        text: getStubbedResponse(trimmed),
        id: Date.now() + "-ai"
      };
      setMessages(msgs => [...msgs, aiReply]);
      setTyping(false);
    }, 900 + Math.random() * 800);
  }

  // Handle Enter (avoid multiline)
  function handleInputKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Keyboard shortcut: Cmd/Ctrl+Shift+/
  useEffect(() => {
    const handleShortcut = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "/" || e.code === "Slash")
      ) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // Clicking outside closes the sidebar
  const containerRef = useRef();
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (window.innerWidth < 560) setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, { capture: true });
    return () => document.removeEventListener("mousedown", handleClickOutside, { capture: true });
  }, [open]);

  // Glassmorphic/neumorphic/floating style (responsive on mobile)
  // Keyboard accessible button/focus
  return (
    <>
      {/* Floating toggle button */}
      <button
        className="sidebar-assistant-fab"
        aria-label={open ? "Close Chat Assistant" : "Open Chat Legal Assistant"}
        title={open ? "Close Assistant (Ctrl+Shift+/)" : "Chat with Legal/Cyber Assistant (Ctrl+Shift+/)"}
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed",
          bottom: 27,
          right: 27,
          zIndex: 2002,
          width: 59, height: 59,
          borderRadius: "50%",
          background: open
            ? "linear-gradient(95deg,var(--primary),(var(--kavia-orange,#E87A41)))"
            : "linear-gradient(95deg,var(--accent,#fbbf24) 30%,var(--primary,#2563eb) 75%)",
          color: "#fff",
          border: "none",
          boxShadow: open
            ? "0 8px 32px #15329b1b, 0 1.2px 2.4px #fff4"
            : "0 4px 14px #E87A4159, 0 1.5px 3px #fff3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: open ? "3px solid var(--accent,#fbbf24)" : "none",
          transition: "background .25s, box-shadow .22s"
        }}
        tabIndex={0}
      >
        <span style={{ fontSize: 29, fontWeight: 700, opacity: 0.91 }}>
          {open ? "×" : "💬"}
        </span>
      </button>
      {/* Sidebar/Modal */}
      <div
        tabIndex={-1}
        aria-modal="true"
        aria-label="CyberLegal Chat Assistant"
        style={{
          display: open ? "flex" : "none",
          flexDirection: "column",
          position: "fixed",
          bottom: window.innerWidth >= 700 ? 35 : 0,
          right: window.innerWidth >= 700 ? 34 : 0,
          zIndex: 2014,
          maxWidth: "95vw",
          width: window.innerWidth < 700 ? "100vw" : 410,
          minHeight: 410,
          maxHeight: window.innerWidth < 700 ? "93vh" : 590,
          boxShadow: "0 14px 42px #181b2369, 0 3px 22px #fbbf245a",
          borderRadius: window.innerWidth < 700 ? "0" : "1.7rem",
          background: "var(--glass-bg,rgba(255,255,255,0.28))",
          backdropFilter: "blur(var(--glass-blur,28px))",
          border: "1.9px solid var(--glass-border,#fff2)",
          transition: "background .3s, box-shadow .24s,border .25s",
          overflow: "hidden",
        }}
        ref={containerRef}
        className="sidebar-assistant-glass"
      >
        {/* Header */}
        <div style={{
          minHeight: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 7,
          padding: "8px 19px 3px 19px",
          background: "linear-gradient(98deg,var(--glass-bg,rgba(255,255,255,0.17)) 72%,#e87a4122 100%)",
          borderBottom: "1.2px solid var(--glass-border,#ececec)",
        }}>
          <span style={{
            fontWeight: 700, fontSize: 18, color: "var(--primary,#2563eb)",
            letterSpacing: "-0.7px", marginRight: 9
          }}>
            <span role="img" aria-label="AI">🤖</span> Chat Assistant
            <span style={{
              fontWeight: 400, fontSize: 13.4, color: "var(--text-secondary)", marginLeft: 10
            }}>(Beta)</span>
          </span>
          <button
            aria-label="Close"
            type="button"
            onClick={() => setOpen(false)}
            tabIndex={0}
            style={{
              background: "none",
              border: "none",
              fontSize: 25,
              color: "var(--text-secondary,#444)",
              cursor: "pointer",
              marginRight: -3,
              marginTop: 0
            }}
          >×</button>
        </div>
        {/* Chat log */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "15px 6px 15px 17px",
          background: "none",
        }}>
          {messages.map((msg, i) => (
            <div
              key={msg.id || i}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
                alignItems: "flex-end"
              }}
            >
              <div
                style={{
                  maxWidth: "82%",
                  background: msg.sender === "user"
                    ? "linear-gradient(90deg,var(--primary,#2563eb) 80%,var(--accent,#fbbf24) 135%)"
                    : "var(--glass-bg,rgba(255,255,255,0.14))",
                  color: msg.sender === "user" ? "#fff" : "var(--kavia-dark,#181A1A)",
                  borderRadius: msg.sender === "user"
                    ? "17px 13px 2px 16px"
                    : "13px 16px 17px 2px",
                  fontSize: 15.1,
                  padding: "9.5px 13px",
                  marginLeft: msg.sender === "user" ? 0 : 2,
                  marginRight: msg.sender === "user" ? 2 : 0,
                  boxShadow: msg.sender === "user"
                    ? "0 2px 7px #2563eb22"
                    : "0 2.5px 10px #e87a410a",
                  fontWeight: 500,
                  position: "relative"
                }}
                aria-label={msg.sender === "user" ? "User message" : "Assistant answer"}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 2 }}>
              <div style={{
                background: "var(--glass-bg,rgba(255,255,255,0.17))",
                color: "var(--text-secondary)",
                borderRadius: "13px 16px 17px 2px",
                fontSize: 15.1,
                padding: "9.5px 13px",
                minWidth: 38,
                minHeight: 23,
                marginLeft: 2,
                boxShadow: "0 1.5px 7px #e87a4131"
              }}>
                <span style={{ opacity: 0.7 }}>...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input box */}
        <form
          onSubmit={handleSend}
          style={{
            borderTop: "1.1px solid var(--glass-border,#ececec)",
            padding: "12px 12px 12px 15px",
            display: "flex",
            alignItems: "center",
            background: "var(--glass-bg,rgba(255,255,255,0.12))"
          }}
          autoComplete="off"
        >
          <input
            type="text"
            aria-label="Type your legal, safety, or risk question"
            placeholder="Type legal/safety/risk question…"
            value={input}
            onChange={e => setInput(e.target.value.slice(0,300))}
            onKeyDown={handleInputKey}
            maxLength={300}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              borderRadius: 9,
              fontSize: 15.4,
              padding: "10px 16px",
              background: "rgba(255,255,255,0.23)",
              fontFamily: "inherit",
              color: "var(--text-color,#181b23)",
              marginRight: 7,
              boxShadow: "0 2px 6px #2563eb11",
            }}
            disabled={typing}
            tabIndex={0}
          />
          <button
            type="submit"
            aria-label="Send Question"
            className="btn"
            style={{
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 7,
              padding: "7px 19px",
              background: "linear-gradient(97deg,var(--accent,#fbbf24),var(--primary,#2563eb))",
              color: "#fff",
              border: "none",
              transition: "background .18s"
            }}
            disabled={typing || !input.trim()}
            tabIndex={0}
          >
            <span role="img" aria-label="send">➤</span>
          </button>
        </form>
      </div>
      <style>{`
      .sidebar-assistant-fab:focus-visible { outline: 2.8px solid var(--primary, #2563eb); }
      .sidebar-assistant-glass { animation: sidebar-chat-in 0.29s cubic-bezier(.48,0,.58,1) both; }
      @keyframes sidebar-chat-in {
        0% { opacity: 0; transform: translateY(42px) scale(0.97);}
        100%{ opacity: 1; transform: translateY(0) scale(1);}
      }
      @media (max-width: 700px) {
        .sidebar-assistant-glass {
          bottom: 0 !important; right: 0 !important; border-radius: 0 !important;
          width: 100vw !important; max-width: 100vw !important; min-height: 60vh;
        }
        .sidebar-assistant-fab {
          right: 12px !important; bottom: 12px !important; width: 50px !important; height: 50px !important;
        }
      }
      `}</style>
    </>
  );
}

export default SidebarAssistant;
