import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loadData, saveData, defaultPrescriptions, formatDate, playSound } from '../data/mockData';

export default function Prescriptions() {
    const { currentUser, checkActionPermission } = useAuth();
    const { showToast } = useTheme();
    const [prescriptions, setPrescriptions] = useState(() => loadData('hms_prescriptions', defaultPrescriptions));
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [form, setForm] = useState({
        patientName: '',
        diagnosis: '',
        medicineName: 'Paracetamol 500mg',
        dosage: '1 tab',
        frequency: 'Thrice daily',
        duration: '5 days'
    });

    const handleCreateClick = () => {
        if (!checkActionPermission('canPrescribe', 'Digital Prescription Issuance')) return;
        setIsAddOpen(true);
    };

    const handleDispenseClick = (id) => {
        if (!checkActionPermission('canDispenseMedicine', 'Medicine Dispensation')) return;
        playSound('success');
        const updated = prescriptions.map(r => r.id === id ? { ...r, status: 'Dispensed' } : r);
        setPrescriptions(updated);
        saveData('hms_prescriptions', updated);
        showToast(`Prescription ${id} marked as Dispensed!`, 'success');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newRx = {
            id: 'RX' + String(prescriptions.length + 1).padStart(3, '0'),
            patientId: 'P001',
            patientName: form.patientName,
            doctorId: currentUser.doctorId || 'D001',
            doctorName: currentUser.displayName,
            date: new Date().toISOString().split('T')[0],
            diagnosis: form.diagnosis,
            status: 'Pending',
            medicines: [
                {
                    name: form.medicineName,
                    dosage: form.dosage,
                    frequency: form.frequency,
                    duration: form.duration,
                    instructions: 'Take after meals with water'
                }
            ]
        };
        const updated = [newRx, ...prescriptions];
        setPrescriptions(updated);
        saveData('hms_prescriptions', updated);
        setIsAddOpen(false);
        playSound('success');
        showToast('Prescription issued to central pharmacy queue!', 'success');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Digital Prescriptions (EHR Rx)</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Clinical Pharmacology, Drug Dosage Schedules & Pharmacy Dispensing</p>
                </div>
                {(currentUser.role === 'Admin' || currentUser.role === 'Doctor') && (
                    <button className="btn btn-primary" onClick={handleCreateClick}>
                        <i className="fas fa-prescription-bottle-alt"></i> New Prescription
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
                {prescriptions.map(rx => (
                    <div key={rx.id} className="card" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '14px' }}>
                            <div>
                                <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{rx.id}</strong>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '2px 0 0 0' }}>{rx.patientName}</h3>
                            </div>
                            <span className={`badge ${rx.status === 'Dispensed' ? 'badge-success' : 'badge-warning'}`}>
                                {rx.status}
                            </span>
                        </div>

                        <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '14px' }}>
                            <div><i className="fas fa-stethoscope" style={{ width: '18px', color: 'var(--primary)' }}></i> Prescribed By: <strong style={{ color: '#ffffff' }}>{rx.doctorName}</strong></div>
                            <div><i className="fas fa-calendar" style={{ width: '18px', color: 'var(--text-muted)' }}></i> Date: {formatDate(rx.date)}</div>
                            <div style={{ marginTop: '4px' }}><i className="fas fa-notes-medical" style={{ width: '18px', color: 'var(--warning)' }}></i> Diagnosis: <em>{rx.diagnosis}</em></div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px' }}>
                            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>Medications</div>
                            {rx.medicines?.map((m, idx) => (
                                <div key={idx} style={{ fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                                    <strong style={{ color: '#ffffff' }}>{m.name}</strong>
                                    <span style={{ color: '#30d158' }}>{m.dosage} • {m.frequency}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            {rx.status !== 'Dispensed' && (currentUser.role === 'Admin' || currentUser.role === 'Pharmacist') && (
                                <button className="btn btn-sm btn-primary" onClick={() => handleDispenseClick(rx.id)}>
                                    <i className="fas fa-pills"></i> Dispense Medicine
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Rx Modal */}
            {isAddOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-prescription" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Prescribe Medication</h3>
                            <button className="modal-close" onClick={() => setIsAddOpen(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Patient Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="e.g. Rajesh Kumar"
                                        value={form.patientName}
                                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Clinical Diagnosis</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="e.g. Type 2 Diabetes Mellitus"
                                        value={form.diagnosis}
                                        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Medicine & Strength</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="e.g. Metformin 500mg"
                                        value={form.medicineName}
                                        onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>Dosage</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.dosage}
                                            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Frequency</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.frequency}
                                            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-check"></i> Issue Rx</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
