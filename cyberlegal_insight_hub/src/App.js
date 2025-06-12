import React from 'react';
import './App.css';
import MainContainer from './containers/MainContainer';
import ThemeToggle from './ui/ThemeToggle';
import CyberLegalLogo from './ui/CyberLegalLogo';
import AuthenticationModal from './ui/AuthenticationModal';
import ReportHistoryModal from './ui/ReportHistoryModal';

/**
 * App.js
 * Root of the React app.  Renders global layout (navbar, theme) and loads the main container.
 */
function App() {
  // "Lift" authentication state into App for navbar integration
  const [user, setUser] = React.useState(() => {
    try {
      const stored = window.localStorage.getItem('cyberlegalUser');
      if (stored) return JSON.parse(stored);
      return null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setAuthModalOpen] = React.useState(false);
  const [isHistoryOpen, setHistoryOpen] = React.useState(false);

  // Handle authentication from modal or subcomponents
  function handleAuthenticated(authUser) {
    setUser(authUser);
    setAuthModalOpen(false);
  }
  // Logout clears storage/user
  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem('cyberlegalUser');
    setAuthModalOpen(false);
    setHistoryOpen(false);
  }

  // Pass user, handleAuthenticated, and modal state down to MainContainer
  // MainContainer uses its own authentication, for the steps, but navbar also has a button for profile/login

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="logo" style={{ paddingLeft: 2 }}>
              <CyberLegalLogo
                size={36}
                title="CyberLegal Insight Hub logo"
                aria-label="CyberLegal Insight Hub logo"
                style={{
                  marginRight: 10,
                  flexShrink: 0,
                  minWidth: 32,
                  minHeight: 32,
                  maxHeight: 42,
                  transition: "filter 0.18s"
                }}
              />
              <span
                style={{
                  fontWeight: 800,
                  fontFamily: "'Inter','Roboto','Helvetica','Arial',sans-serif",
                  fontSize: "1.24rem",
                  letterSpacing: "-0.5px",
                  paddingLeft: 3,
                  color: "var(--primary,#2563eb)",
                  background:
                    "linear-gradient(95deg,var(--primary,#2563eb) 36%,var(--accent,#fbbf24) 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
                className="navbar-title"
              >
                CyberLegal Insight Hub
              </span>
            </div>
            {/* Global controls - Theme toggle and Authentication/Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <ThemeToggle />
              {/* Profile/Login button in navbar (visible on all pages) */}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--primary,#2563eb)",
                      fontSize: "1rem",
                      background: "rgba(251,191,36,0.13)",
                      borderRadius: 9,
                      padding: "2.5px 11px"
                    }}
                  >
                    {user.isGuest ? "Guest" : user.username}
                  </span>
                  <button
                    className="btn"
                    onClick={() => setHistoryOpen(true)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 7,
                      fontSize: 13.2,
                      marginLeft: 0,
                      background: "rgba(37,99,235,0.11)",
                      color: "var(--primary,#2563eb)",
                      fontWeight: 700,
                      transition: "background 0.14s"
                    }}
                    title="View Past Risk Reports"
                  >
                    <span role="img" aria-label="history" style={{marginRight:6}}>📑</span>History
                  </button>
                  <button
                    className="btn"
                    style={{
                      padding: "6px 13px",
                      borderRadius: 7,
                      fontSize: 13,
                      background: "rgba(232,122,65,0.11)",
                      color: "var(--kavia-orange,#E87A41)",
                      fontWeight: 700,
                      marginLeft: 2,
                      transition: "background 0.19s"
                    }}
                    onClick={handleLogout}
                    title="Log Out"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  className="btn"
                  style={{
                    padding: "6px 13px",
                    borderRadius: 7,
                    fontSize: 13,
                    background: "rgba(232,122,65,0.15)",
                    color: "var(--kavia-orange,#E87A41)",
                    fontWeight: 700,
                    marginLeft: 2,
                    transition: "background 0.17s"
                  }}
                  onClick={() => setAuthModalOpen(true)}
                  title="Sign In / Register"
                >
                  <span role="img" aria-label="profile" style={{ marginRight: 6 }}>👤</span>Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* AuthenticationModal (placed here so it appears above App/nav/main) */}
      {/* Pass handleAuthenticated from here so Navbar login/logout works */}
      <AuthenticationModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticate={handleAuthenticated}
      />
      <ReportHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setHistoryOpen(false)}
        user={user}
      />
      <main>
        <div className="container" style={{ paddingTop: 100 }}>
          {/* MainContainer orchestrates the entire step flow */}
          <MainContainer />
        </div>
      </main>
    </div>
  );
}

export default App;