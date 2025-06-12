/**
 * StepCyberQuiz.js
 *
 * PUBLIC_INTERFACE
 * Step for cyber hygiene behavior questions.
 * Interactive multi-question quiz with navigation & explanations.
 */

import React, { useState } from 'react';
import { evaluateQuiz } from '../logic/QuizEngine';

// Example set of quiz questions for cyber/legal hygiene best practices
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: "You receive an email from your 'bank' asking to click a link and verify your account. What should you do?",
    options: [
      "Click the link and enter your credentials immediately.",
      "Delete the email without responding.",
      "Verify the sender's email, contact the bank directly, and avoid clicking suspicious links.",
      "Forward the email to friends as a precaution.",
    ],
    correct: 2,
    explanation:
      "Never click on email links from unknown or suspicious senders. Always independently verify such requests by contacting the bank using official contact info. This prevents phishing attacks."
  },
  {
    id: 'q2',
    question: "What is the MOST secure way to store your work passwords?",
    options: [
      "Write them in a notebook you keep in your desk drawer.",
      "Save them in a secure, encrypted password manager.",
      "Email them to yourself so you don't forget.",
      "Reuse the same simple password everywhere for convenience.",
    ],
    correct: 1,
    explanation:
      "Use a reputable password manager to create and store unique, complex passwords for all your accounts. Never reuse passwords or write them down in insecure locations."
  },
  {
    id: 'q3',
    question: "A colleague asks for access to confidential files. The request comes via text message. What should you do?",
    options: [
      "Share the files, since you know the colleague.",
      "Ignore the request.",
      "Call or verify the request through an official company channel, and follow your organization's data policy.",
      "Send the files only after your manager approves in writing.",
    ],
    correct: 2,
    explanation:
      "Always verify sensitive requests using official, secure channels—even if the requester is familiar. This prevents social engineering and potential data leaks."
  },
  {
    id: 'q4',
    question: "Which of these is a sign of a potentially unsafe website?",
    options: [
      "The web address starts with 'https://' and shows a padlock.",
      "The site asks for personal data and has spelling errors, odd pop-ups, or mismatched URL.",
      "It loads very quickly and has a modern design.",
      "There is a privacy policy linked at the bottom.",
    ],
    correct: 1,
    explanation:
      "Watch for spelling mistakes, unexpected data requests, mismatched URLs, and aggressive pop-ups—these may signal a phishing site. Always check for 'https://' but that's not a sole guarantee."
  },
  {
    id: 'q5',
    question: "Which of the following is LEGALLY acceptable digital behavior at work?",
    options: [
      "Sharing copyrighted media via company email to colleagues.",
      "Using only licensed and approved software for business purposes.",
      "Downloading torrents on the company network for convenience.",
      "Forwarding sensitive customer data to your personal email for work-from-home.",
    ],
    correct: 1,
    explanation:
      "Use only authorized, licensed software for business; unauthorized sharing of media or data can expose you and your employer to legal risk. Never send confidential data to personal accounts."
  },
];

function getInitialResponses() {
  return QUIZ_QUESTIONS.map(q => ({
    questionId: q.id,
    userAnswer: null,
    isCorrect: false,
  }));
}

// PUBLIC_INTERFACE
function StepCyberQuiz({ goToNextStep, goToPrevStep }) {
  // Quiz navigation and responses
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState(getInitialResponses());
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  const currQuestion = QUIZ_QUESTIONS[currentIdx];

  // Handle answer selection for current question
  const handleSelect = (idx) => {
    if (quizComplete) return;
    // Mark answer for this question
    setResponses(prev =>
      prev.map((resp, i) =>
        i === currentIdx
          ? {
              ...resp,
              userAnswer: idx,
              isCorrect: idx === currQuestion.correct,
            }
          : resp
      )
    );
    setShowExplanation(true);
  };

  // Advance to next question or finish
  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      // End of quiz: evaluate and show result, forward data
      setQuizComplete(true);
      const evalSummary = evaluateQuiz(
        responses.map((resp, i) =>
          i === currentIdx
            ? {
                questionId: currQuestion.id,
                isCorrect: resp.userAnswer === null
                  ? false
                  : resp.userAnswer === currQuestion.correct,
              }
            : {
                questionId: QUIZ_QUESTIONS[i].id,
                isCorrect: resp.isCorrect,
              }
        )
      );
      setEvalResult(evalSummary);
      // pass results to next step (parent container)
      goToNextStep({
        cyberQuizCompleted: true,
        quizScore: evalSummary.score,
        quizRisk: evalSummary.risk,
      });
    }
  };

  const handlePrev = () => {
    setShowExplanation(false);
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
    else goToPrevStep();
  };

  // Allow users to complete quiz if skipping later questions
  const handleFinishEarly = () => {
    // unanswered marked as incorrect
    setQuizComplete(true);
    const completedResponses = responses.map((resp, i) =>
      i <= currentIdx
        ? resp
        : { ...resp, userAnswer: null, isCorrect: false }
    );
    const evalSummary = evaluateQuiz(
      completedResponses.map((resp, i) => ({
        questionId: QUIZ_QUESTIONS[i].id,
        isCorrect: resp.isCorrect,
      }))
    );
    setEvalResult(evalSummary);
    goToNextStep({
      cyberQuizCompleted: true,
      quizScore: evalSummary.score,
      quizRisk: evalSummary.risk,
    });
  };

  // Progress bar style (reuse from UI for steps)
  const progressPercent = Math.round(
    ((currentIdx + (quizComplete ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100
  );

  return (
    <div className="step step-cyberquiz" style={{ maxWidth: 530, margin: '0 auto', width: '99%' }}>
      <h2>Cyber Hygiene Quiz</h2>
      <div style={{ marginBottom: 10, fontSize: "1.15em", fontWeight: 500, color: 'var(--primary, #2563eb)' }}>
        {quizComplete
          ? "Quiz Complete!"
          : `Question ${currentIdx + 1} of ${QUIZ_QUESTIONS.length}`}
      </div>
      <div style={{
        background: "var(--glass-bg, #f6f7ffbb)",
        borderRadius: 13, boxShadow: "0 2px 13px #2563eb0a",
        padding: "1.6rem 0.9rem 1.4rem 1rem", marginBottom: 19
      }}>
        {!quizComplete ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, minHeight: 32 }}>
              {currQuestion.question}
            </div>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {currQuestion.options.map((opt, idx) => {
                const selected = responses[currentIdx].userAnswer === idx;
                return (
                  <li key={idx} style={{
                    margin: "7px 0",
                  }}>
                    <button
                      className="btn"
                      style={{
                        background: selected
                          ? "linear-gradient(87deg, var(--primary), var(--accent))"
                          : "var(--base-light, #fff)",
                        color: selected ? "#fff" : "var(--primary, #2563eb)",
                        fontWeight: selected ? 600 : 500,
                        width: "100%",
                        textAlign: "left",
                        boxShadow: selected ? "0 6px 14px #2563eb12" : "0 2.5px 8px #fbbf2415",
                        border: selected ? "1.6px solid var(--accent)" : "none"
                      }}
                      onClick={() => handleSelect(idx)}
                      disabled={responses[currentIdx].userAnswer !== null}
                      aria-pressed={selected}
                      tabIndex={0}
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>
            {responses[currentIdx].userAnswer !== null && (
              <div style={{
                marginTop: 15, color: responses[currentIdx].userAnswer === currQuestion.correct ? "#178f42" : "#b82727",
                fontWeight: 600, background: "rgba(23,210,42,0.03)", borderRadius: 6, padding: "6px 11px",
                transition: "color 0.12s"
              }}>
                <span>
                  {responses[currentIdx].userAnswer === currQuestion.correct
                    ? "Correct!"
                    : "Incorrect."}
                </span>
              </div>
            )}
            {/* Show explanation if answered */}
            {showExplanation && (
              <div style={{
                margin: "10px 0 3px 0",
                background: "rgba(82,114,244,0.08)",
                borderLeft: "4px solid var(--primary, #2563eb)",
                borderRadius: 5,
                padding: "6px 15px",
                fontSize: "1.01em",
                color: "#37457a"
              }}>
                <b>Explanation:</b> <span>{currQuestion.explanation}</span>
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: 18, fontWeight: 600, textAlign: "center" }}>
            <div>
              Quiz Score: {evalResult ? evalResult.score : "-"} / 100
            </div>
            <div>
              Risk Level: {evalResult ? evalResult.risk : "-"}
            </div>
            <div style={{ fontSize: 16, marginTop: 13, color: "#267", fontWeight: 400 }}>
              <b>
                {evalResult && evalResult.score === 100
                  ? "Excellent! You're a cyber hygiene pro."
                  : evalResult && evalResult.score >= 80
                  ? "Great job! Consider reviewing missed topics for total mastery."
                  : evalResult && evalResult.score >= 60
                  ? "Solid effort. Review weak areas to reduce risk further."
                  : evalResult && evalResult.score >= 35
                  ? "Risk could be improved; pay close attention to explanations above."
                  : "Your digital risk is high – review best practices and try again!"}
              </b>
            </div>
          </div>
        )}
      </div>
      {/* Progress bar */}
      {!quizComplete && (
        <div style={{
          width: "100%",
          height: 9,
          background: "rgba(37,99,235,0.08)",
          borderRadius: "5.5px",
          overflow: "hidden",
          margin: "12px 0"
        }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, var(--primary, #2563eb), var(--accent, #fbbf24))",
            width: `${progressPercent}%`,
            borderRadius: "5px",
            transition: "width .35s cubic-bezier(.42,0,.58,1)"
          }} />
        </div>
      )}
      {/* Navigation buttons */}
      <div style={{
        marginTop: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10
      }}>
        <button className="btn" onClick={handlePrev} disabled={currentIdx === 0 && responses[0].userAnswer === null}>
          {currentIdx === 0 ? "Back" : "Previous"}
        </button>
        {!quizComplete && (
          <>
            <button
              className="btn btn-large"
              onClick={showExplanation ? handleNext : undefined}
              style={{ minWidth: 93, marginLeft: 8 }}
              disabled={responses[currentIdx].userAnswer == null || !showExplanation}
            >
              {currentIdx < QUIZ_QUESTIONS.length - 1 ? "Next" : "Finish"}
            </button>
            <button
              className="btn"
              style={{ marginLeft: 2 }}
              onClick={handleFinishEarly}
              disabled={quizComplete}
              title="Finish now (remaining questions count as incorrect)"
            >Skip Quiz</button>
          </>
        )}
      </div>
    </div>
  );
}

export default StepCyberQuiz;
