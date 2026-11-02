import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loadData, saveData, defaultMedicines, formatCurrency, playSound } from '../data/mockData';

export default function Pharmacy() {
    const { currentUser, checkActionPermission } = useAuth();
    const { showToast } = useTheme();
    const [medicines, setMedicines] = useState(() => loadData('hms_medicines', defaultMedicines));

    const handleRestock = (id) => {
        if (!checkActionPermission('canManagePharmacy', 'Pharmacy Restock Inventory')) return;
        playSound('success');
        const updated = medicines.map(m => m.id === id ? { ...m, stock: m.stock + 100, status: 'In Stock' } : m);
        setMedicines(updated);
        saveData('hms_medicines', updated);
        showToast('Inventory replenished (+100 units)', 'success');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Automated Pharmacy & Stock Formulary</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Medication Inventory, Unit Batches, Expiration Tracking & Reorders</p>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Medicine Name</th>
                                <th>Category / Class</th>
                                <th>Batch No.</th>
                                <th>Current Stock</th>
                                <th>Unit Price</th>
                                <th>Expiry Date</th>
                                <th>Stock Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map(m => (
                                <tr key={m.id}>
                                    <td><strong style={{ color: 'var(--primary)' }}>{m.id}</strong></td>
                                    <td>
                                        <strong>{m.name}</strong>
                                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{m.genericName}</div>
                                    </td>
                                    <td><span className="badge badge-info">{m.category}</span></td>
                                    <td><code style={{ fontSize: '0.78rem' }}>{m.batch}</code></td>
                                    <td>
                                        <strong style={{ color: m.stock < m.minStock ? '#ff453a' : '#ffffff' }}>
                                            {m.stock} units
                                        </strong>
                                    </td>
                                    <td>{formatCurrency(m.unitPrice)}</td>
                                    <td>{m.expDate}</td>
                                    <td>
                                        <span className={`badge ${m.status === 'In Stock' ? 'badge-success' : m.status === 'Critical Low' ? 'badge-danger' : 'badge-warning'}`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td>
                                        {(currentUser.role === 'Admin' || currentUser.role === 'Pharmacist') && (
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleRestock(m.id)}
                                                title="Add +100 Units"
                                            >
                                                <i className="fas fa-plus"></i> Restock
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
