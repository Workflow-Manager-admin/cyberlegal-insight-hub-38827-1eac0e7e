import React, { useState, useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * TimelineComponent: Modern, glassmorphic timeline of user reports.
 * - Chronologically renders report "events" as clickable timeline items
 * - Allows selection of 2+ reports for interactive, side-by-side comparison
 * - Highlights differences, supports branch visualization if data supports it
 * - Glassmorphism/neumorphism, matches app style
 * 
 * Props:
 *   reports: Array of saved report objects (order: newest to oldest)
 *   onCompare: function(compareIdsArray) ⟶ update selection/comparison state
 *   defaultSelected?: Array of reportIds to select on mount
 */
function TimelineComponent({
  reports = [], 
  onCompare, 
  defaultSelected = []
}) {
  // Internal state (controlled if used with ReportHistoryModal)
  const [selected, setSelected] = useState(defaultSelected.slice(0,2));
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // Select a report (max 2; toggles or rotates selections)
  function handleSelect(reportId) {
    let next;
    if (selectedSet.has(reportId)) {
      next = selected.filter(id => id !== reportId); // deselect
    } else if (selected.length < 2) {
      next = [...selected, reportId];
    } else {
      next = [selected[0], reportId];
    }
    setSelected(next);
    if (onCompare) onCompare(next);
  }

  // Helper to get diff summary; only show if two reports selected
  function getDiffSummary() {
    if (selected.length !== 2) return null;
    const a = reports.find(r => r.id === selected[0]);
    const b = reports.find(r => r.id === selected[1]);
    if (!a || !b) return null;

    // Key fields to diff
    const fields = [
      { key: "quizScore", label: "Quiz" },
      { key: "contractRisk", label: "Contract" },
      { key: "overall.riskScore", label: "OverallScore" },
      { key: "overall.riskGrade", label: "RiskLevel" }
    ];
    // Helper: supports "foo.bar"
    const getField = (obj, key) =>
      key.includes(".") ? obj[key.split(".")[0]]?.[key.split(".")[1]] : obj[key];
    const diffs = [];
    for (const f of fields) {
      const vA = getField(a, f.key);
      const vB = getField(b, f.key);
      if (vA !== undefined && vB !== undefined && vA !== vB)
        diffs.push({ field: f.label, vA, vB });
    }
    if (JSON.stringify(a.contractFlags) !== JSON.stringify(b.contractFlags)) {
      diffs.push({
        field: "ContractFindings",
        vA: (a.contractFlags || []).join("; ") || "-",
        vB: (b.contractFlags || []).join("; ") || "-"
      });
    }
    return diffs.length ? diffs : null;
  }

    // Timeline item component
  function TimelineItem({ report, idx, count, isSelected, onSelect }) {
    // There is no use of PUBLIC_URL here. If build error still persists,
    // it may be a project configuration problem or a usage in another file/template.
    return (
      <li
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: idx < count-1 ? 38 : 0,
          background: isSelected ? "linear-gradient(90deg,rgba(251,191,36,0.14),rgba(37,99,235,0.10) 80%)" : "none",
          borderRadius: 13,
          border: isSelected ? "2.3px solid var(--accent,#fbbf24)" : "1.2px solid var(--glass-border,#ececec)",
          boxShadow: isSelected ? "0 5px 18px #fbbf2429" : "none",
          transition: "background 0.13s, border 0.16s"
        }}
      >
        {/* Timeline line/dot */}
        <div style={{width:19,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: isSelected ? "var(--accent,#fbbf24)" : "var(--primary,#2563eb)",
            border: isSelected ? "3px solid var(--primary,#2563eb)" : "2.3px solid #fff",
            margin: "1.5px 0 5px 3px", boxShadow: isSelected ? "0 1.5px 6px #fbbf2421" : "none"
          }} />
          {idx<count-1 && <div style={{
            width:3,height:38,background:"rgba(37,99,235,.11)",borderRadius:3,marginTop:-2
          }}/>}
        </div>
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, padding: "6px 0 8px 2px"}}>
          <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
            <span style={{ fontWeight: 700, color: "var(--primary,#2563eb)", fontSize: 15.5 }}>#{count-idx}</span>
            <span style={{
              color: "var(--text-secondary)", fontWeight: 500, fontSize: 13.3, marginRight: 5
            }}>{formatTimelineDate(report.date || report.timestamp)}</span>
            {report.overall?.riskGrade && (
              <span style={{
                background: "rgba(37,99,235,0.05)",
                color: "var(--kavia-orange,#E87A41)",
                fontWeight: 600,
                borderRadius: 7,
                padding: "2.5px 8px",
                fontSize: 12.6,
              }}>{report.overall.riskGrade}</span>
            )}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: 13.7, margin: "3px 0 5.5px 0" }}>
            Quiz: <b>{report.quizScore}</b> | Contract: <b>{report.contractRisk}</b> | Overall: <b>{report.overall?.riskScore}</b>
          </div>
          <button
            className="btn"
            style={{
              fontSize:12.9,padding:"3.2px 16px",background: isSelected ? "var(--accent,#fbbf24)" : "rgba(232,122,65,0.09)",
              color: isSelected ? "#fff" : "var(--kavia-orange,#E87A41)",
              fontWeight: isSelected ? 700 : 500, borderRadius: 7, minWidth: 61, marginTop: 3
            }}
            onClick={() => onSelect(report.id)}
            aria-pressed={isSelected}
          >{isSelected ? "Selected" : "Compare"}</button>
        </div>
      </li>
    );
  }

  // Timeline outmost glass card
  return (
    <div
      className="glass-card"
      style={{
        position: "relative",
        width: "100%",
        margin: "0 auto 13px auto",
        maxWidth: 620,
        overflowY: "auto",
        background: "linear-gradient(103deg, var(--glass-bg), #e6edf6bb 115%)",
        border: "1.5px solid var(--glass-border)",
        borderRadius: 18,
        boxShadow: "0 5px 30px #18234513",
        padding: "1.17rem 1.13rem 1.12rem 0.7rem",
        minHeight: 90
      }}
    >
      <h3 style={{
        marginTop: 0, marginBottom: 13, color:"var(--primary)", fontWeight: 800, fontSize: "1.21rem"
      }}>
        Assessment Timeline
        <span style={{fontSize:18,marginLeft:7,verticalAlign:"middle"}}>🕒</span>
      </h3>
      {reports && reports.length ? (
        <ol style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column"}}>
          {reports.map((report, idx) =>
            <TimelineItem
              key={report.id||idx}
              report={report}
              idx={idx}
              count={reports.length}
              isSelected={selectedSet.has(report.id)}
              onSelect={handleSelect}
            />
          )}
        </ol>
      ) : (
        <div style={{ color: "var(--text-secondary)", textAlign: "center", fontWeight: 500, minHeight: 60 }}>
          <span style={{ fontSize: 33, opacity: 0.67, marginBottom: 5 }}>🕰️</span>
          <div>No reports to visualize yet.</div>
        </div>
      )}
      {/* If comparing, show diff summary */}
      {selected.length === 2 && (
        <div style={{
          marginTop: 19,
          background: "rgba(37,99,235,0.09)",
          border: "1.6px solid var(--primary,#2563eb)",
          borderRadius: 11,
          padding: "13px 18px",
          color: "var(--primary,#2563eb)",
          fontWeight: 600,
          fontSize: 15.1
        }}>
          Comparing <span style={{color:"var(--kavia-orange,#E87A41)",fontWeight:800}}>#{reports.length-reports.findIndex(r=>r.id===selected[0])}</span>
          {" "}vs{" "}
          <span style={{color:"#b82727",fontWeight:800}}>#{reports.length-reports.findIndex(r=>r.id===selected[1])}</span>
          <br />
          {getDiffSummary() 
            ? getDiffSummary().map((d, i) => (
                <span key={i} style={{display:"block",padding:"1.5px 0"}}>
                  <b style={{marginRight:5}}>{d.field}</b>
                  <span style={{
                    textDecoration: "line-through", color: "#b82727", opacity: 0.7, marginRight:6
                  }}>{d.vA}</span>
                  <span style={{
                    color:"#178f42",fontWeight:600
                  }}>{d.vB}</span>
                </span>
              ))
            : <span style={{color:"#267"}}>No key differences detected.</span>
          }
        </div>
      )}
    </div>
  );
}

// Helper: pretty short date format for the timeline
function formatTimelineDate(dateString) {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return dateString || "Unknown";
  }
}

export default TimelineComponent;
