/**
 * StepDashboard.js
 *
 * PUBLIC_INTERFACE
 * Results/dash step to show risk profile, animated scores, and improvement plan.
 * Placeholder for dashboard cards, tabbed content, download/email/share options.
 */

import React from 'react';

// PUBLIC_INTERFACE
function StepDashboard({ goToNextStep, goToPrevStep }) {
  return (
    <div className="step step-dashboard">
      {/* TODO: Dashboard visuals, animated score, tabbed details */}
      <h2>Risk Assessment Results</h2>
      <p>[Dashboard, animated score cards, action plan go here]</p>
      <button className="btn" onClick={goToPrevStep}>Back</button>
      <button className="btn btn-large" onClick={goToNextStep}>Finish</button>
    </div>
  );
}

export default StepDashboard;
