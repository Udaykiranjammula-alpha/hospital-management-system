import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import FluidMeshWallpaper from '../ambient/FluidMeshWallpaper';
import WallpaperHudPill from '../ambient/WallpaperHudPill';
import AIChatbot from '../assistant/AIChatbot';
import ToastContainer from '../common/ToastContainer';
import AccessDeniedModal from '../common/AccessDeniedModal';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser, roleConfig } = useAuth();
    const location = useLocation();

    // Route Guard: verify if path is in allowedRoutes
    const currentPath = location.pathname.toLowerCase();
    const isAllowed = roleConfig.allowedRoutes.some(r => currentPath === r.toLowerCase() || currentPath.startsWith(r.toLowerCase() + '/'));

    if (!isAllowed && currentPath !== '/' && currentPath !== '/dashboard') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <FluidMeshWallpaper />
            <div className="app-container">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="main-content">
                    <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
                    <div className="content-wrapper">
                        <Outlet />
                    </div>
                </main>
            </div>
            <WallpaperHudPill />
            <AIChatbot />
            <ToastContainer />
            <AccessDeniedModal />
        </>
    );
}
