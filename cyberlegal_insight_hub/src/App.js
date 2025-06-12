import React from 'react';
import './App.css';
import MainContainer from './containers/MainContainer';

/**
 * App.js
 * Root of the React app.  Renders global layout (navbar, theme) and loads the main container.
 */
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            {/* Insert global controls (e.g., theme toggle) here */}
            <button className="btn">Menu</button>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{paddingTop: 100}}>
          {/* MainContainer orchestrates the entire step flow */}
          <MainContainer />
        </div>
      </main>
    </div>
  );
}

export default App;