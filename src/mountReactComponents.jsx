import React from 'react';
import ReactDOM from 'react-dom/client';
import AskAIAssistant from './components/AskAIAssistant.jsx';
import LiveTelemetryMonitor from './components/LiveTelemetryMonitor.jsx';
import ReactBadge from './components/ReactBadge.jsx';

// Maintain a registry of initialized React 18 roots to prevent duplicate createRoot calls
const activeRoots = new Map();

/**
 * mountReactWidgets - Main mounting entry point for MediCare HMS
 * Mounts React 18 components into designated DOM containers:
 * - #react-badge-mount -> ReactBadge
 * - #react-telemetry-mount -> LiveTelemetryMonitor
 * - #react-assistant-mount -> AskAIAssistant
 */
export function mountReactWidgets() {
  if (typeof document === 'undefined') return;

  const results = {
    badgeMounted: false,
    telemetryMounted: false,
    assistantMounted: false
  };

  try {
    // 1. Mount React 18 Architecture Badge
    const badgeMount = document.getElementById('react-badge-mount');
    if (badgeMount) {
      if (!activeRoots.has('react-badge-mount')) {
        const root = ReactDOM.createRoot(badgeMount);
        root.render(<ReactBadge />);
        activeRoots.set('react-badge-mount', root);
        results.badgeMounted = true;
      }
    }

    // 2. Mount Real-time Telemetry Monitor (ECG & Vitals)
    const telemetryMount = document.getElementById('react-telemetry-mount');
    if (telemetryMount) {
      if (!activeRoots.has('react-telemetry-mount')) {
        const root = ReactDOM.createRoot(telemetryMount);
        root.render(<LiveTelemetryMonitor />);
        activeRoots.set('react-telemetry-mount', root);
        results.telemetryMounted = true;
      }
    }

    // 3. Mount Ask AI Assistant (Draggable Siri Orb & Clinical Copilot)
    let assistantMount = document.getElementById('react-assistant-mount');
    if (!assistantMount) {
      // Auto-create mount container in body if not already in markup
      assistantMount = document.createElement('div');
      assistantMount.id = 'react-assistant-mount';
      document.body.appendChild(assistantMount);
    }

    if (!activeRoots.has('react-assistant-mount')) {
      const root = ReactDOM.createRoot(assistantMount);
      root.render(<AskAIAssistant />);
      activeRoots.set('react-assistant-mount', root);
      results.assistantMounted = true;
    }

    console.log(
      `%c[MediCare HMS]%c React 18.3.1 Engine & Hooks Active %c(createRoot, Fiber, Concurrent Ready)`,
      'background: #0071e3; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #38bdf8; font-weight: bold;',
      'color: #94a3b8;'
    );
  } catch (error) {
    console.error('[MediCare HMS] Error mounting React components:', error);
  }

  return results;
}

// Expose globals for window, React DevTools, and vanilla JS interoperability
if (typeof window !== 'undefined') {
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.mountReactWidgets = mountReactWidgets;
  window.AskAIAssistant = AskAIAssistant;
  window.LiveTelemetryMonitor = LiveTelemetryMonitor;
  window.ReactBadge = ReactBadge;
}

export { AskAIAssistant, LiveTelemetryMonitor, ReactBadge };
export default mountReactWidgets;
