//
// ContractAnalyzer.js
// PUBLIC_INTERFACE
// Simulates a legal contract AI analysis module.
// Exports: analyzeContract (returns red flags, clauses, and a risk level).
//

/**
 * PUBLIC_INTERFACE
 * Analyzes simulated contract text for risky clauses and flags.
 * @param {string} contractText
 * @returns {Object} - { riskScore, redFlags, recommendations }
 */
export function analyzeContract(contractText = "") {
  if (!contractText || contractText.length < 10) {
    return {
      riskScore: 80,
      redFlags: [],
      recommendations: ["Add contract data for better analysis."]
    };
  }
  // Demo magic: find "termination", "liability", "indemnity" keywords for red flags.
  const flags = [];
  let score = 90;
  let notes = [];
  if (/termination/i.test(contractText)) {
    flags.push("Termination clause: Check for unilateral termination.");
    score -= 20;
    notes.push("Negotiate for mutual termination rights.");
  }
  if (/liability/i.test(contractText)) {
    flags.push("Liability clause: Caps or unlimited?");
    score -= 25;
    notes.push("Ensure liability is capped/defined.");
  }
  if (/indemnity/i.test(contractText)) {
    flags.push("Indemnity: May expose you to high risk.");
    score -= 20;
    notes.push("Limit indemnity obligations, specify time & scope.");
  }
  if (flags.length === 0) {
    flags.push("No critical red flags detected.");
    notes.push("Contract appears generally safe.");
  }
  return {
    riskScore: Math.max(20, score),
    redFlags: flags,
    recommendations: notes
  };
}
