/**
 * MediCare HMS - Masterpiece Core Application Engine
 * Features: Live Theme Engine, Web Audio Synthesizer, Real-Time Clock & Ticker,
 * Glassmorphic HUD, Full CRUD Operations, and Unified Cross-Page Architecture.
 */

// ==========================================
// 1. SAMPLE DATA (Pre-loaded Hospital State)
// ==========================================
const defaultPatients = [
    { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male', bloodGroup: 'O+', phone: '9876543210', email: 'rajesh@email.com', address: '123 MG Road, Delhi', admissionDate: '2026-08-15', condition: 'Diabetes Mellitus', status: 'Admitted', history: [{date:'2026-08-15',event:'Admitted for glycemic stabilization'},{date:'2026-08-20',event:'HbA1c test completed (7.8%)'},{date:'2026-08-25',event:'Prescribed continuous insulin regimen'}] },
    { id: 'P002', name: 'Sunita Sharma', age: 34, gender: 'Female', bloodGroup: 'A+', phone: '9876543211', email: 'sunita@email.com', address: '45 Park Street, Kolkata', admissionDate: '2026-08-18', condition: 'Hypertension', status: 'Outpatient', history: [{date:'2026-08-18',event:'Routine consultation for high BP (145/95)'}] },
    { id: 'P003', name: 'Amit Patel', age: 28, gender: 'Male', bloodGroup: 'B+', phone: '9876543212', email: 'amit@email.com', address: '78 SG Highway, Ahmedabad', admissionDate: '2026-08-22', condition: 'Compound Tibia Fracture', status: 'Admitted', history: [{date:'2026-08-22',event:'Admitted to Ortho Wing after road injury'},{date:'2026-08-23',event:'Open reduction internal fixation surgery successful'}] },
    { id: 'P004', name: 'Priya Singh', age: 52, gender: 'Female', bloodGroup: 'O-', phone: '9876543213', email: 'priya.s@email.com', address: '12 Linking Road, Mumbai', admissionDate: '2026-08-01', condition: 'Acute Myocardial Infarction', status: 'Discharged', history: [{date:'2026-08-01',event:'ICU emergency admission with ST-elevation'},{date:'2026-08-15',event:'Angioplasty recovery in Ward 3'},{date:'2026-08-20',event:'Discharged with cardiac rehabilitation plan'}] },
    { id: 'P005', name: 'Vikram Reddy', age: 60, gender: 'Male', bloodGroup: 'AB+', phone: '9876543214', email: 'vikram@email.com', address: '56 Jubilee Hills, Hyderabad', admissionDate: '2026-08-25', condition: 'Severe COPD Flare', status: 'Admitted', history: [{date:'2026-08-25',event:'Admitted on 4L nasal cannula oxygen support'}] },
    { id: 'P006', name: 'Neha Gupta', age: 22, gender: 'Female', bloodGroup: 'B-', phone: '9876543215', email: 'neha@email.com', address: '89 FC Road, Pune', admissionDate: '2026-08-28', condition: 'Dengue Hemorrhagic Fever', status: 'Admitted', history: [{date:'2026-08-28',event:'Platelet count 58,000 / μL. IV fluid resuscitation.'}] },
    { id: 'P007', name: 'Ramesh Rao', age: 70, gender: 'Male', bloodGroup: 'A-', phone: '9876543216', email: 'ramesh@email.com', address: '34 MG Road, Bengaluru', admissionDate: '2026-08-10', condition: 'Severe Osteoarthritis', status: 'Outpatient', history: [{date:'2026-08-10',event:'Intra-articular knee injection administered'}] },
    { id: 'P008', name: 'Kavita Joshi', age: 40, gender: 'Female', bloodGroup: 'O+', phone: '9876543217', email: 'kavita@email.com', address: '67 Mall Road, Shimla', admissionDate: '2026-09-01', condition: 'Chronic Migraine', status: 'Outpatient', history: [{date:'2026-09-01',event:'Neurology diagnostic consult completed'}] }
];

const defaultDoctors = [
    { id: 'D001', name: 'Dr. Priya Sharma', specialization: 'Interventional Cardiologist', department: 'Cardiology', phone: '9876543001', email: 'priya.sharma@hospital.com', experience: '12 years', availability: 'Available', schedule: {Mon:'9AM-5PM',Tue:'9AM-5PM',Wed:'9AM-1PM',Thu:'9AM-5PM',Fri:'9AM-5PM',Sat:'10AM-2PM',Sun:'Off'} },
    { id: 'D002', name: 'Dr. Rahul Verma', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', phone: '9876543002', email: 'rahul.verma@hospital.com', experience: '15 years', availability: 'On Leave', schedule: {Mon:'10AM-6PM',Tue:'10AM-6PM',Wed:'Off',Thu:'10AM-6PM',Fri:'10AM-6PM',Sat:'9AM-1PM',Sun:'Off'} },
    { id: 'D003', name: 'Dr. Sneha Desai', specialization: 'Senior Neuro Physician', department: 'Neurology', phone: '9876543003', email: 'sneha.desai@hospital.com', experience: '8 years', availability: 'Available', schedule: {Mon:'9AM-4PM',Tue:'9AM-4PM',Wed:'9AM-4PM',Thu:'9AM-4PM',Fri:'9AM-4PM',Sat:'Off',Sun:'Off'} },
    { id: 'D004', name: 'Dr. Anil Kumar', specialization: 'Chief Pediatrician', department: 'Pediatrics', phone: '9876543004', email: 'anil.kumar@hospital.com', experience: '20 years', availability: 'Available', schedule: {Mon:'8AM-2PM',Tue:'8AM-2PM',Wed:'8AM-2PM',Thu:'8AM-2PM',Fri:'8AM-2PM',Sat:'8AM-12PM',Sun:'Off'} },
    { id: 'D005', name: 'Dr. Meera Iyer', specialization: 'Internal Medicine Specialist', department: 'General Medicine', phone: '9876543005', email: 'meera.iyer@hospital.com', experience: '10 years', availability: 'Available', schedule: {Mon:'11AM-7PM',Tue:'11AM-7PM',Wed:'11AM-7PM',Thu:'11AM-7PM',Fri:'11AM-7PM',Sat:'Off',Sun:'Off'} },
    { id: 'D006', name: 'Dr. Sanjay Kapoor', specialization: 'Clinical Dermatologist', department: 'Dermatology', phone: '9876543006', email: 'sanjay.kapoor@hospital.com', experience: '5 years', availability: 'Available', schedule: {Mon:'9AM-5PM',Tue:'9AM-5PM',Wed:'9AM-5PM',Thu:'9AM-5PM',Fri:'Off',Sat:'9AM-2PM',Sun:'Off'} }
];

const defaultAppointments = [
    { id: 'A001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', date: '2026-09-17', time: '10:00 AM', reason: 'Routine Cardiodiabetic Review', status: 'Scheduled' },
    { id: 'A002', patientId: 'P002', patientName: 'Sunita Sharma', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', date: '2026-09-17', time: '11:30 AM', reason: 'BP Monitoring & Medication Adjustment', status: 'Completed' },
    { id: 'A003', patientId: 'P003', patientName: 'Amit Patel', doctorId: 'D002', doctorName: 'Dr. Rahul Verma', date: '2026-09-18', time: '09:00 AM', reason: 'Post-op Cast & X-Ray Review', status: 'Scheduled' },
    { id: 'A004', patientId: 'P004', patientName: 'Priya Singh', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', date: '2026-09-16', time: '02:00 PM', reason: 'Cardiac Echo Evaluation', status: 'Completed' },
    { id: 'A005', patientId: 'P005', patientName: 'Vikram Reddy', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', date: '2026-09-19', time: '12:00 PM', reason: 'Spirometry & Oxygen Titration', status: 'Scheduled' },
    { id: 'A006', patientId: 'P006', patientName: 'Neha Gupta', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', date: '2026-09-17', time: '04:00 PM', reason: 'Platelet Count Re-check', status: 'Scheduled' },
    { id: 'A007', patientId: 'P007', patientName: 'Ramesh Rao', doctorId: 'D002', doctorName: 'Dr. Rahul Verma', date: '2026-09-15', time: '10:30 AM', reason: 'Joint Mobilization Assessment', status: 'Cancelled' },
    { id: 'A008', patientId: 'P008', patientName: 'Kavita Joshi', doctorId: 'D003', doctorName: 'Dr. Sneha Desai', date: '2026-09-20', time: '11:00 AM', reason: 'MRI Brain Scan Review', status: 'Scheduled' }
];

const defaultBills = [
    { id: 'B001', patientId: 'P001', patientName: 'Rajesh Kumar', date: '2026-09-15', items: [{desc:'Endocrinology Consultation',amount:800},{desc:'Complete Blood Count & HbA1c',amount:1200},{desc:'Insulin Therapy Infusion',amount:2500},{desc:'Deluxe Ward (3 days)',amount:4500}], total: 9000, status: 'Paid', paymentMethod: 'Card' },
    { id: 'B002', patientId: 'P003', patientName: 'Amit Patel', date: '2026-09-14', items: [{desc:'Tibia ORIF Surgery & OT Charges',amount:35000},{desc:'Orthopedic Implants & Fixation',amount:15000},{desc:'Anesthetist Charges',amount:6000},{desc:'Hospital Stay (4 days)',amount:8000}], total: 64000, status: 'Pending', paymentMethod: 'Pending' },
    { id: 'B003', patientId: 'P004', patientName: 'Priya Singh', date: '2026-09-10', items: [{desc:'Cardiac ICU Emergency Resuscitation',amount:45000},{desc:'Coronary Angiography',amount:25000},{desc:'Cardiac Care Unit (5 days)',amount:15000},{desc:'Cardiology Care Medicines',amount:9500}], total: 94500, status: 'Paid', paymentMethod: 'Insurance' },
    { id: 'B004', patientId: 'P002', patientName: 'Sunita Sharma', date: '2026-09-12', items: [{desc:'General Medicine Consultation',amount:600},{desc:'Kidney Function & Lipid Panel',amount:1400}], total: 2000, status: 'Paid', paymentMethod: 'UPI' },
    { id: 'B005', patientId: 'P005', patientName: 'Vikram Reddy', date: '2026-09-02', items: [{desc:'Respiratory Emergency Triage',amount:2500},{desc:'High Flow Oxygen Support',amount:4500},{desc:'BiPAP Machine Rental',amount:3000}], total: 10000, status: 'Overdue', paymentMethod: 'Unpaid' },
    { id: 'B006', patientId: 'P006', patientName: 'Neha Gupta', date: '2026-09-16', items: [{desc:'Dengue NS1 Antigen & Platelet Series',amount:2200},{desc:'Daily Physician Round',amount:1500}], total: 3700, status: 'Pending', paymentMethod: 'Pending' }
];

const defaultPrescriptions = [
    { id: 'RX001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', date: '2026-09-15', diagnosis: 'Type 2 Diabetes Mellitus with Mild Neuropathy', medicines: [{name:'Metformin 1000mg ER',dosage:'1 tab',frequency:'Twice daily with meals',duration:'30 days'},{name:'Glimepiride 2mg',dosage:'1 tab',frequency:'Once daily before breakfast',duration:'30 days'},{name:'Methylcobalamin 1500mcg',dosage:'1 cap',frequency:'Once daily night',duration:'30 days'}], notes: 'Strict low carbohydrate diet. Maintain fasting blood sugar log daily.' },
    { id: 'RX002', patientId: 'P002', patientName: 'Sunita Sharma', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', date: '2026-09-12', diagnosis: 'Essential Stage-1 Hypertension', medicines: [{name:'Telmisartan 40mg + Amlodipine 5mg',dosage:'1 tab',frequency:'Once daily morning',duration:'30 days'}], notes: 'Salt restricted diet (< 4g/day). 30 minutes brisk walking daily.' },
    { id: 'RX003', patientId: 'P003', patientName: 'Amit Patel', doctorId: 'D002', doctorName: 'Dr. Rahul Verma', date: '2026-09-14', diagnosis: 'Post-op Tibia Fracture (Right)', medicines: [{name:'Cefuroxime Axetil 500mg',dosage:'1 tab',frequency:'Twice daily',duration:'7 days'},{name:'Tramadol + Paracetamol',dosage:'1 tab',frequency:'SOS for severe pain',duration:'5 days'},{name:'Calcium Carbonate + Vit D3',dosage:'1 tab',frequency:'Once daily post-lunch',duration:'60 days'}], notes: 'Strict non-weight bearing on right leg for 4 weeks. Keep surgical wound clean and dry.' },
    { id: 'RX004', patientId: 'P006', patientName: 'Neha Gupta', doctorId: 'D005', doctorName: 'Dr. Meera Iyer', date: '2026-09-16', diagnosis: 'Dengue Fever (Recovery Phase)', medicines: [{name:'Paracetamol 650mg',dosage:'1 tab',frequency:'SOS for temp > 100°F',duration:'3 days'},{name:'Carica Papaya Leaf Extract 1100mg',dosage:'1 tab',frequency:'Twice daily',duration:'5 days'},{name:'Oral Rehydration Salts (ORS)',dosage:'1 sachet in 1L water',frequency:'Sip throughout day',duration:'5 days'}], notes: 'Strictly avoid Aspirin and NSAIDs. Immediate ER visit if bleeding gums or black stools occur.' }
];

const defaultStaff = [
    { id: 'S001', name: 'Anita Verma', role: 'Chief Nursing Officer', department: 'Cardiology', shift: 'Morning', phone: '9876543101', status: 'On Duty' },
    { id: 'S002', name: 'Kiran Patel', role: 'Senior Critical Care Nurse', department: 'ICU', shift: 'Night', phone: '9876543102', status: 'Off Duty' },
    { id: 'S003', name: 'Ravi Kumar', role: 'Senior Lab Technologist', department: 'Pathology', shift: 'Morning', phone: '9876543103', status: 'On Duty' },
    { id: 'S004', name: 'Sushma Singh', role: 'Head Pharmacist', department: 'Pharmacy', shift: 'Morning', phone: '9876543104', status: 'On Duty' },
    { id: 'S005', name: 'Pooja Das', role: 'Front Desk Lead', department: 'Administration', shift: 'Morning', phone: '9876543105', status: 'On Duty' },
    { id: 'S006', name: 'Manoj Tiwari', role: 'Ward Supervisor', department: 'General Ward', shift: 'Evening', phone: '9876543106', status: 'On Duty' },
    { id: 'S007', name: 'Deepak Sharma', role: 'Advanced Ambulance Driver', department: 'Emergency Transport', shift: 'Night', phone: '9876543107', status: 'On Duty' },
    { id: 'S008', name: 'Sneha Reddy', role: 'Pediatric Care Nurse', department: 'Pediatrics', shift: 'Evening', phone: '9876543108', status: 'On Leave' }
];

const defaultResources = [
    { id: 'R001', name: 'ICU Ventilator Beds', total: 24, occupied: 18, category: 'Beds' },
    { id: 'R002', name: 'General Inpatient Beds', total: 120, occupied: 82, category: 'Beds' },
    { id: 'R003', name: 'Modular Operation Theatres', total: 8, occupied: 5, category: 'OT' },
    { id: 'R004', name: 'High-Flow Ventilators', total: 16, occupied: 11, category: 'Equipment' },
    { id: 'R005', name: '3T Digital MRI Scanner', total: 2, occupied: 1, category: 'Diagnostic' },
    { id: 'R006', name: '128-Slice CT Scanner', total: 3, occupied: 2, category: 'Diagnostic' },
    { id: 'R007', name: 'Advanced Life Support Ambulances', total: 10, occupied: 6, category: 'Vehicles' },
    { id: 'R008', name: 'Central Oxygen Storage (KL)', total: 50, occupied: 38, category: 'Critical Utilities' }
];

// ==========================================
// 2. STORAGE & DATA UTILITIES
// ==========================================
function loadData(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn(`Error reading key ${key}`, e);
        return fallback;
    }
}

function saveData(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
        console.error(`Error saving key ${key}`, e);
    }
}

function generateId(prefix) {
    const num = Math.floor(100 + Math.random() * 900);
    return `${prefix}${Date.now().toString().slice(-3)}${num}`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ==========================================
// 3. SOUND SYNTHESIZER (Web Audio API)
// ==========================================
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSound(type = 'click') {
    const isMuted = localStorage.getItem('hms_sound_muted') === 'true';
    if (isMuted) return;

    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'click') {
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'modal') {
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc.start(now);
            osc.stop(now + 0.09);
        } else if (type === 'warp') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(980, now + 0.65);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.linearRampToValueAtTime(0.14, now + 0.25);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);
            osc.start(now);
            osc.stop(now + 0.68);
        }
    } catch (e) {
        // Audio API may be restricted until user gesture
    }
}

function toggleSound() {
    const current = localStorage.getItem('hms_sound_muted') === 'true';
    const newState = !current;
    localStorage.setItem('hms_sound_muted', newState ? 'true' : 'false');
    updateSoundButtonIcon();
    showToast(newState ? 'Sound Muted' : 'Sound Enabled', 'info');
    if (!newState) playSound('success');
}

function updateSoundButtonIcon() {
    const isMuted = localStorage.getItem('hms_sound_muted') === 'true';
    document.querySelectorAll('.sound-toggle i').forEach(icon => {
        icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });
}

// ==========================================
// 4. LIVE THEME & AMBIENT CANVAS ENGINE
// ==========================================
const THEMES = ['cyber-glass', 'aurora-glass', 'frost-light'];

function initThemeEngine() {
    const saved = localStorage.getItem('hms_theme') || 'cyber-glass';
    applyTheme(saved);
    injectAmbientBackground();
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('hms_theme', theme);
    
    // Update theme toggle buttons icon
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
        if (theme === 'cyber-glass') icon.className = 'fas fa-moon';
        else if (theme === 'aurora-glass') icon.className = 'fas fa-gem';
        else icon.className = 'fas fa-sun';
    });
}

function toggleTheme() {
    playSound('click');
    const current = document.body.getAttribute('data-theme') || 'cyber-glass';
    const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
    const nextTheme = THEMES[nextIdx];
    applyTheme(nextTheme);
    showToast(`Theme Switched: ${nextTheme.replace('-', ' ').toUpperCase()}`, 'info');
}

// ==========================================
// 4b. LIVE SUPER-GRAPHIC TOUCH-RESPONSIVE WALLPAPERS
// ==========================================
const WALLPAPER_MODES = [
    { id: 'hospital3d', name: '🏥 Cinematic Hospital 3D', icon: 'fa-hospital' },
    { id: 'synapse', name: '🌌 Bio-Synapse Matrix', icon: 'fa-brain' },
    { id: 'ecg', name: '💓 Vital ECG Pulsar', icon: 'fa-heartbeat' },
    { id: 'aurora', name: '✨ Fluid Cosmic Aurora', icon: 'fa-wind' },
    { id: 'grid', name: '🌐 Cyber Matrix Grid', icon: 'fa-cube' }
];

const isLoginPage = typeof window !== 'undefined' && (
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname.endsWith('/') ||
    !window.location.pathname.includes('.html')
);

let currentWallpaperMode = localStorage.getItem('hms_wallpaper_mode') || (isLoginPage ? 'hospital3d' : 'hospital3d');
let wpCanvas = null;
let wpCtx = null;
let wpWidth = 0;
let wpHeight = 0;
let wpDpr = 1;
let wpAnimId = null;

const wpPointer = {
    x: -1000,
    y: -1000,
    isDown: false,
    radius: 170,
    trail: []
};

const wpShockwaves = [];
const wpSparks = [];
const wpParticles = [];
let ecgOffset = 0;
let auroraTime = 0;

// 3D Cinematic Hospital Corridor Walkthrough State
let corridorZ = 0;
let corridorSpeed = 2.2;
let targetCorridorSpeed = 2.2;
let isEnteringHospital = false;
let camTiltX = 0;
let camTiltY = 0;
let corridorTime = 0;
let hospitalDustMotes = [];

const HOSPITAL_DEPARTMENTS = [
    { name: 'EMERGENCY & TRAUMA LEVEL 1', sub: 'STAT RESUSCITATION', color: '#ef4444', icon: '🚨' },
    { name: 'ICU - INTENSIVE CARE SUITE 04', sub: 'CARDIAC INTENSIVE', color: '#06b6d4', icon: '💙' },
    { name: 'OR 02 - SURGICAL THEATRE', sub: 'ACTIVE STERILE SUITE', color: '#10b981', icon: '🟢' },
    { name: 'CARDIOLOGY & VASCULAR LAB', sub: 'CATHETERIZATION UNIT', color: '#f43f5e', icon: '💓' },
    { name: 'NEURO-DIAGNOSTICS & MRI', sub: 'ADVANCED NEURO-IMAGING', color: '#a855f7', icon: '🧠' },
    { name: 'PHARMACY & LAB DISPENSARY', sub: 'AUTOMATED DISPENSARY', color: '#38bdf8', icon: '💊' }
];

function initHospitalDustMotes() {
    hospitalDustMotes = [];
    for (let i = 0; i < 45; i++) {
        hospitalDustMotes.push({
            x: (Math.random() - 0.5) * 550,
            y: (Math.random() - 0.5) * 380,
            z: Math.random() * 2200,
            size: 1 + Math.random() * 2.2,
            alpha: 0.25 + Math.random() * 0.5
        });
    }
}

function cycleWallpaperMode() {
    playSound('modal');
    const idx = WALLPAPER_MODES.findIndex(m => m.id === currentWallpaperMode);
    const nextIdx = (idx + 1) % WALLPAPER_MODES.length;
    currentWallpaperMode = WALLPAPER_MODES[nextIdx].id;
    localStorage.setItem('hms_wallpaper_mode', currentWallpaperMode);
    updateWallpaperHUD();
    showToast(`Live Wallpaper: ${WALLPAPER_MODES[nextIdx].name}`, 'info');
    if (!wpCanvas || !wpCtx) injectAmbientBackground();
    createShockwave(window.innerWidth / 2, window.innerHeight / 2, 350);
    createSparks(window.innerWidth / 2, window.innerHeight / 2, 24);
}

function updateWallpaperHUD() {
    const pill = document.getElementById('wallpaperName');
    const modeObj = WALLPAPER_MODES.find(m => m.id === currentWallpaperMode) || WALLPAPER_MODES[0];
    if (pill) pill.textContent = modeObj.name;
    document.querySelectorAll('.wallpaper-toggle i').forEach(icon => {
        icon.className = `fas ${modeObj.icon}`;
    });
}

function createShockwave(x, y, maxRadius = 240) {
    wpShockwaves.push({
        x,
        y,
        r: 10,
        maxR: maxRadius,
        alpha: 0.85,
        color: getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#38bdf8'
    });
}

function createSparks(x, y, count = 16) {
    const primary = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#38bdf8';
    const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#c084fc';
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        wpSparks.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1.0,
            decay: 0.02 + Math.random() * 0.03,
            size: 2 + Math.random() * 3,
            color: Math.random() > 0.4 ? primary : accent
        });
    }
}

function initWallpaperParticles() {
    wpParticles.length = 0;
    const count = Math.min(85, Math.floor((window.innerWidth * window.innerHeight) / 14000));
    for (let i = 0; i < count; i++) {
        wpParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            baseRadius: 2 + Math.random() * 2.5,
            radius: 2 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
            orbitAngle: Math.random() * Math.PI * 2,
            color: Math.random() > 0.3 ? 'primary' : 'secondary'
        });
    }
}

function setupWallpaperEvents() {
    window.addEventListener('pointermove', (e) => {
        wpPointer.x = e.clientX;
        wpPointer.y = e.clientY;
        if (wpPointer.trail.length < 24) {
            wpPointer.trail.push({ x: e.clientX, y: e.clientY, alpha: 0.9, size: wpPointer.isDown ? 16 : 9 });
        }
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
        wpPointer.isDown = true;
        wpPointer.x = e.clientX;
        wpPointer.y = e.clientY;
        createShockwave(e.clientX, e.clientY);
        createSparks(e.clientX, e.clientY, 18);
    }, { passive: true });

    window.addEventListener('pointerup', () => {
        wpPointer.isDown = false;
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            wpPointer.x = t.clientX;
            wpPointer.y = t.clientY;
            createShockwave(t.clientX, t.clientY);
            createSparks(t.clientX, t.clientY, 14);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            wpPointer.x = t.clientX;
            wpPointer.y = t.clientY;
            wpPointer.trail.push({ x: t.clientX, y: t.clientY, alpha: 0.85, size: 14 });
        }
    }, { passive: true });

    window.addEventListener('resize', resizeWallpaperCanvas);
}

function resizeWallpaperCanvas() {
    if (!wpCanvas) return;
    wpDpr = Math.min(window.devicePixelRatio || 1, 2);
    wpWidth = window.innerWidth;
    wpHeight = window.innerHeight;
    wpCanvas.width = wpWidth * wpDpr;
    wpCanvas.height = wpHeight * wpDpr;
    if (wpCtx) wpCtx.scale(wpDpr, wpDpr);
    initWallpaperParticles();
}

function renderLiveWallpaper() {
    if (!wpCtx) return;
    wpCtx.clearRect(0, 0, wpWidth, wpHeight);

    const style = getComputedStyle(document.body);
    const primary = style.getPropertyValue('--primary').trim() || '#38bdf8';
    const secondary = style.getPropertyValue('--secondary').trim() || '#818cf8';
    const accent = style.getPropertyValue('--accent').trim() || '#c084fc';

    // 1. Render Specific Wallpaper Mode
    if (currentWallpaperMode === 'hospital3d') {
        renderHospitalCorridorMode();
    } else if (currentWallpaperMode === 'synapse') {
        renderSynapseMode(primary, secondary, accent);
    } else if (currentWallpaperMode === 'ecg') {
        renderECGMode(primary, accent);
    } else if (currentWallpaperMode === 'aurora') {
        renderAuroraMode(primary, secondary, accent);
    } else if (currentWallpaperMode === 'grid') {
        renderGridMode(primary, secondary);
    }

    // 2. Render Touch Trail
    renderTouchTrail(primary, accent);

    // 3. Render Shockwaves
    renderShockwaves();

    // 4. Render Sparks
    renderSparks();

    wpAnimId = requestAnimationFrame(renderLiveWallpaper);
}

function renderSynapseMode(primary, secondary, accent) {
    const pCount = wpParticles.length;
    for (let i = 0; i < pCount; i++) {
        const p = wpParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.03;
        p.radius = p.baseRadius + Math.sin(p.phase) * 1.0;

        if (p.x < 0) p.x = wpWidth;
        if (p.x > wpWidth) p.x = 0;
        if (p.y < 0) p.y = wpHeight;
        if (p.y > wpHeight) p.y = 0;

        // Pointer touch interaction
        const dx = wpPointer.x - p.x;
        const dy = wpPointer.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < wpPointer.radius) {
            const force = (wpPointer.radius - dist) / wpPointer.radius;
            if (wpPointer.isDown) {
                p.x += (dx / dist) * force * 5;
                p.y += (dy / dist) * force * 5;
            } else {
                p.x -= (dx / dist) * force * 2.5;
                p.y -= (dy / dist) * force * 2.5;
            }

            // Draw electric lightning arc to pointer
            wpCtx.beginPath();
            wpCtx.moveTo(p.x, p.y);
            const midX = (p.x + wpPointer.x) / 2 + (Math.random() - 0.5) * 12;
            const midY = (p.y + wpPointer.y) / 2 + (Math.random() - 0.5) * 12;
            wpCtx.quadraticCurveTo(midX, midY, wpPointer.x, wpPointer.y);
            wpCtx.strokeStyle = primary;
            wpCtx.lineWidth = 1.2 * force;
            wpCtx.globalAlpha = 0.55 * force;
            wpCtx.stroke();
            wpCtx.globalAlpha = 1.0;
        }

        // Draw particle node
        wpCtx.beginPath();
        wpCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        wpCtx.fillStyle = p.color === 'primary' ? primary : secondary;
        wpCtx.shadowColor = wpCtx.fillStyle;
        wpCtx.shadowBlur = 8;
        wpCtx.fill();
        wpCtx.shadowBlur = 0;

        // Connect nearby nodes
        for (let j = i + 1; j < pCount; j++) {
            const p2 = wpParticles[j];
            const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (pDist < 115) {
                const alpha = (1 - pDist / 115) * 0.35;
                wpCtx.beginPath();
                wpCtx.moveTo(p.x, p.y);
                wpCtx.lineTo(p2.x, p2.y);
                wpCtx.strokeStyle = primary;
                wpCtx.lineWidth = 0.8;
                wpCtx.globalAlpha = alpha;
                wpCtx.stroke();
                wpCtx.globalAlpha = 1.0;
            }
        }
    }
}

function renderECGMode(primary, accent) {
    ecgOffset += 2.5;
    const centerY = wpHeight * 0.5;

    // Draw ECG pulse line
    wpCtx.beginPath();
    wpCtx.lineWidth = 2.4;
    wpCtx.strokeStyle = primary;
    wpCtx.shadowColor = primary;
    wpCtx.shadowBlur = 14;

    for (let x = 0; x < wpWidth; x += 4) {
        const waveX = (x + ecgOffset) % 450;
        let y = centerY;

        // P wave
        if (waveX > 50 && waveX < 90) {
            y -= Math.sin(((waveX - 50) / 40) * Math.PI) * 15;
        }
        // Q drop
        else if (waveX >= 110 && waveX < 125) {
            y += ((waveX - 110) / 15) * 12;
        }
        // R high spike
        else if (waveX >= 125 && waveX < 155) {
            y -= Math.sin(((waveX - 125) / 30) * Math.PI) * 120;
        }
        // S drop
        else if (waveX >= 155 && waveX < 175) {
            y += Math.sin(((waveX - 155) / 20) * Math.PI) * 30;
        }
        // T wave
        else if (waveX >= 210 && waveX < 270) {
            y -= Math.sin(((waveX - 210) / 60) * Math.PI) * 28;
        }

        // Touch disturbance deflection
        const pDist = Math.hypot(x - wpPointer.x, y - wpPointer.y);
        if (pDist < 180) {
            const force = (180 - pDist) / 180;
            y += Math.sin(x * 0.1 + ecgOffset * 0.2) * 40 * force;
        }

        if (x === 0) wpCtx.moveTo(x, y);
        else wpCtx.lineTo(x, y);
    }
    wpCtx.stroke();
    wpCtx.shadowBlur = 0;

    // Floating biological blood cell particles
    for (let i = 0; i < wpParticles.length; i++) {
        const p = wpParticles[i];
        p.x += p.vx * 1.5;
        p.y += Math.sin(p.x * 0.01 + ecgOffset * 0.05) * 1.5;
        if (p.x < 0) p.x = wpWidth;
        if (p.x > wpWidth) p.x = 0;

        wpCtx.beginPath();
        wpCtx.arc(p.x, p.y, p.baseRadius * 1.4, 0, Math.PI * 2);
        wpCtx.fillStyle = accent;
        wpCtx.globalAlpha = 0.45;
        wpCtx.fill();
        wpCtx.globalAlpha = 1.0;
    }
}

function renderAuroraMode(primary, secondary, accent) {
    auroraTime += 0.015;
    const colors = [primary, secondary, accent];
    const orbCenters = [
        { x: wpWidth * 0.25, y: wpHeight * 0.35, r: 280 },
        { x: wpWidth * 0.75, y: wpHeight * 0.65, r: 340 },
        { x: wpWidth * 0.5, y: wpHeight * 0.5, r: 300 }
    ];

    for (let i = 0; i < orbCenters.length; i++) {
        const orb = orbCenters[i];
        const driftX = orb.x + Math.sin(auroraTime + i * 2) * 90;
        const driftY = orb.y + Math.cos(auroraTime * 0.8 + i) * 70;

        // Pointer fluid repulsion
        const dx = driftX - wpPointer.x;
        const dy = driftY - wpPointer.y;
        const dist = Math.hypot(dx, dy);
        let finalX = driftX;
        let finalY = driftY;
        if (dist < 260 && dist > 0) {
            const push = (260 - dist) * 0.5;
            finalX += (dx / dist) * push;
            finalY += (dy / dist) * push;
        }

        const grad = wpCtx.createRadialGradient(finalX, finalY, 10, finalX, finalY, orb.r);
        grad.addColorStop(0, colors[i % colors.length]);
        grad.addColorStop(0.5, colors[(i + 1) % colors.length]);
        grad.addColorStop(1, 'transparent');

        wpCtx.beginPath();
        wpCtx.arc(finalX, finalY, orb.r, 0, Math.PI * 2);
        wpCtx.fillStyle = grad;
        wpCtx.globalAlpha = 0.22;
        wpCtx.fill();
        wpCtx.globalAlpha = 1.0;
    }
}

function renderGridMode(primary, secondary) {
    const horizon = wpHeight * 0.45;
    const step = 45;

    wpCtx.strokeStyle = primary;
    wpCtx.lineWidth = 1;
    wpCtx.globalAlpha = 0.25;

    // Perspective vertical grid lines
    const cx = wpWidth * 0.5 + (wpPointer.x - wpWidth * 0.5) * 0.15;
    for (let x = -wpWidth; x <= wpWidth * 2; x += step * 2) {
        wpCtx.beginPath();
        wpCtx.moveTo(cx, horizon);
        wpCtx.lineTo(x, wpHeight);
        wpCtx.stroke();
    }

    // Perspective horizontal lines
    let curY = horizon;
    let gap = 4;
    while (curY < wpHeight) {
        wpCtx.beginPath();
        wpCtx.moveTo(0, curY);

        // Deform grid towards pointer
        if (Math.abs(curY - wpPointer.y) < 100) {
            const deform = (100 - Math.abs(curY - wpPointer.y)) * (wpPointer.isDown ? 0.35 : 0.15);
            wpCtx.quadraticCurveTo(wpPointer.x, curY + deform, wpWidth, curY);
        } else {
            wpCtx.lineTo(wpWidth, curY);
        }

        wpCtx.stroke();
        gap *= 1.14;
        curY += gap;
    }
    wpCtx.globalAlpha = 1.0;
}

function renderHospitalCorridorMode() {
    if (!hospitalDustMotes || !hospitalDustMotes.length) initHospitalDustMotes();

    // Lerp speed (normal glide vs hyperspeed warp entrance)
    corridorSpeed += (targetCorridorSpeed - corridorSpeed) * (isEnteringHospital ? 0.08 : 0.04);
    corridorZ += corridorSpeed;
    corridorTime += 0.02;

    // Smooth steadycam camera sway
    const swayX = Math.sin(corridorTime * 1.2) * 6;
    const swayY = Math.cos(corridorTime * 2.4) * 4.5;

    // Mouse / Touch Parallax Steering
    const targetTiltX = (wpPointer.x > -500) ? (wpPointer.x - wpWidth / 2) * 0.12 : 0;
    const targetTiltY = (wpPointer.y > -500) ? (wpPointer.y - wpHeight / 2) * 0.08 : 0;
    camTiltX += (targetTiltX - camTiltX) * 0.06;
    camTiltY += (targetTiltY - camTiltY) * 0.06;

    const camX = swayX + camTiltX;
    const camY = swayY + camTiltY;

    const vpX = wpWidth * 0.5;
    const vpY = wpHeight * 0.48;
    const F = wpWidth * 0.65;

    function project(x, y, z) {
        const relZ = z - corridorZ;
        if (relZ <= 10) return null;
        const scale = F / relZ;
        return {
            x: vpX + (x - camX) * scale,
            y: vpY + (y - camY) * scale,
            scale: scale,
            relZ: relZ
        };
    }

    const hallW = 340;
    const hallH = 220;
    const segDist = 180;
    const maxSegments = 16;
    const startSeg = Math.floor(corridorZ / segDist);

    // 1. Deep Horizon Atrium Glow
    const horizonGlowRad = isEnteringHospital ? wpWidth * 0.8 : wpWidth * 0.55;
    const glowGrad = wpCtx.createRadialGradient(vpX - camTiltX * 0.5, vpY - camTiltY * 0.5, 2, vpX - camTiltX * 0.5, vpY - camTiltY * 0.5, horizonGlowRad);
    glowGrad.addColorStop(0, isEnteringHospital ? 'rgba(255, 255, 255, 0.95)' : 'rgba(56, 189, 248, 0.65)');
    glowGrad.addColorStop(0.25, 'rgba(14, 165, 233, 0.4)');
    glowGrad.addColorStop(0.55, 'rgba(99, 102, 241, 0.18)');
    glowGrad.addColorStop(1, 'transparent');
    wpCtx.fillStyle = glowGrad;
    wpCtx.fillRect(0, 0, wpWidth, wpHeight);

    // 2. Far vanishing atrium glass double doors with medical cross
    const farP = project(0, 0, (startSeg + maxSegments) * segDist);
    if (farP) {
        const fW = hallW * 2 * farP.scale;
        const fH = hallH * 2 * farP.scale;
        const atriumGrad = wpCtx.createLinearGradient(0, farP.y - fH / 2, 0, farP.y + fH / 2);
        atriumGrad.addColorStop(0, '#38bdf8');
        atriumGrad.addColorStop(0.5, '#0284c7');
        atriumGrad.addColorStop(1, '#0369a1');
        wpCtx.fillStyle = atriumGrad;
        wpCtx.fillRect(farP.x - fW / 2, farP.y - fH / 2, fW, fH);

        // Distant glowing hospital cross
        const crossSize = Math.max(7, fH * 0.28);
        wpCtx.fillStyle = '#ffffff';
        wpCtx.shadowColor = '#ffffff';
        wpCtx.shadowBlur = 12;
        wpCtx.fillRect(farP.x - crossSize * 0.2, farP.y - crossSize * 0.5, crossSize * 0.4, crossSize);
        wpCtx.fillRect(farP.x - crossSize * 0.5, farP.y - crossSize * 0.2, crossSize, crossSize * 0.4);
        wpCtx.shadowBlur = 0;

        wpCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        wpCtx.lineWidth = 1.5;
        wpCtx.strokeRect(farP.x - fW / 2, farP.y - fH / 2, fW, fH);
    }

    // 3. Render Segments from Back to Front
    for (let i = startSeg + maxSegments; i >= startSeg; i--) {
        const zFar = (i + 1) * segDist;
        const zNear = i * segDist;

        const pTL_near = project(-hallW, -hallH, zNear);
        const pTR_near = project(hallW, -hallH, zNear);
        const pBL_near = project(-hallW, hallH, zNear);
        const pBR_near = project(hallW, hallH, zNear);

        const pTL_far = project(-hallW, -hallH, zFar);
        const pTR_far = project(hallW, -hallH, zFar);
        const pBL_far = project(-hallW, hallH, zFar);
        const pBR_far = project(hallW, hallH, zFar);

        if (!pTL_near || !pTL_far) continue;

        const depthAlpha = Math.min(1, Math.max(0, 1 - (pTL_near.relZ / (maxSegments * segDist))));

        // --- CEILING PLANE ---
        wpCtx.beginPath();
        wpCtx.moveTo(pTL_near.x, pTL_near.y);
        wpCtx.lineTo(pTR_near.x, pTR_near.y);
        wpCtx.lineTo(pTR_far.x, pTR_far.y);
        wpCtx.lineTo(pTL_far.x, pTL_far.y);
        wpCtx.closePath();
        const ceilGrad = wpCtx.createLinearGradient(0, pTL_near.y, 0, pTL_far.y);
        ceilGrad.addColorStop(0, `rgba(15, 23, 42, ${0.82 * depthAlpha})`);
        ceilGrad.addColorStop(1, `rgba(8, 14, 26, ${0.96 * depthAlpha})`);
        wpCtx.fillStyle = ceilGrad;
        wpCtx.fill();

        // --- FLOOR PLANE (Glossy Epoxy Reflection) ---
        wpCtx.beginPath();
        wpCtx.moveTo(pBL_near.x, pBL_near.y);
        wpCtx.lineTo(pBR_near.x, pBR_near.y);
        wpCtx.lineTo(pBR_far.x, pBR_far.y);
        wpCtx.lineTo(pBL_far.x, pBL_far.y);
        wpCtx.closePath();
        const floorGrad = wpCtx.createLinearGradient(0, pBL_near.y, 0, pBL_far.y);
        floorGrad.addColorStop(0, `rgba(10, 18, 36, ${0.92 * depthAlpha})`);
        floorGrad.addColorStop(1, `rgba(3, 7, 18, ${0.98 * depthAlpha})`);
        wpCtx.fillStyle = floorGrad;
        wpCtx.fill();

        // Floor tile border
        wpCtx.strokeStyle = `rgba(56, 189, 248, ${0.16 * depthAlpha})`;
        wpCtx.lineWidth = 1;
        wpCtx.stroke();

        // Floor center reflection line
        const pCenterNear = project(0, hallH, zNear);
        const pCenterFar = project(0, hallH, zFar);
        if (pCenterNear && pCenterFar) {
            wpCtx.beginPath();
            wpCtx.moveTo(pCenterNear.x, pCenterNear.y);
            wpCtx.lineTo(pCenterFar.x, pCenterFar.y);
            wpCtx.strokeStyle = `rgba(56, 189, 248, ${0.24 * depthAlpha})`;
            wpCtx.stroke();
        }

        // --- LEFT WALL ---
        wpCtx.beginPath();
        wpCtx.moveTo(pTL_near.x, pTL_near.y);
        wpCtx.lineTo(pTL_far.x, pTL_far.y);
        wpCtx.lineTo(pBL_far.x, pBL_far.y);
        wpCtx.lineTo(pBL_near.x, pBL_near.y);
        wpCtx.closePath();
        wpCtx.fillStyle = `rgba(13, 20, 36, ${0.78 * depthAlpha})`;
        wpCtx.fill();
        wpCtx.strokeStyle = `rgba(30, 41, 59, ${0.4 * depthAlpha})`;
        wpCtx.stroke();

        // --- RIGHT WALL ---
        wpCtx.beginPath();
        wpCtx.moveTo(pTR_near.x, pTR_near.y);
        wpCtx.lineTo(pTR_far.x, pTR_far.y);
        wpCtx.lineTo(pBR_far.x, pBR_far.y);
        wpCtx.lineTo(pBR_near.x, pBR_near.y);
        wpCtx.closePath();
        wpCtx.fillStyle = `rgba(13, 20, 36, ${0.78 * depthAlpha})`;
        wpCtx.fill();
        wpCtx.strokeStyle = `rgba(30, 41, 59, ${0.4 * depthAlpha})`;
        wpCtx.stroke();

        // --- WALL BUMPER & ACCENT STRIPS ---
        const pL_stripNear = project(-hallW, hallH - 30, zNear);
        const pL_stripFar = project(-hallW, hallH - 30, zFar);
        if (pL_stripNear && pL_stripFar) {
            wpCtx.beginPath();
            wpCtx.moveTo(pL_stripNear.x, pL_stripNear.y);
            wpCtx.lineTo(pL_stripFar.x, pL_stripFar.y);
            wpCtx.strokeStyle = `rgba(56, 189, 248, ${0.45 * depthAlpha})`;
            wpCtx.lineWidth = 1.5;
            wpCtx.stroke();
        }
        const pR_stripNear = project(hallW, hallH - 30, zNear);
        const pR_stripFar = project(hallW, hallH - 30, zFar);
        if (pR_stripNear && pR_stripFar) {
            wpCtx.beginPath();
            wpCtx.moveTo(pR_stripNear.x, pR_stripNear.y);
            wpCtx.lineTo(pR_stripFar.x, pR_stripFar.y);
            wpCtx.strokeStyle = `rgba(56, 189, 248, ${0.45 * depthAlpha})`;
            wpCtx.lineWidth = 1.5;
            wpCtx.stroke();
        }

        // --- RECESSED CEILING LED TROFFER ---
        const lightW = 48;
        const warpStretch = (corridorSpeed > 5) ? (corridorSpeed - 2.2) * 12 : 0;
        const lightZ1 = zNear + 30;
        const lightZ2 = zNear + 150 + warpStretch;
        const pLT1 = project(-lightW, -hallH + 1, lightZ1);
        const pLT2 = project(lightW, -hallH + 1, lightZ1);
        const pLT3 = project(lightW, -hallH + 1, lightZ2);
        const pLT4 = project(-lightW, -hallH + 1, lightZ2);

        if (pLT1 && pLT2 && pLT3 && pLT4) {
            wpCtx.beginPath();
            wpCtx.moveTo(pLT1.x, pLT1.y);
            wpCtx.lineTo(pLT2.x, pLT2.y);
            wpCtx.lineTo(pLT3.x, pLT3.y);
            wpCtx.lineTo(pLT4.x, pLT4.y);
            wpCtx.closePath();
            wpCtx.fillStyle = `rgba(240, 249, 255, ${0.92 * depthAlpha})`;
            wpCtx.shadowColor = '#38bdf8';
            wpCtx.shadowBlur = 14 * depthAlpha;
            wpCtx.fill();
            wpCtx.shadowBlur = 0;

            // FLOOR SPECULAR REFLECTION OF LIGHT TROFFER
            const pLF1 = project(-lightW, hallH - 1, lightZ1);
            const pLF2 = project(lightW, hallH - 1, lightZ1);
            const pLF3 = project(lightW, hallH - 1, lightZ2);
            const pLF4 = project(-lightW, hallH - 1, lightZ2);

            if (pLF1 && pLF2 && pLF3 && pLF4) {
                wpCtx.beginPath();
                wpCtx.moveTo(pLF1.x, pLF1.y);
                wpCtx.lineTo(pLF2.x, pLF2.y);
                wpCtx.lineTo(pLF3.x, pLF3.y);
                wpCtx.lineTo(pLF4.x, pLF4.y);
                wpCtx.closePath();
                wpCtx.fillStyle = `rgba(56, 189, 248, ${0.28 * depthAlpha})`;
                wpCtx.fill();
            }
        }

        // --- PASSING MEDICAL DEPARTMENT DOORS & SIGNS ---
        if (i % 2 === 0) {
            const isLeft = (i / 2) % 2 === 0;
            const wallX = isLeft ? -hallW : hallW;
            const deptIdx = Math.floor(i / 2) % HOSPITAL_DEPARTMENTS.length;
            const dept = HOSPITAL_DEPARTMENTS[deptIdx];

            const doorZ1 = zNear + 25;
            const doorZ2 = zNear + 155;
            const doorTopY = -hallH * 0.35;
            const doorBotY = hallH - 5;

            const pD1 = project(wallX, doorTopY, doorZ1);
            const pD2 = project(wallX, doorTopY, doorZ2);
            const pD3 = project(wallX, doorBotY, doorZ2);
            const pD4 = project(wallX, doorBotY, doorZ1);

            if (pD1 && pD2 && pD3 && pD4) {
                // Glass Door Frame
                wpCtx.beginPath();
                wpCtx.moveTo(pD1.x, pD1.y);
                wpCtx.lineTo(pD2.x, pD2.y);
                wpCtx.lineTo(pD3.x, pD3.y);
                wpCtx.lineTo(pD4.x, pD4.y);
                wpCtx.closePath();
                wpCtx.fillStyle = `rgba(14, 165, 233, ${0.12 * depthAlpha})`;
                wpCtx.fill();
                wpCtx.strokeStyle = `rgba(56, 189, 248, ${0.5 * depthAlpha})`;
                wpCtx.lineWidth = 1.2;
                wpCtx.stroke();

                // Floor glow under door
                const pDF1 = project(wallX, hallH - 1, doorZ1);
                const pDF2 = project(wallX, hallH - 1, doorZ2);
                const pDF3 = project(wallX * 0.72, hallH - 1, doorZ2);
                const pDF4 = project(wallX * 0.72, hallH - 1, doorZ1);
                if (pDF1 && pDF2 && pDF3 && pDF4) {
                    wpCtx.beginPath();
                    wpCtx.moveTo(pDF1.x, pDF1.y);
                    wpCtx.lineTo(pDF2.x, pDF2.y);
                    wpCtx.lineTo(pDF3.x, pDF3.y);
                    wpCtx.lineTo(pDF4.x, pDF4.y);
                    wpCtx.closePath();
                    wpCtx.fillStyle = dept.color;
                    wpCtx.globalAlpha = 0.16 * depthAlpha;
                    wpCtx.fill();
                    wpCtx.globalAlpha = 1.0;
                }

                // Illuminated Overhead Medical Sign Plaque
                const signH = 38;
                const pS1 = project(wallX, doorTopY - signH, doorZ1);
                const pS2 = project(wallX, doorTopY - signH, doorZ2);

                if (pS1 && pS2) {
                    wpCtx.beginPath();
                    wpCtx.moveTo(pS1.x, pS1.y);
                    wpCtx.lineTo(pS2.x, pS2.y);
                    wpCtx.lineTo(pD2.x, pD2.y);
                    wpCtx.lineTo(pD1.x, pD1.y);
                    wpCtx.closePath();
                    wpCtx.fillStyle = `rgba(15, 23, 42, ${0.92 * depthAlpha})`;
                    wpCtx.fill();
                    wpCtx.strokeStyle = dept.color;
                    wpCtx.lineWidth = 2 * depthAlpha;
                    wpCtx.shadowColor = dept.color;
                    wpCtx.shadowBlur = 10 * depthAlpha;
                    wpCtx.stroke();
                    wpCtx.shadowBlur = 0;

                    // Render sign name text if within readable range
                    if (pD1.relZ < 680 && pD1.relZ > 40) {
                        const signMidX = (pS1.x + pS2.x) / 2;
                        const signMidY = (pS1.y + pD1.y) / 2;
                        const signW = Math.abs(pS2.x - pS1.x);
                        const fontSize = Math.max(9, Math.min(18, signW * 0.12));
                        wpCtx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
                        wpCtx.fillStyle = '#ffffff';
                        wpCtx.textAlign = 'center';
                        wpCtx.textBaseline = 'middle';
                        wpCtx.shadowColor = dept.color;
                        wpCtx.shadowBlur = 10;
                        wpCtx.fillText(`${dept.icon} ${dept.name}`, signMidX, signMidY);
                        wpCtx.shadowBlur = 0;
                    }
                }
            }
        } else {
            // Alternating segment: Telemetry Vitals Monitor Mounted on Pillar!
            const isLeft = ((i - 1) / 2) % 2 === 1;
            const wallX = isLeft ? -hallW + 2 : hallW - 2;
            const monZ1 = zNear + 50;
            const monZ2 = zNear + 130;
            const monTopY = -hallH * 0.15;
            const monBotY = hallH * 0.25;

            const pM1 = project(wallX, monTopY, monZ1);
            const pM2 = project(wallX, monTopY, monZ2);
            const pM3 = project(wallX, monBotY, monZ2);
            const pM4 = project(wallX, monBotY, monZ1);

            if (pM1 && pM2 && pM3 && pM4) {
                wpCtx.beginPath();
                wpCtx.moveTo(pM1.x, pM1.y);
                wpCtx.lineTo(pM2.x, pM2.y);
                wpCtx.lineTo(pM3.x, pM3.y);
                wpCtx.lineTo(pM4.x, pM4.y);
                wpCtx.closePath();
                wpCtx.fillStyle = `rgba(2, 6, 23, ${0.92 * depthAlpha})`;
                wpCtx.fill();
                wpCtx.strokeStyle = `rgba(16, 185, 129, ${0.65 * depthAlpha})`;
                wpCtx.lineWidth = 1.2;
                wpCtx.stroke();

                // Live animated pulsing ECG waveform on the telemetry monitor
                if (pM1.relZ < 700) {
                    wpCtx.beginPath();
                    const step = (pM2.x - pM1.x) / 10;
                    for (let s = 0; s <= 10; s++) {
                        const px = pM1.x + step * s;
                        const py = (pM1.y + pM4.y) / 2 + Math.sin(s * 1.5 + corridorTime * 4) * 8 * pM1.scale * 3;
                        if (s === 0) wpCtx.moveTo(px, py);
                        else wpCtx.lineTo(px, py);
                    }
                    wpCtx.strokeStyle = '#10b981';
                    wpCtx.shadowColor = '#10b981';
                    wpCtx.shadowBlur = 6;
                    wpCtx.lineWidth = 1.5;
                    wpCtx.stroke();
                    wpCtx.shadowBlur = 0;
                }
            }
        }
    }

    // 4. Clinical Air Dust / Bokeh Motes
    for (let m of hospitalDustMotes) {
        m.z -= corridorSpeed * 0.7;
        if (m.z < 20) m.z = 2000;
        const p = project(m.x, m.y, m.z + corridorZ);
        if (p && p.relZ > 20 && p.relZ < 2000) {
            wpCtx.beginPath();
            wpCtx.arc(p.x, p.y, m.size * p.scale * 2.5, 0, Math.PI * 2);
            wpCtx.fillStyle = `rgba(224, 242, 254, ${m.alpha * Math.min(1, (2000 - p.relZ) / 2000)})`;
            wpCtx.shadowColor = '#38bdf8';
            wpCtx.shadowBlur = 6;
            wpCtx.fill();
            wpCtx.shadowBlur = 0;
        }
    }

    // 5. Warp Speed Light Streak Tunnel Effect (When Authenticating)
    if (isEnteringHospital || corridorSpeed > 8) {
        const streakAlpha = Math.min(0.8, (corridorSpeed - 2.2) / 30);
        wpCtx.save();
        wpCtx.globalCompositeOperation = 'lighter';
        for (let s = 0; s < 18; s++) {
            const angle = (s / 18) * Math.PI * 2;
            const r1 = 30 + Math.random() * 40;
            const r2 = r1 + corridorSpeed * 15;
            wpCtx.beginPath();
            wpCtx.moveTo(vpX + Math.cos(angle) * r1, vpY + Math.sin(angle) * r1);
            wpCtx.lineTo(vpX + Math.cos(angle) * r2, vpY + Math.sin(angle) * r2);
            wpCtx.strokeStyle = `rgba(56, 189, 248, ${streakAlpha * (0.4 + Math.random() * 0.6)})`;
            wpCtx.lineWidth = 2 + Math.random() * 3;
            wpCtx.stroke();
        }
        wpCtx.restore();
    }
}

function renderTouchTrail(primary, accent) {
    for (let i = wpPointer.trail.length - 1; i >= 0; i--) {
        const pt = wpPointer.trail[i];
        pt.alpha -= 0.035;
        pt.size *= 0.96;
        if (pt.alpha <= 0) {
            wpPointer.trail.splice(i, 1);
            continue;
        }
        wpCtx.beginPath();
        wpCtx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        wpCtx.fillStyle = i % 2 === 0 ? primary : accent;
        wpCtx.globalAlpha = pt.alpha * 0.6;
        wpCtx.shadowColor = wpCtx.fillStyle;
        wpCtx.shadowBlur = 10;
        wpCtx.fill();
        wpCtx.shadowBlur = 0;
        wpCtx.globalAlpha = 1.0;
    }
}

function renderShockwaves() {
    for (let i = wpShockwaves.length - 1; i >= 0; i--) {
        const sw = wpShockwaves[i];
        sw.r += 6;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0 || sw.r >= sw.maxR) {
            wpShockwaves.splice(i, 1);
            continue;
        }
        wpCtx.beginPath();
        wpCtx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        wpCtx.strokeStyle = sw.color;
        wpCtx.lineWidth = 2.5;
        wpCtx.globalAlpha = sw.alpha;
        wpCtx.shadowColor = sw.color;
        wpCtx.shadowBlur = 16;
        wpCtx.stroke();
        wpCtx.shadowBlur = 0;
        wpCtx.globalAlpha = 1.0;
    }
}

function renderSparks() {
    for (let i = wpSparks.length - 1; i >= 0; i--) {
        const sp = wpSparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.12;
        sp.vx *= 0.98;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
            wpSparks.splice(i, 1);
            continue;
        }

        wpCtx.beginPath();
        wpCtx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        wpCtx.fillStyle = sp.color;
        wpCtx.globalAlpha = sp.alpha;
        wpCtx.shadowColor = sp.color;
        wpCtx.shadowBlur = 8;
        wpCtx.fill();
        wpCtx.shadowBlur = 0;
        wpCtx.globalAlpha = 1.0;
    }
}

function injectAmbientBackground() {
    let bg = document.querySelector('.ambient-background');
    if (!bg) {
        bg = document.createElement('div');
        bg.className = 'ambient-background';
        document.body.prepend(bg);
    }

    // Ensure liveWallpaperCanvas exists inside .ambient-background
    let canvas = document.getElementById('liveWallpaperCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'liveWallpaperCanvas';
        bg.prepend(canvas);
    }

    // Ensure ambient orbs exist
    if (!bg.querySelector('.ambient-orb')) {
        bg.insertAdjacentHTML('beforeend', `
            <div class="ambient-orb orb-1"></div>
            <div class="ambient-orb orb-2"></div>
            <div class="ambient-orb orb-3"></div>
            <div class="ambient-grid"></div>
        `);
    }

    // Inject Floating Live Wallpaper Controller Pill
    if (!document.getElementById('wallpaperPill')) {
        const pill = document.createElement('div');
        pill.id = 'wallpaperPill';
        pill.className = 'wallpaper-hud-pill';
        pill.setAttribute('onclick', 'cycleWallpaperMode()');
        pill.setAttribute('title', 'Touch / Click to switch Live Interactive Wallpaper Mode');
        const modeObj = WALLPAPER_MODES.find(m => m.id === currentWallpaperMode) || WALLPAPER_MODES[0];
        pill.innerHTML = `
            <span class="pulse-dot"></span>
            <span id="wallpaperName">${modeObj.name}</span>
            <i class="fas fa-magic" style="color:var(--primary); font-size:0.8rem;"></i>
        `;
        document.body.appendChild(pill);
    }

    // Initialize Canvas
    wpCanvas = document.getElementById('liveWallpaperCanvas');
    if (wpCanvas) {
        wpCtx = wpCanvas.getContext('2d');
        resizeWallpaperCanvas();
        setupWallpaperEvents();
        if (wpAnimId) cancelAnimationFrame(wpAnimId);
        wpAnimId = requestAnimationFrame(renderLiveWallpaper);
    }
}

// ==========================================
// 5. LIVE DIGITAL CLOCK & TELEMETRY TICKER
// ==========================================
function initLiveHUD() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

    // Update any clock widgets
    document.querySelectorAll('.live-clock-widget').forEach(widget => {
        const timeEl = widget.querySelector('.clock-time') || widget.querySelector('#liveTime');
        const dateEl = widget.querySelector('.clock-date') || widget.querySelector('#liveDate');
        if (timeEl) timeEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
    });

    const timeDirect = document.getElementById('liveTime');
    if (timeDirect) timeDirect.textContent = timeStr;
    const dateDirect = document.getElementById('liveDate');
    if (dateDirect) dateDirect.textContent = dateStr;
}

function toggleSidebar() {
    playSound('click');
    const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
    const main = document.querySelector('.main-content') || document.querySelector('.main-wrapper');
    if (sidebar) sidebar.classList.toggle('collapsed');
    if (main) main.classList.toggle('expanded');

    // On mobile screen
    if (window.innerWidth <= 1024 && sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

// ==========================================
// 6. TOAST NOTIFICATIONS & MODALS
// ==========================================
function showToast(message, type = 'success') {
    playSound(type === 'error' ? 'click' : 'success');
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

function openModal(id) {
    playSound('modal');
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.zIndex = '99999';
        const inner = modal.querySelector('.modal, .modal-dialog, .modal-content');
        if (inner) {
            inner.style.display = 'flex';
            inner.style.visibility = 'visible';
            inner.style.opacity = '1';
        }
        setTimeout(() => {
            const firstInput = modal.querySelector('input:not([type="hidden"]):not([readonly]), select, textarea');
            if (firstInput) firstInput.focus();
        }, 50);
    } else {
        console.warn('Modal not found:', id);
    }
}

function closeModal(id) {
    playSound('click');
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// ==========================================
// 7. GLOBAL INITIALIZATION (DOMContentLoaded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Engine & Live Ambient Canvas
    initThemeEngine();
    updateSoundButtonIcon();
    updateWallpaperHUD();

    // 2. Initialize Seed Data in LocalStorage
    if (!localStorage.getItem('hms_patients')) saveData('hms_patients', defaultPatients);
    if (!localStorage.getItem('hms_doctors')) saveData('hms_doctors', defaultDoctors);
    if (!localStorage.getItem('hms_appointments')) saveData('hms_appointments', defaultAppointments);
    if (!localStorage.getItem('hms_bills')) saveData('hms_bills', defaultBills);
    if (!localStorage.getItem('hms_prescriptions')) saveData('hms_prescriptions', defaultPrescriptions);
    if (!localStorage.getItem('hms_staff')) saveData('hms_staff', defaultStaff);
    if (!localStorage.getItem('hms_resources')) saveData('hms_resources', defaultResources);

    // 3. Live Clock HUD & Universal Command/Notification Mesh
    initLiveHUD();
    initGlobalHUD();
    // 4. Modal Backdrop Click Dismiss (ONLY when clicking outer dark overlay)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target.id);
        }
    });
    // 4b. Escape Key Modal Dismiss
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
        }
    });
    // 5. Active Nav Highlighting
    const normalizedPath = (window.location.pathname.replace(/\\/g, '/').split('/').pop() || '').toLowerCase();
    document.querySelectorAll('.sidebar .nav-item').forEach(link => {
        link.classList.remove('active');
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (href === normalizedPath || (normalizedPath === '' && href === 'dashboard.html')) {
            link.classList.add('active');
        }
    });

    // 6. Universal Router Dispatcher (Detects page by DOM element & URL)
    if (document.getElementById('loginForm') || normalizedPath === 'index.html' || (normalizedPath === '' && !document.querySelector('.sidebar'))) {
        initLoginPage();
    }
    if (document.getElementById('recentAppointments') || document.getElementById('totalPatients') || normalizedPath === 'dashboard.html') {
        initDashboardPage();
    }
    if (document.getElementById('patientsTable') || document.getElementById('patientsTableBody') || normalizedPath === 'patients.html') {
        initPatientsPage();
    }
    if (document.getElementById('doctorGrid') || normalizedPath === 'doctors.html') {
        initDoctorsPage();
    }
    if (document.getElementById('appointmentsTableBody') || document.getElementById('calendarBody') || normalizedPath === 'appointments.html') {
        initAppointmentsPage();
    }
    if (document.getElementById('billsTableBody') || normalizedPath === 'billing.html') {
        initBillingPage();
    }
    if (document.getElementById('prescriptionsTableBody') || normalizedPath === 'prescriptions.html') {
        initPrescriptionsPage();
    }
    if (document.getElementById('staffTableBody') || normalizedPath === 'admin.html') {
        initAdminPage();
    }

    // 7. Auto-trigger creation modals if navigated with ?action=new
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new') {
        setTimeout(() => {
            if (document.getElementById('invoiceModal')) showCreateInvoiceModal();
            else if (document.getElementById('appointmentModal')) showBookAppointmentModal();
            else if (document.getElementById('prescriptionModal')) showCreatePrescriptionModal();
            else if (document.getElementById('patientModal')) showAddPatientModal();
            else if (document.getElementById('doctorModal')) showAddDoctorModal();
        }, 200);
    }
});

// ==========================================
// 8. PAGE: LOGIN (index.html)
// ==========================================
function startHospitalWarpSequence(callback) {
    playSound('warp');
    isEnteringHospital = true;
    targetCorridorSpeed = 42.0;

    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.playbackRate = 3.2;
        bgVideo.classList.add('warp-accelerate');
    }

    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
        loginContainer.classList.add('login-entering');
    }

    setTimeout(() => {
        if (typeof callback === 'function') callback();
    }, 680);
}

function handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    const userInput = document.getElementById('username')?.value.trim() || 'Admin';
    const activeRoleBtn = document.querySelector('.role-btn.active');
    const selectedRole = activeRoleBtn ? (activeRoleBtn.getAttribute('data-role') || 'admin') : 'admin';
    const roleCapitalized = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);

    localStorage.setItem('hms_username', userInput);
    localStorage.setItem('hms_user_role', roleCapitalized);
    
    showToast(`Entering Hospital Wing as ${roleCapitalized} ${userInput}...`, 'success');
    
    startHospitalWarpSequence(() => {
        window.location.href = 'dashboard.html';
    });
    return false;
}

function initLoginPage() {
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const form = document.getElementById('loginForm') || document.querySelector('form');
    if (form) {
        form.onsubmit = handleLogin;
    }
}

// ==========================================
// 9. PAGE: DASHBOARD (dashboard.html)
// ==========================================
function initDashboardPage() {
    const patients = loadData('hms_patients', []);
    const appointments = loadData('hms_appointments', []);
    const bills = loadData('hms_bills', []);
    const resources = loadData('hms_resources', []);

    // 1. KPI Calculations
    const totalPatients = patients.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date === todayStr || a.date === '2026-09-17').length;
    const totalRev = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.total, 0);

    let freeBeds = 0;
    resources.filter(r => r.category.includes('Beds') || r.category === 'Beds').forEach(r => {
        freeBeds += (r.total - r.occupied);
    });

    // 2. Animate Count Ups for Dashboard Numbers
    animateNumber('totalPatients', totalPatients);
    animateNumber('total-patients-count', totalPatients);
    animateNumber('todayAppointments', todayAppts || appointments.length);
    animateNumber('today-appointments-count', todayAppts || appointments.length);
    
    const revEl = document.getElementById('totalRevenue') || document.getElementById('total-revenue-count');
    if (revEl) revEl.innerText = formatCurrency(totalRev);

    animateNumber('availableBeds', freeBeds);
    animateNumber('available-beds-count', freeBeds);

    // 3. Recent Appointments Table
    const recentBody = document.getElementById('recentAppointments') || document.getElementById('recent-appointments-body');
    if (recentBody) {
        const list = appointments.slice().reverse().slice(0, 5);
        recentBody.innerHTML = list.map(a => `
            <tr>
                <td><strong>${a.patientName}</strong></td>
                <td>${a.doctorName}</td>
                <td>${formatDate(a.date)}</td>
                <td><span class="badge badge-info"><i class="fas fa-clock"></i> ${a.time}</span></td>
                <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
            </tr>
        `).join('');
    }

    // 4. Department Doctor Breakdown Bars
    const deptStatsEl = document.getElementById('departmentStats') || document.getElementById('department-chart');
    if (deptStatsEl) {
        const doctors = loadData('hms_doctors', []);
        const deptCounts = {};
        doctors.forEach(d => {
            deptCounts[d.department] = (deptCounts[d.department] || 0) + 1;
        });

        const maxDocs = Math.max(...Object.values(deptCounts), 1);
        let barsHtml = '';
        for (const [dept, count] of Object.entries(deptCounts)) {
            const pct = Math.round((count / maxDocs) * 100);
            barsHtml += `
                <div class="dept-bar-item">
                    <div class="dept-bar-label">
                        <span><i class="fas fa-clinic-medical" style="color:var(--primary); margin-right:6px;"></i> ${dept}</span>
                        <strong style="color:var(--primary); font-family:'JetBrains Mono';">${count} Doctors</strong>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill green" style="width: ${pct}%;"></div>
                    </div>
                </div>
            `;
        }
        deptStatsEl.innerHTML = barsHtml;
    }

    // 5. Interactive Clinical Charts & Operations Feed
    initDashboardCharts();
}

function animateNumber(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.innerText = target;
            clearInterval(timer);
        } else {
            el.innerText = current;
        }
    }, 25);
}

// Quick action shortcuts
function bookAppointment() {
    window.location.href = 'appointments.html?action=new';
}
function createInvoice() {
    window.location.href = 'billing.html?action=new';
}
function addPrescription() {
    window.location.href = 'prescriptions.html?action=new';
}

// ==========================================
// 10. PAGE: PATIENTS (patients.html)
// ==========================================
let editingPatientId = null;

function initPatientsPage() {
    const patients = loadData('hms_patients', []);
    renderPatients(patients);
}

function renderPatients(data) {
    const tbody = document.getElementById('patientsTableBody') || document.getElementById('patients-tbody');
    const countBadge = document.getElementById('patientCount');
    const emptyState = document.getElementById('patientsEmpty');
    
    if (countBadge) countBadge.innerText = `${data.length} Patients Recorded`;
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    tbody.innerHTML = data.map(p => `
        <tr>
            <td><strong style="font-family:'JetBrains Mono'; color:var(--primary);">${p.id}</strong></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.age} Yrs</td>
            <td>${p.gender}</td>
            <td><span class="badge badge-info">${p.bloodGroup}</span></td>
            <td><i class="fas fa-phone" style="font-size:0.8rem; color:var(--text-muted); margin-right:4px;"></i> ${p.phone}</td>
            <td>${p.condition}</td>
            <td><span class="badge badge-${p.status.toLowerCase()}">${p.status}</span></td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn-sm btn-info" onclick="viewPatient('${p.id}')" title="View Patient Profile"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-warning" onclick="editPatient('${p.id}')" title="Edit Patient"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deletePatient('${p.id}')" title="Delete Patient"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterPatients() {
    const query = (document.getElementById('patientSearch')?.value || '').toLowerCase().trim();
    const patients = loadData('hms_patients', []);
    const filtered = patients.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.condition.toLowerCase().includes(query) ||
        p.phone.includes(query)
    );
    renderPatients(filtered);
}

function showAddPatientModal() {
    editingPatientId = null;
    const title = document.getElementById('patientModalTitle') || document.getElementById('patient-modal-title');
    if (title) title.innerText = 'Add New Patient Record';
    const form = document.getElementById('patientForm') || document.getElementById('patient-form');
    if (form) form.reset();
    openModal('patientModal');
    openModal('patient-modal');
}

function editPatient(id) {
    const patients = loadData('hms_patients', []);
    const patient = patients.find(p => p.id === id);
    if (!patient) return;

    editingPatientId = id;
    const title = document.getElementById('patientModalTitle') || document.getElementById('patient-modal-title');
    if (title) title.innerText = `Edit Patient: ${patient.name}`;

    const setVal = (id1, id2, val) => {
        const el = document.getElementById(id1) || document.getElementById(id2);
        if (el) el.value = val || '';
    };

    setVal('patientName', 'p-name', patient.name);
    setVal('patientAge', 'p-age', patient.age);
    setVal('patientGender', 'p-gender', patient.gender);
    setVal('patientBloodGroup', 'p-bloodGroup', patient.bloodGroup);
    setVal('patientPhone', 'p-phone', patient.phone);
    setVal('patientEmail', 'p-email', patient.email);
    setVal('patientAddress', 'p-address', patient.address);
    setVal('patientCondition', 'p-condition', patient.condition);
    setVal('patientStatus', 'p-status', patient.status);

    openModal('patientModal');
    openModal('patient-modal');
}

function savePatient() {
    const getVal = (id1, id2) => {
        const el = document.getElementById(id1) || document.getElementById(id2);
        return el ? el.value.trim() : '';
    };

    const name = getVal('patientName', 'p-name');
    const age = parseInt(getVal('patientAge', 'p-age')) || 0;
    const gender = getVal('patientGender', 'p-gender') || 'Male';
    const bloodGroup = getVal('patientBloodGroup', 'p-bloodGroup') || 'O+';
    const phone = getVal('patientPhone', 'p-phone');
    const email = getVal('patientEmail', 'p-email');
    const address = getVal('patientAddress', 'p-address');
    const condition = getVal('patientCondition', 'p-condition');
    const status = getVal('patientStatus', 'p-status') || 'Admitted';

    if (!name || !phone) {
        showToast('Please enter Patient Name and Phone Number.', 'error');
        return;
    }

    let patients = loadData('hms_patients', []);

    if (editingPatientId) {
        const idx = patients.findIndex(p => p.id === editingPatientId);
        if (idx > -1) {
            patients[idx] = { ...patients[idx], name, age, gender, bloodGroup, phone, email, address, condition, status };
            showToast('Patient record updated successfully!', 'success');
        }
    } else {
        const newPatient = {
            id: generateId('P'),
            name, age, gender, bloodGroup, phone, email, address, condition, status,
            admissionDate: new Date().toISOString().split('T')[0],
            history: [{ date: new Date().toISOString().split('T')[0], event: 'Registered & Admitted to MediCare HMS' }]
        };
        patients.unshift(newPatient);
        showToast('New patient registered successfully!', 'success');
    }

    saveData('hms_patients', patients);
    renderPatients(patients);
    closeModal('patientModal');
    closeModal('patient-modal');
}

function deletePatient(id) {
    if (confirm('Are you sure you want to remove this patient record?')) {
        let patients = loadData('hms_patients', []);
        patients = patients.filter(p => p.id !== id);
        saveData('hms_patients', patients);
        renderPatients(patients);
        showToast('Patient removed.', 'success');
    }
}

function viewPatient(id) {
    const patients = loadData('hms_patients', []);
    const patient = patients.find(p => p.id === id);
    if (!patient) return;

    let viewModal = document.getElementById('viewPatientModal');
    if (!viewModal) {
        viewModal = document.createElement('div');
        viewModal.id = 'viewPatientModal';
        viewModal.className = 'modal-overlay';
        viewModal.innerHTML = `
            <div class="modal" style="max-width: 780px; width: 95%;">
                <div class="modal-header">
                    <h3><i class="fas fa-id-card-alt" style="color:var(--primary); margin-right:8px;"></i> Patient EHR Medical Passport</h3>
                    <button class="btn-icon" onclick="closeModal('viewPatientModal')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" id="viewPatientContent" style="padding: 20px;"></div>
                <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-sm btn-outline" onclick="bookApptForPatient('${patient.id}')"><i class="fas fa-calendar-plus"></i> Book Consultation</button>
                        <button class="btn btn-sm btn-outline" onclick="billForPatient('${patient.id}')"><i class="fas fa-file-invoice"></i> Create Invoice</button>
                    </div>
                    <button class="btn btn-primary" onclick="closeModal('viewPatientModal')">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(viewModal);
    }

    const content = document.getElementById('viewPatientContent');
    if (content) {
        // Cross-linked records
        const allAppointments = loadData('hms_appointments', []);
        const patientAppts = allAppointments.filter(a => a.patientId === id || a.patientName === patient.name);

        const allPrescriptions = loadData('hms_prescriptions', []);
        const patientRxs = allPrescriptions.filter(r => r.patientId === id || r.patientName === patient.name);

        const allBills = loadData('hms_bills', []);
        const patientBills = allBills.filter(b => b.patientId === id || b.patientName === patient.name);

        const historyList = patient.history && patient.history.length ? patient.history.map(h => `
            <li style="margin-bottom:10px; padding-left:12px; border-left:3px solid var(--primary); position:relative;">
                <span style="font-size:0.75rem; font-family:'JetBrains Mono'; color:var(--text-muted); display:block;">${formatDate(h.date)}</span>
                <div style="font-size:0.9rem; color:var(--text-primary); font-weight:500;">${h.event}</div>
            </li>
        `).join('') : '<p style="color:var(--text-muted); padding:10px 0;">No chronological observations recorded.</p>';

        const apptRows = patientAppts.length ? patientAppts.map(a => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.5); padding:10px 14px; border-radius:8px; border:1px solid var(--glass-border); margin-bottom:6px;">
                <div>
                    <strong>${a.doctorName}</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted);">${formatDate(a.date)} at ${a.time} - ${a.reason}</div>
                </div>
                <span class="badge badge-${a.status.toLowerCase()}">${a.status}</span>
            </div>
        `).join('') : '<p style="color:var(--text-muted); padding:10px 0;">No consultation history with hospital physicians.</p>';

        const rxRows = patientRxs.length ? patientRxs.map(r => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.5); padding:10px 14px; border-radius:8px; border:1px solid var(--glass-border); margin-bottom:6px;">
                <div>
                    <strong>${r.diagnosis}</strong> <span style="font-size:0.8rem; color:var(--text-muted);">by ${r.doctorName} (${formatDate(r.date)})</span>
                    <div style="font-size:0.8rem; color:var(--primary); margin-top:2px;">${(r.medicines||[]).map(m=>m.name).join(', ')}</div>
                </div>
                <button class="btn btn-sm btn-info" onclick="closeModal('viewPatientModal'); viewPrescription('${r.id}');"><i class="fas fa-eye"></i> View Rx</button>
            </div>
        `).join('') : '<p style="color:var(--text-muted); padding:10px 0;">No digital prescriptions issued yet.</p>';

        const billRows = patientBills.length ? patientBills.map(b => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.5); padding:10px 14px; border-radius:8px; border:1px solid var(--glass-border); margin-bottom:6px;">
                <div>
                    <strong style="font-family:'JetBrains Mono';">${b.id}</strong> - <span style="font-size:0.85rem; color:var(--text-secondary);">${formatDate(b.date)}</span>
                    <div style="font-size:0.85rem; color:var(--success); font-weight:700; font-family:'JetBrains Mono';">${formatCurrency(b.total)}</div>
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <span class="badge badge-${b.status.toLowerCase()}">${b.status}</span>
                    <button class="btn btn-sm btn-info" onclick="closeModal('viewPatientModal'); viewInvoice('${b.id}');"><i class="fas fa-file-invoice"></i></button>
                </div>
            </div>
        `).join('') : '<p style="color:var(--text-muted); padding:10px 0;">No hospital invoices on record.</p>';

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=0284c7&color=fff&size=128`;

        content.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid var(--glass-border);">
                <div style="display:flex; align-items:center; gap:16px;">
                    <img src="${avatarUrl}" alt="${patient.name}" style="width:60px; height:60px; border-radius:14px; border:2px solid var(--primary); box-shadow:0 0 12px var(--primary-glow);">
                    <div>
                        <h2 style="color:var(--primary); margin:0; font-size:1.4rem;">${patient.name}</h2>
                        <div style="font-family:'JetBrains Mono'; font-size:0.82rem; color:var(--text-muted);">EHR ID: ${patient.id} | Adm: ${formatDate(patient.admissionDate || '2026-08-15')}</div>
                    </div>
                </div>
                <span class="badge badge-${patient.status.toLowerCase()}" style="font-size:0.85rem; padding:6px 12px;">${patient.status}</span>
            </div>

            <!-- Vitals Grid -->
            <div class="ehr-vitals-grid">
                <div class="ehr-vital-box">
                    <div class="ehr-vital-label">Age / Gender</div>
                    <div class="ehr-vital-value">${patient.age} Yrs / ${patient.gender}</div>
                </div>
                <div class="ehr-vital-box">
                    <div class="ehr-vital-label">Blood Group</div>
                    <div class="ehr-vital-value" style="color:var(--danger);">${patient.bloodGroup}</div>
                </div>
                <div class="ehr-vital-box">
                    <div class="ehr-vital-label">Primary Contact</div>
                    <div class="ehr-vital-value" style="font-size:0.9rem;">${patient.phone}</div>
                </div>
                <div class="ehr-vital-box">
                    <div class="ehr-vital-label">Diagnosis</div>
                    <div class="ehr-vital-value" style="font-size:0.85rem; color:var(--warning);">${patient.condition}</div>
                </div>
            </div>

            <!-- Tabbed Navigation -->
            <div class="ehr-tabs-nav">
                <button type="button" class="ehr-tab-item active" onclick="switchEHRTab(this, 'ehr-timeline')"><i class="fas fa-notes-medical"></i> Medical Timeline</button>
                <button type="button" class="ehr-tab-item" onclick="switchEHRTab(this, 'ehr-appts')"><i class="fas fa-calendar-check"></i> Consultations (${patientAppts.length})</button>
                <button type="button" class="ehr-tab-item" onclick="switchEHRTab(this, 'ehr-rxs')"><i class="fas fa-prescription"></i> Prescriptions (${patientRxs.length})</button>
                <button type="button" class="ehr-tab-item" onclick="switchEHRTab(this, 'ehr-bills')"><i class="fas fa-file-invoice-dollar"></i> Invoices (${patientBills.length})</button>
            </div>

            <div id="ehr-timeline" class="ehr-tab-pane active">
                <ul style="list-style:none; padding-left:4px; margin-top:8px;">${historyList}</ul>
            </div>
            <div id="ehr-appts" class="ehr-tab-pane">
                ${apptRows}
            </div>
            <div id="ehr-rxs" class="ehr-tab-pane">
                ${rxRows}
            </div>
            <div id="ehr-bills" class="ehr-tab-pane">
                ${billRows}
            </div>
        `;
    }
    openModal('viewPatientModal');
}

function switchEHRTab(btn, tabId) {
    playSound('click');
    const modal = document.getElementById('viewPatientModal');
    if (!modal) return;
    modal.querySelectorAll('.ehr-tab-item').forEach(b => b.classList.remove('active'));
    modal.querySelectorAll('.ehr-tab-pane').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
}

function bookApptForPatient(patientId) {
    closeModal('viewPatientModal');
    window.location.href = `appointments.html?action=new&patientId=${patientId}`;
}

function billForPatient(patientId) {
    closeModal('viewPatientModal');
    window.location.href = `billing.html?action=new&patientId=${patientId}`;
}

// ==========================================
// 11. PAGE: DOCTORS (doctors.html)
// ==========================================
let editingDoctorId = null;

function initDoctorsPage() {
    const doctors = loadData('hms_doctors', []);
    renderDoctors(doctors);
}

function renderDoctors(data) {
    const grid = document.getElementById('doctorGrid') || document.getElementById('doctors-grid');
    const emptyState = document.getElementById('doctorsEmpty');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = data.map(d => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0284c7&color=fff&size=128`;
        return `
            <div class="doctor-card">
                <div class="doctor-header">
                    <img src="${avatarUrl}" alt="${d.name}" class="doctor-avatar">
                    <div>
                        <div class="doctor-name">${d.name}</div>
                        <div class="doctor-specialty">${d.specialization}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-building"></i> ${d.department}</div>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
                    <span><i class="fas fa-briefcase-medical" style="color:var(--primary); margin-right:4px;"></i> <strong>${d.experience}</strong></span>
                    <span class="badge badge-${d.availability.toLowerCase().replace(' ', '-')}">${d.availability}</span>
                </div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">
                    <div><i class="fas fa-phone-alt" style="font-size:0.8rem; margin-right:4px;"></i> ${d.phone}</div>
                    <div><i class="fas fa-envelope" style="font-size:0.8rem; margin-right:4px;"></i> ${d.email}</div>
                </div>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <button class="btn btn-sm btn-info" style="flex:1;" onclick="viewDoctor('${d.id}')"><i class="fas fa-calendar-alt"></i> Schedule</button>
                    <button class="btn btn-sm btn-warning" onclick="editDoctor('${d.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDoctor('${d.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function filterDoctors() {
    applyDoctorFilters();
}

function filterDoctorsByDept() {
    applyDoctorFilters();
}

function applyDoctorFilters() {
    const search = (document.getElementById('doctorSearch')?.value || '').toLowerCase().trim();
    const dept = (document.getElementById('deptFilter')?.value || document.getElementById('doctor-dept-filter')?.value || '');
    
    const doctors = loadData('hms_doctors', []);
    const filtered = doctors.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search) || d.specialization.toLowerCase().includes(search);
        const matchDept = !dept || dept === 'All' || d.department === dept;
        return matchSearch && matchDept;
    });
    renderDoctors(filtered);
}

function showAddDoctorModal() {
    editingDoctorId = null;
    const title = document.getElementById('doctorModalTitle') || document.getElementById('doctor-modal-title');
    if (title) title.innerText = 'Add New Doctor';
    const form = document.getElementById('doctorForm') || document.getElementById('doctor-form');
    if (form) form.reset();
    openModal('doctorModal');
    openModal('doctor-modal');
}

function editDoctor(id) {
    const doctors = loadData('hms_doctors', []);
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return;

    editingDoctorId = id;
    const title = document.getElementById('doctorModalTitle') || document.getElementById('doctor-modal-title');
    if (title) title.innerText = `Edit Doctor: ${doctor.name}`;

    const setVal = (id1, id2, val) => {
        const el = document.getElementById(id1) || document.getElementById(id2);
        if (el) el.value = val || '';
    };

    setVal('doctorName', 'd-name', doctor.name);
    setVal('doctorEmail', 'd-email', doctor.email);
    setVal('doctorPhone', 'd-phone', doctor.phone);
    setVal('doctorDepartment', 'd-department', doctor.department);
    setVal('doctorSpecialization', 'd-specialization', doctor.specialization);
    setVal('doctorExperience', 'd-experience', doctor.experience.replace(/[^0-9]/g, ''));
    setVal('doctorAvailability', 'd-availability', doctor.availability);

    if (doctor.schedule) {
        ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
            const el = document.getElementById(`sched${day}`);
            if (el) el.value = doctor.schedule[day] || '';
        });
    }

    openModal('doctorModal');
    openModal('doctor-modal');
}

function saveDoctor() {
    const getVal = (id1, id2) => {
        const el = document.getElementById(id1) || document.getElementById(id2);
        return el ? el.value.trim() : '';
    };

    const name = getVal('doctorName', 'd-name');
    const email = getVal('doctorEmail', 'd-email');
    const phone = getVal('doctorPhone', 'd-phone');
    const department = getVal('doctorDepartment', 'd-department');
    const specialization = getVal('doctorSpecialization', 'd-specialization') || department;
    const expNum = getVal('doctorExperience', 'd-experience') || '5';
    const experience = `${expNum} years`;
    const availability = getVal('doctorAvailability', 'd-availability') || 'Available';

    if (!name || !department) {
        showToast('Please enter Doctor Name and Department.', 'error');
        return;
    }

    const schedule = {};
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
        const el = document.getElementById(`sched${day}`);
        schedule[day] = el && el.value.trim() ? el.value.trim() : (day === 'Sun' ? 'Off' : '9AM-5PM');
    });

    let doctors = loadData('hms_doctors', []);

    if (editingDoctorId) {
        const idx = doctors.findIndex(d => d.id === editingDoctorId);
        if (idx > -1) {
            doctors[idx] = { ...doctors[idx], name, email, phone, department, specialization, experience, availability, schedule };
            showToast('Doctor record updated successfully!', 'success');
        }
    } else {
        const newDoctor = {
            id: generateId('D'),
            name, email, phone, department, specialization, experience, availability, schedule
        };
        doctors.push(newDoctor);
        showToast('New doctor added to medical staff!', 'success');
    }

    saveData('hms_doctors', doctors);
    renderDoctors(doctors);
    closeModal('doctorModal');
    closeModal('doctor-modal');
}

function deleteDoctor(id) {
    if (confirm('Are you sure you want to remove this physician?')) {
        let doctors = loadData('hms_doctors', []);
        doctors = doctors.filter(d => d.id !== id);
        saveData('hms_doctors', doctors);
        renderDoctors(doctors);
        showToast('Doctor removed.', 'success');
    }
}

function viewDoctor(id) {
    const doctors = loadData('hms_doctors', []);
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return;

    let modal = document.getElementById('viewDoctorModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'viewDoctorModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Doctor Profile & Clinical Schedule</h3>
                    <button class="btn-icon" onclick="closeModal('viewDoctorModal')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" id="viewDoctorContent"></div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeModal('viewDoctorModal')">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const content = document.getElementById('viewDoctorContent');
    if (content) {
        const schedRows = doctor.schedule ? Object.entries(doctor.schedule).map(([day, hrs]) => `
            <tr>
                <td style="font-weight:600; width:120px;">${day}</td>
                <td><span class="badge ${hrs === 'Off' ? 'badge-on-leave' : 'badge-info'}">${hrs}</span></td>
            </tr>
        `).join('') : '<tr><td colspan="2">Standard 9AM - 5PM</td></tr>';

        content.innerHTML = `
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0284c7&color=fff&size=128" class="doctor-avatar">
                <div>
                    <h2 style="color:var(--primary); margin:0;">${doctor.name}</h2>
                    <div style="font-weight:600; color:var(--text-secondary);">${doctor.specialization} (${doctor.department})</div>
                    <div style="font-size:0.85rem; color:var(--text-muted);">Experience: ${doctor.experience} | ID: ${doctor.id}</div>
                </div>
            </div>
            <h4 style="margin-bottom:10px; border-bottom:1px solid var(--glass-border); padding-bottom:6px;">Weekly Consultation Roster</h4>
            <table class="table"><tbody>${schedRows}</tbody></table>
        `;
    }
    openModal('viewDoctorModal');
}

// ==========================================
// 12. PAGE: APPOINTMENTS (appointments.html)
// ==========================================
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

function initAppointmentsPage() {
    const appointments = loadData('hms_appointments', []);
    renderAppointments(appointments);
    renderCalendarView(currentCalendarMonth, currentCalendarYear);
    populateAppointmentDropdowns();

    // Form submission listener
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveAppointment();
        });
    }
}

function switchAppointmentView(view) {
    playSound('click');
    const listView = document.getElementById('listView');
    const calView = document.getElementById('calendarView');
    const tabs = document.querySelectorAll('.actions-bar .tab-btn');

    tabs.forEach(t => t.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    if (view === 'list') {
        if (listView) listView.style.display = 'block';
        if (calView) calView.style.display = 'none';
    } else {
        if (listView) listView.style.display = 'none';
        if (calView) calView.style.display = 'block';
        renderCalendarView(currentCalendarMonth, currentCalendarYear);
    }
}

function renderAppointments(data) {
    const tbody = document.getElementById('appointmentsTableBody') || document.getElementById('appointments-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(a => `
        <tr>
            <td><strong style="font-family:'JetBrains Mono'; color:var(--primary);">${a.id}</strong></td>
            <td><strong>${a.patientName}</strong></td>
            <td>${a.doctorName}</td>
            <td>${formatDate(a.date)}</td>
            <td><span class="badge badge-info">${a.time}</span></td>
            <td>${a.reason || 'Consultation'}</td>
            <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
            <td>
                <div style="display:flex; gap:6px;">
                    ${a.status === 'Scheduled' ? `
                        <button class="btn btn-sm btn-success" onclick="updateAppointmentStatus('${a.id}','Completed')" title="Mark Completed"><i class="fas fa-check"></i></button>
                        <button class="btn btn-sm btn-warning" onclick="updateAppointmentStatus('${a.id}','Cancelled')" title="Cancel Appointment"><i class="fas fa-ban"></i></button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteAppointment('${a.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderCalendarView(month, year) {
    const grid = document.getElementById('calendarBody') || document.getElementById('calendar-grid');
    const title = document.getElementById('calendarTitle') || document.getElementById('calendar-month-year');
    if (!grid) return;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (title) title.innerText = `${monthNames[month]} ${year}`;

    const appointments = loadData('hms_appointments', []);
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let html = '';
    // Empty prefix cells
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-cell empty"></div>`;
    }

    // Day cells
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayAppts = appointments.filter(a => a.date === dateStr);
        const hasAppts = dayAppts.length > 0;

        html += `
            <div class="calendar-cell ${hasAppts ? 'has-appt' : ''}" onclick="openDayAppointments('${dateStr}')">
                <div class="calendar-date-num">${day}</div>
                ${hasAppts ? `<div class="calendar-appt-pill">${dayAppts.length} Appt${dayAppts.length > 1 ? 's' : ''}</div>` : ''}
            </div>
        `;
    }
    grid.innerHTML = html;
}

function prevMonth() {
    playSound('click');
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    renderCalendarView(currentCalendarMonth, currentCalendarYear);
}

function nextMonth() {
    playSound('click');
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    renderCalendarView(currentCalendarMonth, currentCalendarYear);
}

function populateAppointmentDropdowns() {
    const pSelect = document.getElementById('apptPatient') || document.getElementById('appt-patient');
    const dSelect = document.getElementById('apptDoctor') || document.getElementById('appt-doctor');

    const patients = loadData('hms_patients', defaultPatients);
    const doctors = loadData('hms_doctors', defaultDoctors);

    if (pSelect) {
        pSelect.innerHTML = patients.map((p, idx) => `<option value="${p.id}" ${idx === 0 ? 'selected' : ''}>${p.name} (${p.id})</option>`).join('');
    }
    if (dSelect) {
        dSelect.innerHTML = doctors.map((d, idx) => `<option value="${d.id}" ${idx === 0 ? 'selected' : ''}>${d.name} (${d.specialization})</option>`).join('');
    }
}

function showBookAppointmentModal() {
    populateAppointmentDropdowns();
    const form = document.getElementById('appointmentForm') || document.getElementById('appointment-form');
    if (form) form.reset();

    const dateEl = document.getElementById('apptDate');
    if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
    const timeEl = document.getElementById('apptTime');
    if (timeEl) timeEl.value = '10:00';

    openModal('appointmentModal');
    openModal('appointment-modal');
}

function saveAppointment() {
    const patients = loadData('hms_patients', defaultPatients);
    const doctors = loadData('hms_doctors', defaultDoctors);

    let pId = document.getElementById('apptPatient')?.value;
    let dId = document.getElementById('apptDoctor')?.value;

    if (!pId && patients.length > 0) pId = patients[0].id;
    if (!dId && doctors.length > 0) dId = doctors[0].id;

    if (!pId || !dId) {
        showToast('Please select Patient and Doctor.', 'error');
        return;
    }

    const date = document.getElementById('apptDate')?.value || new Date().toISOString().split('T')[0];
    const time = document.getElementById('apptTime')?.value || '10:00 AM';
    const reason = document.getElementById('apptReason')?.value.trim() || 'General Consultation';

    const patient = patients.find(p => p.id === pId);
    const doctor = doctors.find(d => d.id === dId);

    const newAppt = {
        id: generateId('A'),
        patientId: pId,
        patientName: patient ? patient.name : 'Patient ' + pId,
        doctorId: dId,
        doctorName: doctor ? doctor.name : 'Dr. Consultant',
        date,
        time,
        reason,
        status: 'Scheduled'
    };

    let appointments = loadData('hms_appointments', defaultAppointments);
    appointments.unshift(newAppt);
    saveData('hms_appointments', appointments);

    renderAppointments(appointments);
    renderCalendarView(currentCalendarMonth, currentCalendarYear);
    closeModal('appointmentModal');
    closeModal('appointment-modal');
    showToast(`Appointment #${newAppt.id} booked successfully!`, 'success');
}

function updateAppointmentStatus(id, status) {
    let appointments = loadData('hms_appointments', []);
    const idx = appointments.findIndex(a => a.id === id);
    if (idx > -1) {
        appointments[idx].status = status;
        saveData('hms_appointments', appointments);
        renderAppointments(appointments);
        renderCalendarView(currentCalendarMonth, currentCalendarYear);
        showToast(`Appointment status updated to ${status}.`, 'success');
    }
}

function deleteAppointment(id) {
    if (confirm('Remove this appointment?')) {
        let appointments = loadData('hms_appointments', []);
        appointments = appointments.filter(a => a.id !== id);
        saveData('hms_appointments', appointments);
        renderAppointments(appointments);
        renderCalendarView(currentCalendarMonth, currentCalendarYear);
        showToast('Appointment deleted.', 'success');
    }
}

function openDayAppointments(dateStr) {
    const appointments = loadData('hms_appointments', []);
    const dayAppts = appointments.filter(a => a.date === dateStr);
    
    let modal = document.getElementById('dayModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dayModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 id="dayModalTitle">Appointments for Date</h3>
                    <button class="btn-icon" onclick="closeModal('dayModal')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" id="dayAppointments"></div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeModal('dayModal')">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const title = modal.querySelector('h2, h3');
    if (title) title.innerText = `Appointments for ${formatDate(dateStr)}`;

    const container = document.getElementById('dayAppointments');
    if (container) {
        if (dayAppts.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px 0;">No appointments scheduled for this date.</p>`;
        } else {
            container.innerHTML = dayAppts.map(a => `
                <div style="background:var(--glass-bg); border:1px solid var(--glass-border); padding:12px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${a.patientName}</strong> with <em>${a.doctorName}</em>
                        <div style="font-size:0.8rem; color:var(--text-muted);">${a.time} - ${a.reason}</div>
                    </div>
                    <span class="badge badge-${a.status.toLowerCase()}">${a.status}</span>
                </div>
            `).join('');
        }
    }
    openModal('dayModal');
}

// ==========================================
// 13. PAGE: BILLING (billing.html)
// ==========================================
function initBillingPage() {
    const bills = loadData('hms_bills', []);
    renderBills(bills);
    updateBillingStats(bills);
    populateBillingPatientSelect();

    const form = document.getElementById('createInvoiceForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveInvoice();
        });
    }
}

function updateBillingStats(bills) {
    const totalRev = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.total, 0);
    const pendingAmount = bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.total, 0);
    const paidCount = bills.filter(b => b.status === 'Paid').length;
    const overdueCount = bills.filter(b => b.status === 'Overdue').length;

    const elRev = document.getElementById('totalRevenue');
    if (elRev) elRev.innerText = formatCurrency(totalRev);
    const elPend = document.getElementById('pendingAmount');
    if (elPend) elPend.innerText = formatCurrency(pendingAmount);
    const elPaid = document.getElementById('paidCount');
    if (elPaid) elPaid.innerText = paidCount;
    const elOverdue = document.getElementById('overdueCount');
    if (elOverdue) elOverdue.innerText = overdueCount;
}

function renderBills(data) {
    const tbody = document.getElementById('billsTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.map(b => `
        <tr>
            <td><strong style="font-family:'JetBrains Mono'; color:var(--primary);">${b.id}</strong></td>
            <td><strong>${b.patientName}</strong></td>
            <td>${formatDate(b.date)}</td>
            <td><span class="badge badge-info">${b.items ? b.items.length : 1} Line Items</span></td>
            <td><strong style="font-family:'JetBrains Mono'; color:var(--success);">${formatCurrency(b.total)}</strong></td>
            <td><span class="badge badge-${b.status.toLowerCase()}" style="cursor:pointer;" onclick="toggleBillStatus('${b.id}')" title="Click to Toggle Status">${b.status}</span></td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn-sm btn-info" onclick="viewInvoice('${b.id}')" title="View/Print Invoice"><i class="fas fa-file-invoice"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBill('${b.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function toggleBillStatus(id) {
    let bills = loadData('hms_bills', []);
    const idx = bills.findIndex(b => b.id === id);
    if (idx > -1) {
        const statuses = ['Pending', 'Paid', 'Overdue'];
        const next = statuses[(statuses.indexOf(bills[idx].status) + 1) % statuses.length];
        bills[idx].status = next;
        saveData('hms_bills', bills);
        renderBills(bills);
        updateBillingStats(bills);
        showToast(`Invoice ${id} marked as ${next}`, 'info');
    }
}

function populateBillingPatientSelect() {
    const select = document.getElementById('invoicePatient');
    if (select) {
        const patients = loadData('hms_patients', defaultPatients);
        if (patients.length === 0) {
            select.innerHTML = '<option value="">No patients registered</option>';
            return;
        }
        select.innerHTML = patients.map((p, idx) => `
            <option value="${p.id}" ${idx === 0 ? 'selected' : ''}>${p.name} (${p.id} - ${p.condition})</option>
        `).join('');
    }
}

function showCreateInvoiceModal() {
    populateBillingPatientSelect();
    const container = document.getElementById('invoiceItems');
    if (container) {
        container.innerHTML = `
            <div class="invoice-item-row" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="text" class="form-control item-desc" placeholder="Description" value="Medical Consultation & Care" style="flex: 2;">
                <input type="number" class="form-control item-amount" placeholder="Amount" value="1500" min="0" oninput="calculateInvoiceTotal()" style="flex: 1;">
                <button type="button" class="btn btn-danger btn-sm btn-icon" onclick="removeInvoiceItem(this)"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }
    calculateInvoiceTotal();
    openModal('invoiceModal');
}

function addInvoiceItem() {
    playSound('click');
    const container = document.getElementById('invoiceItems');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'invoice-item-row';
    row.style = "display: flex; gap: 0.5rem; margin-bottom: 0.5rem;";
    row.innerHTML = `
        <input type="text" class="form-control item-desc" placeholder="Description" value="Clinical Diagnostics" style="flex: 2;">
        <input type="number" class="form-control item-amount" placeholder="Amount" value="500" min="0" oninput="calculateInvoiceTotal()" style="flex: 1;">
        <button type="button" class="btn btn-danger btn-sm btn-icon" onclick="removeInvoiceItem(this)"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(row);
    calculateInvoiceTotal();
}

function removeInvoiceItem(btn) {
    playSound('click');
    const row = btn.closest('.invoice-item-row');
    if (row) {
        row.remove();
        calculateInvoiceTotal();
    }
}

function calculateInvoiceTotal() {
    let total = 0;
    document.querySelectorAll('.invoice-item-row').forEach(row => {
        const amtInput = row.querySelector('.item-amount') || row.querySelector('input[type="number"]');
        if (amtInput) {
            const val = parseFloat(amtInput.value);
            if (!isNaN(val) && val > 0) total += val;
        }
    });
    const totalDisplay = document.getElementById('invoiceTotal');
    if (totalDisplay) totalDisplay.innerText = formatCurrency(total);
    return total;
}

function saveInvoice() {
    let pId = document.getElementById('invoicePatient')?.value;
    let total = calculateInvoiceTotal();

    const patients = loadData('hms_patients', defaultPatients);
    if (!pId && patients.length > 0) {
        pId = patients[0].id;
    }

    if (!pId) {
        showToast('Please select a Patient.', 'error');
        return;
    }

    const patient = patients.find(p => p.id === pId) || { name: 'Patient ' + pId };

    const items = [];
    document.querySelectorAll('.invoice-item-row').forEach(row => {
        const desc = row.querySelector('.item-desc')?.value || row.querySelector('input[type="text"]')?.value || 'Service Item';
        const amtInput = row.querySelector('.item-amount') || row.querySelector('input[type="number"]');
        const amt = parseFloat(amtInput ? amtInput.value : 0) || 0;
        if (amt > 0) items.push({ desc, amount: amt });
    });

    if (items.length === 0) {
        items.push({ desc: 'Medical Care & Consultation', amount: total > 0 ? total : 1500 });
        total = total > 0 ? total : 1500;
    }

    const pMethod = document.getElementById('invoicePaymentMethod')?.value || 'Pending';
    const billStatus = pMethod === 'Pending' ? 'Pending' : 'Paid';

    const newBill = {
        id: generateId('B'),
        patientId: pId,
        patientName: patient.name,
        date: new Date().toISOString().split('T')[0],
        items,
        total: total > 0 ? total : 1500,
        status: billStatus,
        paymentMethod: pMethod
    };

    let bills = loadData('hms_bills', defaultBills);
    bills.unshift(newBill);
    saveData('hms_bills', bills);

    renderBills(bills);
    updateBillingStats(bills);
    closeModal('invoiceModal');
    showToast(`Invoice #${newBill.id} created for ${patient.name}!`, 'success');
}

function deleteBill(id) {
    if (confirm('Delete this invoice record?')) {
        let bills = loadData('hms_bills', []);
        bills = bills.filter(b => b.id !== id);
        saveData('hms_bills', bills);
        renderBills(bills);
        updateBillingStats(bills);
        showToast('Invoice removed.', 'success');
    }
}

function viewInvoice(id) {
    const bills = loadData('hms_bills', []);
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    const content = document.getElementById('viewInvoiceContent');
    if (content) {
        const itemRows = (bill.items || []).map(it => `
            <tr>
                <td>${it.desc}</td>
                <td style="text-align:right; font-family:'JetBrains Mono';">${formatCurrency(it.amount)}</td>
            </tr>
        `).join('');

        content.innerHTML = `
            <div style="padding:15px; border:1px solid var(--glass-border); border-radius:12px; background:var(--glass-bg);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--glass-border); padding-bottom:14px; margin-bottom:14px;">
                    <div>
                        <h2 style="color:var(--primary); margin:0;"><i class="fas fa-hospital"></i> MediCare HMS</h2>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Super Specialty Hospital & Research Center</p>
                    </div>
                    <div style="text-align:right;">
                        <h3 style="margin:0; font-family:'JetBrains Mono';">${bill.id}</h3>
                        <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">Date: ${formatDate(bill.date)}</p>
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <strong>Billed To:</strong>
                    <div>${bill.patientName} (${bill.patientId})</div>
                    <div>Status: <span class="badge badge-${bill.status.toLowerCase()}">${bill.status}</span></div>
                </div>
                <table class="table" style="margin-bottom:16px;">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style="text-align:right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                    <tfoot>
                        <tr>
                            <th>Total Payable</th>
                            <th style="text-align:right; font-size:1.2rem; color:var(--success); font-family:'JetBrains Mono';">${formatCurrency(bill.total)}</th>
                        </tr>
                    </tfoot>
                </table>
                <div style="display:flex; justify-content:flex-end; gap:8px;">
                    <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> Print Invoice</button>
                    <button class="btn btn-primary" onclick="closeModal('viewInvoiceModal')">Close</button>
                </div>
            </div>
        `;
    }
    openModal('viewInvoiceModal');
}

// ==========================================
// 14. PAGE: PRESCRIPTIONS (prescriptions.html)
// ==========================================
function initPrescriptionsPage() {
    const rxs = loadData('hms_prescriptions', []);
    renderPrescriptions(rxs);
    populatePrescriptionDropdowns();

    const form = document.getElementById('prescriptionForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            savePrescription();
        });
    }
}

function renderPrescriptions(data) {
    const tbody = document.getElementById('prescriptionsTableBody');
    const rxCount = document.getElementById('rxCount');
    const emptyState = document.getElementById('prescriptionsEmpty');

    if (rxCount) rxCount.innerText = `${data.length} Prescriptions`;
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    tbody.innerHTML = data.map(rx => {
        const medSummary = (rx.medicines || []).map(m => `<span class="badge badge-info" style="margin:2px;">${m.name}</span>`).join('');
        return `
            <tr>
                <td><strong style="font-family:'JetBrains Mono'; color:var(--primary);">${rx.id}</strong></td>
                <td><strong>${rx.patientName}</strong></td>
                <td>${rx.doctorName}</td>
                <td>${formatDate(rx.date)}</td>
                <td>${rx.diagnosis}</td>
                <td>${medSummary || 'None'}</td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-sm btn-info" onclick="viewPrescription('${rx.id}')" title="View/Print Rx"><i class="fas fa-prescription"></i> View</button>
                        <button class="btn btn-sm btn-danger" onclick="deletePrescription('${rx.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterPrescriptions() {
    const q = (document.getElementById('prescriptionSearch')?.value || '').toLowerCase().trim();
    const rxs = loadData('hms_prescriptions', []);
    const filtered = rxs.filter(r => 
        r.patientName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q)
    );
    renderPrescriptions(filtered);
}

function populatePrescriptionDropdowns() {
    const pSelect = document.getElementById('rxPatient');
    const dSelect = document.getElementById('rxDoctor');

    const patients = loadData('hms_patients', defaultPatients);
    const doctors = loadData('hms_doctors', defaultDoctors);

    if (pSelect) {
        pSelect.innerHTML = patients.map((p, idx) => `<option value="${p.id}" ${idx === 0 ? 'selected' : ''}>${p.name} (${p.id})</option>`).join('');
    }
    if (dSelect) {
        dSelect.innerHTML = doctors.map((d, idx) => `<option value="${d.id}" ${idx === 0 ? 'selected' : ''}>${d.name} (${d.specialization})</option>`).join('');
    }
}

function showCreatePrescriptionModal() {
    populatePrescriptionDropdowns();
    const form = document.getElementById('prescriptionForm');
    if (form) form.reset();
    openModal('prescriptionModal');
}

function savePrescription() {
    const patients = loadData('hms_patients', defaultPatients);
    const doctors = loadData('hms_doctors', defaultDoctors);

    let pId = document.getElementById('rxPatient')?.value;
    let dId = document.getElementById('rxDoctor')?.value;

    if (!pId && patients.length > 0) pId = patients[0].id;
    if (!dId && doctors.length > 0) dId = doctors[0].id;

    if (!pId) {
        showToast('Please select a Patient.', 'error');
        return;
    }

    const diagnosis = document.getElementById('rxDiagnosis')?.value.trim() || 'General Clinical Evaluation';
    const notes = document.getElementById('rxNotes')?.value.trim() || 'Take medicines as directed.';

    const patient = patients.find(p => p.id === pId) || { name: 'Patient ' + pId };
    const doctor = doctors.find(d => d.id === dId) || (doctors[0] || { name: 'Dr. Priya Sharma' });

    const med1 = document.getElementById('rxMed1')?.value.trim() || 'Amoxicillin 500mg';
    const dose1 = document.getElementById('rxDose1')?.value.trim() || '1 tablet';
    const freq1 = document.getElementById('rxFreq1')?.value.trim() || 'Twice daily';
    const dur1 = document.getElementById('rxDur1')?.value.trim() || '5 days';

    const newRx = {
        id: generateId('RX'),
        patientId: pId,
        patientName: patient.name,
        doctorId: doctor.id || 'D001',
        doctorName: doctor.name,
        date: new Date().toISOString().split('T')[0],
        diagnosis,
        medicines: [{ name: med1, dosage: dose1, frequency: freq1, duration: dur1 }],
        notes
    };

    let rxs = loadData('hms_prescriptions', defaultPrescriptions);
    rxs.unshift(newRx);
    saveData('hms_prescriptions', rxs);

    renderPrescriptions(rxs);
    closeModal('prescriptionModal');
    showToast(`Prescription #${newRx.id} created!`, 'success');
}

function deletePrescription(id) {
    if (confirm('Delete this prescription?')) {
        let rxs = loadData('hms_prescriptions', []);
        rxs = rxs.filter(r => r.id !== id);
        saveData('hms_prescriptions', rxs);
        renderPrescriptions(rxs);
        showToast('Prescription removed.', 'success');
    }
}

function viewPrescription(id) {
    const rxs = loadData('hms_prescriptions', []);
    const rx = rxs.find(r => r.id === id);
    if (!rx) return;

    let modal = document.getElementById('viewRxModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'viewRxModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Digital Prescription Sheet</h3>
                    <button class="btn-icon" onclick="closeModal('viewRxModal')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" id="viewRxContent"></div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> Print Rx</button>
                    <button class="btn btn-primary" onclick="closeModal('viewRxModal')">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const content = document.getElementById('viewRxContent');
    if (content) {
        const medRows = (rx.medicines || []).map(m => `
            <tr>
                <td><strong>${m.name}</strong></td>
                <td>${m.dosage}</td>
                <td>${m.frequency}</td>
                <td>${m.duration}</td>
            </tr>
        `).join('');

        content.innerHTML = `
            <div style="border:1px solid var(--glass-border); padding:20px; border-radius:12px; background:var(--glass-bg);">
                <div style="display:flex; justify-content:space-between; border-bottom:2px solid var(--primary); padding-bottom:12px; margin-bottom:14px;">
                    <div>
                        <h2 style="color:var(--primary); margin:0;">MediCare HMS</h2>
                        <div style="font-size:0.85rem; color:var(--text-muted);">Consultant: <strong>${rx.doctorName}</strong></div>
                    </div>
                    <div style="text-align:right;">
                        <h3 style="color:var(--primary); margin:0; font-family:'JetBrains Mono';">${rx.id}</h3>
                        <div style="font-size:0.85rem; color:var(--text-muted);">Date: ${formatDate(rx.date)}</div>
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <strong>Patient:</strong> ${rx.patientName} (${rx.patientId})<br>
                    <strong>Diagnosis:</strong> <span style="color:var(--primary); font-weight:600;">${rx.diagnosis}</span>
                </div>
                <div style="font-size:1.4rem; font-weight:bold; color:var(--primary); margin-bottom:8px;">℞</div>
                <table class="table" style="margin-bottom:16px;">
                    <thead>
                        <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>${medRows}</tbody>
                </table>
                <div style="background:var(--glass-input); padding:10px; border-radius:8px; margin-bottom:14px;">
                    <strong>Advice & Instructions:</strong>
                    <p style="margin:4px 0 0 0; color:var(--text-secondary);">${rx.notes || 'None'}</p>
                </div>
            </div>
        `;
    }
    openModal('viewRxModal');
}

// ==========================================
// 15. PAGE: ADMINISTRATION (admin.html)
// ==========================================
function initAdminPage() {
    const staff = loadData('hms_staff', []);
    renderStaff(staff);
    const resources = loadData('hms_resources', []);
    renderResources(resources);
}

function switchAdminTab(tabId) {
    playSound('click');
    const tabs = ['staff', 'resources', 'departments', 'system'];
    tabs.forEach(t => {
        const el = document.getElementById(`${t}Tab`);
        if (el) el.style.display = t === tabId ? 'block' : 'none';
    });

    const btns = document.querySelectorAll('.tabs .tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

function renderStaff(data) {
    const tbody = document.getElementById('staffTableBody') || document.getElementById('staff-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(s => `
        <tr>
            <td><strong style="font-family:'JetBrains Mono'; color:var(--primary);">${s.id}</strong></td>
            <td><strong>${s.name}</strong></td>
            <td>${s.role}</td>
            <td>${s.department}</td>
            <td><span class="badge badge-info">${s.shift}</span></td>
            <td>${s.phone}</td>
            <td><span class="badge badge-${s.status.toLowerCase().replace(' ', '-')}">${s.status}</span></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteStaff('${s.id}')" title="Remove Staff"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterStaff() {
    const q = (document.getElementById('staffSearch')?.value || '').toLowerCase().trim();
    const staff = loadData('hms_staff', []);
    const filtered = staff.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
    renderStaff(filtered);
}

function showAddStaffModal() {
    const form = document.getElementById('staffForm') || document.getElementById('staff-form');
    if (form) form.reset();
    openModal('staffModal');
    openModal('staff-modal');
}

function saveStaff() {
    const getVal = (id1, id2) => {
        const el = document.getElementById(id1) || document.getElementById(id2);
        return el ? el.value.trim() : '';
    };

    const name = getVal('staffName', 's-name');
    const role = getVal('staffRole', 's-role') || 'Nurse';
    const department = getVal('staffDepartment', 's-department') || 'General';
    const shift = getVal('staffShift', 's-shift') || 'Morning';
    const phone = getVal('staffPhone', 's-phone');
    const status = getVal('staffStatus', 's-status') || 'On Duty';

    if (!name || !phone) {
        showToast('Please enter Staff Name and Contact Number.', 'error');
        return;
    }

    const newStaff = {
        id: generateId('S'),
        name, role, department, shift, phone, status
    };

    const staff = loadData('hms_staff', []);
    staff.unshift(newStaff);
    saveData('hms_staff', staff);

    renderStaff(staff);
    closeModal('staffModal');
    closeModal('staff-modal');
    showToast('Staff member added successfully!', 'success');
}

function deleteStaff(id) {
    if (confirm('Remove this staff record?')) {
        let staff = loadData('hms_staff', []);
        staff = staff.filter(s => s.id !== id);
        saveData('hms_staff', staff);
        renderStaff(staff);
        showToast('Staff record removed.', 'success');
    }
}

function renderResources(data) {
    const grid = document.getElementById('resourceGrid') || document.getElementById('resources-grid');
    if (!grid) return;

    grid.innerHTML = data.map(r => {
        const pct = Math.round((r.occupied / r.total) * 100);
        const colorClass = pct > 85 ? 'red' : (pct > 60 ? 'yellow' : 'green');
        const available = r.total - r.occupied;

        return `
            <div class="card" style="margin-bottom:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <h4 style="margin:0; color:var(--text-primary); font-size:1.05rem;">${r.name}</h4>
                    <span class="badge badge-info">${r.category}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.88rem; color:var(--text-secondary); margin-bottom:4px;">
                    <span>Occupied: <strong>${r.occupied}</strong> / ${r.total}</span>
                    <span style="color:var(--${colorClass === 'red' ? 'danger' : (colorClass === 'yellow' ? 'warning' : 'success')}); font-weight:bold;">${pct}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${colorClass}" style="width:${pct}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                    <span style="font-size:0.85rem; color:var(--text-muted);">${available} Available Units</span>
                    <button class="btn btn-sm btn-primary" onclick="updateResource('${r.id}')"><i class="fas fa-sliders-h"></i> Adjust</button>
                </div>
            </div>
        `;
    }).join('');
}

let activeUpdateResourceId = null;
function updateResource(id) {
    const resources = loadData('hms_resources', []);
    const res = resources.find(r => r.id === id);
    if (!res) return;

    activeUpdateResourceId = id;
    const nameEl = document.getElementById('resName') || document.getElementById('res-update-name');
    const totalEl = document.getElementById('resTotal');
    const occEl = document.getElementById('resOccupied') || document.getElementById('res-occupied');
    const availEl = document.getElementById('resAvailable');

    if (nameEl) nameEl.value = res.name;
    if (totalEl) totalEl.value = res.total;
    if (occEl) occEl.value = res.occupied;
    if (availEl) availEl.value = res.total - res.occupied;

    openModal('resourceModal');
    openModal('resource-update-modal');
}

function saveResourceUpdate() {
    const occInput = document.getElementById('resOccupied') || document.getElementById('res-occupied');
    const occupied = parseInt(occInput ? occInput.value : 0);

    let resources = loadData('hms_resources', []);
    const idx = resources.findIndex(r => r.id === activeUpdateResourceId);
    if (idx > -1) {
        if (occupied < 0 || occupied > resources[idx].total) {
            showToast(`Occupied count must be between 0 and ${resources[idx].total}.`, 'error');
            return;
        }
        resources[idx].occupied = occupied;
        saveData('hms_resources', resources);
        renderResources(resources);
        closeModal('resourceModal');
        closeModal('resource-update-modal');
        showToast('Resource capacity updated!', 'success');
    }
}

// ==========================================
// 16. DATA EXPORT & CSV GENERATORS
// ==========================================
function escapeCSV(val) {
    if (val === null || val === undefined) return '""';
    return '"' + String(val).split('"').join('""') + '"';
}

function downloadCSV(csvContent, fileName) {
    playSound('click');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${fileName} successfully!`, 'success');
}

function exportBillsToCSV() {
    const bills = loadData('hms_bills', defaultBills);
    if (!bills.length) {
        showToast('No invoices available to export.', 'info');
        return;
    }
    const headers = ['Invoice ID', 'Patient ID', 'Patient Name', 'Date', 'Total Amount', 'Status', 'Payment Method'];
    const rows = bills.map(b => [
        escapeCSV(b.id),
        escapeCSV(b.patientId),
        escapeCSV(b.patientName),
        escapeCSV(b.date),
        escapeCSV(b.total),
        escapeCSV(b.status),
        escapeCSV(b.paymentMethod || 'N/A')
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCSV(csvContent, `MediCare_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportPatientsToCSV() {
    const patients = loadData('hms_patients', defaultPatients);
    if (!patients.length) {
        showToast('No patient records to export.', 'info');
        return;
    }
    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Blood Group', 'Phone', 'Email', 'Condition', 'Status', 'Admission Date'];
    const rows = patients.map(p => [
        escapeCSV(p.id),
        escapeCSV(p.name),
        escapeCSV(p.age),
        escapeCSV(p.gender),
        escapeCSV(p.bloodGroup),
        escapeCSV(p.phone),
        escapeCSV(p.email || ''),
        escapeCSV(p.condition),
        escapeCSV(p.status),
        escapeCSV(p.admissionDate || '')
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCSV(csvContent, `MediCare_Patients_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportDoctorsToCSV() {
    const doctors = loadData('hms_doctors', defaultDoctors);
    if (!doctors.length) {
        showToast('No doctor records to export.', 'info');
        return;
    }
    const headers = ['Doctor ID', 'Name', 'Department', 'Specialization', 'Experience', 'Phone', 'Email', 'Availability'];
    const rows = doctors.map(d => [
        escapeCSV(d.id),
        escapeCSV(d.name),
        escapeCSV(d.department),
        escapeCSV(d.specialization),
        escapeCSV(d.experience || 0),
        escapeCSV(d.phone),
        escapeCSV(d.email),
        escapeCSV(d.availability)
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCSV(csvContent, `MediCare_Doctors_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportAppointmentsToCSV() {
    const appts = loadData('hms_appointments', defaultAppointments);
    if (!appts.length) {
        showToast('No appointments to export.', 'info');
        return;
    }
    const headers = ['Appointment ID', 'Patient Name', 'Doctor Name', 'Date', 'Time', 'Status', 'Reason'];
    const rows = appts.map(a => [
        escapeCSV(a.id),
        escapeCSV(a.patientName),
        escapeCSV(a.doctorName),
        escapeCSV(a.date),
        escapeCSV(a.time),
        escapeCSV(a.status),
        escapeCSV(a.reason || '')
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCSV(csvContent, `MediCare_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportPrescriptionsToCSV() {
    const rxs = loadData('hms_prescriptions', defaultPrescriptions);
    if (!rxs.length) {
        showToast('No prescriptions to export.', 'info');
        return;
    }
    const headers = ['Rx ID', 'Date', 'Patient Name', 'Doctor Name', 'Diagnosis', 'Medicines Count', 'Advice'];
    const rows = rxs.map(r => [
        escapeCSV(r.id),
        escapeCSV(r.date),
        escapeCSV(r.patientName),
        escapeCSV(r.doctorName),
        escapeCSV(r.diagnosis),
        escapeCSV((r.medicines || []).length),
        escapeCSV(r.notes || '')
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCSV(csvContent, `MediCare_Prescriptions_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportStaffToCSV() {
    const staff = loadData('hms_staff', defaultStaff);
    if (!staff.length) {
        showToast('No staff records to export.', 'info');
        return;
    }
    const headers = ['Staff ID', 'Name', 'Role', 'Department', 'Shift', 'Phone', 'Status'];
    const rows = staff.map(s => [
        escapeCSV(s.id),
        escapeCSV(s.name),
        escapeCSV(s.role),
        escapeCSV(s.department),
        escapeCSV(s.shift),
        escapeCSV(s.phone),
        escapeCSV(s.status)
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCSV(csvContent, `MediCare_Staff_${new Date().toISOString().split('T')[0]}.csv`);
}

// ==========================================
// 17. SYSTEM DATABASE BACKUP & RESTORE
// ==========================================
function exportDatabaseBackup() {
    playSound('modal');
    const db = {
        app: "MediCare HMS",
        version: "2.0 Masterpiece",
        exportedAt: new Date().toISOString(),
        patients: loadData('hms_patients', []),
        doctors: loadData('hms_doctors', []),
        appointments: loadData('hms_appointments', []),
        bills: loadData('hms_bills', []),
        prescriptions: loadData('hms_prescriptions', []),
        staff: loadData('hms_staff', []),
        resources: loadData('hms_resources', [])
    };
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `medicare_hms_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Hospital database backup exported successfully!', 'success');
}

function importDatabaseBackup(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.patients) saveData('hms_patients', data.patients);
            if (data.doctors) saveData('hms_doctors', data.doctors);
            if (data.appointments) saveData('hms_appointments', data.appointments);
            if (data.bills) saveData('hms_bills', data.bills);
            if (data.prescriptions) saveData('hms_prescriptions', data.prescriptions);
            if (data.staff) saveData('hms_staff', data.staff);
            if (data.resources) saveData('hms_resources', data.resources);
            playSound('success');
            showToast('Database successfully restored from backup! Refreshing...', 'success');
            setTimeout(() => window.location.reload(), 800);
        } catch (err) {
            playSound('alert');
            showToast('Invalid JSON backup file.', 'error');
        }
    };
    reader.readAsText(file);
}

function resetToDemoData() {
    playSound('modal');
    if (confirm('Restore hospital database to sample demo data? All temporary changes will be replaced with fresh clinical records.')) {
        saveData('hms_patients', defaultPatients);
        saveData('hms_doctors', defaultDoctors);
        saveData('hms_appointments', defaultAppointments);
        saveData('hms_bills', defaultBills);
        saveData('hms_prescriptions', defaultPrescriptions);
        saveData('hms_staff', defaultStaff);
        saveData('hms_resources', defaultResources);
        playSound('success');
        showToast('System database reset to rich sample records! Reloading...', 'success');
        setTimeout(() => window.location.reload(), 700);
    }
}

// ==========================================
// 18. NOTIFICATION CENTER MODULE
// ==========================================
const defaultNotifications = [
    { id: 'N001', type: 'emergency', title: '🚨 Trauma Code Red: ALS-04 Incoming', desc: 'Critical poly-trauma stabilization in progress. Resuscitation Bay 2 prepped.', time: '2m ago', read: false },
    { id: 'N002', type: 'appointment', title: '📅 Consult in 15 Mins: Rajesh Kumar', desc: 'Dr. Priya Sharma (Cardiology) - Diabetic review follow-up scheduled.', time: '14m ago', read: false },
    { id: 'N003', type: 'billing', title: '💳 Invoice #B001 Payment Confirmed', desc: '₹9,000 received via Card for Inpatient Stay & Pathology Labs.', time: '1h ago', read: false },
    { id: 'N004', type: 'clinical', title: '💊 Pharmacy Dispensation Complete', desc: 'Rx #RX003 (Cefuroxime & Calcium) dispensed for Amit Patel.', time: '2h ago', read: true },
    { id: 'N005', type: 'system', title: '⚙️ Cloud Telemetry: 100% Operational', desc: 'Oxygen storage pressure normal (38/50 KL). All 8 OT suites sterile.', time: '3h ago', read: true }
];

let activeNotifFilter = 'all';

function getNotifications() {
    return loadData('hms_notifications', defaultNotifications);
}

function saveNotifications(data) {
    saveData('hms_notifications', data);
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const list = getNotifications();
    const unreadCount = list.filter(n => !n.read).length;
    document.querySelectorAll('.notification-bell-btn').forEach(btn => {
        let badge = btn.querySelector('.notif-badge-dot');
        if (unreadCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'notif-badge-dot';
                btn.appendChild(badge);
            }
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = 'flex';
        } else if (badge) {
            badge.style.display = 'none';
        }
    });
}

function toggleNotificationCenter(force) {
    playSound('modal');
    let overlay = document.getElementById('notificationDrawerOverlay');
    let drawer = document.getElementById('notificationDrawer');

    if (!overlay || !drawer) {
        injectNotificationDrawer();
        overlay = document.getElementById('notificationDrawerOverlay');
        drawer = document.getElementById('notificationDrawer');
    }

    const isOpening = force !== undefined ? force : !drawer.classList.contains('active');
    if (isOpening) {
        overlay.classList.add('active');
        drawer.classList.add('active');
        renderNotifications(activeNotifFilter);
    } else {
        overlay.classList.remove('active');
        drawer.classList.remove('active');
    }
}

function renderNotifications(filter = 'all') {
    activeNotifFilter = filter;
    const listContainer = document.getElementById('notificationListContainer');
    if (!listContainer) return;

    const all = getNotifications();
    const filtered = filter === 'all' ? all : all.filter(n => n.type === filter);

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; padding:30px 10px; color:var(--text-muted); font-size:0.85rem;"><i class="fas fa-bell-slash" style="font-size:1.8rem; margin-bottom:10px; display:block; opacity:0.5;"></i>No notifications in this category.</div>`;
        return;
    }

    listContainer.innerHTML = filtered.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'} ${n.type}" onclick="handleNotifClick('${n.id}')">
            <div class="notif-icon-box ${n.type}">
                <i class="fas ${getNotifIcon(n.type)}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-title-row">
                    <span class="notif-title">${n.title}</span>
                    <span class="notif-time">${n.time}</span>
                </div>
                <p class="notif-desc">${n.desc}</p>
            </div>
        </div>
    `).join('');
}

function getNotifIcon(type) {
    switch(type) {
        case 'emergency': return 'fa-ambulance';
        case 'appointment': return 'fa-calendar-check';
        case 'billing': return 'fa-receipt';
        case 'clinical': return 'fa-prescription-bottle-alt';
        case 'system': return 'fa-server';
        default: return 'fa-bell';
    }
}

function handleNotifClick(id) {
    const list = getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
        item.read = true;
        saveNotifications(list);
        renderNotifications(activeNotifFilter);
    }
}

function markAllNotificationsRead() {
    playSound('success');
    const list = getNotifications().map(n => ({ ...n, read: true }));
    saveNotifications(list);
    renderNotifications(activeNotifFilter);
    showToast('All notifications marked as read', 'info');
}

function filterNotifTab(btn, category) {
    playSound('click');
    document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderNotifications(category);
}

function injectNotificationDrawer() {
    if (document.getElementById('notificationDrawerOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'notificationDrawerOverlay';
    overlay.className = 'notification-drawer-overlay';
    overlay.onclick = (e) => {
        if (e.target === overlay) toggleNotificationCenter(false);
    };

    const drawer = document.createElement('div');
    drawer.id = 'notificationDrawer';
    drawer.className = 'notification-drawer';
    drawer.innerHTML = `
        <div class="notification-header">
            <h3><i class="fas fa-bell" style="color:var(--primary);"></i> Hospital Alerts</h3>
            <div class="notification-actions">
                <button class="mark-read-link" onclick="markAllNotificationsRead()">Mark all read</button>
                <button class="btn-icon" onclick="toggleNotificationCenter(false)" style="width:28px; height:28px;"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="notification-tabs">
            <button class="notif-tab active" onclick="filterNotifTab(this, 'all')">All</button>
            <button class="notif-tab" onclick="filterNotifTab(this, 'emergency')">🚨 Emergency</button>
            <button class="notif-tab" onclick="filterNotifTab(this, 'appointment')">📅 Consults</button>
            <button class="notif-tab" onclick="filterNotifTab(this, 'billing')">💳 Billing</button>
            <button class="notif-tab" onclick="filterNotifTab(this, 'system')">⚙️ System</button>
        </div>
        <div class="notification-list" id="notificationListContainer"></div>
        <div class="notification-footer">
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:'JetBrains Mono';">MediCare Live Alert Mesh</span>
            <button class="btn btn-sm btn-outline" onclick="toggleNotificationCenter(false)">Close</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
}

// ==========================================
// 19. GLOBAL COMMAND PALETTE ENGINE (Ctrl + K)
// ==========================================
let commandSelectedIndex = 0;
let currentCommandResults = [];

function toggleCommandPalette(force) {
    playSound('modal');
    let overlay = document.getElementById('commandPaletteOverlay');
    if (!overlay) {
        injectCommandPalette();
        overlay = document.getElementById('commandPaletteOverlay');
    }

    const isOpening = force !== undefined ? force : !overlay.classList.contains('active');
    if (isOpening) {
        overlay.classList.add('active');
        const input = document.getElementById('commandSearchInput');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 50);
        }
        searchCommandPalette('');
    } else {
        overlay.classList.remove('active');
    }
}

function searchCommandPalette(query) {
    query = (query || '').toLowerCase().trim();
    commandSelectedIndex = 0;
    const results = [];

    const patients = loadData('hms_patients', defaultPatients);
    const doctors = loadData('hms_doctors', defaultDoctors);
    const appts = loadData('hms_appointments', defaultAppointments);
    const bills = loadData('hms_bills', defaultBills);
    const rxs = loadData('hms_prescriptions', defaultPrescriptions);

    // 1. Navigation Routes
    const navs = [
        { name: 'Dashboard', desc: 'Executive Overview & Real-Time Stats', url: 'dashboard.html', icon: 'fa-th-large', type: 'Navigation' },
        { name: 'Patients Registry', desc: 'Patient Admissions & Records', url: 'patients.html', icon: 'fa-user-injured', type: 'Navigation' },
        { name: 'Doctors & Physicians', desc: 'Medical Staff & Schedules', url: 'doctors.html', icon: 'fa-user-md', type: 'Navigation' },
        { name: 'Appointments Schedule', desc: 'Consultation Calendar & Bookings', url: 'appointments.html', icon: 'fa-calendar-check', type: 'Navigation' },
        { name: 'Billing & Invoices', desc: 'Payments, Invoices & Revenue', url: 'billing.html', icon: 'fa-file-invoice-dollar', type: 'Navigation' },
        { name: 'Prescriptions (Rx)', desc: 'Digital Medication Orders', url: 'prescriptions.html', icon: 'fa-prescription', type: 'Navigation' },
        { name: 'Administration', desc: 'Hospital Staff & Resource Units', url: 'admin.html', icon: 'fa-cogs', type: 'Navigation' }
    ];

    navs.forEach(n => {
        if (!query || n.name.toLowerCase().includes(query) || n.desc.toLowerCase().includes(query)) {
            results.push({
                group: 'Navigation',
                title: n.name,
                subtitle: n.desc,
                badge: 'Page',
                icon: n.icon,
                action: () => { window.location.href = n.url; }
            });
        }
    });

    // 2. Quick Actions
    const quickActions = [
        { title: 'Register New Patient', subtitle: 'Open Patient Registration Form', icon: 'fa-user-plus', action: () => { window.location.href = 'patients.html?action=new'; } },
        { title: 'Schedule Doctor Appointment', subtitle: 'Book a consultation slot', icon: 'fa-calendar-plus', action: () => { window.location.href = 'appointments.html?action=new'; } },
        { title: 'Generate Hospital Bill', subtitle: 'Create a new invoice', icon: 'fa-file-invoice', action: () => { window.location.href = 'billing.html?action=new'; } },
        { title: 'Issue Digital Prescription', subtitle: 'Write medication orders', icon: 'fa-prescription-bottle-alt', action: () => { window.location.href = 'prescriptions.html?action=new'; } },
        { title: 'Switch Glass Theme', subtitle: 'Cycle Cyber Obsidian / Aurora / Crystal Frost', icon: 'fa-palette', action: () => { toggleTheme(); } },
        { title: 'Switch Live Wallpaper Mode', subtitle: '3D Corridor / Synapse / ECG / Aurora / Grid', icon: 'fa-magic', action: () => { cycleWallpaperMode(); } },
        { title: 'Toggle Audio Synthesizer', subtitle: 'Enable or mute UI audio feedback', icon: 'fa-volume-up', action: () => { toggleSound(); } },
        { title: 'Export Full Database Backup', subtitle: 'Download JSON hospital state', icon: 'fa-download', action: () => { exportDatabaseBackup(); } }
    ];

    quickActions.forEach(qa => {
        if (!query || qa.title.toLowerCase().includes(query) || qa.subtitle.toLowerCase().includes(query)) {
            results.push({
                group: 'Quick Actions',
                title: qa.title,
                subtitle: qa.subtitle,
                badge: 'Action',
                icon: qa.icon,
                action: qa.action
            });
        }
    });

    // 3. Patients
    patients.forEach(p => {
        if (p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query) || p.condition.toLowerCase().includes(query)) {
            results.push({
                group: 'Patients',
                title: p.name,
                subtitle: `${p.id} • ${p.age} Yrs • ${p.condition} (${p.status})`,
                badge: p.bloodGroup,
                icon: 'fa-user-injured',
                action: () => {
                    if (window.location.pathname.includes('patients.html')) {
                        viewPatient(p.id);
                    } else {
                        window.location.href = `patients.html?view=${p.id}`;
                    }
                }
            });
        }
    });

    // 4. Doctors
    doctors.forEach(d => {
        if (d.name.toLowerCase().includes(query) || d.department.toLowerCase().includes(query) || d.specialization.toLowerCase().includes(query)) {
            results.push({
                group: 'Doctors',
                title: d.name,
                subtitle: `${d.specialization} • ${d.department} (${d.availability})`,
                badge: d.department,
                icon: 'fa-user-md',
                action: () => {
                    if (window.location.pathname.includes('doctors.html')) {
                        viewDoctor(d.id);
                    } else {
                        window.location.href = `doctors.html?view=${d.id}`;
                    }
                }
            });
        }
    });

    // 5. Invoices
    bills.forEach(b => {
        if (b.id.toLowerCase().includes(query) || b.patientName.toLowerCase().includes(query)) {
            results.push({
                group: 'Invoices',
                title: `Invoice #${b.id} - ${b.patientName}`,
                subtitle: `${formatCurrency(b.total)} • Date: ${formatDate(b.date)} (${b.status})`,
                badge: b.status,
                icon: 'fa-receipt',
                action: () => {
                    if (window.location.pathname.includes('billing.html')) {
                        viewInvoice(b.id);
                    } else {
                        window.location.href = `billing.html?view=${b.id}`;
                    }
                }
            });
        }
    });

    currentCommandResults = results;
    renderCommandResultsHTML();
}

function renderCommandResultsHTML() {
    const list = document.getElementById('commandResultsList');
    if (!list) return;

    if (currentCommandResults.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:32px 16px; color:var(--text-muted); font-size:0.9rem;"><i class="fas fa-search" style="font-size:1.8rem; margin-bottom:10px; display:block; opacity:0.5;"></i>No results matched your search query.</div>`;
        return;
    }

    let html = '';
    let currentGroup = '';

    currentCommandResults.slice(0, 30).forEach((item, idx) => {
        if (item.group !== currentGroup) {
            currentGroup = item.group;
            html += `<div class="command-group-heading">${currentGroup}</div>`;
        }
        const isSelected = idx === commandSelectedIndex;
        html += `
            <div class="command-item ${isSelected ? 'selected' : ''}" onclick="executeCommandIndex(${idx})">
                <div class="command-item-left">
                    <div class="command-item-icon"><i class="fas ${item.icon}"></i></div>
                    <div class="command-item-info">
                        <span class="command-item-title">${item.title}</span>
                        <span class="command-item-subtitle">${item.subtitle}</span>
                    </div>
                </div>
                <span class="command-item-badge">${item.badge}</span>
            </div>
        `;
    });

    list.innerHTML = html;
}

function executeCommandIndex(idx) {
    if (currentCommandResults[idx] && typeof currentCommandResults[idx].action === 'function') {
        playSound('click');
        toggleCommandPalette(false);
        currentCommandResults[idx].action();
    }
}

function injectCommandPalette() {
    if (document.getElementById('commandPaletteOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'commandPaletteOverlay';
    overlay.className = 'command-palette-overlay';
    overlay.onclick = (e) => {
        if (e.target === overlay) toggleCommandPalette(false);
    };

    overlay.innerHTML = `
        <div class="command-palette">
            <div class="command-search-header">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="commandSearchInput" class="command-search-input" placeholder="Search patients, doctors, bills, pages, or actions..." autocomplete="off" oninput="searchCommandPalette(this.value)">
                <button class="command-close-btn" onclick="toggleCommandPalette(false)"><i class="fas fa-times"></i></button>
            </div>
            <div class="command-results-list" id="commandResultsList"></div>
            <div class="command-palette-footer">
                <div class="key-hints">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
                    <span><kbd>↵</kbd> Select</span>
                    <span><kbd>Esc</kbd> Close</span>
                </div>
                <span>MediCare HMS Command Mesh</span>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
        const overlayEl = document.getElementById('commandPaletteOverlay');
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            toggleCommandPalette();
            return;
        }
        if (overlayEl && overlayEl.classList.contains('active')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                commandSelectedIndex = Math.min(commandSelectedIndex + 1, currentCommandResults.length - 1);
                renderCommandResultsHTML();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                commandSelectedIndex = Math.max(commandSelectedIndex - 1, 0);
                renderCommandResultsHTML();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                executeCommandIndex(commandSelectedIndex);
            }
        }
    });
}

// ==========================================
// 20. DASHBOARD DATA VISUALIZATIONS
// ==========================================
function initDashboardCharts() {
    renderPatientFlowChart();
    renderBedOccupancyDonut();
    initLiveOpsFeed();
    window.addEventListener('resize', () => {
        renderPatientFlowChart();
        renderBedOccupancyDonut();
    });
}

function renderPatientFlowChart() {
    const canvas = document.getElementById('patientFlowCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.clientWidth || 500;
    const h = rect.height || canvas.clientHeight || 220;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const inpatientData = [18, 24, 22, 28, 35, 30, 38];
    const outpatientData = [45, 62, 58, 70, 85, 52, 60];
    const maxVal = 100;

    const padLeft = 36;
    const padRight = 18;
    const padTop = 20;
    const padBottom = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padTop + (plotH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(w - padRight, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padLeft - 6, y + 3);
    }

    // Draw Smooth Spline Helper
    function drawSmoothCurve(data, strokeColor, fillColor) {
        const points = data.map((val, idx) => ({
            x: padLeft + (plotW / (data.length - 1)) * idx,
            y: padTop + plotH - (val / maxVal) * plotH
        }));

        // Fill area
        ctx.beginPath();
        ctx.moveTo(points[0].x, padTop + plotH);
        ctx.lineTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineTo(points[points.length - 1].x, padTop + plotH);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
        grad.addColorStop(0, fillColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Points
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
        });
    }

    drawSmoothCurve(outpatientData, '#10b981', 'rgba(16, 185, 129, 0.25)');
    drawSmoothCurve(inpatientData, '#38bdf8', 'rgba(56, 189, 248, 0.25)');

    // Day Labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    days.forEach((d, idx) => {
        const x = padLeft + (plotW / (days.length - 1)) * idx;
        ctx.fillText(d, x, h - 10);
    });
}

function renderBedOccupancyDonut() {
    const canvas = document.getElementById('bedOccupancyCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.clientWidth || 240;
    const h = rect.height || canvas.clientHeight || 240;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const resources = loadData('hms_resources', defaultResources);
    let totalBeds = 0;
    let occupiedBeds = 0;

    resources.filter(r => r.category.includes('Beds') || r.category === 'Beds').forEach(r => {
        totalBeds += r.total;
        occupiedBeds += r.occupied;
    });

    const freeBeds = Math.max(0, totalBeds - occupiedBeds);
    const occPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 74;

    const segments = [
        { label: 'Occupied ICU', val: 18, color: '#ef4444' },
        { label: 'Occupied General', val: 82, color: '#38bdf8' },
        { label: 'Available Beds', val: freeBeds, color: '#10b981' }
    ];

    const sum = segments.reduce((acc, s) => acc + s.val, 0);
    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(cx, cy) - 16;
    const innerR = outerR * 0.68;

    let startAngle = -Math.PI / 2;

    segments.forEach(seg => {
        const sliceAngle = (seg.val / sum) * (Math.PI * 2);
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startAngle, endAngle);
        ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
        ctx.closePath();

        ctx.fillStyle = seg.color;
        ctx.shadowColor = seg.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${occPct}%`, cx, cy - 6);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OCCUPANCY', cx, cy + 14);
}

function initLiveOpsFeed() {
    const feed = document.getElementById('liveOpsStream');
    if (!feed) return;

    const streamEvents = [
        { msg: 'ICU Bed #08 telemetry synchronized - vitals normal', time: 'Just now' },
        { msg: 'OR Suite 02 sterilized & staged for Ortho ORIF', time: '1m ago' },
        { msg: 'Pharmacy automated dispensary batch #892 loaded', time: '3m ago' },
        { msg: 'Ambulance ALS-02 returned to trauma dock', time: '6m ago' },
        { msg: 'Pathology lab blood gas analysis completed for P001', time: '10m ago' }
    ];

    feed.innerHTML = streamEvents.map(e => `
        <div class="ops-stream-item">
            <div class="ops-item-left">
                <span class="ops-live-dot"></span>
                <span>${e.msg}</span>
            </div>
            <span style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--text-muted);">${e.time}</span>
        </div>
    `).join('');
}

// ==========================================
// 21. UNIVERSAL HEADER HUD INJECTOR
// ==========================================
function initGlobalHUD() {
    injectCommandPalette();
    injectNotificationDrawer();
    updateNotificationBadge();

    // Ensure header has Search Pill and Notification Bell if not in static HTML
    document.querySelectorAll('.header .header-right').forEach(right => {
        if (!right.querySelector('.header-search-pill')) {
            const searchPill = document.createElement('div');
            searchPill.className = 'header-search-pill';
            searchPill.setAttribute('onclick', 'toggleCommandPalette(true)');
            searchPill.setAttribute('title', 'Quick Command Search (Ctrl + K)');
            searchPill.innerHTML = `
                <i class="fas fa-search" style="font-size:0.8rem; color:var(--primary);"></i>
                <span>Search</span>
                <kbd>Ctrl K</kbd>
            `;
            right.prepend(searchPill);
        }

        if (!right.querySelector('.notification-bell-btn')) {
            const bellBtn = document.createElement('button');
            bellBtn.className = 'btn-icon notification-bell-btn';
            bellBtn.setAttribute('onclick', 'toggleNotificationCenter()');
            bellBtn.setAttribute('title', 'Notifications & Clinical Alerts');
            bellBtn.innerHTML = `<i class="fas fa-bell"></i>`;
            
            const themeToggle = right.querySelector('.theme-toggle');
            if (themeToggle) {
                right.insertBefore(bellBtn, themeToggle);
            } else {
                right.appendChild(bellBtn);
            }
        }
    });

    updateNotificationBadge();
}

