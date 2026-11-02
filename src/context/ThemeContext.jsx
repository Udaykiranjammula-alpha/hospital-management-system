import React, { createContext, useContext, useState, useEffect } from 'react';
import { playSound } from '../data/mockData';

const ThemeContext = createContext();

export const WALLPAPER_MODES = [
    { id: 'appleFluid', name: ' Apple Fluid Mesh', icon: 'fa-apple-whole' },
    { id: 'aurora', name: '✨ VisionOS Aurora', icon: 'fa-wind' },
    { id: 'synapse', name: '🧬 Bio-Neural Float', icon: 'fa-brain' },
    { id: 'ecg', name: '💓 Vital Harmonic Flow', icon: 'fa-heartbeat' },
    { id: 'minimal', name: '💎 Studio Glass Flow', icon: 'fa-gem' }
];

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('hms_theme') || 'dark');
    const [wallpaperMode, setWallpaperMode] = useState(() => localStorage.getItem('hms_wallpaper_mode') || 'appleFluid');
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('hms_sound') !== 'muted');
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('hms_theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('hms_wallpaper_mode', wallpaperMode);
    }, [wallpaperMode]);

    useEffect(() => {
        localStorage.setItem('hms_sound', soundEnabled ? 'enabled' : 'muted');
    }, [soundEnabled]);

    const toggleTheme = () => {
        playSound('click');
        setTheme(prev => (prev === 'frost-light' ? 'dark' : 'frost-light'));
    };

    const cycleWallpaper = () => {
        playSound('click');
        const idx = WALLPAPER_MODES.findIndex(m => m.id === wallpaperMode);
        const next = WALLPAPER_MODES[(idx + 1) % WALLPAPER_MODES.length];
        setWallpaperMode(next.id);
        showToast(`Live Wallpaper: ${next.name}`, 'info');
    };

    const toggleSound = () => {
        setSoundEnabled(prev => {
            const next = !prev;
            if (next) playSound('click');
            return next;
        });
    };

    const showToast = (message, type = 'info') => {
        if (type === 'success') playSound('success');
        else if (type === 'error') playSound('error');

        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3400);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme,
            wallpaperMode,
            setWallpaperMode,
            cycleWallpaper,
            soundEnabled,
            toggleSound,
            toasts,
            showToast,
            removeToast
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
