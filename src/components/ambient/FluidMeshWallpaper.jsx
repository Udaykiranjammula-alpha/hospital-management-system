import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function FluidMeshWallpaper() {
    const canvasRef = useRef(null);
    const { wallpaperMode } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId = null;
        let time = 0;

        const pointer = {
            x: -1000,
            y: -1000,
            isDown: false,
            trail: []
        };

        const handlePointerMove = (e) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            if (pointer.trail.length < 18) {
                pointer.trail.push({ x: e.clientX, y: e.clientY, alpha: 0.8, size: pointer.isDown ? 14 : 8 });
            }
        };

        const handlePointerDown = (e) => {
            pointer.isDown = true;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
        };

        const handlePointerUp = () => {
            pointer.isDown = false;
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerdown', handlePointerDown, { passive: true });
        window.addEventListener('pointerup', handlePointerUp, { passive: true });

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', resize);

        const render = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);
            time += 0.007;

            const isDark = document.body.getAttribute('data-theme') !== 'frost-light';

            const orbs = isDark ? [
                {
                    x: w * 0.22 + Math.sin(time * 1.1) * 120,
                    y: h * 0.28 + Math.cos(time * 0.8) * 90,
                    r: Math.min(w, h) * 0.44,
                    colorStart: 'rgba(10, 132, 255, 0.22)',
                    colorEnd: 'rgba(10, 132, 255, 0)'
                },
                {
                    x: w * 0.78 + Math.cos(time * 0.9) * 110,
                    y: h * 0.32 + Math.sin(time * 1.2) * 100,
                    r: Math.min(w, h) * 0.46,
                    colorStart: 'rgba(94, 92, 230, 0.20)',
                    colorEnd: 'rgba(94, 92, 230, 0)'
                },
                {
                    x: w * 0.52 + Math.sin(time * 0.75 + 1.5) * 130,
                    y: h * 0.74 + Math.cos(time * 1.05 + 1) * 85,
                    r: Math.min(w, h) * 0.48,
                    colorStart: 'rgba(191, 90, 242, 0.16)',
                    colorEnd: 'rgba(191, 90, 242, 0)'
                },
                {
                    x: w * 0.85 + Math.sin(time * 1.3 + 3) * 80,
                    y: h * 0.82 + Math.sin(time * 0.7) * 70,
                    r: Math.min(w, h) * 0.36,
                    colorStart: 'rgba(48, 209, 88, 0.10)',
                    colorEnd: 'rgba(48, 209, 88, 0)'
                }
            ] : [
                {
                    x: w * 0.25 + Math.sin(time * 1.1) * 100,
                    y: h * 0.30 + Math.cos(time * 0.8) * 80,
                    r: Math.min(w, h) * 0.45,
                    colorStart: 'rgba(0, 113, 227, 0.14)',
                    colorEnd: 'rgba(0, 113, 227, 0)'
                },
                {
                    x: w * 0.75 + Math.cos(time * 0.9) * 90,
                    y: h * 0.35 + Math.sin(time * 1.2) * 90,
                    r: Math.min(w, h) * 0.44,
                    colorStart: 'rgba(88, 86, 214, 0.11)',
                    colorEnd: 'rgba(88, 86, 214, 0)'
                },
                {
                    x: w * 0.50 + Math.sin(time * 0.75 + 1.5) * 110,
                    y: h * 0.75 + Math.cos(time * 1.05 + 1) * 75,
                    r: Math.min(w, h) * 0.46,
                    colorStart: 'rgba(175, 82, 222, 0.08)',
                    colorEnd: 'rgba(175, 82, 222, 0)'
                }
            ];

            const hasPointer = (pointer.x > -500 && pointer.y > -500);

            for (let i = 0; i < orbs.length; i++) {
                const orb = orbs[i];
                let finalX = orb.x;
                let finalY = orb.y;

                if (hasPointer) {
                    const dx = pointer.x - orb.x;
                    const dy = pointer.y - orb.y;
                    const dist = Math.hypot(dx, dy);
                    const maxDist = orb.r * 1.2;
                    if (dist < maxDist && dist > 1) {
                        const norm = (maxDist - dist) / maxDist;
                        const pullFactor = pointer.isDown ? 0.22 : 0.09;
                        finalX += (dx / dist) * norm * orb.r * pullFactor;
                        finalY += (dy / dist) * norm * orb.r * pullFactor;
                    }
                }

                const grad = ctx.createRadialGradient(finalX, finalY, orb.r * 0.04, finalX, finalY, orb.r);
                grad.addColorStop(0, orb.colorStart);
                grad.addColorStop(0.45, orb.colorStart);
                grad.addColorStop(1, orb.colorEnd);

                ctx.beginPath();
                ctx.arc(finalX, finalY, orb.r, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            // Draw interactive touch trail
            for (let i = pointer.trail.length - 1; i >= 0; i--) {
                const pt = pointer.trail[i];
                pt.alpha -= 0.04;
                pt.size *= 0.95;
                if (pt.alpha <= 0) {
                    pointer.trail.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? 'rgba(10, 132, 255, 0.5)' : 'rgba(0, 113, 227, 0.4)';
                ctx.globalAlpha = pt.alpha;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('resize', resize);
        };
    }, [wallpaperMode]);

    return (
        <div className="ambient-background">
            <canvas ref={canvasRef} id="liveWallpaperCanvas" />
            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>
            <div className="ambient-orb orb-3"></div>
            <div className="ambient-grid"></div>
        </div>
    );
}
