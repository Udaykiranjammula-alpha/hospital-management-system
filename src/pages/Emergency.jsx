import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../data/mockData';

export default function Emergency() {
    const [codeBlueActive, setCodeBlueActive] = useState(false);
    const ecgRefs = useRef([]);

    const monitors = [
        { bed: 'ICU BED 101', patient: 'Rajesh Kumar (P001)', condition: 'Post-CABG Recovery', hr: 74, spo2: 99, bp: '122/80', rr: 16 },
        { bed: 'ICU BED 102', patient: 'Rohan Mehra (ER-801)', condition: 'Acute STEMI Resuscitation', hr: 128, spo2: 91, bp: '85/55', rr: 26 },
        { bed: 'ICU BED 103', patient: 'Sunil Chawla (ER-802)', condition: 'Poly-trauma Chest Tube', hr: 114, spo2: 94, bp: '105/70', rr: 22 },
        { bed: 'ICU BED 104', patient: 'Vikram Reddy (P005)', condition: 'Severe COPD on BiPAP', hr: 88, spo2: 92, bp: '135/88', rr: 20 }
    ];

    const triageCases = [
        { caseId: 'ER-901', patient: 'Ananya Deshmukh', age: 29, priority: 'ESI-1 Resuscitation', complaint: 'Cardiac Arrest / CPR in progress', bay: 'Trauma Bay 01', time: '2 mins ago', doctor: 'Dr. Priya Sharma' },
        { caseId: 'ER-902', patient: 'Harish Mehta', age: 58, priority: 'ESI-2 Emergent', complaint: 'Acute Aortic Dissection / Severe Chest Pain', bay: 'Cath Lab 02', time: '8 mins ago', doctor: 'Dr. Rahul Verma' },
        { caseId: 'ER-903', patient: 'Rohan Mehra', age: 48, priority: 'ESI-2 Emergent', complaint: 'Acute Inferior Wall STEMI', bay: 'ICU Bed 102', time: '14 mins ago', doctor: 'Dr. Priya Sharma' },
        { caseId: 'ER-904', patient: 'Pooja Iyer', age: 34, priority: 'ESI-3 Urgent', complaint: 'Open Femur Fracture / Hypovolemia', bay: 'Trauma Bay 03', time: '22 mins ago', doctor: 'Dr. Rahul Verma' }
    ];

    const handleTriggerCodeBlue = () => {
        playSound('alarm');
        setCodeBlueActive(prev => !prev);
    };

    // Continuous 60Hz live ECG canvas animation
    useEffect(() => {
        let animId = null;
        let offset = 0;

        const renderECG = () => {
            offset += 2.5;

            ecgRefs.current.forEach((canvas, idx) => {
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                const w = canvas.width;
                const h = canvas.height;
                ctx.clearRect(0, 0, w, h);

                const m = monitors[idx] || monitors[0];
                const isCrit = m.hr > 120 || m.spo2 < 92;
                const strokeColor = isCrit ? '#ff453a' : idx === 2 ? '#ff9f0a' : '#30d158';

                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 2.2;
                ctx.shadowColor = strokeColor;
                ctx.shadowBlur = 8;
                ctx.beginPath();

                const centerY = h * 0.5;
                for (let x = 0; x < w; x += 3) {
                    const waveX = (x + offset * (m.hr / 70)) % 280;
                    let y = centerY;

                    // P wave
                    if (waveX > 30 && waveX < 55) {
                        y -= Math.sin(((waveX - 30) / 25) * Math.PI) * 8;
                    }
                    // R high spike
                    else if (waveX >= 75 && waveX < 95) {
                        y -= Math.sin(((waveX - 75) / 20) * Math.PI) * (h * 0.42);
                    }
                    // S drop
                    else if (waveX >= 95 && waveX < 110) {
                        y += Math.sin(((waveX - 95) / 15) * Math.PI) * 12;
                    }
                    // T wave
                    else if (waveX >= 135 && waveX < 175) {
                        y -= Math.sin(((waveX - 135) / 40) * Math.PI) * 14;
                    }

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            });

            animId = requestAnimationFrame(renderECG);
        };

        animId = requestAnimationFrame(renderECG);
        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <div>
            {/* Top Action Banner */}
            <div className="emergency-hud-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255, 69, 58, 0.2)', border: '2px solid #ff453a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#ff453a' }}>
                        <i className="fas fa-truck-medical"></i>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>Level-1 Trauma & Critical Resuscitation Wing</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>24/7 Dedicated Emergency Physicians, Cardiothoracic OT & Cath Lab on 5-Minute Standby.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="btn-code-blue" onClick={handleTriggerCodeBlue}>
                        <i className="fas fa-triangle-exclamation"></i> {codeBlueActive ? 'RESET CODE BLUE' : 'TRIGGER CODE BLUE'}
                    </button>
                </div>
            </div>

            {/* Capacity Metrics */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', marginBottom: '24px' }}>
                <div className="stat-card red">
                    <div className="stat-icon"><i className="fas fa-lungs"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">18 / 24</h3>
                        <p className="stat-label">ICU Ventilators Occupied (6 Free)</p>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><i className="fas fa-bed-pulse"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">4 / 6</h3>
                        <p className="stat-label">Resuscitation Bays Active</p>
                    </div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-icon"><i className="fas fa-ambulance"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">2 Active</h3>
                        <p className="stat-label">Inbound ALS Ambulances</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><i className="fas fa-user-doctor"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">14 Staff</h3>
                        <p className="stat-label">Critical Care Team On Duty</p>
                    </div>
                </div>
            </div>

            {/* Live ICU Bed Telemetry Monitors */}
            <div className="card" style={{ marginBottom: '28px' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="card-title"><i className="fas fa-heartbeat" style={{ color: '#ff453a', marginRight: '8px' }}></i> Live ICU Critical Telemetry Monitors (Real-Time Waveforms)</h3>
                    <span className="badge badge-success"><span className="clock-dot"></span> Live 60Hz Telemetry Feed</span>
                </div>
                <div style={{ padding: '20px' }}>
                    <div className="icu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {monitors.map((m, idx) => (
                            <div
                                key={idx}
                                className={`icu-monitor-card ${(m.hr > 120 || codeBlueActive) ? 'code-blue-active' : ''}`}
                            >
                                <div className="icu-monitor-header">
                                    <div>
                                        <strong style={{ color: '#0a84ff', fontFamily: 'monospace' }}>{m.bed}</strong>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{m.patient}</div>
                                    </div>
                                    <span className={`badge ${m.hr > 120 ? 'badge-danger' : 'badge-success'}`}>{m.condition}</span>
                                </div>

                                <canvas
                                    ref={el => ecgRefs.current[idx] = el}
                                    width={340}
                                    height={70}
                                    className="icu-ecg-canvas"
                                />

                                <div className="icu-vitals-row">
                                    <div className="icu-vital-item">
                                        <div className="icu-vital-val" style={{ color: m.hr > 110 ? '#ff453a' : '#30d158' }}>{m.hr}</div>
                                        <div className="icu-vital-label">HR (BPM)</div>
                                    </div>
                                    <div className="icu-vital-item">
                                        <div className="icu-vital-val" style={{ color: m.spo2 < 93 ? '#ff9f0a' : '#0a84ff' }}>{m.spo2}%</div>
                                        <div className="icu-vital-label">SPO2</div>
                                    </div>
                                    <div className="icu-vital-item">
                                        <div className="icu-vital-val" style={{ color: '#ffffff' }}>{m.bp}</div>
                                        <div className="icu-vital-label">NIBP</div>
                                    </div>
                                    <div className="icu-vital-item">
                                        <div className="icu-vital-val" style={{ color: '#bf5af2' }}>{m.rr}</div>
                                        <div className="icu-vital-label">RESP</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Emergency Severity Index (ESI) Pipeline */}
            <div className="card" style={{ marginBottom: '28px' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="card-title"><i className="fas fa-ranking-star" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Emergency Severity Index (ESI) Triage Pipeline</h3>
                    <span className="badge badge-warning">4 Critical Patients Active</span>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Patient</th>
                                <th>Triage Priority</th>
                                <th>Presenting Complaint</th>
                                <th>Allocated Bay</th>
                                <th>Time Elapsed</th>
                                <th>Attending Consultant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {triageCases.map((tc) => (
                                <tr key={tc.caseId}>
                                    <td><strong style={{ color: 'var(--primary)' }}>{tc.caseId}</strong></td>
                                    <td><strong>{tc.patient}</strong> <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>({tc.age}y)</span></td>
                                    <td><span className={`badge ${tc.priority.includes('ESI-1') ? 'badge-danger' : 'badge-warning'}`}>{tc.priority}</span></td>
                                    <td>{tc.complaint}</td>
                                    <td><span className="badge badge-info">{tc.bay}</span></td>
                                    <td>{tc.time}</td>
                                    <td><span className="badge badge-success"><i className="fas fa-user-md"></i> {tc.doctor}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
