import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
    const { currentUser, roleConfig, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <div className="brand-icon">
                    <i className="fas fa-hospital"></i>
                </div>
                <h2>MediCare HMS</h2>
            </div>

            <nav className="sidebar-nav">
                {roleConfig.navItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.href}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        <i className={`fas ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <a href="#logout" className="nav-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            </div>
        </aside>
    );
}
