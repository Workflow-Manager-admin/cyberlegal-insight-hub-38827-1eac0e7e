//
// QuizEngine.js
// PUBLIC_INTERFACE
// Simulates scoring logic and feedback for a cyber hygiene quiz.

/**
 * PUBLIC_INTERFACE
 * Evaluates answers and returns a normalized score and risk message.
 * @param {Object[]} responses - array of quiz item results.
 * Each: { questionId: string, isCorrect: boolean }
 */
export function evaluateQuiz(responses = []) {
  if (!Array.isArray(responses) || responses.length === 0)
    return { score: 100, risk: "Very Low" };
  const correct = responses.filter(r => r.isCorrect).length;
  const total = responses.length;
  const percent = Math.round((correct / total) * 100);
  let risk;
  if (percent > 80) risk = "Very Low";
  else if (percent > 65) risk = "Low";
  else if (percent > 50) risk = "Moderate";
  else if (percent > 35) risk = "High";
  else risk = "Severe";
  return { score: percent, risk };
}
