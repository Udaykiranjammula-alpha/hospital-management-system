import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ToastContainer() {
    const { toasts, removeToast } = useTheme();

    if (!toasts.length) return null;

    return (
        <div id="toast-container" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 999999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`toast ${t.type}`}
                    style={{
                        background: 'rgba(22, 22, 26, 0.88)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '14px',
                        padding: '12px 18px',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                    }}
                    onClick={() => removeToast(t.id)}
                >
                    <i className={`fas ${t.type === 'success' ? 'fa-check-circle text-success' : t.type === 'error' ? 'fa-exclamation-circle text-danger' : 'fa-info-circle text-primary'}`}></i>
                    <span>{t.message}</span>
                </div>
            ))}
        </div>
    );
}
