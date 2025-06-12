import React, { useState } from 'react';
import { calculateOverallRisk, getRecommendations } from '../logic/SmartRiskEngine';
import './StepDashboard.css';

/**
 * PUBLIC_INTERFACE
 * StepDashboard
 * Animated, tabbed dashboard with animated scorecard, micro-interactions, glassmorphism/neumorphism,
 * responsive layout, and stubs for download/email/share.
 */

// PUBLIC_INTERFACE
function ScoreCard({ quizScore, contractRisk, overallScore, overallGrade }) {
  // Animate main score (on mount & score change).
  const [animatedScore, setAnimatedScore] = useState(0);
  React.useEffect(() => {
    let raf;
    const duration = 900;
    const start = 0;
    const end = overallScore;
    const update = (timestamp, startTime) => {
      const elapsed = Math.min(duration, timestamp - startTime);
      const value = Math.round(start + (end - start) * (elapsed / duration));
      setAnimatedScore(value);
      if (elapsed < duration) {
        raf = requestAnimationFrame(ts => update(ts, startTime));
      } else {
        setAnimatedScore(end);
      }
    };
    const startTime = performance.now();
    raf = requestAnimationFrame(ts => update(ts, startTime));
    return () => raf && cancelAnimationFrame(raf);
  }, [overallScore]);

  // ACTION STUBS
  const handleDownload = () => {
    // Stub action: no-op, could integrate with PDF export logic.
    alert("Download action (stub).");
  };
  const handleEmail = () => {
    alert("Email action (stub).");
  };
  const handleShare = () => {
    alert("Share action (stub).");
  };

  return (
    <div className="glass-card neumorph-shadow dashboard-scorecard">
      <div className="dashboard-score-smalls">
        <div>
          <span className="score-label">Quiz</span>
          <span className="score-num">{quizScore}</span>
        </div>
        <div>
          <span className="score-label">Contract</span>
          <span className="score-num">{contractRisk}</span>
        </div>
      </div>
      <div className="score-main-anim" aria-label={`Overall Score: ${animatedScore}`}>
        <span className="score-big">{animatedScore}</span>
        <span className="score-grade">/100</span>
        <span className="score-tag">{overallGrade}</span>
      </div>
      <div className="score-cta-btns">
        <button className="dashboard-action-btn" title="Download as PDF" onClick={handleDownload}>
          <span role="img" aria-label="download">⬇️</span>
        </button>
        <button className="dashboard-action-btn" title="Email report" onClick={handleEmail}>
          <span role="img" aria-label="email">✉️</span>
        </button>
        <button className="dashboard-action-btn" title="Share dashboard" onClick={handleShare}>
          <span role="img" aria-label="share">🔗</span>
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function TipsTab({ recommendations }) {
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0,marginBottom:6}}>Smart Recommendations</h4>
      <ul>
        {recommendations.map((r, idx) =>
          <li key={idx} style={{marginBottom: 2}}>{r}</li>
        )}
      </ul>
    </div>
  );
}

// PUBLIC_INTERFACE
function Checklist({ items }) {
  // Add a simple checkmark animation stub for demo.
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0,marginBottom:6}}>Quick Checklist</h4>
      <ol className="dashboard-checklist">
        {items.map((item, idx) =>
          <li key={idx}>
            <span className="checklist-bullet" aria-label="check" role="img">✅</span>
            {item}
          </li>
        )}
      </ol>
    </div>
  );
}

// PUBLIC_INTERFACE
function ActionPlan({ actionItems }) {
  // Micro-animation: alternate dot color for steps.
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0,marginBottom:6}}>Action Plan</h4>
      <ul>
        {actionItems.map((act, idx) =>
          <li key={idx}>
            <span className="actionplan-dot" style={{
              filter: idx === 0 ? "brightness(1.04) saturate(1.12)" : "",
              marginRight:9
            }} />
            {act}
          </li>
        )}
      </ul>
    </div>
  );
}

/*
 * MAIN DASHBOARD COMPONENT
 * PUBLIC_INTERFACE
 * Now aggregates and displays quiz and contract analysis results in an interactive tabbed dashboard.
 */
function StepDashboard({
  goToNextStep,
  goToPrevStep,
  appData,
  // Also accept quiz/contract values via props for flexibility
  quizScore,
  quizRisk,
  quizResults,
  contractRisk,
  contractFlags,
  contractRecs,
  contractUploaded
}) {
  // Data flow: prefer explicit state from props, else fallback to appData, else demo values
  const mergedQuizScore =
    quizScore ??
    appData?.quizScore ??
    78;
  const mergedContractRisk =
    contractRisk ??
    appData?.contractRisk ??
    63;

  const mergedQuizRisk =
    quizRisk ??
    appData?.quizRisk ??
    "-";
  const mergedQuizResults =
    quizResults ??
    appData?.quizResults ??
    undefined;

  const mergedContractFlags =
    contractFlags ??
    appData?.contractFlags ??
    [];
  const mergedContractRecs =
    contractRecs ??
    appData?.contractRecs ??
    [];

  // Core overall risk
  const summary = calculateOverallRisk({
    quizScore: mergedQuizScore,
    contractRisk: mergedContractRisk
  });
  const recommendations = getRecommendations(summary.riskGrade);

  // Prepare combined insights for display in tabs
  const checklist = [
    ...recommendations.map(r => r.replace(/[.!?]$/, '')),
    "Update passwords across key accounts",
    "Enable two-factor authentication",
    "Schedule yearly contract review"
  ];
  const actionPlan = [
    "Download full results as PDF",
    "Forward report to legal or IT advisor",
    "Retake quiz in 90 days"
  ];

  // Enhanced: Prepare insights for all tabs
  const quizInsight = mergedQuizResults && Array.isArray(mergedQuizResults)
    ? (
        <div>
          <h4 style={{marginTop:0,marginBottom:7}}>Quiz Insights</h4>
          <ul>
            {mergedQuizResults.map((res, idx) => (
              <li key={res.questionId || idx}>
                <span style={{fontWeight: 600, color: res.isCorrect ? "#178f42" : "#b82727"}}>
                  {res.isCorrect ? "✔️" : "❌"}
                </span>
                &nbsp;
                <span style={{color:"#213", fontWeight:500}}>
                  {`Q${idx+1}`}
                </span>
                {typeof res.userAnswer === "number"
                  ? ` : ${res.isCorrect?"Correct":"Incorrect"}`
                  : ""}
              </li>
            ))}
          </ul>
          <div style={{marginTop:5, fontSize:14.5, color:'#678'}}>
            <b>Quiz Risk Level:</b> {mergedQuizRisk}
          </div>
        </div>
      )
    : (
        <div>
          <h4 style={{marginTop:0}}>Quiz Insights</h4>
          <div>No answer details available.</div>
        </div>
      );

  const contractFindings = contractUploaded === false
    ? (
      <div>
        <h4 style={{marginTop:0}}>Contract Findings</h4>
        <div>No contract was uploaded for analysis.</div>
      </div>
    )
    : (
      <div>
        <h4 style={{marginTop:0,marginBottom:6}}>Contract Analysis</h4>
        <div><b>Red Flags:</b>
          <ul style={{marginBottom:2,paddingLeft:18}}>
            {(mergedContractFlags || []).length
              ? mergedContractFlags.map((flag, idx) => <li key={idx}>{flag}</li>)
              : <li>None found</li>
            }
          </ul>
        </div>
        <div><b>Recommendations:</b>
          <ul style={{marginBottom:2,paddingLeft:18}}>
            {(mergedContractRecs || []).length
              ? mergedContractRecs.map((rec, idx) => <li key={idx}>{rec}</li>)
              : <li>No recommendations provided.</li>
            }
          </ul>
        </div>
      </div>
    );

  // Tab definition for richer tab experience
  const TABS = [
    {
      label: "Summary",
      icon: "📊",
      content: (
        <div>
          <div className="glass-card dashboard-panel-card">
            <div>
              <b>Quiz Score:</b> {mergedQuizScore} / 100{" "}
              <span style={{ color: "#2563eb", marginLeft: 5, fontWeight: 600 }}>
                {mergedQuizRisk}
              </span>
            </div>
            <div>
              <b>Contract Safety Score:</b> {mergedContractRisk} / 100
            </div>
            <div style={{ fontSize: 18, margin: '10px 0 7px 0' }}>
              <b>Overall:</b> {summary.riskScore} / 100{" "}
              <span style={{ fontWeight: 600 }}>{summary.riskGrade}</span>
            </div>
            {quizInsight}
            <div style={{margin:"11px 0"}}>{contractFindings}</div>
          </div>
        </div>
      )
    },
    {
      label: "Quiz Insights",
      icon: "🧩",
      content: (<div className="glass-card dashboard-panel-card">{quizInsight}</div>)
    },
    {
      label: "Contract Findings",
      icon: "📑",
      content: (<div className="glass-card dashboard-panel-card">{contractFindings}</div>)
    },
    {
      label: "Tips",
      icon: "💡",
      content: <TipsTab recommendations={recommendations} />
    },
    {
      label: "Checklist",
      icon: "☑️",
      content: <Checklist items={checklist} />
    },
    {
      label: "Action Plan",
      icon: "🚀",
      content: <ActionPlan actionItems={actionPlan} />
    }
  ];
  const [tab, setTab] = useState(0);

  // Animate fade-in for tab panel on change
  const [tabKey, setTabKey] = useState(0);
  React.useEffect(() => { setTabKey(tab + Math.random()); }, [tab]);

  // Responsive margin for top/bottom
  return (
    <div className="step step-dashboard" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <h2 style={{
        marginTop: 0, marginBottom: 22, fontWeight: 700, letterSpacing: "-0.5px"
      }}>
        Risk Assessment Results
      </h2>
      <ScoreCard
        quizScore={mergedQuizScore}
        contractRisk={mergedContractRisk}
        overallScore={summary.riskScore}
        overallGrade={summary.riskGrade}
      />
      {/* Tabbed navigation */}
      <div className="dashboard-tabs-nav" role="tablist" aria-label="Dashboard Subsections">
        {TABS.map((t, i) =>
          <button
            key={t.label}
            className={`dashboard-tab-btn${tab === i ? " active" : ""}`}
            onClick={() => setTab(i)}
            type="button"
            aria-selected={tab === i}
            tabIndex={tab === i ? 0 : -1}
            role="tab"
            style={{ transitionDelay: `${i * 31}ms` }}
          >
            <span style={{ fontSize: 22, marginRight: 5 }}>{t.icon}</span> {t.label}
          </button>
        )}
      </div>

      {/* Animated content panel for tab */}
      <div className="dashboard-tabs-panel anim-fadein" key={tabKey}>
        {TABS[tab].content}
      </div>

      {/* Footer navigation buttons */}
      <div style={{
        marginTop: 30, display: 'flex', gap: 18, flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <button className="btn" onClick={goToPrevStep}>Back</button>
        <button className="btn btn-large" onClick={goToNextStep}>Finish</button>
      </div>
    </div>
  );
}

export default StepDashboard;
