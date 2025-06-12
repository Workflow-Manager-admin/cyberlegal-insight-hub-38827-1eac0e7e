import React, { useState, useRef } from "react";
import { analyzeContract } from "../logic/ContractAnalyzer";

/**
 * PUBLIC_INTERFACE
 * StepContractUpload
 * Modern, animated drag-and-drop and paste contract upload step.
 * - Glassmorphism/neumorphism, animated UI
 * - Drag & drop zone with visual feedback
 * - Code paste area (syntax highlight for legal keywords)
 * - Skip support, accessibility, trust tips
 * - Integrates with analyzeContract for stub analysis
 * - Responsive + mobile-friendly
 */
const LEGAL_KEYWORDS = [
  "termination", "liability", "indemnity", "assign", "confidential", "breach",
  "warranty", "damages", "governing law", "dispute", "arbitration"
];

function highlightLegal(text) {
  if (!text) return "";
  // Mild syntax "highlighting" for demonstration: wrap keywords in span
  let result = text;
  LEGAL_KEYWORDS.forEach(word => {
    const re = new RegExp(`\\b(${word})\\b`, "gi");
    result = result.replace(
      re,
      '<span class="highlight-keyword">$1</span>'
    );
  });
  return result
    .replace(/</g, "&lt;")
    .replace(/&lt;span class="highlight-keyword"&gt;/g, '<span class="highlight-keyword">')
    .replace(/&lt;\/span&gt;/g, "</span>");
}

// Accessibility: unique id for aria
let _instance = 0;
function getUniqueId() {
  return `contract-upload-${++_instance}`;
}

// Trust Tips for contract upload security
const TRUST_TIPS = [
  "Uploaded or pasted content is analyzed locally in your browser.",
  "No contract data is transmitted to servers.",
  "Remove confidential data if desired—use sample contract for demo.",
  "Look for terms like 'liability', 'termination', and 'indemnity'."
];

function StepContractUpload({ goToNextStep, goToPrevStep }) {
  const [contractText, setContractText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [animating, setAnimating] = useState(false);
  const fileInputRef = useRef(null);
  const pasteAreaId = useRef(getUniqueId());

  // Animate panel pop-in
  React.useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 670);
    return () => clearTimeout(t);
  }, []);

  // Handle file upload (.txt only, max 64KB)
  function handleFile(files) {
    setUploadError("");
    const file = files?.[0];
    if (!file) return;
    if (!file.name.match(/\.txt$/i)) {
      setUploadError("Only .txt contracts supported for demo.");
      return;
    }
    if (file.size > 64 * 1024) {
      setUploadError("File too large (max 64KB for demo).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setContractText(e.target.result || "");
    };
    reader.onerror = () =>
      setUploadError("Failed to read file. Try again or paste contract manually.");
    reader.readAsText(file);
  }
  function handleDragOver(e) {
    e.preventDefault(); e.stopPropagation();
    setDragActive(true);
  }
  function handleDragLeave(e) {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
  }
  function handleDrop(e) {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files);
    }
  }
  function onFileChange(e) {
    handleFile(e.target.files);
  }

  // Paste logic (Ctrl+V into paste area below)
  function handlePaste(e) {
    if (e.clipboardData) {
      const pasted = e.clipboardData.getData("text/plain");
      if (pasted.length) {
        setContractText(pasted.trim());
        e.preventDefault();
      }
    }
  }

  // Reset/paste area
  function clearContract() {
    setContractText("");
    setAnalysis(null);
    fileInputRef.current.value = "";
  }

  // Continue → Analyze
  function handleAnalyze() {
    const textToAnalyze =
      contractText ||
      "Sample contract with liability and indemnity and termination provisions.";
    setAnimating(true);
    setTimeout(() => {
      const result = analyzeContract(textToAnalyze);
      setAnalysis(result);
      setAnimating(false);
      goToNextStep({
        contractUploaded: true,
        contractRisk: result.riskScore,
        contractFlags: result.redFlags,
        contractRecs: result.recommendations
      });
    }, 650);
  }

  // Enter key: do not allow submit via Enter in paste area
  function preventSubmitOnEnter(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleAnalyze();
    }
  }

  // Glass/neumorph style cards for drag-drop and paste
  return (
    <div
      className={`step step-contractupload${animating ? " anim-upload" : ""}`}
      style={{
        maxWidth: 520,
        width: "99%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 23
      }}
    >
      <h2 style={{
        textAlign: "center",
        margin: "17px 0 6px 0",
        color: "var(--primary, #2563eb)",
        fontWeight: 700,
        letterSpacing: "-0.5px",
        fontSize: "2.03rem"
      }}>
        Upload or Paste Legal Contract
      </h2>
      <div style={{textAlign:"center", color: "var(--text-secondary)", fontWeight:500, fontSize:"1.07rem", marginBottom:3, marginTop:-11}}>
        Enhance your assessment by providing a vendor, NDA, or other legal contract. <br />
        <span role="img" aria-label="lock" style={{fontSize:15}}>🔒</span>
        <span style={{fontSize:13, color:"var(--kavia-orange,#E87A41)",marginLeft:6}}>All analysis happens locally—no content is uploaded to a server.</span>
      </div>
      {/* Animated drag-and-drop card */}
      <div
        className={`glass-card${dragActive ? " drag-active" : ""}`}
        style={{
          width: "100%",
          border: dragActive ? "2.6px dashed var(--primary, #2563eb)" : "1.4px solid var(--glass-border)",
          transition: "box-shadow .32s, border .28s",
          boxShadow: dragActive
            ? "0 10px 26px #2563eb22, 0 1.5px 7px #fbbf2430"
            : "0 8px 24px #18234510",
          background: dragActive ? "linear-gradient(115deg, var(--glass-bg), #e6edf6bb 80%)" : "var(--glass-bg, #fff4)",
          cursor: "pointer",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          userSelect: "none"
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        aria-label="Drag and drop your contract text file"
        role="button"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          tabIndex={-1}
          style={{ display: "none" }}
          onChange={onFileChange}
        />
        <div style={{
          fontSize: 27,
          color: "var(--kavia-orange, #E87A41)",
          marginTop: 6,
          marginBottom: 2,
          opacity: dragActive ? 1 : 0.86,
          transition: "opacity .22s"
        }}>
          {dragActive ? "📂" : "📄"}
        </div>
        <div style={{
          fontWeight: 600,
          fontSize: 15.3,
          color: dragActive ? "var(--primary,#2563eb)" : "var(--text-color,#222)",
          marginBottom: 4
        }}>
          {dragActive
            ? "Drop .txt contract here"
            : "Click or drag .txt file to upload"}
        </div>
        <div style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          marginBottom: dragActive ? 0 : 5
        }}>
          .txt only &bull; Max 64 KB &bull; Paste below also supported
        </div>
        {uploadError && (
          <div style={{
            color: "#B82727",
            background: "#fbeef2",
            marginTop: 2,
            padding: "6px 14px",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500
          }}>
            {uploadError}
          </div>
        )}
      </div>
      {/* Code/paste area */}
      <div
        className="glass-card"
        style={{
          width: "100%",
          margin: "0 auto",
          minHeight: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          position: "relative",
        }}
      >
        <label
          htmlFor={pasteAreaId.current}
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--primary,#2563eb)",
            marginBottom: 2
          }}
        >
          Or paste contract text below (Ctrl+V, max 8000 chars)
        </label>
        <div
          id={pasteAreaId.current}
          role="textbox"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          aria-label="Paste contract text"
          tabIndex={0}
          style={{
            fontFamily: "Menlo,Monaco,Consolas,monospace",
            fontSize: 15,
            minHeight: 97,
            maxHeight: 192,
            background: "rgba(255,255,255,0.11)",
            color: "var(--text-color)",
            padding: "14px 13px 14px 13px",
            borderRadius: 9,
            border: "1.1px solid var(--border-color,#ececec)",
            outline: "none",
            marginBottom: 6,
            marginTop: 1,
            overflowY: "auto",
            boxShadow: "0 2.5px 10px #E87A4122",
            userSelect: "text",
            transition: "background 0.18s",
            caretColor: "var(--primary,#2563eb)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
          }}
          onPaste={handlePaste}
          onInput={e => {
            let val = e.currentTarget.innerText || "";
            if (val.length > 8000) val = val.slice(0, 8000);
            setContractText(val);
          }}
          onKeyDown={preventSubmitOnEnter}
          dangerouslySetInnerHTML={{
            __html: highlightLegal(contractText)
          }}
          aria-multiline="true"
        />
        {/* Syntax "legend" */}
        <div style={{
          fontSize: 12.6,
          color: "var(--primary,#2563eb)",
          marginTop: 6
        }}>
          <span className="highlight-keyword" style={{
            background: "rgba(250,187,36,0.24)",
            color: "var(--kavia-orange,#E87A41)",
            padding: "1.2px 7px",
            borderRadius: 4,
            fontWeight: 700,
            marginRight: 3
          }}>Keywords</span>
          flagged for review: termination, liability, indemnity, etc.
        </div>
        <button
          className="btn"
          style={{
            position: "absolute",
            right: 13,
            bottom: 11,
            fontSize: 12.6,
            padding: "3px 13px",
            background: "rgba(232,122,65,0.13)",
            color: "var(--kavia-orange, #E87A41)",
            borderRadius: 7,
            border: "none"
          }}
          onClick={clearContract}
          type="button"
          aria-label="Clear contract input"
          title="Clear contract"
        >Clear</button>
      </div>
      {/* Trust + upload tips panel */}
      <div
        className="glass-card"
        style={{
          width: "100%",
          margin: "0 auto",
          background: "linear-gradient(111deg, var(--glass-bg), #fbbf2415 103%)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          fontSize: 13.3,
          color: "var(--text-color)",
          padding: "16px 19px",
        }}
      >
        <div style={{
          fontWeight: 600,
          color: "var(--primary, #2563eb)",
          marginBottom: 3
        }}>
          <span role="img" aria-label="info" style={{ marginRight: 4 }}>📢</span>
          Upload Tips & Trust Info
        </div>
        <ul style={{margin:0,paddingLeft:19,listStyle:"circle"}}>
          {TRUST_TIPS.map((tip, i) => (
            <li key={i} style={{
              marginBottom: 2,
              color: i === 0
                ? "var(--primary,#2563eb)"
                : i === 1
                ? "var(--kavia-orange,#E87A41)"
                : "var(--text-secondary,#778)"
            }}>{tip}</li>
          ))}
        </ul>
      </div>
      {/* Navigation & Feedback */}
      <div style={{
        display: "flex",
        gap: 13,
        marginTop: 7,
        flexWrap:"wrap",
        justifyContent: "center",
        width: "100%"
      }}>
        <button className="btn" onClick={goToPrevStep}>Back</button>
        <button
          className="btn btn-large"
          onClick={contractText ? handleAnalyze : handleAnalyze /* default demo */}
          style={{
            fontWeight: 700,
            minWidth: 111,
            cursor: "pointer",
            marginLeft: 2,
            background: "linear-gradient(87deg,var(--primary,#2563eb),var(--accent,#fbbf24))"
          }}
        >
          Continue
        </button>
        <button
          className="btn"
          style={{ marginLeft: 3 }}
          onClick={() => goToNextStep({ contractUploaded: false })}
          title="Continue without uploading contract"
        >
          Skip
        </button>
      </div>
      {/* Animate feedback/analysis result */}
      {analysis && (
        <div
          className="glass-card"
          style={{
            width: "100%",
            margin: "17px auto 0 auto",
            background: "rgba(37,99,235,0.06)",
            borderLeft: "7px solid var(--accent,#fbbf24)",
            fontSize: 15,
            color: "var(--text-color,#112)",
            boxShadow: "0 7px 14px #e87a4125"
          }}
        >
          <div style={{fontWeight:700,marginBottom:2}}>
            <span role="img" aria-label="analyze" style={{marginRight:6}}>🧠</span>
            Contract Risk Analysis (Stub)
          </div>
          <div>
            <b>Risk Score:</b> <span style={{color:"#e87a41"}}>{analysis.riskScore}</span>
          </div>
          <div>
            <b>Red Flags:</b>
            <ul style={{marginBottom:2,paddingLeft:18}}>
              {analysis.redFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
          <div>
            <b>Recommendations:</b>
            <ul style={{marginBottom:2,paddingLeft:18}}>
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Inline CSS for highlight keywords */}
      <style>
        {`
          .highlight-keyword {
            background: rgba(250,187,36,0.14);
            color: var(--kavia-orange,#e87a41);
            font-weight: bold;
            border-radius: 3.5px;
            padding: 0 3px;
            transition: background .13s;
          }
          .step-contractupload.anim-upload {
            animation: upload-fadein 0.67s cubic-bezier(.48,0,.58,1) both;
          }
          @keyframes upload-fadein {
            0% {opacity:0; transform: translateY(34px) scale(.95);}
            77%{opacity:1; transform: translateY(-4px) scale(1.01);}
            100%{opacity:1; transform: translateY(0) scale(1);}
          }
          .glass-card.drag-active {
            background: linear-gradient(111deg, #e3e5ff 39%, var(--glass-bg) 100%);
            box-shadow: 0 12px 32px #2563eb44, 0 1.5px 7px #fbbf2455;
          }
          @media (max-width: 600px) {
            .step-contractupload { padding: 0 1vw; }
            .glass-card { padding: 1.25rem 0.65rem; }
          }
          @media (max-width: 399px) {
            .glass-card { padding: 0.77rem 0.20rem; font-size: 0.97rem;}
            .step-contractupload h2 { font-size:1.19rem;}
          }
        `}
      </style>
    </div>
  );
}

export default StepContractUpload;
