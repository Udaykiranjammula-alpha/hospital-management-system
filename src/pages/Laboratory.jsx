import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loadData, saveData, defaultLabTests, formatDate, playSound } from '../data/mockData';

export default function Laboratory() {
    const { currentUser, checkActionPermission } = useAuth();
    const { showToast } = useTheme();
    const [labTests, setLabTests] = useState(() => loadData('hms_lab_tests', defaultLabTests));
    const [selectedTest, setSelectedTest] = useState(null);

    const handleUpdateStatus = (id, newStatus) => {
        if (!checkActionPermission('canEnterLabResults', 'Update Diagnostic Test Result')) return;
        playSound('success');
        const updated = labTests.map(t => t.id === id ? { ...t, status: newStatus } : t);
        setLabTests(updated);
        saveData('hms_lab_tests', updated);
        showToast(`Diagnostic panel ${id} marked as ${newStatus}`, 'success');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Pathology & Diagnostic Laboratory</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Automated Specimen Processing, Serology, Hematology & Imaging Scans</p>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Test Order ID</th>
                                <th>Patient Name</th>
                                <th>Test Name & Panel</th>
                                <th>Category</th>
                                <th>Specimen</th>
                                <th>Priority</th>
                                <th>Ordered Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labTests.map(t => (
                                <tr key={t.id}>
                                    <td><strong style={{ color: 'var(--primary)' }}>{t.id}</strong></td>
                                    <td><strong>{t.patientName}</strong></td>
                                    <td>{t.testName}</td>
                                    <td><span className="badge badge-info">{t.category}</span></td>
                                    <td>{t.specimen}</td>
                                    <td><span className={`badge ${t.priority === 'STAT' ? 'badge-danger' : t.priority === 'Urgent' ? 'badge-warning' : 'badge-info'}`}>{t.priority}</span></td>
                                    <td>{formatDate(t.orderedDate)}</td>
                                    <td><span className={`badge ${t.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => { setSelectedTest(t); playSound('click'); }}
                                                title="View Results"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {t.status !== 'Completed' && (currentUser.role === 'Admin' || currentUser.role === 'LabTechnician') && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleUpdateStatus(t.id, 'Completed')}
                                                    title="Approve Results"
                                                >
                                                    <i className="fas fa-check-double"></i> Complete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Lab Results Modal */}
            {selectedTest && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ maxWidth: '540px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-flask" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Diagnostic Panel Results • {selectedTest.id}</h3>
                            <button className="modal-close" onClick={() => setSelectedTest(null)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Patient Name</div>
                                    <strong style={{ fontSize: '1.05rem' }}>{selectedTest.patientName}</strong>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Requisitioning Physician</div>
                                    <strong>{selectedTest.doctorName}</strong>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Clinical Parameters</h4>
                            {selectedTest.results && selectedTest.results.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                    {selectedTest.results.map((r, i) => (
                                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{r.parameter}</strong>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Normal: {r.range} {r.unit}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: r.flag?.includes('High') || r.flag?.includes('Critical') ? '#ff453a' : '#30d158' }}>
                                                    {r.value} {r.unit}
                                                </span>
                                                {r.flag && <span className={`badge ${r.flag?.includes('Critical') ? 'badge-danger' : 'badge-warning'}`} style={{ marginLeft: '8px' }}>{r.flag}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>Specimen received at analyzer. Results pending verification.</p>
                            )}

                            {selectedTest.notes && (
                                <div style={{ background: 'rgba(10, 132, 255, 0.08)', border: '1px solid rgba(10, 132, 255, 0.2)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem' }}>
                                    <i className="fas fa-info-circle" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
                                    <strong>Pathologist Notes:</strong> {selectedTest.notes}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
