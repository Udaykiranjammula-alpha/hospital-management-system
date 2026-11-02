import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loadData, saveData, defaultAppointments, defaultDoctors, defaultPatients, formatDate, playSound } from '../data/mockData';

export default function Appointments() {
    const { currentUser, checkActionPermission } = useAuth();
    const { showToast } = useTheme();
    const [appointments, setAppointments] = useState(() => loadData('hms_appointments', defaultAppointments));
    const [doctors] = useState(() => loadData('hms_doctors', defaultDoctors));
    const [patients] = useState(() => loadData('hms_patients', defaultPatients));
    const [filter, setFilter] = useState('All');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [form, setForm] = useState({
        patientName: '',
        doctorName: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        type: 'Consultation'
    });

    const scoped = currentUser.role === 'Doctor'
        ? appointments.filter(a => a.doctorId === currentUser.doctorId || a.doctorName?.includes('Priya'))
        : appointments;

    const filtered = filter === 'All' ? scoped : scoped.filter(a => a.status === filter);

    const handleAddClick = () => {
        if (!checkActionPermission('canManageAppointments', 'Schedule Appointment')) return;
        setIsAddOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const selectedDoc = doctors.find(d => d.name === form.doctorName) || doctors[0];
        const newAppt = {
            id: 'A' + String(appointments.length + 1).padStart(3, '0'),
            patientName: form.patientName,
            doctorId: selectedDoc.id,
            doctorName: selectedDoc.name,
            department: selectedDoc.department,
            date: form.date,
            time: form.time,
            type: form.type,
            status: 'Scheduled'
        };
        const updated = [newAppt, ...appointments];
        setAppointments(updated);
        saveData('hms_appointments', updated);
        setIsAddOpen(false);
        playSound('success');
        showToast('Appointment successfully confirmed!', 'success');
    };

    const handleStatusChange = (id, newStatus) => {
        playSound('click');
        const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
        setAppointments(updated);
        saveData('hms_appointments', updated);
        showToast(`Appointment status updated to ${newStatus}`, 'info');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Consultation Appointments</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>OPD Slot Scheduling, Token Verification & Doctor Calendar</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '10px' }}>
                        {['All', 'Scheduled', 'Confirmed', 'Completed'].map(st => (
                            <button
                                key={st}
                                className={`btn btn-sm ${filter === st ? 'btn-primary' : 'btn-outline'}`}
                                style={{ border: 'none', padding: '6px 12px' }}
                                onClick={() => setFilter(st)}
                            >
                                {st}
                            </button>
                        ))}
                    </div>
                    {/* Add Appointment visible to Admin and Receptionist */}
                    {(currentUser.role === 'Admin' || currentUser.role === 'Receptionist') && (
                        <button className="btn btn-primary" onClick={handleAddClick}>
                            <i className="fas fa-calendar-plus"></i> Book Slot
                        </button>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Appt ID</th>
                                <th>Patient Name</th>
                                <th>Consultant Physician</th>
                                <th>Department</th>
                                <th>Date & Slot</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.id}>
                                    <td><strong style={{ color: 'var(--primary)' }}>{a.id}</strong></td>
                                    <td><strong>{a.patientName}</strong></td>
                                    <td><span className="badge badge-success"><i className="fas fa-stethoscope"></i> {a.doctorName}</span></td>
                                    <td>{a.department}</td>
                                    <td><strong>{formatDate(a.date)}</strong> at {a.time}</td>
                                    <td><span className="badge badge-info">{a.type}</span></td>
                                    <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {a.status !== 'Completed' && (
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    style={{ color: '#30d158' }}
                                                    onClick={() => handleStatusChange(a.id, 'Completed')}
                                                    title="Mark Complete"
                                                >
                                                    <i className="fas fa-check"></i>
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

            {/* Book Appointment Modal */}
            {isAddOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-calendar-plus" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Book Consultation Slot</h3>
                            <button className="modal-close" onClick={() => setIsAddOpen(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Select Patient</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        list="patientList"
                                        required
                                        placeholder="Type or select patient"
                                        value={form.patientName}
                                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                    />
                                    <datalist id="patientList">
                                        {patients.map(p => <option key={p.id} value={p.name} />)}
                                    </datalist>
                                </div>
                                <div className="form-group">
                                    <label>Attending Doctor</label>
                                    <select
                                        className="form-control"
                                        required
                                        value={form.doctorName}
                                        onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                                    >
                                        <option value="">Choose Physician</option>
                                        {doctors.map(d => <option key={d.id} value={d.name}>{d.name} ({d.department})</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            required
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Slot Time</label>
                                        <select
                                            className="form-control"
                                            value={form.time}
                                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        >
                                            <option>09:00 AM</option>
                                            <option>10:00 AM</option>
                                            <option>11:30 AM</option>
                                            <option>02:00 PM</option>
                                            <option>04:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-check"></i> Confirm Slot</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
