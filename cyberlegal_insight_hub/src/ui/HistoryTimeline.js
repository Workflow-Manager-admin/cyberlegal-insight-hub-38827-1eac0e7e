import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * HistoryTimeline: Interactive, chronological timeline of saved reports.
 * - Visually displays reports with date, risk levels, and summarized diffs.
 * - Highlights key differences against a selected reference report.
 * - Allows users to select up to 2 reports to compare (enforce max 2).
 * - Designed for integration within History modal or as section.
 *
 * Props:
 *   reports: Array of report objects (chronologically sorted, newest first).
 *   onCompare: Function (reportIds[]) - called with array of selected report IDs for comparison.
 *   defaultCompareIds: Array of up to 2 report IDs.
 */
function formatTimelineDate(dateString) {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return dateString || "Unknown";
  }
}

// Helper: Compute field diffs between base and target report.
// Returns an array of { field, from, to } for changed values.
function diffReports(base, target) {
  if (!base || !target) return [];
  const diffs = [];
  // Compare key fields (risk, grade, contract flags, etc).
  const fields = [
    { key: "quizScore", label: "Quiz" },
    { key: "contractRisk", label: "Contract" },
    { key: "overall.riskScore", label: "Overall Score" },
    { key: "overall.riskGrade", label: "Risk Level" },
  ];
  for (const f of fields) {
    let from = f.key.includes(".") ? base[f.key.split(".")[0]]?.[f.key.split(".")[1]] : base[f.key];
    let to = f.key.includes(".") ? target[f.key.split(".")[0]]?.[f.key.split(".")[1]] : target[f.key];
    if (from !== undefined && to !== undefined && from !== to)
      diffs.push({ field: f.label, from, to });
  }
  // Heuristic: flag contract finding differences by count
  if (
    (Array.isArray(base.contractFlags) || Array.isArray(target.contractFlags)) &&
    JSON.stringify(base.contractFlags) !== JSON.stringify(target.contractFlags)
  ) {
    diffs.push({
      field: "Contract Findings",
      from: (base.contractFlags || []).filter(f => f && !/no critical/i.test(f)).join(" | ") || "-",
      to: (target.contractFlags || []).filter(f => f && !/no critical/i.test(f)).join(" | ") || "-"
    });
  }
  return diffs;
}

/**
 * Timeline Item
 * @param {*} param0 
 * @returns 
 */
function TimelineItem({ report, index, total, selected, onSelect, showDiff, diffBase, isFirst, isLast }) {
  // Highlight comparison diff if requested
  let diffDisplay = null;
  if (showDiff && diffBase && report.id !== diffBase.id) {
    const diffs = diffReports(diffBase, report);
    if (diffs.length) {
      diffDisplay = (
        <div style={{
          marginTop: 6, background: "rgba(232,122,65,0.08)", borderRadius: 5, fontSize: 13.2, color:"#BD5712", padding: "4.5px 8px"
        }}>
          <span style={{fontWeight:600}}>Changed:</span>{" "}
          {diffs.map((d, i) => <span key={i} style={{marginLeft:i>0?7:0}}>
            <b>{d.field}</b>: <span style={{textDecoration:"line-through", color:"#b82727", opacity:0.6}}>{d.from}</span>{" "}
            <span style={{color:"#178f42"}}>{d.to}</span>
          </span>)}
        </div>
      );
    }
  }

  return (
    <div style={{
      position: "relative", 
      display: "flex", 
      alignItems: "flex-start", 
      marginBottom: isLast ? 0 : 22,
      background: selected ? "linear-gradient(90deg,rgba(251,191,36,0.16),rgba(37,99,235,0.08) 85%)" : "none",
      borderRadius: 9,
      border: selected ? "2.4px solid var(--accent,#fbbf24)" : "1.2px solid var(--glass-border,#ececec)",
      boxShadow: selected ? "0 7px 16px #fbbf2434" : "none",
      transition: "background 0.13s, border 0.17s"
    }}>
      {/* Timeline vertical line */}
      <div style={{
        width: 17, flexShrink: 0, height: "100%",
        display: "flex", alignItems: "center", flexDirection: "column"
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: selected ? "var(--accent,#fbbf24)" : "var(--primary,#2563eb)",
          border: selected ? "2.9px solid var(--primary,#2563eb)" : "2.2px solid #fff",
          marginLeft: 3, zIndex: 1, boxShadow: selected? "0 2.1px 8px #fbbf242d":"none"
        }}/>
        {!isLast && <div style={{
          width: 3.2, height: 38, margin: "0 auto", background: "rgba(37,99,235,0.13)",
          borderRadius: 2, marginBottom: 4, marginTop: 1
        }}/>}
      </div>
      <div style={{ flex: 1, padding: "8px 0 11px 2px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 700, color: "var(--primary,#2563eb)", fontSize: 15.5 }}>#{total-index}</span>
          <span style={{
            color: "var(--text-secondary)", fontWeight: 500, fontSize: 13.3, marginRight: 5
          }}>{formatTimelineDate(report.date || report.timestamp)}</span>
          {report?.overall?.riskGrade && (
            <span style={{
              background: "rgba(37,99,235,0.05)",
              color: "var(--kavia-orange,#E87A41)",
              fontWeight: 600,
              borderRadius: 7,
              padding: "2.5px 8px",
              fontSize: 12.8,
            }}>{report.overall.riskGrade}</span>
          )}
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: 13.7, marginTop: 3, marginBottom:3.5 }}>
          Quiz: <b>{report.quizScore}</b> | Contract: <b>{report.contractRisk}</b> | Overall: <b>{report.overall?.riskScore}</b>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:7, marginTop:3}}>
          <button
            className="btn"
            style={{
              fontSize:13.2, padding:"1.5px 10px",
              background: selected ? "var(--accent,#fbbf24)" : "rgba(232,122,65,0.10)",
              color: selected ? "#fff" : "var(--kavia-orange,#E87A41)",
              fontWeight: selected ? 700 : 500,
              borderRadius: 7,
              minWidth: "min(70px,18vw)",
              transition: "background .12s"
            }}
            onClick={() => onSelect(report.id)}
            title={selected ? "Deselect for comparison" : "Select to compare"}
            aria-pressed={selected}
          >
            {selected ? "Selected" : "Compare"}
          </button>
        </div>
        {diffDisplay}
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main Timeline component.
 */
function HistoryTimeline({ reports = [], onCompare, defaultCompareIds = [] }) {
  // Internal state for which reports are selected for comparison (at most 2)
  const [compareIds, setCompareIds] = useState(defaultCompareIds.slice(0,2));
  // Determine compare base (first selected report)
  const compareBaseId = compareIds[0];
  // Memoized selected reports
  const reportsById = useMemo(() => {
    const map = {}; reports.forEach(r => map[r.id] = r);
    return map;
  }, [reports]);
  // Click to toggle select/deselect for comparison (max 2, new click replaces 2nd)
  function handleSelect(reportId) {
    if (compareIds.includes(reportId)) {
      // Deselect
      const next = compareIds.filter(id => id !== reportId);
      setCompareIds(next);
      if (onCompare) onCompare(next);
    } else if (compareIds.length < 2) {
      const next = [...compareIds, reportId];
      setCompareIds(next);
      if (onCompare) onCompare(next);
    } else {
      // Replace second with new
      const next = [compareIds[0], reportId];
      setCompareIds(next);
      if (onCompare) onCompare(next);
    }
  }

  // Outermost timeline card container
  return (
    <div
      className="glass-card"
      style={{
        position: "relative",
        width: "100%",
        margin: "0 auto 13px auto",
        maxWidth: 580,
        overflowY: "auto",
        background: "linear-gradient(101deg, var(--glass-bg), #e6edf6bb 100%)",
        border: "1.5px solid var(--glass-border)",
        borderRadius: 16,
        boxShadow: "0 5px 32px #18234518",
        padding: "1.17rem 1.03rem 1.01rem 0.8rem",
        minHeight: 90
      }}
    >
      <h3 style={{
        marginTop: 0,
        marginBottom: 11,
        color: "var(--primary,#2563eb)",
        fontWeight: 800,
        fontSize: "1.18rem",
        textAlign: "left",
        letterSpacing: "-0.5px"
      }}>Assessment History Timeline</h3>
      {reports && reports.length ? (
        <ol style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column"
        }}>
          {reports.map((report, idx) => (
            <li key={report.id || idx} style={{ marginBottom: idx === reports.length - 1 ? 2 : 0 }}>
              <TimelineItem
                report={report}
                index={idx}
                total={reports.length}
                selected={compareIds.includes(report.id)}
                onSelect={handleSelect}
                showDiff={compareIds.length === 2}
                diffBase={reportsById[compareIds[0]]}
                isFirst={idx === 0}
                isLast={idx === reports.length - 1}
              />
            </li>
          ))}
        </ol>
      ) : (
        <div style={{ color: "var(--text-secondary)", textAlign: "center", fontWeight: 500, minHeight: 60 }}>
          <span style={{ fontSize: 32, opacity: 0.7, marginBottom: 5 }}>🕰️</span>
          <div>No reports to visualize.</div>
        </div>
      )}
      {compareIds.length === 2 && (
        <div style={{
          marginTop: 19,
          background: "rgba(37,99,235,0.11)",
          border: "1.4px solid var(--primary,#2563eb)",
          borderRadius: 11,
          padding: "13px 18px",
          color: "var(--primary,#2563eb)",
          fontWeight: 600,
          fontSize: 15.1
        }}>
          Comparing reports <span style={{ color: "var(--kavia-orange,#E87A41)", fontWeight: 800 }}>
            #{reports.length - reports.findIndex(r => r.id === compareIds[0])}
          </span>{" "}
          vs{" "}
          <span style={{ color: "#b82727", fontWeight: 800 }}>
            #{reports.length - reports.findIndex(r => r.id === compareIds[1])}
          </span>
          . Review highlights above. Deselect to reset.
        </div>
      )}
    </div>
  );
}

export default HistoryTimeline;
