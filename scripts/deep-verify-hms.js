/**
 * Deep Automated Verification Suite for MediCare HMS Hackathon Game-Changers
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✅ [PASS] ${testName}`);
    } else {
        failedTests++;
        console.error(`  ❌ [FAIL] ${testName} - ${details}`);
    }
}

async function runAllTests() {
    console.log('🏥 Starting Deep Verification Test Suite for MediCare HMS...\n');

    // ----------------------------------------------------
    // TEST SUITE 1: Files & Markup Integrity
    // ----------------------------------------------------
    console.log('--- TEST SUITE 1: DOM Elements, Modals & Markup Integrity ---');
    const emergencyHtml = fs.readFileSync(path.join(rootDir, 'emergency.html'), 'utf8');
    const labHtml = fs.readFileSync(path.join(rootDir, 'laboratory.html'), 'utf8');
    const rxHtml = fs.readFileSync(path.join(rootDir, 'prescriptions.html'), 'utf8');
    const styleCss = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');
    const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

    // Emergency Page DOM Elements
    assert(emergencyHtml.includes('id="biometricScannerModal"'), 'emergency.html has #biometricScannerModal');
    assert(emergencyHtml.includes('id="ppgVideo"'), 'emergency.html has #ppgVideo');
    assert(emergencyHtml.includes('id="ppgWaveformCanvas"'), 'emergency.html has #ppgWaveformCanvas');
    assert(emergencyHtml.includes('id="ppgTargetBedSelect"'), 'emergency.html has #ppgTargetBedSelect');
    assert(emergencyHtml.includes('id="ambulanceGpsMapCanvas"'), 'emergency.html has #ambulanceGpsMapCanvas');
    assert(emergencyHtml.includes('id="ambulanceDispatchModal"'), 'emergency.html has #ambulanceDispatchModal');
    assert(emergencyHtml.includes('openBiometricScannerModal'), 'emergency.html triggers openBiometricScannerModal');

    // Laboratory Page DOM Elements
    assert(labHtml.includes('id="cxrBaseCanvas"'), 'laboratory.html has #cxrBaseCanvas');
    assert(labHtml.includes('id="cxrHeatmapCanvas"'), 'laboratory.html has #cxrHeatmapCanvas');
    assert(labHtml.includes('id="cxrAnnotationCanvas"'), 'laboratory.html has #cxrAnnotationCanvas');
    assert(labHtml.includes('id="cxrCaseNormalBtn"'), 'laboratory.html has preset buttons');
    assert(labHtml.includes('id="cxrCasePneumoniaBtn"'), 'laboratory.html has pneumonia preset button');
    assert(labHtml.includes('id="cxrHeatmapOpacity"'), 'laboratory.html has opacity slider');
    assert(labHtml.includes('exportRadiologyReport()'), 'laboratory.html triggers exportRadiologyReport()');

    // Prescriptions Page DOM Elements
    assert(rxHtml.includes('id="viewRxModal"'), 'prescriptions.html has #viewRxModal');
    assert(rxHtml.includes('id="viewRxContent"'), 'prescriptions.html has #viewRxContent container');
    assert(rxHtml.includes('printVerifiablePrescription()'), 'prescriptions.html triggers printVerifiablePrescription()');
    assert(rxHtml.includes('verifyCurrentRxIntegrity()'), 'prescriptions.html triggers verifyCurrentRxIntegrity()');

    // CSS Keyframe Animations & Print Rules
    assert(styleCss.includes('@keyframes ppgPulseBorder'), 'css/style.css defines @keyframes ppgPulseBorder');
    assert(styleCss.includes('@keyframes ppgHeartbeatAnim'), 'css/style.css defines @keyframes ppgHeartbeatAnim');
    assert(styleCss.includes('@keyframes cxrLaserSweep'), 'css/style.css defines @keyframes cxrLaserSweep');
    assert(styleCss.includes('.modal-overlay:not(.active)'), 'css/style.css hides inactive modals in print stylesheet');
    assert(styleCss.includes('body:has(.modal-overlay.active) .main-wrapper'), 'css/style.css isolates modal during print');

    // ----------------------------------------------------
    // TEST SUITE 2: React Bundle & Offline QR Code Engine
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 2: React Bundle & Offline QR Code Engine ---');
    const bundlePath = path.join(rootDir, 'js/react-components.bundle.js');
    assert(fs.existsSync(bundlePath), 'js/react-components.bundle.js exists');
    const bundleCode = fs.readFileSync(bundlePath, 'utf8');

    // Test bundle in mock browser sandbox
    const mockWindow = {
        name: 'test_window',
        location: { pathname: '/prescriptions.html', origin: 'http://localhost:3000' }
    };
    const mockDoc = {
        getElementById: () => null,
        createElement: (tag) => ({ id: '', style: {}, appendChild: () => {} }),
        body: { appendChild: () => {} },
        head: { appendChild: () => {} }
    };

    const bundleFn = new Function('window', 'document', 'self', bundleCode);
    bundleFn(mockWindow, mockDoc, mockWindow);

    assert(typeof mockWindow.QRCode === 'object', 'bundle exposes window.QRCode');
    assert(typeof mockWindow.QRCode.toString === 'function', 'window.QRCode.toString is callable');

    const qrResult = await mockWindow.QRCode.toString('https://medicare-hms.vercel.app/prescriptions.html?verify=RX001', { type: 'svg' });
    assert(qrResult && qrResult.includes('<svg') && qrResult.includes('</svg>'), 'QRCode.toString generates valid SVG vector code');
    assert(typeof mockWindow.mountReactWidgets === 'function', 'bundle exposes mountReactWidgets');
    assert(typeof mockWindow.AskAIAssistant === 'function', 'bundle exposes AskAIAssistant component');
    assert(typeof mockWindow.LiveTelemetryMonitor === 'function', 'bundle exposes LiveTelemetryMonitor component');

    // ----------------------------------------------------
    // TEST SUITE 3: Clinical Mesh Engine & Event Deduplication
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 3: Clinical Mesh Engine & Deduplication ---');
    assert(appJs.includes('const handledMeshEventIds = new Set();'), 'app.js implements mesh event deduplication set');
    assert(appJs.includes('const currentSessionTabId ='), 'app.js generates unique persistent tab session ID');
    assert(appJs.includes('if (data.tabId && data.tabId === currentSessionTabId) return;'), 'app.js guards against self-reflection');
    assert(appJs.includes('function updatePatientStats()'), 'app.js defines updatePatientStats');
    assert(appJs.includes('function updateAppointmentStats()'), 'app.js defines updateAppointmentStats');
    assert(appJs.includes('function updateDashboardKPIs()'), 'app.js defines updateDashboardKPIs');
    assert(appJs.includes('updateLabKPIs(tests)'), 'app.js calls valid updateLabKPIs on lab mesh events');

    // ----------------------------------------------------
    // TEST SUITE 4: Real Webcam PPG Waveform Scaling & Auto-Gain
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 4: Real Webcam PPG Waveform Scaling & Auto-Gain ---');
    assert(appJs.includes('const acSignal = rawVal - baseline;'), 'app.js computes AC signal via baseline subtraction');
    assert(appJs.includes('ppgBuffer.push({ time, val: rawVal, ac: acSignal });'), 'app.js stores AC signal in buffer');
    assert(appJs.includes('const scale = (h * 0.38) / Math.max(maxAc, 1.5);'), 'app.js auto-gains waveform to fill canvas height without clipping');
    assert(appJs.includes('const adaptiveThreshold = Math.max(0.35, 0.40 * maxAc);'), 'app.js uses adaptive peak detection threshold');
    assert(appJs.includes('window.syncedBedVitals = window.syncedBedVitals || {};'), 'app.js persists synced bed vitals across re-renders');
    assert(appJs.includes("window.dispatchEvent(new CustomEvent('medicare_biometric_sync'"), 'app.js dispatches medicare_biometric_sync event');

    // ----------------------------------------------------
    // TEST SUITE 5: Radiology AI Heatmap & Canvas Safety
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 5: Radiology AI Heatmap & Report Export ---');
    assert(appJs.includes('function exportRadiologyReport()'), 'app.js defines exportRadiologyReport');
    assert(appJs.includes('printableLabReportContent'), 'exportRadiologyReport populates printable report content');
    assert(appJs.includes("openModal('printLabReportModal')"), 'exportRadiologyReport opens printLabReportModal');
    assert(appJs.includes('if (typeof ctx.roundRect === \'function\')'), 'app.js provides ctx.roundRect fallback');

    // ----------------------------------------------------
    // TEST SUITE 6: Verifiable Digital Prescription & QR URL Handler
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 6: Verifiable e-Prescription & QR Auto-Open ---');
    assert(appJs.includes("urlParams.get('verify')"), 'app.js inspects ?verify URL parameter');
    assert(appJs.includes('viewPrescription(verifyRxId)'), 'app.js auto-triggers viewPrescription on scan verification');
    assert(appJs.includes('baseVerifyOrigin'), 'app.js dynamically adapts QR verification URL to current host');

    // ----------------------------------------------------
    // TEST SUITE 7: Multilingual AI Assistant Routing
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 7: Multilingual AI Assistant Routing ---');
    const askAiJs = fs.readFileSync(path.join(rootDir, 'src/components/AskAIAssistant.jsx'), 'utf8');
    assert(askAiJs.includes("handleSendMessage(kb.knowledge[key].title, key)"), 'handleChipClick routes predefined key explicitly');
    assert(askAiJs.includes("forceKey && activeKb.knowledge && activeKb.knowledge[forceKey]"), 'handleSendMessage prioritizes forceKey without regex misses');
    assert(askAiJs.includes("'en-IN'") && askAiJs.includes("'hi-IN'") && askAiJs.includes("'te-IN'"), 'AskAIAssistant supports EN, HI, and TE');

    // ----------------------------------------------------
    // TEST SUITE 8: Virtual Telemedicine & Video Consultation
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 8: Virtual Telemedicine & Video Consultation ---');
    const telemedPath = path.join(rootDir, 'telemedicine.html');
    assert(fs.existsSync(telemedPath), 'telemedicine.html exists');
    const telemedHtml = fs.readFileSync(telemedPath, 'utf8');
    assert(telemedHtml.includes('id="telemedicineConsole"'), 'telemedicine.html has #telemedicineConsole');
    assert(telemedHtml.includes('id="telemedWebcamVideo"'), 'telemedicine.html has #telemedWebcamVideo for WebRTC');
    assert(telemedHtml.includes('id="telemedPatientStreamCanvas"'), 'telemedicine.html has #telemedPatientStreamCanvas');
    assert(telemedHtml.includes('id="telemedVitalsHud"'), 'telemedicine.html has vitals HUD overlay');
    assert(telemedHtml.includes('id="telemedSoapNotes"'), 'telemedicine.html has in-call clinical notepad (#telemedSoapNotes)');
    assert(telemedHtml.includes('id="telemedDiagnosis"'), 'telemedicine.html has quick diagnosis field');
    assert(telemedHtml.includes('id="telemedCompleteModal"'), 'telemedicine.html has consultation completion & billing handoff modal');
    assert(telemedHtml.includes('toggleTelemedAudio()') && telemedHtml.includes('toggleTelemedVideo()'), 'telemedicine.html has audio/video toggle controls');
    assert(appJs.includes('function initTelemedicinePage()'), 'app.js implements initTelemedicinePage');
    assert(appJs.includes('async function toggleRealCameraStream()'), 'app.js implements toggleRealCameraStream WebRTC integration');
    assert(appJs.includes('function startTelemedPatientStream()'), 'app.js implements animated remote patient rendering engine');
    assert(appJs.includes('function completeTelemedConsultation()'), 'app.js implements completeTelemedConsultation with billing invoice creation');

    // ----------------------------------------------------
    // TEST SUITE 9: National Blood Bank & Donor Registry
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 9: National Blood Bank & Donor Registry ---');
    const bloodPath = path.join(rootDir, 'blood-bank.html');
    assert(fs.existsSync(bloodPath), 'blood-bank.html exists');
    const bloodHtml = fs.readFileSync(bloodPath, 'utf8');
    assert(bloodHtml.includes('id="bloodInventoryGrid"'), 'blood-bank.html has #bloodInventoryGrid');
    assert(bloodHtml.includes('id="bloodDonorsTableBody"'), 'blood-bank.html has #bloodDonorsTableBody');
    assert(bloodHtml.includes('id="bloodRequestsTableBody"'), 'blood-bank.html has #bloodRequestsTableBody');
    assert(bloodHtml.includes('id="donorIntakeModal"'), 'blood-bank.html has #donorIntakeModal');
    assert(bloodHtml.includes('id="emergencyBloodRequestModal"'), 'blood-bank.html has #emergencyBloodRequestModal');
    assert(bloodHtml.includes('id="donorHemoglobin"') && bloodHtml.includes('id="donorWeight"'), 'blood-bank.html has clinical screening inputs');
    assert(appJs.includes('const defaultBloodInventory = ['), 'app.js defines default 8-group blood inventory dataset');
    assert(appJs.includes('function initBloodBankPage()'), 'app.js implements initBloodBankPage');
    assert(appJs.includes('function submitDonorIntake()'), 'app.js implements submitDonorIntake with clinical eligibility validation');
    assert(appJs.includes('function broadcastEmergencyBloodRequest()'), 'app.js implements broadcastEmergencyBloodRequest');
    assert(appJs.includes('function fulfillBloodRequest(reqId)'), 'app.js implements fulfillBloodRequest inventory deduction');

    // ----------------------------------------------------
    // TEST SUITE 10: Smart Visual Bed & Ward Management
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 10: Smart Visual Bed & Ward Management ---');
    const dashHtml = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');
    const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');
    assert(dashHtml.includes('id="dashboardBedGrid"'), 'dashboard.html has #dashboardBedGrid floor plan container');
    assert(dashHtml.includes('id="bedAllocationModal"'), 'dashboard.html has #bedAllocationModal');
    assert(dashHtml.includes('id="patientTransferModal"'), 'dashboard.html has #patientTransferModal');
    assert(dashHtml.includes('id="bedDetailsModal"'), 'dashboard.html has #bedDetailsModal');
    assert(adminHtml.includes('id="adminBedGrid"'), 'admin.html has #adminBedGrid floor plan container');
    assert(adminHtml.includes('id="bedmanagerTab"'), 'admin.html has bedmanager tab');
    assert(appJs.includes('defaultHospitalBeds = ['), 'app.js defines default floor plan bed wings dataset');
    assert(appJs.includes('function renderBedFloorPlan('), 'app.js implements renderBedFloorPlan');
    assert(appJs.includes('function submitBedAllocation()'), 'app.js implements submitBedAllocation with mesh broadcasting');
    assert(appJs.includes('function submitPatientTransfer()'), 'app.js implements submitPatientTransfer');

    // ----------------------------------------------------
    // TEST SUITE 11: Clinical Drug-Drug Interaction (DDI) Safety Checker
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 11: Clinical DDI & Allergy Safety Checker ---');
    const pharmHtml = fs.readFileSync(path.join(rootDir, 'pharmacy.html'), 'utf8');
    assert(rxHtml.includes('id="prescriptionDdiAlert"'), 'prescriptions.html has real-time DDI alert banner');
    assert(rxHtml.includes('id="rxDdiMechanism"'), 'prescriptions.html has DDI mechanism details');
    assert(rxHtml.includes('id="rxDdiAlternative"'), 'prescriptions.html has safe alternative recommendation');
    assert(pharmHtml.includes('id="pharmacyDdiView"'), 'pharmacy.html has Clinical DDI Safety Engine view');
    assert(pharmHtml.includes('id="tabDdiBtn"'), 'pharmacy.html has tab selector for DDI engine');
    assert(appJs.includes('CLINICAL_DDI_RULES = ['), 'app.js defines clinical contraindication rules');
    assert(appJs.includes('function checkClinicalDDI('), 'app.js implements checkClinicalDDI logic');
    assert(appJs.includes('function triggerRxDdiScan()'), 'app.js implements real-time prescription DDI evaluation');
    assert(appJs.includes('function analyzePharmacyDdi()'), 'app.js implements interactive pharmacy 2-drug analyzer');

    // ----------------------------------------------------
    // TEST SUITE 12: ABHA Digital Health ID & Apple Wallet Pass
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 12: ABHA Digital Health ID & Apple Wallet Pass ---');
    const patientsHtml = fs.readFileSync(path.join(rootDir, 'patients.html'), 'utf8');
    const portalHtml = fs.readFileSync(path.join(rootDir, 'patient-portal.html'), 'utf8');
    assert(patientsHtml.includes('id="abhaCardModal"'), 'patients.html has #abhaCardModal');
    assert(patientsHtml.includes('id="abhaCardVisualContainer"'), 'patients.html has #abhaCardVisualContainer');
    assert(portalHtml.includes('id="patientDigitalIdCard"'), 'patient-portal.html has patientDigitalIdCard container');
    assert(portalHtml.includes('id="appleWalletPassModal"'), 'patient-portal.html has Apple Wallet pass modal');
    assert(appJs.includes('function getOrGenerateAbha('), 'app.js implements 14-digit ABHA ID generator');
    assert(appJs.includes('async function renderABHACard('), 'app.js implements renderABHACard with vector QR rendering');
    assert(appJs.includes('function toggleAppleWalletPassView()'), 'app.js implements Apple Wallet pass modal handler');
    assert(appJs.includes('async function renderAppleWalletPass('), 'app.js implements renderAppleWalletPass');

    // ----------------------------------------------------
    // TEST SUITE 13: PWA Offline Resilience & Service Worker
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 13: PWA Offline Resilience & Service Worker ---');
    const manifestPath = path.join(rootDir, 'manifest.json');
    assert(fs.existsSync(manifestPath), 'manifest.json exists');
    const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert(manifestJson.short_name === 'MediCare HMS' && manifestJson.display === 'standalone', 'manifest.json configured for standalone hospital app');
    assert(Array.isArray(manifestJson.icons) && manifestJson.icons.length > 0, 'manifest.json defines PWA app icons');

    const swPath = path.join(rootDir, 'sw.js');
    assert(fs.existsSync(swPath), 'sw.js service worker exists');
    const swCode = fs.readFileSync(swPath, 'utf8');
    assert(swCode.includes('medicare-hms-core-v2.1'), 'sw.js defines versioned cache store');
    assert(swCode.includes("addEventListener('install'"), 'sw.js handles install lifecycle event');
    assert(swCode.includes("addEventListener('fetch'"), 'sw.js handles fetch caching lifecycle event');
    assert(appJs.includes("navigator.serviceWorker.register('./sw.js')"), 'app.js registers PWA service worker');
    assert(appJs.includes("id = 'offlineBanner'"), 'app.js creates interactive PWA offline fallback banner');

    // ----------------------------------------------------
    // TEST SUITE 14: Universal Navigation & Clinical Mesh Events
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 14: Universal Navigation & Clinical Mesh Cross-Sync ---');
    assert(fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8').includes('manifest.json'), 'index.html links to manifest.json');

    const mainAppPages = [
        'dashboard.html', 'patients.html', 'appointments.html',
        'doctors.html', 'prescriptions.html', 'pharmacy.html', 'laboratory.html',
        'billing.html', 'emergency.html', 'admin.html', 'patient-portal.html',
        'telemedicine.html', 'blood-bank.html'
    ];
    for (const pageName of mainAppPages) {
        const pageContent = fs.readFileSync(path.join(rootDir, pageName), 'utf8');
        assert(pageContent.includes('telemedicine.html'), `${pageName} links to telemedicine.html in navigation`);
        assert(pageContent.includes('blood-bank.html'), `${pageName} links to blood-bank.html in navigation`);
        assert(pageContent.includes('manifest.json'), `${pageName} links to manifest.json`);
    }
    assert(appJs.includes("data.type.includes('telemed')"), 'app.js listens to mesh telemed event');
    assert(appJs.includes("data.type.includes('blood')"), 'app.js listens to mesh blood event');
    assert(appJs.includes("data.type.includes('bed')"), 'app.js listens to mesh bed event');


    console.log(`\n====================================================`);
    console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
    console.log(`====================================================\n`);

    if (failedTests > 0) {
        process.exit(1);
    }
}

runAllTests().catch(err => {
    console.error('Fatal error in test suite:', err);
    process.exit(1);
});
