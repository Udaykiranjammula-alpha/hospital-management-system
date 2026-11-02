import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ onToggleSidebar }) {
    const { currentUser, switchRole } = useAuth();
    const { theme, toggleTheme, soundEnabled, toggleSound, cycleWallpaper } = useTheme();
    const [timeStr, setTimeStr] = useState('--:--:--');
    const [dateStr, setDateStr] = useState('---');
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTimeStr(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }));
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    const roleTitles = {
        Admin: 'Executive Operations Dashboard',
        Doctor: `Clinical Cockpit • ${currentUser.department}`,
        Receptionist: 'Front Desk & Patient Admissions',
        Pharmacist: 'Automated Pharmacy Dispensary',
        LabTechnician: 'Pathology & Diagnostic Laboratory'
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="btn-icon sidebar-toggle" onClick={onToggleSidebar} title="Toggle Sidebar">
                    <i className="fas fa-bars"></i>
                </button>
                <div>
                    <h1>{roleTitles[currentUser.role] || 'MediCare Operations'}</h1>
                    <span>MediCare Super Specialty Health System • {currentUser.role} View</span>
                </div>
            </div>

            <div className="header-right">
                {/* Spotlight Search Pill */}
                <div className="header-search-pill" title="Universal Search & Command Palette (Ctrl + K)">
                    <i className="fas fa-search" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}></i>
                    <span>Search System</span>
                    <kbd>Ctrl K</kbd>
                </div>

                {/* Live Status Pill */}
                <div className="live-emergency-ticker">
                    <i className="fas fa-heartbeat"></i>
                    <span>EMERGENCY: 100% OPERATIONAL</span>
                </div>

                {/* Clock Widget */}
                <div className="live-clock-widget">
                    <span className="clock-dot"></span>
                    <span className="clock-time">{timeStr}</span>
                    <span style={{ opacity: 0.4 }}>|</span>
                    <span className="clock-date">{dateStr}</span>
                </div>

                {/* Controls */}
                <button
                    className="btn-icon sound-toggle"
                    onClick={toggleSound}
                    title={soundEnabled ? 'Mute Audio Feedback' : 'Unmute Audio Feedback'}
                >
                    <i className={`fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
                </button>

                <button
                    className="btn-icon wallpaper-toggle"
                    onClick={cycleWallpaper}
                    title="Switch Interactive Live Wallpaper"
                >
                    <i className="fas fa-magic"></i>
                </button>

                <button
                    className="btn-icon theme-toggle"
                    onClick={toggleTheme}
                    title="Switch Glass Theme"
                >
                    <i className={`fas ${theme === 'frost-light' ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>

                {/* User Profile Capsule with Quick Switcher */}
                <div
                    className="user-info"
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                    <img src={currentUser.avatar} alt={currentUser.displayName} className="avatar" />
                    <div>
                        <strong style={{ fontSize: '0.86rem', display: 'block', lineHeight: 1.2 }}>{currentUser.displayName}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser.role}</span>
                    </div>

                    {userMenuOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                marginTop: '10px',
                                background: 'rgba(22, 22, 26, 0.95)',
                                backdropFilter: 'blur(30px)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '16px',
                                padding: '12px',
                                minWidth: '220px',
                                zIndex: 99999,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', padding: '6px 10px', fontWeight: 700 }}>
                                Quick Role Switch (Evaluation)
                            </div>
                            {['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'LabTechnician'].map((r) => (
                                <button
                                    key={r}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        background: currentUser.role === r ? 'rgba(10,132,255,0.2)' : 'transparent',
                                        border: 'none',
                                        color: currentUser.role === r ? '#0a84ff' : '#ffffff',
                                        padding: '8px 10px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.82rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                    onClick={() => {
                                        switchRole(r);
                                        setUserMenuOpen(false);
                                    }}
                                >
                                    <span>{r}</span>
                                    {currentUser.role === r && <i className="fas fa-check"></i>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
