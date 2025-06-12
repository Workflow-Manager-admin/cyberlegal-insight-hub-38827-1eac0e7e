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
    alert("Download as PDF coming soon!");
  };
  const handleEmail = () => {
    alert("Email results: Placeholder action.");
  };
  const handleShare = () => {
    alert("Share results: Placeholder action.");
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

/**
 * Enhanced: All dashboard tab content is generated dynamically as per quiz and contract state,
 * using fresh contextual logic. Risk-priority labels/explanations are included for actionable guidance.
 */

// PUBLIC_INTERFACE
function TipsTab({ recommendations, quizRisk, contractFlags, contractRecs }) {
  // Compose actionable, contextual, and risk-prioritized tips
  const hasContractFindings = Array.isArray(contractFlags) && contractFlags.some(flag => flag && !/no critical/i.test(flag));
  const adviceList = [];
  // Quiz risk label
  if (quizRisk && quizRisk !== "-") {
    adviceList.push(
      <li key="quizrisklabel">
        <b>Quiz Risk Level:</b> <span style={{color: quizRisk === 'Severe' ? "#b82727" : quizRisk === 'High' ? "#e87a41" : "#2563eb"}}>{quizRisk}</span>
        {quizRisk === "Severe" && (
          <span style={{color:"#b82727", fontWeight:500, marginLeft:8}}>❗ Immediate improvement needed.</span>
        )}
        {quizRisk === "High" && (
          <span style={{color:"#e87a41", fontWeight:500, marginLeft:8}}>⚠️ Review weak areas soon.</span>
        )}
      </li>
    );
  }
  // System recommendations (from engine)
  for (let i = 0; i < recommendations.length; ++i) {
    adviceList.push(
      <li key={"mainrec"+i}>{recommendations[i]}</li>
    );
  }
  // Contract findings/tips
  if (hasContractFindings && Array.isArray(contractFlags)) {
    contractFlags.forEach((flag, i) => {
      adviceList.push(
        <li key={"flag"+i}><b>Contract Issue:</b> {flag}</li>
      );
    });
  }
  if (hasContractFindings && Array.isArray(contractRecs)) {
    contractRecs.forEach((rec, i) => {
      adviceList.push(
        <li key={"recs"+i}><b>Legal Tip:</b> {rec}</li>
      );
    });
  }
  // Fallback for full safety
  if (!adviceList.length) adviceList.push(<li key="none">No additional recommendations. You're in good shape!</li>);
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0,marginBottom:6}}>Smart Recommendations</h4>
      <ul>
        {adviceList}
      </ul>
    </div>
  );
}

// PUBLIC_INTERFACE
function Checklist({ items, contractFlags }) {
  // Compose an actionable checklist, adding contract flags as top priority, labeled by risk
  const checklistItems = [];
  if (
    Array.isArray(contractFlags) && contractFlags.length > 0 &&
    !contractFlags.some(flag => /no critical/i.test(flag))
  ) {
    contractFlags.forEach((flag, i) =>
      checklistItems.push(`Review contract finding: ${flag}`)
    );
  }
  checklistItems.push(...items);
  // Dedup and render
  const unique = Array.from(new Set(checklistItems));
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0,marginBottom:6}}>Quick Checklist</h4>
      <ol className="dashboard-checklist">
        {unique.map((item, idx) =>
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
function ActionPlan({ actionItems, overallGrade, quizRisk, contractFlags }) {
  // Start with core plan, inject urgent/priority steps based on risk and contract findings
  let plan = [];
  if (
    Array.isArray(contractFlags) && contractFlags.length > 0 &&
    !contractFlags.some(flag => /no critical/i.test(flag))
  ) {
    contractFlags.forEach(flag =>
      plan.push(`URGENT: Address contract finding: ${flag}`)
    );
  }
  if (quizRisk === "Severe" || quizRisk === "High") {
    plan.push("URGENT: Take phishing/cyber training ASAP");
  }
  if (overallGrade === "Severe" && !plan.includes("URGENT: Schedule compliance/legal audit")) {
    plan.push("URGENT: Schedule compliance/legal audit");
  } else if (overallGrade === "High" && !plan.includes("Schedule compliance review")) {
    plan.push("Schedule compliance review");
  }
  plan.push(...actionItems);
  plan = Array.from(new Set(plan));
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0,marginBottom:6}}>Action Plan</h4>
      <ul>
        {plan.map((act, idx) =>
          <li key={idx}>
            <span className="actionplan-dot" style={{
              filter: idx === 0 ? "brightness(1.12) saturate(1.18)" : "",
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
 * Aggregates and displays quiz and contract analysis results in an interactive tabbed dashboard.
 * Populates actionable content in all result tabs based on user data.
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

  // Overall/summary risk analysis
  const summary = calculateOverallRisk({
    quizScore: mergedQuizScore,
    contractRisk: mergedContractRisk
  });
  const recommendations = getRecommendations(summary.riskGrade);

  // Assemble checklist and actions with real/derived data
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

  // Show granular quiz results in tab
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

  // Contract findings per actual user input
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

  // Compose all dashboard tabs
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
      content: <TipsTab
        recommendations={recommendations}
        quizRisk={mergedQuizRisk}
        contractFlags={mergedContractFlags}
        contractRecs={mergedContractRecs}
      />
    },
    {
      label: "Checklist",
      icon: "☑️",
      content: <Checklist
        items={checklist}
        contractFlags={mergedContractFlags}
      />
    },
    {
      label: "Action Plan",
      icon: "🚀",
      content: <ActionPlan
        actionItems={actionPlan}
        overallGrade={summary.riskGrade}
        quizRisk={mergedQuizRisk}
        contractFlags={mergedContractFlags}
      />
    }
  ];
  const [tab, setTab] = useState(0);

  // Animate fade-in for tab panel on change
  const [tabKey, setTabKey] = useState(0);
  React.useEffect(() => { setTabKey(tab + Math.random()); }, [tab]);

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
      <div className="dashboard-tabs-panel anim-fadein" key={tabKey}>
        {TABS[tab].content}
      </div>
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
