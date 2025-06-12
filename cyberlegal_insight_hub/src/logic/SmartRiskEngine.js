//
// SmartRiskEngine.js
// PUBLIC_INTERFACE
// Simulates an AI-powered engine combining cyber and legal risk insights.
// Exports: calculateOverallRisk (accepts quiz & contract data and returns composite risk), getRecommendations.
//

/**
 * PUBLIC_INTERFACE
 * Calculates a combined cyber/legal risk score and a simple risk grade.
 * @param {Object} params - { quizScore: number, contractRisk: number }
 * @returns {Object} - { riskScore, riskGrade }
 */
export function calculateOverallRisk({ quizScore = 0, contractRisk = 0 }) {
  const normalizedQuiz = Math.max(0, Math.min(quizScore, 100));
  const normalizedContract = Math.max(0, Math.min(contractRisk, 100));
  // Simple average (weights can be customized)
  const combined = Math.round((normalizedQuiz * 0.6) + (normalizedContract * 0.4));
  let riskGrade = "Low";
  if (combined > 80) riskGrade = "Very Low";
  else if (combined > 65) riskGrade = "Low";
  else if (combined > 50) riskGrade = "Moderate";
  else if (combined > 35) riskGrade = "High";
  else riskGrade = "Severe";
  return { riskScore: combined, riskGrade };
}

/**
 * PUBLIC_INTERFACE
 * Returns stubbed recommendations based on overall grade.
 * @param {string} grade
 */
export function getRecommendations(grade) {
  const recs = {
    "Very Low": ["Keep up the great digital habits!", "Review contracts annually."],
    "Low": ["Good job! Consider adding 2FA where possible.", "Review contract for recent regulatory changes."],
    "Moderate": ["Improve password management.", "Seek legal review of new vendors."],
    "High": ["Take training on phishing.", "Consult legal counsel for risky clauses."],
    "Severe": ["Critical risk! Immediate action needed.", "Schedule a compliance audit."]
  };
  return recs[grade] || ["Stay vigilant."];
}
