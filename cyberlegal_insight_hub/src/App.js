import React from 'react';
import './App.css';
import MainContainer from './containers/MainContainer';
import ThemeToggle from './ui/ThemeToggle';
import CyberLegalLogo from './ui/CyberLegalLogo';

/**
 * App.js
 * Root of the React app.  Renders global layout (navbar, theme) and loads the main container.
 */
function App() {
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
            {/* Global controls - Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>
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