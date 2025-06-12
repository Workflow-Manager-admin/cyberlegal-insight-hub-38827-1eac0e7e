/**
 * StepContractUpload.js
 *
 * PUBLIC_INTERFACE
 * Step for uploading/pasting contracts. 
 * Placeholder for animated drag-and-drop, code highlighting, and tips.
 */

import React, { useState } from 'react';
import { analyzeContract } from '../logic/ContractAnalyzer';

// PUBLIC_INTERFACE
function StepContractUpload({ goToNextStep, goToPrevStep }) {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = () => {
    const result = analyzeContract(contractText || 'Sample contract with liability and indemnity and termination provisions.');
    setAnalysis(result);
    // Continue with contract risk for downstream steps
    goToNextStep({ contractUploaded: true, contractRisk: result.riskScore, contractFlags: result.redFlags, contractRecs: result.recommendations });
  };

  return (
    <div className="step step-contractupload">
      {/* TODO: Animated drag-drop, syntax highlight, skip button */}
      <h2>Contract Upload / Paste</h2>
      <p>[Contract Upload UI Placeholder]</p>
      <textarea
        rows={4}
        placeholder="Paste contract text or leave blank for demo"
        style={{ width: "100%", marginBottom: 10, fontFamily: "monospace" }}
        value={contractText}
        onChange={e => setContractText(e.target.value)}
      />
      <button className="btn" onClick={goToPrevStep}>Back</button>
      <button className="btn btn-large" onClick={handleAnalyze}>Continue</button>
      <button className="btn" style={{marginLeft: 8}} onClick={() => goToNextStep({ contractUploaded: false })}>Skip</button>
      {analysis && (
        <div style={{marginTop:16, background:'#f9f9ff', padding:10, borderRadius:8, fontSize:14}}>
          <b>Stub Contract Risk Score:</b> {analysis.riskScore}
          <ul>
            {analysis.redFlags.map((flag, idx) => <li key={idx}>{flag}</li>)}
          </ul>
          <div><b>Recommendations:</b>
          <ul>
            {analysis.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
          </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default StepContractUpload;
