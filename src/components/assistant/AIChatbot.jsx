import React, { useState, useRef, useEffect } from 'react';
import { playSound } from '../../data/mockData';

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am MediCare Clinical AI Assistant. How can I help you today with patient triage, ICU telemetry, or hospital workflows?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [position, setPosition] = useState(() => {
        const sx = localStorage.getItem('hms_ai_pos_x');
        const sy = localStorage.getItem('hms_ai_pos_y');
        if (sx && sy && !isNaN(Number(sx)) && !isNaN(Number(sy))) {
            return { x: Number(sx), y: Number(sy) };
        }
        return {
            x: Math.max(12, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 220),
            y: Math.max(12, (typeof window !== 'undefined' ? window.innerHeight : 800) - 140)
        };
    });

    const dragRef = useRef({
        isDragging: false,
        justDragged: false,
        startX: 0,
        startY: 0,
        origX: 0,
        origY: 0,
        velocityX: 0,
        velocityY: 0,
        lastTime: 0
    });

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Apple Rubber-band formula
    const appleRubberband = (overshoot, dimension, constant = 0.55) => {
        return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
    };

    const clampPosition = (x, y, rubberband = false) => {
        const pad = 12;
        const w = 190;
        const h = 50;
        const minX = pad;
        const maxX = Math.max(10, window.innerWidth - w - pad);
        const minY = pad;
        const maxY = Math.max(10, window.innerHeight - h - pad);

        let fx = x;
        let fy = y;

        if (rubberband) {
            if (x < minX) fx = minX - appleRubberband(minX - x, window.innerWidth);
            else if (x > maxX) fx = maxX + appleRubberband(x - maxX, window.innerWidth);
            if (y < minY) fy = minY - appleRubberband(minY - y, window.innerHeight);
            else if (y > maxY) fy = maxY + appleRubberband(y - maxY, window.innerHeight);
        } else {
            fx = Math.max(minX, Math.min(maxX, x));
            fy = Math.max(minY, Math.min(maxY, y));
        }

        return { x: fx, y: fy };
    };

    const handlePointerDown = (e) => {
        if (e.target.closest('.ai-chatbot-window')) return;
        const state = dragRef.current;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.origX = position.x;
        state.origY = position.y;
        state.isDragging = false;
        state.lastTime = performance.now();
        state.velocityX = 0;
        state.velocityY = 0;

        const onPointerMove = (ev) => {
            const dx = ev.clientX - state.startX;
            const dy = ev.clientY - state.startY;
            if (!state.isDragging && Math.hypot(dx, dy) > 6) {
                state.isDragging = true;
            }
            if (state.isDragging) {
                const now = performance.now();
                const dt = Math.max(1, now - state.lastTime);
                state.velocityX = (ev.clientX - state.startX) / dt;
                state.velocityY = (ev.clientY - state.startY) / dt;
                state.lastTime = now;
                const pos = clampPosition(state.origX + dx, state.origY + dy, true);
                setPosition(pos);
            }
        };

        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);

            if (state.isDragging) {
                state.justDragged = true;
                setTimeout(() => { state.justDragged = false; }, 220);

                // Momentum projection
                const decel = 0.994;
                const projX = (state.velocityX * 1000) * (decel / (1 - decel)) * 0.001;
                const projY = (state.velocityY * 1000) * (decel / (1 - decel)) * 0.001;
                const targetX = position.x + Math.max(-140, Math.min(140, projX));
                const targetY = position.y + Math.max(-140, Math.min(140, projY));
                const finalPos = clampPosition(targetX, targetY, false);
                setPosition(finalPos);
                localStorage.setItem('hms_ai_pos_x', Math.round(finalPos.x));
                localStorage.setItem('hms_ai_pos_y', Math.round(finalPos.y));
            }
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    const handleTriggerClick = () => {
        if (dragRef.current.justDragged) return;
        playSound('click');
        setIsOpen(prev => !prev);
    };

    const handleSend = (textToSend) => {
        const query = (textToSend || inputValue).trim();
        if (!query) return;

        playSound('click');
        const userMsg = { sender: 'user', text: query };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        setTimeout(() => {
            playSound('success');
            let botReply = "Understood. The hospital system is synchronized. All telemetry feeds and clinical records are active.";
            const q = query.toLowerCase();

            if (q.includes('bed') || q.includes('icu') || q.includes('ventilator')) {
                botReply = "ICU Status: 18 of 24 ventilators occupied (75% load). 4 active resuscitation bays. Bed occupancy is optimal.";
            } else if (q.includes('patient') || q.includes('admission') || q.includes('registration')) {
                botReply = "Patient Pipeline: 8 registered inpatients currently tracked. Patient P001 (Rajesh Kumar) and P006 (Neha Gupta) are under continuous monitoring.";
            } else if (q.includes('er') || q.includes('emergency') || q.includes('trauma')) {
                botReply = "Trauma Status: Level-1 Resuscitation Wing is 100% OPERATIONAL. Cardiothoracic OT & Cath Lab on 5-minute standby.";
            } else if (q.includes('medicine') || q.includes('drug') || q.includes('pharmacy')) {
                botReply = "Pharmacy Alert: Augmentin 625 Duo is on Low Stock (85 units left). Clexane 40mg is at critical reorder threshold.";
            }

            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        }, 500);
    };

    const chips = ['ICU Bed Status', 'Trauma Protocol', 'Patient Records', 'Pharmacy Alerts'];

    return (
        <div
            className="ai-chatbot-container"
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 9990
            }}
            onPointerDown={handlePointerDown}
        >
            <button
                className="ai-chatbot-trigger"
                onClick={handleTriggerClick}
                title="Drag to reposition • Click to open MediCare Assistant"
            >
                <span className="ai-siri-orb"></span>
                <i className="fas fa-sparkles"></i>
                <span>Ask AI Assistant</span>
            </button>

            {isOpen && (
                <div
                    className="ai-chatbot-window"
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: '60px',
                        right: '0',
                        width: '380px',
                        height: '520px',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <div className="ai-chatbot-header">
                        <div className="ai-header-left">
                            <div className="ai-avatar">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div className="ai-header-info">
                                <h4>MediCare Assistant <span style={{ fontSize: '10px', background: 'rgba(10,132,255,0.2)', border: '1px solid #0a84ff', padding: '2px 6px', borderRadius: '10px', color: '#0a84ff' }}>v3.0 React</span></h4>
                                <span><span className="ai-online-dot"></span> Online • Clinical Triage Bot</span>
                            </div>
                        </div>
                        <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="ai-chatbot-body" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                        {messages.map((m, i) => (
                            <div key={i} className={`ai-message ${m.sender}`}>
                                <div className="ai-bubble">{m.text}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ai-quick-chips" style={{ padding: '8px 14px', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                        {chips.map((chip, idx) => (
                            <button key={idx} className="ai-chip" onClick={() => handleSend(chip)}>
                                {chip}
                            </button>
                        ))}
                    </div>

                    <div className="ai-chatbot-footer">
                        <input
                            type="text"
                            placeholder="Ask clinical question, beds, records..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="ai-send-btn" onClick={() => handleSend()}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
