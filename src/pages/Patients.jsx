import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loadData, saveData, defaultPatients, formatDate, playSound } from '../data/mockData';

export default function Patients() {
    const { currentUser, checkActionPermission } = useAuth();
    const { showToast } = useTheme();
    const [patients, setPatients] = useState(() => loadData('hms_patients', defaultPatients));
    const [search, setSearch] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [form, setForm] = useState({
        name: '',
        age: '',
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '',
        email: '',
        condition: '',
        status: 'Outpatient'
    });

    const handleAddClick = () => {
        if (!checkActionPermission('canRegisterPatients', 'Patient Registration')) return;
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        if (!checkActionPermission('canManagePatients', 'Delete Patient Record')) return;
        playSound('error');
        const updated = patients.filter(p => p.id !== id);
        setPatients(updated);
        saveData('hms_patients', updated);
        showToast('Patient record removed.', 'info');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newId = 'P' + String(patients.length + 1).padStart(3, '0');
        const newPatient = {
            id: newId,
            ...form,
            admissionDate: new Date().toISOString().split('T')[0],
            history: [{ date: new Date().toISOString().split('T')[0], event: 'Registered to hospital system' }]
        };
        const updated = [newPatient, ...patients];
        setPatients(updated);
        saveData('hms_patients', updated);
        setIsAddModalOpen(false);
        playSound('success');
        showToast(`Patient ${newPatient.name} registered successfully!`, 'success');
        setForm({ name: '', age: '', gender: 'Male', bloodGroup: 'O+', phone: '', email: '', condition: '', status: 'Outpatient' });
    };

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.condition.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Patients Directory</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Centralized EHR Records & Longitudinal Medical Histories</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}></i>
                        <input
                            type="text"
                            placeholder="Search patients, ID, diagnosis..."
                            className="form-control"
                            style={{ paddingLeft: '34px', width: '260px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Only show Add button if permitted */}
                    {(currentUser.role === 'Admin' || currentUser.role === 'Receptionist') && (
                        <button className="btn btn-primary" onClick={handleAddClick}>
                            <i className="fas fa-user-plus"></i> Register Patient
                        </button>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Full Name</th>
                                <th>Age / Sex</th>
                                <th>Blood</th>
                                <th>Phone</th>
                                <th>Primary Diagnosis</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td><strong style={{ color: 'var(--primary)' }}>{p.id}</strong></td>
                                    <td><strong>{p.name}</strong></td>
                                    <td>{p.age}y / {p.gender}</td>
                                    <td><span className="badge badge-info">{p.bloodGroup}</span></td>
                                    <td>{p.phone}</td>
                                    <td>{p.condition}</td>
                                    <td>
                                        <span className={`badge ${p.status === 'Admitted' ? 'badge-danger' : p.status === 'Discharged' ? 'badge-success' : 'badge-warning'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => { setSelectedPatient(p); playSound('click'); }}
                                                title="View Medical Chart"
                                            >
                                                <i className="fas fa-file-medical"></i>
                                            </button>
                                            {/* Delete action guarded */}
                                            {currentUser.role === 'Admin' && (
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    style={{ color: '#ff453a' }}
                                                    onClick={() => handleDeleteClick(p.id)}
                                                    title="Delete Record"
                                                >
                                                    <i className="fas fa-trash"></i>
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

            {/* View Patient Details Modal */}
            {selectedPatient && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ maxWidth: '580px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-id-card-clip" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Patient Clinical Dossier • {selectedPatient.id}</h3>
                            <button className="modal-close" onClick={() => setSelectedPatient(null)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</span>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedPatient.name}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span>
                                    <div><span className="badge badge-success">{selectedPatient.status}</span></div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age & Gender</span>
                                    <div style={{ fontWeight: 600 }}>{selectedPatient.age} years • {selectedPatient.gender}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blood Group</span>
                                    <div style={{ fontWeight: 600 }}>{selectedPatient.bloodGroup}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact</span>
                                    <div>{selectedPatient.phone} • {selectedPatient.email}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Diagnosis</span>
                                    <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedPatient.condition}</div>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginBottom: '10px' }}>
                                <i className="fas fa-timeline"></i> Longitudinal Event Timeline
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedPatient.history?.map((h, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{h.event}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{formatDate(h.date)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Patient Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ maxWidth: '520px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-user-plus" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> New Patient Intake</h3>
                            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Patient Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Meera Nambiar"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>Age</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            required
                                            value={form.age}
                                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                                            placeholder="35"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select
                                            className="form-control"
                                            value={form.gender}
                                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>Blood Group</label>
                                        <select
                                            className="form-control"
                                            value={form.bloodGroup}
                                            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                                        >
                                            <option>O+</option>
                                            <option>A+</option>
                                            <option>B+</option>
                                            <option>AB+</option>
                                            <option>O-</option>
                                            <option>A-</option>
                                            <option>B-</option>
                                            <option>AB-</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Primary Condition / Chief Complaint</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={form.condition}
                                        onChange={(e) => setForm({ ...form, condition: e.target.value })}
                                        placeholder="e.g. Acute Bronchitis"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-check"></i> Register Patient</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
