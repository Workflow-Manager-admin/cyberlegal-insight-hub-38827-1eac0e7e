/**
 * StepCyberQuiz.js
 * 
 * PUBLIC_INTERFACE
 * Step for cyber hygiene behavior questions.
 * Placeholder for dynamic quiz UI/cards, tooltips, progress bar, etc.
 */

import React, { useState } from 'react';
import { evaluateQuiz } from '../logic/QuizEngine';

// PUBLIC_INTERFACE
function StepCyberQuiz({ goToNextStep, goToPrevStep }) {
  // For the stub: hardcoded answers to simulate evaluation.
  const [result, setResult] = useState(null);

  // Imagine answers submitted; call stub logic
  const handleQuizComplete = () => {
    const sampleResponses = [
      { questionId: 'q1', isCorrect: true },
      { questionId: 'q2', isCorrect: false },
      { questionId: 'q3', isCorrect: true },
      { questionId: 'q4', isCorrect: true }
    ];
    const quizResult = evaluateQuiz(sampleResponses);
    setResult(quizResult);
    // Pass result to next step if needed
    goToNextStep({ cyberQuizCompleted: true, quizScore: quizResult.score, quizRisk: quizResult.risk });
  };

  return (
    <div className="step step-cyberquiz">
      {/* TODO: Add animated quiz cards and collect answers */}
      <h2>Cyber Hygiene Quiz</h2>
      <p>[Quiz UI Placeholder]</p>
      <button className="btn" onClick={goToPrevStep}>Back</button>
      <button className="btn btn-large" onClick={handleQuizComplete}>Next</button>
      {result && (
        <div style={{marginTop:12, color:'#267', fontWeight:500}}>
          <div>Stubbed Quiz Score: {result.score}</div>
          <div>Risk Level: {result.risk}</div>
        </div>
      )}
    </div>
  );
}

export default StepCyberQuiz;
