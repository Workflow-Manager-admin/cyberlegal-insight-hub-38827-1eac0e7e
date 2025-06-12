/**
 * StepThankYou.js
 *
 * PUBLIC_INTERFACE
 * Final step - thank you/celebration, retake and share CTAs.
 * Placeholder for confetti, subscribe, and retake assessment.
 */

import React from 'react';

// PUBLIC_INTERFACE
function StepThankYou() {
  return (
    <div className="step step-thankyou">
      {/* TODO: Add confetti animation, share/subscription options */}
      <h2>Thank You!</h2>
      <p>Your CyberLegal insight report is ready.</p>
      <button className="btn btn-large" onClick={() => window.location.reload()}>Retake Assessment</button>
      {/* Optionally: more buttons for sharing/subscribing */}
    </div>
  );
}

export default StepThankYou;
