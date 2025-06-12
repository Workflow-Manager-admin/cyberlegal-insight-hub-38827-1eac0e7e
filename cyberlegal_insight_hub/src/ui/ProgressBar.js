/**
 * ProgressBar.js
 *
 * PUBLIC_INTERFACE
 * Simple shared UI component for indicating step progression in the flow.
 * Can be themed and expanded with animations or distinct styles.
 */

import React from 'react';

// PUBLIC_INTERFACE
function ProgressBar({ current, total }) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="progress-bar-container" style={{ margin: '16px 0', width: '100%' }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        height: '10px',
        borderRadius: '5px',
        width: '100%',
        overflow: 'hidden'
      }}>
        <div
          className="progress-bar-filled"
          style={{
            background: 'var(--base-light, #00ffff)',
            width: `${percent}%`,
            height: '100%',
            borderRadius: '5px',
            transition: 'width 0.4s cubic-bezier(.42,0,.58,1)'
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, textAlign: 'right' }}>
        Step {current + 1} of {total}
      </div>
    </div>
  );
}

export { ProgressBar };
