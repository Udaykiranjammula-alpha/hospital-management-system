import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * ReactBadge - Apple-styled "Powered by React 18 & Hooks" HUD Component
 * Mounts cleanly in Header, Dashboard, or Navbar
 * Demonstrates: useState, useEffect, useCallback, useRef
 */
export default function ReactBadge({ initialExpanded = false }) {
  const [isOpen, setIsOpen] = useState(initialExpanded);
  const [uptime, setUptime] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [pulseActive, setPulseActive] = useState(false);
  const popoverRef = useRef(null);
  const timerRef = useRef(null);

  // Hook 1: useEffect for live uptime counter
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Hook 2: useCallback for handling outside clicks to dismiss popover
  const handleClickOutside = useCallback((e) => {
    if (popoverRef.current && !popoverRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  // Hook 3: useCallback for triggering synthetic state re-render test
  const triggerHookTest = useCallback(() => {
    setPulseActive(true);
    setRenderCount(prev => prev + 1);
    setTimeout(() => setPulseActive(false), 800);
  }, []);

  const formatUptime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div 
      ref={popoverRef}
      className="medicare-react-badge-wrapper"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        zIndex: 100
      }}
    >
      {/* Sleek Apple Frosted Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="React 18 Engine Status"
        title="Powered by React 18.3 & Hooks • Click for Architecture Details"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: isOpen 
            ? 'linear-gradient(135deg, rgba(10, 132, 255, 0.25) 0%, rgba(94, 92, 230, 0.25) 100%)' 
            : 'rgba(28, 28, 30, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isOpen 
            ? '1px solid rgba(10, 132, 255, 0.6)' 
            : '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '9999px',
          color: '#ffffff',
          fontSize: '0.78rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: isOpen 
            ? '0 0 20px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
            : '0 4px 14px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {/* Animated React Atom SVG */}
        <span 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            animation: 'reactSpin 10s linear infinite',
            filter: 'drop-shadow(0 0 6px #00d8ff)'
          }}
        >
          <svg viewBox="-11.5 -10.23174 23 20.46348" width="100%" height="100%">
            <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
            <g stroke="#00d8ff" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </span>

        {/* Text and Pulse Indicator */}
        <span style={{ letterSpacing: '0.2px' }}>
          React <span style={{ color: '#00d8ff', fontWeight: 700 }}>18</span>
        </span>

        {/* Green Online Pulse Beacon */}
        <span 
          style={{
            position: 'relative',
            display: 'inline-flex',
            width: '7px',
            height: '7px'
          }}
        >
          <span 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#30d158',
              opacity: 0.75,
              animation: 'reactPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} 
          />
          <span 
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#30d158',
              boxShadow: '0 0 8px #30d158'
            }} 
          />
        </span>

        <span 
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            color: 'rgba(255, 255, 255, 0.65)',
            marginLeft: '2px'
          }}
        >
          HOOKS
        </span>
      </button>

      {/* Floating Apple Glass Popover / Diagnostics Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '320px',
            background: 'rgba(18, 18, 22, 0.92)',
            backdropFilter: 'blur(28px) saturate(190%)',
            WebkitBackdropFilter: 'blur(28px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '18px',
            padding: '18px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(10, 132, 255, 0.15)',
            color: '#f5f5f7',
            animation: 'reactFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'top right'
          }}
        >
          {/* Popover Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(0, 216, 255, 0.12)',
                  border: '1px solid rgba(0, 216, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fab fa-react" style={{ color: '#00d8ff', fontSize: '15px' }}></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, letterSpacing: '-0.2px' }}>
                  React 18 Architecture
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#98989d' }}>Concurrent Fiber Engine</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                color: '#98989d',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Diagnostics Metrics Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '14px'
            }}
          >
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '9px 12px'
              }}
            >
              <span style={{ fontSize: '0.66rem', color: '#98989d', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Reconciler
              </span>
              <strong style={{ fontSize: '0.82rem', color: '#00d8ff', fontFamily: "'JetBrains Mono', monospace" }}>
                React Fiber
              </strong>
            </div>

            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '9px 12px'
              }}
            >
              <span style={{ fontSize: '0.66rem', color: '#98989d', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Hooks Engine
              </span>
              <strong style={{ fontSize: '0.82rem', color: '#30d158', fontFamily: "'JetBrains Mono', monospace" }}>
                Active (4 Types)
              </strong>
            </div>

            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '9px 12px'
              }}
            >
              <span style={{ fontSize: '0.66rem', color: '#98989d', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Uptime
              </span>
              <strong style={{ fontSize: '0.82rem', color: '#f5f5f7', fontFamily: "'JetBrains Mono', monospace" }}>
                {formatUptime(uptime)}
              </strong>
            </div>

            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '9px 12px'
              }}
            >
              <span style={{ fontSize: '0.66rem', color: '#98989d', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                State Dispatches
              </span>
              <strong style={{ 
                fontSize: '0.82rem', 
                color: pulseActive ? '#ff9f0a' : '#f5f5f7', 
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'color 0.2s'
              }}>
                #{renderCount}
              </strong>
            </div>
          </div>

          {/* Hooks Feature List */}
          <div 
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#98989d', marginBottom: '6px', fontWeight: 600 }}>
              Production React 18 Features:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['useState', 'useEffect', 'useCallback', 'useRef', 'createRoot', 'Automatic Batching'].map((tag) => (
                <span 
                  key={tag}
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    background: 'rgba(10, 132, 255, 0.12)',
                    border: '1px solid rgba(10, 132, 255, 0.25)',
                    color: '#38bdf8',
                    padding: '2px 7px',
                    borderRadius: '6px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Re-render Dispatch Button */}
          <button
            onClick={triggerHookTest}
            style={{
              width: '100%',
              padding: '9px 12px',
              background: pulseActive 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #0071e3 0%, #0a84ff 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(10, 132, 255, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <i className={`fas ${pulseActive ? 'fa-check' : 'fa-bolt'}`}></i>
            {pulseActive ? 'State Hook Updated!' : 'Test useState Dispatch'}
          </button>
        </div>
      )}

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes reactSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reactPing {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes reactFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
