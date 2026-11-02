import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    loadData,
    defaultPatients,
    defaultAppointments,
    defaultBills,
    defaultDoctors,
    defaultMedicines,
    defaultLabTests,
    formatCurrency,
    formatDate
} from '../data/mockData';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const flowCanvasRef = useRef(null);
    const donutCanvasRef = useRef(null);

    const patients = loadData('hms_patients', defaultPatients);
    const appointments = loadData('hms_appointments', defaultAppointments);
    const bills = loadData('hms_bills', defaultBills);
    const doctors = loadData('hms_doctors', defaultDoctors);
    const medicines = loadData('hms_medicines', defaultMedicines);
    const labTests = loadData('hms_lab_tests', defaultLabTests);

    const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.total, 0);

    // Filter appointments for Doctor role
    const scopedAppointments = currentUser.role === 'Doctor'
        ? appointments.filter(a => a.doctorId === currentUser.doctorId || a.doctorName?.includes('Priya'))
        : appointments;

    // Render Apple Health Cubic Splines
    useEffect(() => {
        const canvas = flowCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || 500;
        const h = rect.height || 220;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        const isDark = document.body.getAttribute('data-theme') !== 'frost-light';
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const inpatientData = [18, 24, 22, 28, 35, 30, 38];
        const outpatientData = [45, 62, 58, 70, 85, 52, 60];
        const maxVal = 100;

        const padLeft = 36;
        const padRight = 24;
        const padTop = 24;
        const padBottom = 32;
        const plotW = w - padLeft - padRight;
        const plotH = h - padTop - padBottom;

        // Subtle guidelines
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            const y = padTop + (plotH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(w - padRight, y);
            ctx.stroke();

            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.45)';
            ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padLeft - 8, y + 3);
        }
        ctx.restore();

        function drawAppleSpline(data, strokeColor, fillColor) {
            const points = data.map((val, idx) => ({
                x: padLeft + (plotW / (data.length - 1)) * idx,
                y: padTop + plotH - (val / maxVal) * plotH
            }));

            ctx.beginPath();
            ctx.moveTo(points[0].x, padTop + plotH);
            ctx.lineTo(points[0].x, points[0].y);

            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[Math.max(0, i - 1)];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[Math.min(points.length - 1, i + 2)];

                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }

            ctx.lineTo(points[points.length - 1].x, padTop + plotH);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
            grad.addColorStop(0, fillColor);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[Math.max(0, i - 1)];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[Math.min(points.length - 1, i + 2)];

                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? '#1c1c1e' : '#ffffff';
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 2.4;
                ctx.fill();
                ctx.stroke();
            });
        }

        drawAppleSpline(outpatientData, '#30d158', 'rgba(48, 209, 88, 0.16)');
        drawAppleSpline(inpatientData, '#0a84ff', 'rgba(10, 132, 255, 0.16)');

        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
        ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
        ctx.textAlign = 'center';
        days.forEach((d, idx) => {
            const x = padLeft + (plotW / (days.length - 1)) * idx;
            ctx.fillText(d, x, h - 8);
        });
    }, [currentUser.role]);

    // Render Apple Activity Ring
    useEffect(() => {
        const canvas = donutCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || 240;
        const h = rect.height || 240;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        const isDark = document.body.getAttribute('data-theme') !== 'frost-light';
        const occPct = 69;

        const segments = [
            { label: 'Occupied ICU', val: 18, color: '#ff453a' },
            { label: 'Occupied General', val: 82, color: '#0a84ff' },
            { label: 'Available Beds', val: 44, color: '#30d158' }
        ];

        const sum = segments.reduce((acc, s) => acc + s.val, 0);
        const cx = w / 2;
        const cy = h / 2 - 4;
        const outerR = Math.min(cx, cy) - 20;
        const ringWidth = 20;
        const gap = 0.08;

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = ringWidth;
        ctx.stroke();

        let currentAngle = -Math.PI / 2;
        segments.forEach(seg => {
            const sweep = (seg.val / sum) * (Math.PI * 2);
            const start = currentAngle + gap / 2;
            const end = currentAngle + sweep - gap / 2;

            if (end > start) {
                ctx.beginPath();
                ctx.arc(cx, cy, outerR, start, end);
                ctx.strokeStyle = seg.color;
                ctx.lineWidth = ringWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
            currentAngle += sweep;
        });

        ctx.fillStyle = isDark ? '#ffffff' : '#1d1d1f';
        ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${occPct}%`, cx, cy - 6);

        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
        ctx.letterSpacing = '0.08em';
        ctx.fillText('OCCUPANCY', cx, cy + 16);
    }, [currentUser.role]);

    // Department Doctor counts
    const deptCounts = {};
    doctors.forEach(d => {
        deptCounts[d.department] = (deptCounts[d.department] || 0) + 1;
    });
    const maxDocs = Math.max(...Object.values(deptCounts), 1);

    return (
        <div>
            {/* KPI Metric Cards */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><i className="fas fa-users"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">{patients.length}</h3>
                        <p className="stat-label">Total Registered Patients</p>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">{scopedAppointments.length}</h3>
                        <p className="stat-label">{currentUser.role === 'Doctor' ? 'My Consultations' : "Today's Consultations"}</p>
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">{formatCurrency(totalRevenue)}</h3>
                        <p className="stat-label">Collected Clinical Revenue</p>
                    </div>
                </div>

                <div className="stat-card red">
                    <div className="stat-icon"><i className="fas fa-bed"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">44</h3>
                        <p className="stat-label">Available Inpatient Beds</p>
                    </div>
                </div>
            </div>

            {/* Apple Visualizations */}
            <div className="dashboard-charts-grid">
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <h3 className="chart-card-title"><i className="fas fa-chart-area" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> 7-Day Patient Volume & Admission Flow</h3>
                            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>Real-time inpatient admissions vs outpatient consultations</p>
                        </div>
                        <div className="chart-legend">
                            <div className="legend-item"><span className="legend-dot outpatient"></span> Outpatient</div>
                            <div className="legend-item"><span className="legend-dot inpatient"></span> Inpatient</div>
                        </div>
                    </div>
                    <div className="chart-canvas-container">
                        <canvas ref={flowCanvasRef} className="chart-canvas"></canvas>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <h3 className="chart-card-title"><i className="fas fa-procedures" style={{ color: 'var(--success)', marginRight: '8px' }}></i> Bed Capacity Breakdown</h3>
                            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>ICU, Emergency, and Inpatient Wards</p>
                        </div>
                    </div>
                    <div className="chart-canvas-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <canvas ref={donutCanvasRef} className="chart-canvas"></canvas>
                    </div>
                </div>
            </div>

            {/* Inset Grouped Tables & Department Roster */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginTop: '24px' }}>
                <div className="card" style={{ marginBottom: 0 }}>
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-history" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Recent Consultations & Appointments</h3>
                        <Link to="/appointments" className="btn btn-sm btn-outline">View All</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Consultant Doctor</th>
                                    <th>Date</th>
                                    <th>Slot</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scopedAppointments.slice(0, 5).map((a) => (
                                    <tr key={a.id}>
                                        <td><strong>{a.patientName}</strong></td>
                                        <td><span className="badge badge-success"><i className="fas fa-stethoscope"></i> {a.doctorName}</span></td>
                                        <td>{formatDate(a.date)}</td>
                                        <td><span className="badge badge-info"><i className="fas fa-clock"></i> {a.time}</span></td>
                                        <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: 0 }}>
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-hospital-user" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Department Roster & Strength</h3>
                        <Link to="/doctors" className="btn btn-sm btn-outline">Physicians</Link>
                    </div>
                    <div>
                        {Object.entries(deptCounts).map(([dept, count]) => {
                            const pct = Math.round((count / maxDocs) * 100);
                            return (
                                <div key={dept} className="dept-bar-item">
                                    <div className="dept-bar-label">
                                        <span><i className="fas fa-clinic-medical" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> {dept}</span>
                                        <strong style={{ color: 'var(--primary)' }}>{count} Doctors</strong>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill green" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Action Dock */}
            <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-bolt" style={{ color: 'var(--warning)', marginRight: '8px' }}></i> Clinical Operations Quick Action Dock</h3>
                </div>
                <div className="quick-actions-grid" style={{ marginTop: '10px' }}>
                    <Link to="/patients" className="quick-action-btn"><i className="fas fa-user-plus" style={{ color: 'var(--primary)' }}></i> Register Patient</Link>
                    <Link to="/appointments" className="quick-action-btn"><i className="fas fa-calendar-plus" style={{ color: 'var(--success)' }}></i> Schedule Appointment</Link>
                    <Link to="/billing" className="quick-action-btn"><i className="fas fa-file-invoice" style={{ color: 'var(--warning)' }}></i> Generate Invoice</Link>
                    <Link to="/prescriptions" className="quick-action-btn"><i className="fas fa-prescription-bottle-alt" style={{ color: 'var(--accent)' }}></i> New Digital Rx</Link>
                </div>
            </div>

            {/* Academic Development Team Banner */}
            <div className="card" style={{ marginTop: '24px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(10, 132, 255, 0.3)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#0a84ff', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '4px' }}>
                            <i className="fas fa-graduation-cap"></i> React & Web Engineering Project
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>MediCare Project Development Team</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ background: 'rgba(10, 132, 255, 0.2)', border: '1px solid #0a84ff', padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-crown" style={{ color: '#ff9f0a', fontSize: '16px' }}></i>
                            <div>
                                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#0a84ff', textTransform: 'uppercase', display: 'block' }}>Team Lead</span>
                                <strong style={{ fontSize: '12.5px', color: '#ffffff' }}>NISTALA SAI PHANEENDRA KUMAR</strong>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-user-check" style={{ color: '#30d158', fontSize: '14px' }}></i>
                            <div>
                                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#30d158', textTransform: 'uppercase', display: 'block' }}>Team Member</span>
                                <strong style={{ fontSize: '12px', color: '#ffffff' }}>KANASANI NEELAKANTA BALAJI</strong>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-user-check" style={{ color: '#bf5af2', fontSize: '14px' }}></i>
                            <div>
                                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#bf5af2', textTransform: 'uppercase', display: 'block' }}>Team Member</span>
                                <strong style={{ fontSize: '12px', color: '#ffffff' }}>JAMMULA UDAY KIRAN</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
