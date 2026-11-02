/**
 * MediCare HMS - Master Clinical Data Store & RBAC System
 */

export const defaultPatients = [
    { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male', bloodGroup: 'O+', phone: '9876543210', email: 'rajesh@email.com', address: '123 MG Road, Delhi', admissionDate: '2026-08-15', condition: 'Diabetes Mellitus', status: 'Admitted', history: [{date:'2026-08-15',event:'Admitted for glycemic stabilization'},{date:'2026-08-20',event:'HbA1c test completed (7.8%)'},{date:'2026-08-25',event:'Prescribed continuous insulin regimen'}] },
    { id: 'P002', name: 'Sunita Sharma', age: 34, gender: 'Female', bloodGroup: 'A+', phone: '9876543211', email: 'sunita@email.com', address: '45 Park Street, Kolkata', admissionDate: '2026-08-18', condition: 'Hypertension', status: 'Outpatient', history: [{date:'2026-08-18',event:'Routine consultation for high BP (145/95)'}] },
    { id: 'P003', name: 'Amit Patel', age: 28, gender: 'Male', bloodGroup: 'B+', phone: '9876543212', email: 'amit@email.com', address: '78 SG Highway, Ahmedabad', admissionDate: '2026-08-22', condition: 'Compound Tibia Fracture', status: 'Admitted', history: [{date:'2026-08-22',event:'Admitted to Ortho Wing after road injury'},{date:'2026-08-23',event:'Open reduction internal fixation surgery successful'}] },
    { id: 'P004', name: 'Priya Singh', age: 52, gender: 'Female', bloodGroup: 'O-', phone: '9876543213', email: 'priya.s@email.com', address: '12 Linking Road, Mumbai', admissionDate: '2026-08-01', condition: 'Acute Myocardial Infarction', status: 'Discharged', history: [{date:'2026-08-01',event:'ICU emergency admission with ST-elevation'},{date:'2026-08-15',event:'Angioplasty recovery in Ward 3'},{date:'2026-08-20',event:'Discharged with cardiac rehabilitation plan'}] },
    { id: 'P005', name: 'Vikram Reddy', age: 60, gender: 'Male', bloodGroup: 'AB+', phone: '9876543214', email: 'vikram@email.com', address: '56 Jubilee Hills, Hyderabad', admissionDate: '2026-08-25', condition: 'Severe COPD Flare', status: 'Admitted', history: [{date:'2026-08-25',event:'Admitted on 4L nasal cannula oxygen support'}] },
    { id: 'P006', name: 'Neha Gupta', age: 22, gender: 'Female', bloodGroup: 'B-', phone: '9876543215', email: 'neha@email.com', address: '89 FC Road, Pune', admissionDate: '2026-08-28', condition: 'Dengue Hemorrhagic Fever', status: 'Admitted', history: [{date:'2026-08-28',event:'Platelet count 58,000 / μL. IV fluid resuscitation.'}] },
    { id: 'P007', name: 'Ramesh Rao', age: 70, gender: 'Male', bloodGroup: 'A-', phone: '9876543216', email: 'ramesh@email.com', address: '34 MG Road, Bengaluru', admissionDate: '2026-08-10', condition: 'Severe Osteoarthritis', status: 'Outpatient', history: [{date:'2026-08-10',event:'Intra-articular knee injection administered'}] },
    { id: 'P008', name: 'Kavita Joshi', age: 40, gender: 'Female', bloodGroup: 'O+', phone: '9876543217', email: 'kavita@email.com', address: '67 Mall Road, Shimla', admissionDate: '2026-09-01', condition: 'Chronic Migraine', status: 'Outpatient', history: [{date:'2026-09-01',event:'Neurology diagnostic consult completed'}] }
];

export const defaultDoctors = [
    { id: 'D001', name: 'Dr. Priya Sharma', specialization: 'Interventional Cardiologist', department: 'Cardiology', phone: '9876543001', email: 'priya.sharma@hospital.com', experience: '12 years', availability: 'Available', schedule: {Mon:'9AM-5PM',Tue:'9AM-5PM',Wed:'9AM-1PM',Thu:'9AM-5PM',Fri:'9AM-5PM',Sat:'10AM-2PM',Sun:'Off'} },
    { id: 'D002', name: 'Dr. Rahul Verma', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', phone: '9876543002', email: 'rahul.verma@hospital.com', experience: '15 years', availability: 'On Leave', schedule: {Mon:'10AM-6PM',Tue:'10AM-6PM',Wed:'Off',Thu:'10AM-6PM',Fri:'10AM-6PM',Sat:'9AM-1PM',Sun:'Off'} },
    { id: 'D003', name: 'Dr. Sneha Desai', specialization: 'Senior Neuro Physician', department: 'Neurology', phone: '9876543003', email: 'sneha.desai@hospital.com', experience: '8 years', availability: 'Available', schedule: {Mon:'9AM-4PM',Tue:'9AM-4PM',Wed:'9AM-4PM',Thu:'9AM-4PM',Fri:'9AM-4PM',Sat:'Off',Sun:'Off'} },
    { id: 'D004', name: 'Dr. Anil Kumar', specialization: 'Chief Pediatrician', department: 'Pediatrics', phone: '9876543004', email: 'anil.kumar@hospital.com', experience: '20 years', availability: 'Available', schedule: {Mon:'8AM-2PM',Tue:'8AM-2PM',Wed:'8AM-2PM',Thu:'8AM-2PM',Fri:'8AM-2PM',Sat:'8AM-12PM',Sun:'Off'} },
    { id: 'D005', name: 'Dr. Meera Iyer', specialization: 'Internal Medicine Specialist', department: 'General Medicine', phone: '9876543005', email: 'meera.iyer@hospital.com', experience: '10 years', availability: 'Available', schedule: {Mon:'9AM-5PM',Tue:'9AM-5PM',Wed:'9AM-5PM',Thu:'9AM-5PM',Fri:'9AM-5PM',Sat:'9AM-1PM',Sun:'Off'} },
    { id: 'D006', name: 'Dr. Vikram Malhotra', specialization: 'Consultant Dermatologist', department: 'Dermatology', phone: '9876543006', email: 'vikram.m@hospital.com', experience: '6 years', availability: 'Available', schedule: {Mon:'11AM-7PM',Tue:'11AM-7PM',Wed:'11AM-7PM',Thu:'11AM-7PM',Fri:'11AM-7PM',Sat:'Off',Sun:'Off'} }
];

export const defaultAppointments = [
    { id: 'A001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', date: '2026-09-17', time: '10:00 AM', status: 'Completed', type: 'Follow-up' },
    { id: 'A002', patientId: 'P002', patientName: 'Sunita Sharma', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', department: 'General Medicine', date: '2026-09-17', time: '11:30 AM', status: 'Completed', type: 'Consultation' },
    { id: 'A003', patientId: 'P003', patientName: 'Amit Patel', doctorId: 'D002', doctorName: 'Dr. Rahul Verma', department: 'Orthopedics', date: '2026-09-18', time: '02:00 PM', status: 'Confirmed', type: 'Checkup' },
    { id: 'A004', patientId: 'P005', patientName: 'Vikram Reddy', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', department: 'General Medicine', date: '2026-09-18', time: '04:00 PM', status: 'Scheduled', type: 'Emergency' },
    { id: 'A005', patientId: 'P006', patientName: 'Neha Gupta', doctorId: 'D004', doctorName: 'Dr. Anil Kumar', department: 'Pediatrics', date: '2026-09-19', time: '09:30 AM', status: 'Scheduled', type: 'Routine' },
    { id: 'A006', patientId: 'P008', patientName: 'Kavita Joshi', doctorId: 'D003', doctorName: 'Dr. Sneha Desai', department: 'Neurology', date: '2026-09-20', time: '11:00 AM', status: 'Scheduled', type: 'Consultation' }
];

export const defaultPrescriptions = [
    { id: 'RX001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', date: '2026-09-15', diagnosis: 'Type 2 Diabetes Mellitus with Mild Neuropathy', status: 'Dispensed', medicines: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', duration: '30 days', instructions: 'Monitor fasting blood sugar weekly' }, { name: 'Glimepiride', dosage: '1mg', frequency: 'Once daily before breakfast', duration: '30 days', instructions: 'Do not skip breakfast' }] },
    { id: 'RX002', patientId: 'P002', patientName: 'Sunita Sharma', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', date: '2026-09-16', diagnosis: 'Essential Primary Hypertension', status: 'Pending', medicines: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily in the morning', duration: '60 days', instructions: 'Low salt diet recommended' }, { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily at bedtime', duration: '60 days', instructions: 'Check blood pressure twice weekly' }] },
    { id: 'RX003', patientId: 'P003', patientName: 'Amit Patel', doctorId: 'D002', doctorName: 'Dr. Rahul Verma', date: '2026-09-16', diagnosis: 'Post-Operative Tibia Fracture Recovery', status: 'Dispensed', medicines: [{ name: 'Cefixime', dosage: '200mg', frequency: 'Twice daily after meals', duration: '7 days', instructions: 'Complete the entire antibiotic course' }, { name: 'Tramadol / Paracetamol', dosage: '37.5mg/325mg', frequency: 'As needed for acute pain (max 3/day)', duration: '5 days', instructions: 'Avoid operating heavy machinery' }] }
];

export const defaultBills = [
    { id: 'INV001', patientId: 'P001', patientName: 'Rajesh Kumar', date: '2026-09-15', items: [{ desc: 'Cardiology Specialist Consultation Fee', amount: 1500 }, { desc: 'Comprehensive HbA1c & Blood Chemistry Panel', amount: 850 }, { desc: 'Pharmacy Dispensing (Metformin, Glimepiride)', amount: 450 }], total: 2800, paymentMethod: 'Insurance TPA', insuranceProvider: 'Star Health Care', status: 'Paid' },
    { id: 'INV002', patientId: 'P002', patientName: 'Sunita Sharma', date: '2026-09-16', items: [{ desc: 'Internal Medicine General Consultation', amount: 800 }, { desc: 'Resting Electrocardiogram (ECG 12-Lead)', amount: 600 }, { desc: 'Comprehensive Lipid & Renal Profile', amount: 1200 }], total: 2600, paymentMethod: 'UPI / Digital', status: 'Paid' },
    { id: 'INV003', patientId: 'P003', patientName: 'Amit Patel', date: '2026-09-16', items: [{ desc: 'Emergency Trauma Admission & Triage', amount: 3500 }, { desc: 'Orthopedic Surgical Fee (ORIF Open Fixation)', amount: 45000 }, { desc: 'Operating Theatre & Anesthesiology Package', amount: 18000 }, { desc: 'Post-Op ICU Monitored Bed (2 Days)', amount: 12000 }], total: 78500, paymentMethod: 'Insurance TPA', insuranceProvider: 'HDFC ERGO Health', status: 'Pending' },
    { id: 'INV004', patientId: 'P004', patientName: 'Priya Singh', date: '2026-08-20', items: [{ desc: 'Emergency Percutaneous Coronary Intervention (PCI)', amount: 125000 }, { desc: 'Drug-Eluting Stents (2 Units)', amount: 60000 }, { desc: 'Cardiac ICU Stay (5 Days Dedicated Telemetry)', amount: 35000 }, { desc: 'Discharge Medications & Cardiac Care Kit', amount: 4500 }], total: 224500, paymentMethod: 'Insurance TPA', insuranceProvider: 'ICICI Lombard Health', status: 'Paid' }
];

export const defaultLabTests = [
    {
        id: 'LAB-101', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', testName: 'HbA1c & Fasting Blood Sugar', category: 'Biochemistry', priority: 'Routine', specimen: 'Venous Blood', orderedDate: '2026-09-17', status: 'Completed',
        results: [
            { parameter: 'HbA1c (Glycated Hb)', value: '7.8', unit: '%', range: '4.0 - 5.6', flag: 'High' },
            { parameter: 'Fasting Blood Glucose', value: '142', unit: 'mg/dL', range: '70 - 99', flag: 'High' }
        ],
        technician: 'Ravi Kumar', notes: 'Consistent with poorly controlled Type 2 Diabetes. Recommend insulin titration.'
    },
    {
        id: 'LAB-102', patientId: 'P006', patientName: 'Neha Gupta', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', testName: 'Dengue Serology & Complete Blood Count (CBC)', category: 'Hematology', priority: 'STAT', specimen: 'Whole Blood (EDTA)', orderedDate: '2026-09-17', status: 'In Progress',
        results: [
            { parameter: 'Platelet Count', value: '54,000', unit: '/μL', range: '150,000 - 450,000', flag: 'Critical Low' },
            { parameter: 'Hematocrit (PCV)', value: '44', unit: '%', range: '36 - 46', flag: 'Normal' },
            { parameter: 'Dengue NS1 Antigen', value: 'Positive', unit: '', range: 'Negative', flag: 'Abnormal' }
        ],
        technician: 'Ravi Kumar', notes: 'Thrombocytopenia alert triggered. Critical platelet count notification dispatched.'
    },
    {
        id: 'LAB-103', patientId: 'P004', patientName: 'Priya Singh', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', testName: 'Cardiac Troponin I & Lipid Panel', category: 'Cardiology Diagnostics', priority: 'Urgent', specimen: 'Serum', orderedDate: '2026-09-16', status: 'Completed',
        results: [
            { parameter: 'High-Sensitivity Troponin I', value: '0.012', unit: 'ng/mL', range: '< 0.014', flag: 'Normal' },
            { parameter: 'Total Cholesterol', value: '215', unit: 'mg/dL', range: '< 200', flag: 'Borderline' },
            { parameter: 'LDL Cholesterol', value: '138', unit: 'mg/dL', range: '< 100', flag: 'High' },
            { parameter: 'HDL Cholesterol', value: '46', unit: 'mg/dL', range: '> 50', flag: 'Low' }
        ],
        technician: 'Ravi Kumar', notes: 'Post-angioplasty troponin normalizing. Continue aggressive lipid-lowering therapy.'
    }
];

export const defaultMedicines = [
    { id: 'MED001', name: 'Paracetamol', genericName: 'Acetaminophen', category: 'Analgesic & Antipyretic', batch: 'PCM-2026-08', stock: 1250, minStock: 200, unitPrice: 2.5, expDate: '2027-12-31', supplier: 'Sun Pharma Ltd', status: 'In Stock' },
    { id: 'MED002', name: 'Amoxicillin + Clavulanic Acid', genericName: 'Augmentin 625 Duo', category: 'Broad Spectrum Antibiotic', batch: 'AMX-2026-04', stock: 85, minStock: 150, unitPrice: 22.0, expDate: '2027-08-31', supplier: 'GlaxoSmithKline', status: 'Low Stock' },
    { id: 'MED003', name: 'Atorvastatin', genericName: 'Lipitor 20mg', category: 'Cardiovascular / Statin', batch: 'ATV-2026-11', stock: 450, minStock: 100, unitPrice: 14.5, expDate: '2028-02-28', supplier: 'Cipla Therapeutics', status: 'In Stock' },
    { id: 'MED004', name: 'Metformin HCl', genericName: 'Glyciphage 500mg', category: 'Antidiabetic / Biguanide', batch: 'MET-2026-03', stock: 820, minStock: 200, unitPrice: 3.8, expDate: '2027-11-30', supplier: 'Franco-Indian Pharma', status: 'In Stock' },
    { id: 'MED005', name: 'Enoxaparin Sodium', genericName: 'Clexane 40mg/0.4ml', category: 'Anticoagulant (LMWH)', batch: 'ENO-2026-01', stock: 12, minStock: 30, unitPrice: 420.0, expDate: '2026-12-31', supplier: 'Sanofi Healthcare', status: 'Critical Low' }
];

export const defaultResources = [
    { id: 'RES001', category: 'Beds', name: 'ICU Critical Care Beds', total: 24, occupied: 18 },
    { id: 'RES002', category: 'Beds', name: 'Emergency Trauma Bays', total: 6, occupied: 4 },
    { id: 'RES003', category: 'Beds', name: 'General Inpatient Ward', total: 80, occupied: 44 },
    { id: 'RES004', category: 'Equipment', name: 'ICU Mechanical Ventilators', total: 24, occupied: 18 },
    { id: 'RES005', category: 'Fleet', name: 'Advanced Life Support Ambulances', total: 4, occupied: 2 }
];

export const ROLES = {
    ADMIN: {
        id: 'Admin',
        category: 'ADMIN',
        title: 'Master Administrator',
        allowedRoutes: ['/dashboard', '/patients', '/doctors', '/appointments', '/prescriptions', '/laboratory', '/pharmacy', '/emergency', '/billing', '/admin', '/patient-portal', '/slides'],
        navItems: [
            { href: '/dashboard', icon: 'fa-chart-pie', label: 'Admin Dashboard' },
            { href: '/patients', icon: 'fa-user-injured', label: 'Patients' },
            { href: '/doctors', icon: 'fa-user-md', label: 'Doctors' },
            { href: '/appointments', icon: 'fa-calendar-check', label: 'Appointments' },
            { href: '/prescriptions', icon: 'fa-prescription', label: 'Prescriptions' },
            { href: '/laboratory', icon: 'fa-flask', label: 'Laboratory' },
            { href: '/pharmacy', icon: 'fa-pills', label: 'Pharmacy' },
            { href: '/emergency', icon: 'fa-truck-medical', label: 'Emergency & ICU' },
            { href: '/billing', icon: 'fa-file-invoice-dollar', label: 'Billing' },
            { href: '/admin', icon: 'fa-shield-halved', label: 'Administration' },
            { href: '/slides', icon: 'fa-file-powerpoint', label: 'Presentation' }
        ],
        permissions: {
            canManageDoctors: true,
            canAddDoctor: true,
            canEditDoctor: true,
            canDeleteDoctor: true,
            canManageStaff: true,
            canManagePharmacy: true,
            canManageLab: true,
            canAccessAdminSettings: true,
            canAccessFinancialReports: true,
            canManagePatients: true,
            canRegisterPatients: true,
            canManageAppointments: true,
            canPrescribe: true,
            canDispenseMedicine: true,
            canEnterLabResults: true,
            canViewAllData: true
        }
    },
    DOCTOR: {
        id: 'Doctor',
        category: 'DOCTOR',
        title: 'Physician / Consultant',
        allowedRoutes: ['/dashboard', '/patients', '/appointments', '/prescriptions', '/emergency', '/patient-portal', '/slides'],
        navItems: [
            { href: '/dashboard', icon: 'fa-stethoscope', label: 'Doctor Cockpit' },
            { href: '/patients', icon: 'fa-user-injured', label: 'My Patients' },
            { href: '/appointments', icon: 'fa-calendar-check', label: 'My Appointments' },
            { href: '/prescriptions', icon: 'fa-prescription', label: 'Prescriptions' },
            { href: '/emergency', icon: 'fa-heart-pulse', label: 'ICU Telemetry' },
            { href: '/slides', icon: 'fa-file-powerpoint', label: 'Presentation' }
        ],
        permissions: {
            canManageDoctors: false,
            canAddDoctor: false,
            canEditDoctor: false,
            canDeleteDoctor: false,
            canManageStaff: false,
            canManagePharmacy: false,
            canManageLab: false,
            canAccessAdminSettings: false,
            canAccessFinancialReports: false,
            canManagePatients: false,
            canRegisterPatients: false,
            canManageAppointments: true,
            canPrescribe: true,
            canDispenseMedicine: false,
            canEnterLabResults: false,
            canViewAllData: false
        }
    },
    RECEPTIONIST: {
        id: 'Receptionist',
        category: 'STAFF',
        title: 'Front Desk & Admissions',
        allowedRoutes: ['/dashboard', '/patients', '/appointments', '/billing', '/patient-portal', '/slides'],
        navItems: [
            { href: '/dashboard', icon: 'fa-concierge-bell', label: 'Reception Desk' },
            { href: '/patients', icon: 'fa-user-plus', label: 'Patient Registration' },
            { href: '/appointments', icon: 'fa-calendar-plus', label: 'Appointments' },
            { href: '/billing', icon: 'fa-receipt', label: 'Billing Counter' },
            { href: '/slides', icon: 'fa-file-powerpoint', label: 'Presentation' }
        ],
        permissions: {
            canManageDoctors: false,
            canAddDoctor: false,
            canEditDoctor: false,
            canDeleteDoctor: false,
            canManageStaff: false,
            canManagePharmacy: false,
            canManageLab: false,
            canAccessAdminSettings: false,
            canAccessFinancialReports: false,
            canRegisterPatients: true,
            canManagePatients: true,
            canManageAppointments: true,
            canPrescribe: false,
            canDispenseMedicine: false,
            canEnterLabResults: false,
            canViewAllData: false
        }
    },
    PHARMACIST: {
        id: 'Pharmacist',
        category: 'STAFF',
        title: 'Pharmacy Operations',
        allowedRoutes: ['/dashboard', '/pharmacy', '/prescriptions', '/billing', '/patient-portal', '/slides'],
        navItems: [
            { href: '/dashboard', icon: 'fa-laptop-medical', label: 'Pharmacy Dashboard' },
            { href: '/pharmacy', icon: 'fa-pills', label: 'Medicines & Stock' },
            { href: '/prescriptions', icon: 'fa-file-prescription', label: 'Prescriptions Received' },
            { href: '/billing', icon: 'fa-receipt', label: 'Pharmacy Billing' },
            { href: '/slides', icon: 'fa-file-powerpoint', label: 'Presentation' }
        ],
        permissions: {
            canManageDoctors: false,
            canAddDoctor: false,
            canEditDoctor: false,
            canDeleteDoctor: false,
            canManageStaff: false,
            canManagePharmacy: true,
            canDispenseMedicine: true,
            canManageLab: false,
            canAccessAdminSettings: false,
            canAccessFinancialReports: false,
            canPrescribe: false,
            canEnterLabResults: false,
            canViewAllData: false
        }
    },
    LABTECHNICIAN: {
        id: 'LabTechnician',
        category: 'STAFF',
        title: 'Diagnostic Pathology & Lab',
        allowedRoutes: ['/dashboard', '/laboratory', '/patient-portal', '/slides'],
        navItems: [
            { href: '/dashboard', icon: 'fa-flask-vial', label: 'Laboratory Dashboard' },
            { href: '/laboratory', icon: 'fa-microscope', label: 'Diagnostic Tests' },
            { href: '/slides', icon: 'fa-file-powerpoint', label: 'Presentation' }
        ],
        permissions: {
            canManageDoctors: false,
            canAddDoctor: false,
            canEditDoctor: false,
            canDeleteDoctor: false,
            canManageStaff: false,
            canManagePharmacy: false,
            canManageLab: true,
            canEnterLabResults: true,
            canAccessAdminSettings: false,
            canAccessFinancialReports: false,
            canPrescribe: false,
            canDispenseMedicine: false,
            canViewAllData: false
        }
    }
};

export function getRoleConfig(role) {
    const raw = String(role || 'Admin').toUpperCase().replace(/[^A-Z]/g, '');
    if (raw.includes('DOCTOR')) return ROLES.DOCTOR;
    if (raw.includes('RECEPTION')) return ROLES.RECEPTIONIST;
    if (raw.includes('PHARMAC')) return ROLES.PHARMACIST;
    if (raw.includes('LAB') || raw.includes('PATHO')) return ROLES.LABTECHNICIAN;
    return ROLES.ADMIN;
}

export function loadData(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch (_) {
        return fallback;
    }
}

export function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (_) {}
}

// Web Audio API Synthesizer
let audioCtx = null;
export function playSound(type = 'click') {
    if (localStorage.getItem('hms_sound') === 'muted') return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const t = audioCtx.currentTime;

        if (type === 'click') {
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
            osc.start(t);
            osc.stop(t + 0.04);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(523.25, t);
            osc.frequency.setValueAtTime(659.25, t + 0.08);
            osc.frequency.setValueAtTime(783.99, t + 0.16);
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
            osc.start(t);
            osc.stop(t + 0.32);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, t);
            osc.frequency.setValueAtTime(160, t + 0.1);
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            osc.start(t);
            osc.stop(t + 0.25);
        } else if (type === 'alarm') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, t);
            osc.frequency.setValueAtTime(660, t + 0.15);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.3);
        }
    } catch (_) {}
}

export function formatCurrency(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (_) {
        return dateStr;
    }
}
