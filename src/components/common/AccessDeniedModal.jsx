import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AccessDeniedModal() {
    const { accessDeniedModal, closeAccessDeniedModal, currentUser, switchRole } = useAuth();

    if (!accessDeniedModal.isOpen) return null;

    return (
        <div
            className="modal-overlay active"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '20px'
            }}
        >
            <div
                style={{
                    background: 'rgba(22,22,26,0.92)',
                    border: '1px solid rgba(255,69,58,0.45)',
                    borderRadius: '24px',
                    padding: '36px',
                    maxWidth: '480px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 40px rgba(255,69,58,0.25)'
                }}
            >
                <div
                    style={{
                        width: '72px',
                        height: '72px',
                        margin: '0 auto 18px',
                        borderRadius: '50%',
                        background: 'rgba(255,69,58,0.15)',
                        border: '2px solid #ff453a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 28px rgba(255,69,58,0.45)'
                    }}
                >
                    <i className="fas fa-shield-halved" style={{ fontSize: '32px', color: '#ff453a' }}></i>
                </div>

                <div
                    style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        background: 'rgba(255,69,58,0.18)',
                        border: '1px solid rgba(255,69,58,0.4)',
                        borderRadius: '20px',
                        color: '#ff453a',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        marginBottom: '10px'
                    }}
                >
                    <i className="fas fa-ban"></i> 403 Forbidden • Action Blocked
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.30rem', fontWeight: 700, marginBottom: '8px' }}>
                    {accessDeniedModal.title}
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '20px' }}>
                    {accessDeniedModal.message}
                </p>

                <div
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        marginBottom: '20px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        color: '#94a3b8'
                    }}
                >
                    <div>Active Persona: <strong style={{ color: '#0a84ff' }}>{currentUser.displayName}</strong></div>
                    <div style={{ marginTop: '4px' }}>Role Authority: <span className="badge badge-warning" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>{currentUser.role}</span></div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={closeAccessDeniedModal} style={{ flex: 1, padding: '12px' }}>
                        <i className="fas fa-check"></i> Understood
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            switchRole('Admin');
                            closeAccessDeniedModal();
                        }}
                        style={{ flex: 1, padding: '12px' }}
                    >
                        <i className="fas fa-user-shield"></i> Switch to Admin
                    </button>
                </div>
            </div>
        </div>
    );
}
