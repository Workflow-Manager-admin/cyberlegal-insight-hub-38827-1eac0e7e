/**
 * MainContainer.js
 * 
 * PUBLIC_INTERFACE
 * The central orchestrator for CyberLegal Insight Hub's multi-step flow.
 * Manages progression between steps (pages) of the user's cyber/legal risk journey,
 * controls state, and coordinates sub-components such as quizzes, uploaders, and the dashboard. 
 * 
 * Architectural comments:
 * - Uses a simple step index paradigm; an enum or step registry can be introduced for scale.
 * - Each step is a distinct child component loaded in order; navigation logic included.
 * - Centralized shared state for core data flow.
 * - Future: consider useReducer or a state manager if step complexity grows.
 */

import React, { useState } from 'react';
// Step Components
import StepWelcome from '../steps/StepWelcome';
import StepCyberQuiz from '../steps/StepCyberQuiz';
import StepContractUpload from '../steps/StepContractUpload';
import StepDashboard from '../steps/StepDashboard';
import StepThankYou from '../steps/StepThankYou';
// UI components (example import)
import { ProgressBar } from '../ui/ProgressBar';

// PUBLIC_INTERFACE
const steps = [
  { name: 'Welcome', component: StepWelcome },
  { name: 'Cyber Quiz', component: StepCyberQuiz },
  { name: 'Contract Upload', component: StepContractUpload },
  { name: 'Dashboard', component: StepDashboard },
  { name: 'Thank You', component: StepThankYou }
];

/**
 * PUBLIC_INTERFACE
 * MainContainer handles navigation and step rendering.
 */
function MainContainer() {
  // Step index state. Shared "appData" state can grow as logic is added.
  const [currentStep, setCurrentStep] = useState(0);
  const [appData, setAppData] = useState({
    // Attach quiz answers, contract text, calculated risk, etc.
  });

  // Step navigation logic; passed to children as needed
  const goToNextStep = (extraData = {}) => {
    setAppData(prev => ({ ...prev, ...extraData }));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Dynamically chooses which step to render
  const StepComponent = steps[currentStep].component;

  return (
    <div
      className="main-container"
      style={{
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
        margin: '0 auto',
        padding: '24px 0',
      }}
      tabIndex={-1}
    >
      {/* Example: Progress bar (renders except last/thank you step) */}
      {currentStep < steps.length - 1 && (
        <ProgressBar current={currentStep} total={steps.length - 1} />
      )}
      {/* Step content */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {/* For Dashboard, supply full quiz + contract state. Other steps receive standard props. */}
        <StepComponent
          appData={appData}
          setAppData={setAppData}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          currentStep={currentStep}
          // Pass quiz/contract details for deep insights to Dashboard
          {...(StepComponent === steps[3].component
            ? {
                // Quiz details
                quizScore: appData.quizScore,
                quizRisk: appData.quizRisk,
                quizResults: appData.quizResults,
                // Contract details
                contractRisk: appData.contractRisk,
                contractFlags: appData.contractFlags,
                contractRecs: appData.contractRecs,
                // Whether the user actually submitted/uploaded/pasted a contract
                contractUploaded: appData.contractUploaded
              }
            : {})}
        />
      </div>
    </div>
  );
}

export default MainContainer;
