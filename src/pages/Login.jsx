import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FluidMeshWallpaper from '../components/ambient/FluidMeshWallpaper';
import WallpaperHudPill from '../components/ambient/WallpaperHudPill';
import { playSound } from '../data/mockData';

export default function Login() {
    const [category, setCategory] = useState('admin');
    const [staffRole, setStaffRole] = useState('receptionist');
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleCategorySelect = (cat) => {
        playSound('click');
        setCategory(cat);
        setError('');
        if (cat === 'admin') {
            setUsername('admin');
        } else if (cat === 'doctor') {
            setUsername('doctor');
        } else if (cat === 'staff') {
            setUsername(staffRole);
        }
    };

    const handleStaffSubSelect = (sub) => {
        playSound('click');
        setStaffRole(sub);
        setUsername(sub);
        setError('');
    };

    const handleQuickLogin = (cat, u, role, dept, docId) => {
        playSound('click');
        setCategory(cat);
        setUsername(u);
        setPassword('password123');
        login(cat.toUpperCase(), u, role, docId, dept);
        navigate('/dashboard');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter both username and password.');
            playSound('error');
            return;
        }

        let finalRole = 'Admin';
        let dept = 'Hospital Administration';
        let docId = '';

        if (category === 'doctor') {
            finalRole = 'Doctor';
            dept = 'Cardiology';
            docId = 'D001';
        } else if (category === 'staff') {
            if (staffRole === 'pharmacy') {
                finalRole = 'Pharmacist';
                dept = 'Central Pharmacy';
            } else if (staffRole === 'lab') {
                finalRole = 'LabTechnician';
                dept = 'Pathology Diagnostics';
            } else {
                finalRole = 'Receptionist';
                dept = 'Front Desk & Admissions';
            }
        }

        login(category.toUpperCase(), username, finalRole, docId, dept);
        navigate('/dashboard');
    };

    return (
        <div className="login-page">
            <FluidMeshWallpaper />

            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo-ring">
                        <i className="fas fa-heart-pulse"></i>
                    </div>
                    <h2>MediCare HMS</h2>
                    <p>Next-Gen Glassmorphic EHR Portal • React Architecture</p>
                </div>

                {/* 3-Tier Login Category Selector */}
                <div className="login-category-selector">
                    <button
                        type="button"
                        className={`login-cat-btn ${category === 'admin' ? 'active' : ''}`}
                        onClick={() => handleCategorySelect('admin')}
                    >
                        <i className="fas fa-shield-halved"></i>
                        <span>Admin</span>
                    </button>
                    <button
                        type="button"
                        className={`login-cat-btn ${category === 'doctor' ? 'active' : ''}`}
                        onClick={() => handleCategorySelect('doctor')}
                    >
                        <i className="fas fa-stethoscope"></i>
                        <span>Doctor</span>
                    </button>
                    <button
                        type="button"
                        className={`login-cat-btn ${category === 'staff' ? 'active' : ''}`}
                        onClick={() => handleCategorySelect('staff')}
                    >
                        <i className="fas fa-users-gear"></i>
                        <span>Staff</span>
                    </button>
                </div>

                {/* Staff Sub-Role Selector */}
                {category === 'staff' && (
                    <div className="staff-sub-selector">
                        <div className="sub-btn-group">
                            <button
                                type="button"
                                className={`staff-sub-btn ${staffRole === 'receptionist' ? 'active' : ''}`}
                                onClick={() => handleStaffSubSelect('receptionist')}
                            >
                                <i className="fas fa-concierge-bell"></i> Reception
                            </button>
                            <button
                                type="button"
                                className={`staff-sub-btn ${staffRole === 'pharmacy' ? 'active' : ''}`}
                                onClick={() => handleStaffSubSelect('pharmacy')}
                            >
                                <i className="fas fa-pills"></i> Pharmacy
                            </button>
                            <button
                                type="button"
                                className={`staff-sub-btn ${staffRole === 'lab' ? 'active' : ''}`}
                                onClick={() => handleStaffSubSelect('lab')}
                            >
                                <i className="fas fa-flask"></i> Lab Tech
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label><i className="fas fa-user-circle"></i> Username or Operator ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter operator username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><i className="fas fa-lock"></i> Master Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ff453a', fontSize: '0.84rem', margin: '8px 0', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary login-btn">
                        <span>Authenticate & Enter System</span>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </form>

                {/* Quick Persona Demo Switcher */}
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
                        1-Click Faculty Demo Personas
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '6px 8px', fontSize: '0.76rem' }}
                            onClick={() => handleQuickLogin('admin', 'admin', 'Admin', 'Hospital Administration', '')}
                        >
                            👑 Admin
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '6px 8px', fontSize: '0.76rem' }}
                            onClick={() => handleQuickLogin('doctor', 'doctor', 'Doctor', 'Cardiology', 'D001')}
                        >
                            🩺 Doctor
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '6px 8px', fontSize: '0.76rem' }}
                            onClick={() => handleQuickLogin('staff', 'receptionist', 'Receptionist', 'Front Desk', '')}
                        >
                            🛎️ Reception
                        </button>
                    </div>
                </div>
            </div>

            <WallpaperHudPill />
        </div>
    );
}
