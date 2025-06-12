/**
 * StepContractUpload.js
 *
 * PUBLIC_INTERFACE
 * Step for uploading/pasting contracts. 
 * Placeholder for animated drag-and-drop, code highlighting, and tips.
 */

import React from 'react';

// PUBLIC_INTERFACE
function StepContractUpload({ goToNextStep, goToPrevStep }) {
  return (
    <div className="step step-contractupload">
      {/* TODO: Animated drag-drop, syntax highlight, skip button */}
      <h2>Contract Upload / Paste</h2>
      <p>[Contract Upload UI Placeholder]</p>
      <button className="btn" onClick={goToPrevStep}>Back</button>
      <button className="btn btn-large" onClick={() => goToNextStep({ contractUploaded: true })}>Continue</button>
      <button className="btn" style={{marginLeft: 8}} onClick={() => goToNextStep({ contractUploaded: false })}>Skip</button>
    </div>
  );
}

export default StepContractUpload;
