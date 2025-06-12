import React, { useState } from 'react';
import { calculateOverallRisk, getRecommendations } from '../logic/SmartRiskEngine';

/**
 * PUBLIC_INTERFACE
 * StepDashboard
 * Animated results dashboard: shows risk profile, animated scorecard, tab navigation,
 * actionable tips, checklist, and action plan, with glass/neumorphism styles.
 */

import './StepDashboard.css';

// PUBLIC_INTERFACE
function ScoreCard({ quizScore, contractRisk, overallScore, overallGrade }) {
  // Micro animation for overall score
  const [animatedScore, setAnimatedScore] = useState(0);
  React.useEffect(() => {
    let start = 0;
    const duration = 900;
    const startTime = Date.now();
    function animate() {
      const now = Date.now();
      const elapsed = now - startTime;
      if (elapsed < duration) {
        setAnimatedScore(Math.round(start + (overallScore - start) * (elapsed / duration)));
        requestAnimationFrame(animate);
      } else {
        setAnimatedScore(overallScore);
      }
    }
    animate();
    // eslint-disable-next-line
  }, [overallScore]);
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
      <div className="score-main-anim">
        <span className="score-big">{animatedScore}</span>
        <span className="score-grade">/100</span>
        <span className="score-tag">{overallGrade}</span>
      </div>
      <div className="score-cta-btns">
        <button className="dashboard-action-btn" title="Download (stub)">
          <span role="img" aria-label="download">⬇️</span>
        </button>
        <button className="dashboard-action-btn" title="Email (stub)">
          <span role="img" aria-label="email">✉️</span>
        </button>
        <button className="dashboard-action-btn" title="Share (stub)">
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
      <h4 style={{marginTop:0}}>Smart Recommendations</h4>
      <ul>
        {recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
      </ul>
    </div>
  );
}

// PUBLIC_INTERFACE
function Checklist({ items }) {
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0}}>Quick Checklist</h4>
      <ol className="dashboard-checklist">
        {items.map((item, idx) =>
          <li key={idx}>
            <span className="checklist-bullet">{/* animated check icon stub */}✅</span>
            {item}
          </li>
        )}
      </ol>
    </div>
  );
}

// PUBLIC_INTERFACE
function ActionPlan({ actionItems }) {
  return (
    <div className="dashboard-tab">
      <h4 style={{marginTop:0}}>Action Plan</h4>
      <ul>
        {actionItems.map((act, idx) =>
          <li key={idx}>
            <span className="actionplan-dot" />{act}
          </li>
        )}
      </ul>
    </div>
  );
}

// MAIN DASHBOARD COMPONENT
function StepDashboard({ goToNextStep, goToPrevStep, appData }) {
  // Pull data from previous steps or fall back to demo values
  const quizScore = appData?.quizScore ?? 72;
  const contractRisk = appData?.contractRisk ?? 60;
  const summary = calculateOverallRisk({ quizScore, contractRisk });
  const recommendations = getRecommendations(summary.riskGrade);

  // Imaginary checklist/action plan
  const checklist = [
    ...recommendations.map(r => r.replace(/[.!?]$/, '')), // simple stub
    "Update passwords across key accounts",
    "Enable two-factor authentication",
    "Schedule yearly contract review",
  ];
  const actionPlan = [
    "Download full results as PDF",
    "Forward report to legal or IT advisor",
    "Retake quiz in 90 days"
  ];

  // Tabs: 0 - Results, 1 - Tips, 2 - Checklist, 3 - Action plan
  const TABS = [
    { label: "Summary", icon: "📊" },
    { label: "Tips", icon: "💡" },
    { label: "Checklist", icon: "☑️" },
    { label: "Action Plan", icon: "🚀" }
  ];
  const [tab, setTab] = useState(0);

  // Animate tab panel (fade in)
  const [tabKey, setTabKey] = useState(0);
  React.useEffect(() => { setTabKey(tab + Math.random()); }, [tab]);

  return (
    <div className="step step-dashboard" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h2 style={{marginTop:0,marginBottom:24}}>Risk Assessment Results</h2>
      {/* Score Card with actions */}
      <ScoreCard
        quizScore={quizScore}
        contractRisk={contractRisk}
        overallScore={summary.riskScore}
        overallGrade={summary.riskGrade}
      />
      {/* Tabbed nav */}
      <div className="dashboard-tabs-nav">
        {TABS.map((t, i) =>
          <button
            key={t.label}
            className={`dashboard-tab-btn${tab === i ? " active" : ""}`}
            onClick={() => setTab(i)}
            type="button"
            aria-selected={tab === i}
            tabIndex={tab === i ? 0 : -1}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <span style={{fontSize:22,marginRight:5}}>{t.icon}</span> {t.label}
          </button>
        )}
      </div>
      {/* Animated tab panels */}
      <div className="dashboard-tabs-panel anim-fadein" key={tabKey}>
        {tab === 0 && (
          <div>
            <div className="glass-card dashboard-panel-card">
              <div><b>Quiz Score:</b> {quizScore} / 100</div>
              <div><b>Contract Safety Score:</b> {contractRisk} / 100</div>
              <div style={{fontSize:18,margin:'9px 0'}}><b>Overall:</b> {summary.riskScore} / 100 <span style={{fontWeight:600}}>{summary.riskGrade}</span></div>
            </div>
          </div>
        )}
        {tab === 1 && <TipsTab recommendations={recommendations} />}
        {tab === 2 && <Checklist items={checklist} />}
        {tab === 3 && <ActionPlan actionItems={actionPlan} />}
      </div>
      {/* Footer nav */}
      <div style={{marginTop:30,display:'flex',gap:18}}>
        <button className="btn" onClick={goToPrevStep}>Back</button>
        <button className="btn btn-large" onClick={goToNextStep}>Finish</button>
      </div>
    </div>
  );
}

export default StepDashboard;

/**
 * CSS-in-JS Glassmorphism + Neumorphism styles for this UI are imported from StepDashboard.css (created alongside).
 */

