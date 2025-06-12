/**
 * StepWelcome.js
 *
 * PUBLIC_INTERFACE
 * First step of the Insight Hub: Welcome/Hero screen.
 * Placeholder for glassmorphic design, animated CTA, logo, etc.
 */

import React from 'react';

// PUBLIC_INTERFACE
function StepWelcome({ goToNextStep }) {
  return (
    <div className="step step-welcome">
      {/* TODO: Style hero card, logo, and add theme toggle */}
      <h2>Welcome to CyberLegal Insight Hub</h2>
      <p>Ready to assess your cyber and legal awareness?</p>
      <button className="btn btn-large" onClick={() => goToNextStep()}>Start Assessment</button>
    </div>
  );
}

export default StepWelcome;
