import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loadData, saveData, defaultDoctors, playSound } from '../data/mockData';

export default function Doctors() {
    const { currentUser, checkActionPermission } = useAuth();
    const { showToast } = useTheme();
    const [doctors, setDoctors] = useState(() => loadData('hms_doctors', defaultDoctors));
    const [search, setSearch] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [form, setForm] = useState({
        name: '',
        specialization: '',
        department: 'Cardiology',
        phone: '',
        email: '',
        experience: '5 years',
        availability: 'Available'
    });

    const handleAddClick = () => {
        if (!checkActionPermission('canAddDoctor', 'Add New Medical Officer / Doctor')) return;
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        if (!checkActionPermission('canDeleteDoctor', 'Delete Doctor Profile')) return;
        playSound('error');
        const updated = doctors.filter(d => d.id !== id);
        setDoctors(updated);
        saveData('hms_doctors', updated);
        showToast('Doctor record deleted.', 'info');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newId = 'D' + String(doctors.length + 1).padStart(3, '0');
        const newDoc = {
            id: newId,
            ...form,
            schedule: { Mon: '9AM-5PM', Tue: '9AM-5PM', Wed: '9AM-5PM', Thu: '9AM-5PM', Fri: '9AM-5PM', Sat: '10AM-2PM', Sun: 'Off' }
        };
        const updated = [...doctors, newDoc];
        setDoctors(updated);
        saveData('hms_doctors', updated);
        setIsAddModalOpen(false);
        playSound('success');
        showToast(`Dr. ${newDoc.name} appointed successfully!`, 'success');
        setForm({ name: '', specialization: '', department: 'Cardiology', phone: '', email: '', experience: '5 years', availability: 'Available' });
    };

    const filtered = doctors.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.department.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Consultant Physicians & Surgeons</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Medical Staff Roster, Clinical Specializations & OPD Rostering</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search physicians, specialty..."
                        className="form-control"
                        style={{ width: '260px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* Add Doctor is exclusively visible to Admin */}
                    {currentUser.role === 'Admin' && (
                        <button className="btn btn-primary" onClick={handleAddClick}>
                            <i className="fas fa-user-doctor"></i> Appoint Doctor
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {filtered.map(d => (
                    <div key={d.id} className="card" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(10, 132, 255, 0.15)', border: '1px solid rgba(10, 132, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#0a84ff' }}>
                                <i className="fas fa-user-md"></i>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{d.name}</h3>
                                <span style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600 }}>{d.specialization}</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1', marginBottom: '16px' }}>
                            <div><i className="fas fa-hospital" style={{ width: '18px', color: 'var(--text-muted)' }}></i> Department: <strong style={{ color: '#ffffff' }}>{d.department}</strong></div>
                            <div><i className="fas fa-award" style={{ width: '18px', color: 'var(--text-muted)' }}></i> Experience: {d.experience}</div>
                            <div><i className="fas fa-phone" style={{ width: '18px', color: 'var(--text-muted)' }}></i> Contact: {d.phone}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                            <span className={`badge ${d.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                                <i className="fas fa-circle" style={{ fontSize: '0.5rem', marginRight: '4px' }}></i> {d.availability}
                            </span>
                            {currentUser.role === 'Admin' && (
                                <button
                                    className="btn btn-sm btn-outline"
                                    style={{ color: '#ff453a' }}
                                    onClick={() => handleDeleteClick(d.id)}
                                >
                                    <i className="fas fa-trash"></i> Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Appoint Doctor Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-user-md" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Appoint Medical Officer</h3>
                            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Doctor Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Dr. Rajeshwari Rao"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Clinical Specialization</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={form.specialization}
                                        onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                                        placeholder="e.g. Senior Pulmonologist"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <select
                                        className="form-control"
                                        value={form.department}
                                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    >
                                        <option>Cardiology</option>
                                        <option>Orthopedics</option>
                                        <option>Neurology</option>
                                        <option>Pediatrics</option>
                                        <option>General Medicine</option>
                                        <option>Dermatology</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>Experience</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.experience}
                                            onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                            placeholder="10 years"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="9876543007"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-check"></i> Save Appointment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
