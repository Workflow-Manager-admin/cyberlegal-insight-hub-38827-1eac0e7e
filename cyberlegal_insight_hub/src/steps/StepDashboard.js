/**
 * StepDashboard.js
 *
 * PUBLIC_INTERFACE
 * Results/dash step to show risk profile, animated scores, and improvement plan.
 * Placeholder for dashboard cards, tabbed content, download/email/share options.
 */

import React from 'react';
import { calculateOverallRisk, getRecommendations } from '../logic/SmartRiskEngine';

// PUBLIC_INTERFACE
function StepDashboard({ goToNextStep, goToPrevStep, appData }) {
  // Use appData from previous steps
  const quizScore = appData?.quizScore ?? 70;
  const contractRisk = appData?.contractRisk ?? 60;
  const summary = calculateOverallRisk({ quizScore, contractRisk });
  const recommendations = getRecommendations(summary.riskGrade);

  return (
    <div className="step step-dashboard">
      {/* TODO: Dashboard visuals, animated score, tabbed details */}
      <h2>Risk Assessment Results</h2>
      <div style={{marginBottom:16, background:'#f5f7fc', padding:16, borderRadius:10}}>
        <div><b>Quiz Score:</b> {quizScore} / 100</div>
        <div><b>Contract Safety Score:</b> {contractRisk} / 100</div>
        <div style={{marginTop:7, fontSize:18}}>
          <b>Overall Risk:</b> {summary.riskScore} / 100 ({summary.riskGrade})
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <b>Smart Recommendations:</b>
        <ul>
          {recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
        </ul>
      </div>
      <button className="btn" onClick={goToPrevStep}>Back</button>
      <button className="btn btn-large" onClick={goToNextStep}>Finish</button>
    </div>
  );
}

export default StepDashboard;
