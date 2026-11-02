import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loadData, saveData, defaultBills, formatCurrency, formatDate, playSound } from '../data/mockData';

export default function Billing() {
    const { currentUser } = useAuth();
    const { showToast } = useTheme();
    const [bills, setBills] = useState(() => loadData('hms_bills', defaultBills));
    const [selectedBill, setSelectedBill] = useState(null);

    const handleMarkPaid = (id) => {
        playSound('success');
        const updated = bills.map(b => b.id === id ? { ...b, status: 'Paid' } : b);
        setBills(updated);
        saveData('hms_bills', updated);
        showToast(`Invoice ${id} marked as Paid!`, 'success');
    };

    const totalCollected = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.total, 0);
    const totalPending = bills.filter(b => b.status === 'Pending').reduce((acc, b) => acc + b.total, 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Revenue & Patient Invoicing Counter</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Insurance TPA Approvals, OPD Consultations & Surgical Settlement</p>
                </div>
            </div>

            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card green">
                    <div className="stat-icon"><i className="fas fa-circle-check"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">{formatCurrency(totalCollected)}</h3>
                        <p className="stat-label">Total Realized Revenue</p>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><i className="fas fa-clock"></i></div>
                    <div className="stat-details">
                        <h3 className="stat-number">{formatCurrency(totalPending)}</h3>
                        <p className="stat-label">Pending Insurance / Self Pay</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Patient Name</th>
                                <th>Billing Date</th>
                                <th>Payment Method</th>
                                <th>Total Settlement</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map(b => (
                                <tr key={b.id}>
                                    <td><strong style={{ color: 'var(--primary)' }}>{b.id}</strong></td>
                                    <td><strong>{b.patientName}</strong></td>
                                    <td>{formatDate(b.date)}</td>
                                    <td>
                                        <span className="badge badge-info">
                                            <i className="fas fa-credit-card" style={{ marginRight: '4px' }}></i> {b.paymentMethod}
                                        </span>
                                    </td>
                                    <td><strong>{formatCurrency(b.total)}</strong></td>
                                    <td><span className={`badge ${b.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => { setSelectedBill(b); playSound('click'); }}
                                                title="Print Invoice"
                                            >
                                                <i className="fas fa-file-invoice"></i> View
                                            </button>
                                            {b.status === 'Pending' && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleMarkPaid(b.id)}
                                                    title="Mark as Paid"
                                                >
                                                    <i className="fas fa-check"></i> Collect
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

            {/* Invoice Breakdown Modal */}
            {selectedBill && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ maxWidth: '520px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-receipt" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> Tax Invoice • {selectedBill.id}</h3>
                            <button className="modal-close" onClick={() => setSelectedBill(null)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Billed To</div>
                                    <strong style={{ fontSize: '1.1rem' }}>{selectedBill.patientName}</strong>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Date</div>
                                    <strong>{formatDate(selectedBill.date)}</strong>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                {selectedBill.items?.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <span>{item.desc}</span>
                                        <strong style={{ color: '#ffffff' }}>{formatCurrency(item.amount)}</strong>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,132,255,0.1)', padding: '12px 16px', borderRadius: '12px' }}>
                                <span style={{ fontWeight: 600 }}>Total Payable Amount:</span>
                                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#30d158' }}>{formatCurrency(selectedBill.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
