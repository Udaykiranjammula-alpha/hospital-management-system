import React from 'react';
import { useTheme, WALLPAPER_MODES } from '../../context/ThemeContext';

export default function WallpaperHudPill() {
    const { wallpaperMode, cycleWallpaper } = useTheme();
    const currentMode = WALLPAPER_MODES.find(m => m.id === wallpaperMode) || WALLPAPER_MODES[0];

    return (
        <div
            className="wallpaper-hud-pill"
            id="wallpaperPill"
            onClick={cycleWallpaper}
            title="Touch / Click to switch Live Interactive Wallpaper Mode"
        >
            <span className="pulse-dot"></span>
            <span id="wallpaperName">{currentMode.name}</span>
            <i className={`fas ${currentMode.icon}`} style={{ color: 'var(--primary)', fontSize: '0.8rem' }}></i>
        </div>
    );
}
