/**
 * StepThankYou.js
 *
 * PUBLIC_INTERFACE
 * Final step - thank you/celebration, retake and share CTAs with confetti animation.
 * Glassmorphism/neumorphism, mobile responsive.
 */

import React, { useEffect, useRef } from 'react';

// Light, no-dependency confetti effect using Canvas API for this context.
function ConfettiCanvas() {
  const canvasRef = useRef();

  useEffect(() => {
    const colors = [
      'var(--primary, #2563eb)', 'var(--accent, #fbbf24)',
      '#E87A41', '#8ac926', '#ff595e', '#1982c4'
    ];
    let animationFrameId;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let W = c.width = window.innerWidth;
    let H = c.height = Math.max(window.innerHeight * 0.36, 340);

    // Responsive canvas resize
    const handleResize = () => {
      W = c.width = window.innerWidth;
      H = c.height = Math.max(window.innerHeight * 0.36, 340);
    };
    window.addEventListener('resize', handleResize);

    const confettiCount = Math.floor(W / 19) + 38;
    const confetti = [];
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * W,
        y: Math.random() * -H / 2,
        r: 5 + Math.random() * 7,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngle: 0,
        tiltAngleIncremental: (Math.random() * 0.08) + 0.02
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      confetti.forEach(function(cPiece, i) {
        ctx.beginPath();
        ctx.lineWidth = cPiece.r;
        ctx.strokeStyle = cPiece.color;
        ctx.moveTo(cPiece.x + cPiece.tilt + cPiece.r / 2, cPiece.y);
        ctx.lineTo(cPiece.x + cPiece.tilt, cPiece.y + cPiece.r);
        ctx.stroke();
      });
      update();
    }

    function update() {
      confetti.forEach(function(cPiece, i) {
        cPiece.y += (2.2 + Math.cos(cPiece.d)) * 1.08;
        cPiece.x += Math.sin(0.01 * cPiece.d);
        cPiece.tiltAngle += cPiece.tiltAngleIncremental;
        cPiece.tilt = Math.sin(cPiece.tiltAngle) * 15;
        // Respawn confetti at top after falling
        if (cPiece.y > H + 18) {
          cPiece.y = -12;
          cPiece.x = Math.random() * W;
          cPiece.tilt = Math.random() * 10 - 5;
        }
      });
    }

    function animate() {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  // Canvas is visually hidden from screen readers
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '35vh',
        maxHeight: 380,
        zIndex: 0,
        opacity: .92,
      }}
    />
  );
}

// PUBLIC_INTERFACE
function StepThankYou() {
  // Share helper
  function handleShare() {
    // Try Web Share API, fallback to clipboard
    const shareData = {
      title: "My CyberLegal Insight Results",
      text: "Check out my CyberLegal Insight Report! Try your own risk assessment: https://cyberlegal.kavia.ai",
      url: window?.location?.href || "https://cyberlegal.kavia.ai"
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied! Share it anywhere.");
    }
  }

  // Email subscribe handler stub
  function handleSubscribe(e) {
    e.preventDefault();
    const email = e.target.elements?.email?.value;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Enter a valid email!");
      return;
    }
    // Normally submit to backend (stubbed)
    alert("Thank you for subscribing!");
    e.target.reset();
  }

  return (
    <div
      className="step step-thankyou"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: "0px 0 28px 0",
        minHeight: '54vh',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div style={{
        position: 'absolute',
        zIndex: 0,
        left: 0,
        top: 0,
        width: '100%',
        height: '40vh',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <ConfettiCanvas />
      </div>
      <div
        className="glass-card neumorph-shadow"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '99%',
          maxWidth: 450,
          margin: '0 auto',
          marginTop: 58,
          marginBottom: 33,
          padding: '2.2rem 1.22rem 2.3rem 1.22rem',
          boxShadow: '0 8px 34px 0 rgba(19,22,34,0.16)',
          textAlign: 'center',
          background: 'var(--glass-bg, rgba(255,255,255,0.30))',
          backdropFilter: 'blur(var(--glass-blur,28px))',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 6, filter: 'drop-shadow(0 4px 16px #2563eb2a)' }}>
          🎉
        </div>
        <h2
          style={{
            margin: 0,
            marginBottom: 12,
            fontWeight: 700,
            fontSize: '2.07rem',
            letterSpacing: '-1px',
            color: 'var(--primary, #2563eb)'
          }}
        >
          Thank You!
        </h2>
        <div className="description" style={{ fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Your CyberLegal Insight Report is ready.<br />
          <span role="img" aria-label="shield" style={{ fontSize: 19, marginLeft: 2, marginRight: 3 }}>🛡️</span>
          Stay secure, informed, and ahead.
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 17 }}>
          <button
            className="btn btn-large"
            onClick={() => window.location.reload()}
            style={{ minWidth: 133, fontWeight: 600 }}
            title="Retake Assessment"
          >
            <span role="img" aria-label="retry" style={{ marginRight: 6 }}>🌀</span>
            Retake
          </button>
          <button
            className="btn btn-large"
            style={{
              background: 'linear-gradient(97deg,var(--primary,#2563eb),var(--accent,#fbbf24))',
              fontWeight: 600
            }}
            title="Share Results"
            onClick={handleShare}
          >
            <span role="img" aria-label="share" style={{ marginRight: 3 }}>🔗</span>
            Share
          </button>
        </div>

        {/* Subscribe CTA */}
        <form onSubmit={handleSubscribe} style={{
          marginTop: 11, marginBottom: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7
        }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>
            Stay updated on cyber/legal tips!
          </div>
          <div style={{
            display: 'flex', gap: 0, borderRadius: 8,
            boxShadow: '0 3.5px 7px #e87a41a4', background: 'rgba(255,255,255,0.13)'
          }}>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              style={{
                border: 'none',
                padding: '11px 12px',
                borderRadius: '8px 0 0 8px',
                fontSize: '1rem',
                outline: 'none',
                color: 'var(--text-color)',
                background: 'rgba(255,255,255,0.20)',
                minWidth: 0,
                width: 156,
                maxWidth: 198
              }}
              aria-label="Your email address"
            />
            <button
              type="submit"
              className="btn"
              style={{
                borderRadius: '0 8px 8px 0',
                fontWeight: 600,
                background: 'var(--kavia-orange, #E87A41)',
                color: '#fff',
                padding: '0 20px'
              }}
              title="Subscribe"
            >
              Subscribe
            </button>
          </div>
        </form>

        {/* Social hint for mobile */}
        <div style={{
          fontSize: 13.1,
          lineHeight: 1.38,
          color: 'var(--text-secondary,#586)',
          marginTop: 3, marginBottom: -6
        }}>
          Or share your results & inspire better digital habits 🎯
        </div>
      </div>
    </div>
  );
}

export default StepThankYou;
