/**
 * StepCyberQuiz.js
 * 
 * PUBLIC_INTERFACE
 * Step for cyber hygiene behavior questions.
 * Placeholder for dynamic quiz UI/cards, tooltips, progress bar, etc.
 */

import React from 'react';

// PUBLIC_INTERFACE
function StepCyberQuiz({ goToNextStep, goToPrevStep }) {
  return (
    <div className="step step-cyberquiz">
      {/* TODO: Add animated quiz cards and collect answers */}
      <h2>Cyber Hygiene Quiz</h2>
      <p>[Quiz UI Placeholder]</p>
      <button className="btn" onClick={goToPrevStep}>Back</button>
      <button className="btn btn-large" onClick={() => goToNextStep({ cyberQuizCompleted: true })}>Next</button>
    </div>
  );
}

export default StepCyberQuiz;
