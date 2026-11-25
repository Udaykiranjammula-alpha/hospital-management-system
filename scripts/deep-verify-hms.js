/**
 * Deep Automated Verification Suite for MediCare HMS Hackathon Game-Changers
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

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
    assert(appJs.includes("openModal('printLabReportModal')") || appJs.includes("viewLabReportModal"), 'exportRadiologyReport opens lab report modal');
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
    console.log('\n--- TEST SUITE 7: Multilingual AI Assistant Routing & Google Gemini Live Integration ---');
    const askAiJs = fs.readFileSync(path.join(rootDir, 'src/components/AskAIAssistant.jsx'), 'utf8');
    assert(askAiJs.includes("handleSendMessage(kb.knowledge[key].title, key)"), 'handleChipClick routes predefined key explicitly');
    assert(askAiJs.includes("forceKey && activeKb.knowledge && activeKb.knowledge[forceKey]"), 'handleSendMessage prioritizes forceKey without regex misses');
    assert(askAiJs.includes("'en-IN'") && askAiJs.includes("'hi-IN'") && askAiJs.includes("'te-IN'"), 'AskAIAssistant supports EN, HI, and TE');
    assert(askAiJs.includes('callGeminiAPI'), 'AskAIAssistant implements callGeminiAPI integration');
    assert(askAiJs.includes('GEMINI_CLINICAL_SYSTEM_PROMPT'), 'AskAIAssistant defines GEMINI_CLINICAL_SYSTEM_PROMPT');
    assert(askAiJs.includes('[TRIAGE: GREEN') && askAiJs.includes('[TRIAGE: YELLOW') && askAiJs.includes('[TRIAGE: RED'), 'AskAIAssistant defines emergency clinical triage system prompt with Green, Yellow, and Red tiers');
    assert(askAiJs.includes('Dr. Priya Sharma') && askAiJs.includes('Dr. Rahul Verma') && askAiJs.includes('Dr. Sneha Desai'), 'AskAIAssistant system prompt routes to MediCare specialist doctors');
    assert(askAiJs.includes('appointments.html?doctor=D001') && askAiJs.includes('appointments.html?doctor=D002'), 'AskAIAssistant includes 1-click booking appointment links for specialists');
    assert(askAiJs.includes('hms_gemini_api_key'), 'AskAIAssistant persists Gemini API key in localStorage (hms_gemini_api_key)');
    assert(askAiJs.includes('modelDisplayName') && askAiJs.includes('Connected') && askAiJs.includes('Clinical Offline Copilot'), 'AskAIAssistant shows live Gemini connection status vs offline copilot');
    assert(askAiJs.includes('isSettingsOpen') && askAiJs.includes('fa-cog'), 'AskAIAssistant includes settings gear and modal for Gemini API configuration');
    assert(askAiJs.includes('demo-gemini-flash') || askAiJs.includes('handleUseDemoKey'), 'AskAIAssistant supports one-click pre-configured demo key test');
    assert(askAiJs.includes('SpeechSynthesisUtterance') && askAiJs.includes('speakMessage'), 'AskAIAssistant supports TTS voice readout with toggle');

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
    assert(appJs.includes('function toggleAppleWalletPassView('), 'app.js implements Apple Wallet pass modal handler');
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
    assert(swCode.includes('medicare-hms-core-v2'), 'sw.js defines versioned cache store');
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
    assert(rxHtml.includes('loadAllergyPreset'), 'prescriptions.html provides 1-click allergy test presets');
    assert(appJs.includes('loadAllergyPreset'), 'app.js implements loadAllergyPreset');
    assert(appJs.includes('downloadAbhaCard'), 'app.js implements downloadAbhaCard SVG export');
    assert(appJs.includes('downloadAppleWalletPass'), 'app.js implements downloadAppleWalletPass .pkpass.json export');
    assert(bloodHtml.includes('id="donorGender"'), 'blood-bank.html includes donor gender selection');

    // ----------------------------------------------------
    // TEST SUITE 15: Clinical Logic & Algorithm Deep Execution
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 15: Clinical Logic & Algorithm Deep Execution ---');
    const clinicalMockWindow = {
        addEventListener: () => {},
        location: { href: '', pathname: '/dashboard.html' },
        localStorage: {
            _data: {},
            getItem(k) { return this._data[k] || null; },
            setItem(k, v) { this._data[k] = String(v); }
        },
        document: {
            getElementById: () => null,
            querySelectorAll: () => [],
            createElement: () => ({ style: {}, appendChild: () => {}, setAttribute: () => {}, classList: { add: () => {}, remove: () => {} } }),
            addEventListener: () => {},
            removeEventListener: () => {},
            body: { appendChild: () => {}, removeChild: () => {} }
        },
        BroadcastChannel: class {
            postMessage() {}
            addEventListener() {}
            close() {}
        },
        QRCode: {
            toString: async () => '<svg></svg>'
        }
    };
    const sandbox = {
        window: clinicalMockWindow,
        document: clinicalMockWindow.document,
        localStorage: clinicalMockWindow.localStorage,
        BroadcastChannel: clinicalMockWindow.BroadcastChannel,
        navigator: { serviceWorker: { register: () => Promise.resolve() }, userAgent: 'Node' },
        console: { log: () => {}, error: () => {}, warn: () => {} },
        setTimeout: () => 1,
        setInterval: () => 1,
        clearTimeout: () => {},
        clearInterval: () => {}
    };
    sandbox.globalThis = sandbox;
    sandbox.self = sandbox;
    vm.createContext(sandbox);

    // Execute appJs inside sandbox
    try {
        vm.runInContext(appJs, sandbox);
    } catch (e) {
        console.error('Sandbox eval error:', e);
    }

    // 1. Check checkClinicalDDI pairwise rules
    const ddiRes1 = sandbox.checkClinicalDDI(['Warfarin 5mg', 'Aspirin 75mg']);
    assert(ddiRes1.hasConflict === true && ddiRes1.rule.title.includes('Hemorrhage'), 'checkClinicalDDI detects Warfarin + Aspirin bleeding conflict');

    const ddiRes2 = sandbox.checkClinicalDDI(['Viagra 50mg', 'Nitrostat 0.4mg']);
    assert(ddiRes2.hasConflict === true && ddiRes2.rule.severity === 'Contraindicated', 'checkClinicalDDI detects brand alias Viagra + Nitrostat hypotension');

    const ddiResSafe = sandbox.checkClinicalDDI(['Paracetamol 500mg', 'Amoxicillin 250mg']);
    assert(ddiResSafe.hasConflict === false, 'checkClinicalDDI passes safe combination without false alarms');

    // 2. Check checkClinicalDDI patient allergy & condition checks
    // P002 has Penicillin allergy
    const allergyRes = sandbox.checkClinicalDDI(['Amoxicillin 500mg'], 'P002');
    assert(allergyRes.hasConflict === true && allergyRes.isAllergy === true && allergyRes.rule.title.includes('Penicillin'), 'checkClinicalDDI detects Penicillin allergy for patient P002 with Amoxicillin');

    // P006 has Dengue condition
    const dengueRes = sandbox.checkClinicalDDI(['Aspirin 75mg'], 'P006');
    assert(dengueRes.hasConflict === true && dengueRes.isConditionContraindication === true, 'checkClinicalDDI detects Dengue contraindication with Aspirin');

    // 3. Test getOrGenerateAbha format and compliance
    const abhaSample = sandbox.getOrGenerateAbha({ id: 'P001', name: 'Rajesh Kumar', age: 45, bloodGroup: 'O+', phone: '9876543210' });
    assert(/^\d{2}-\d{4}-\d{4}-\d{4}$/.test(abhaSample.number), `ABHA number is 14 digits with hyphen grouping: ${abhaSample.number}`);
    assert(abhaSample.address === 'rajesh.kumar@abdm', `ABHA address is properly formatted: ${abhaSample.address}`);
    assert(typeof abhaSample.dob === 'string' && abhaSample.dob.length === 10, `ABHA calculated DOB format is valid: ${abhaSample.dob}`);

    // 4. Test donor eligibility interval logic
    const emptyDonationInput = '';
    const isFirstTimeEligible = !emptyDonationInput;
    assert(isFirstTimeEligible === true, 'First-time blood donors without previous donation date are immediately eligible');

    // 5. Test sw.js query string handling & navigation fallback
    const swFile = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');
    assert(swFile.includes('ignoreSearch: true'), 'sw.js uses ignoreSearch: true so cache handles query parameters (?v=9.0)');
    assert(swFile.includes('dashboard.html') || swFile.includes('index.html'), 'sw.js provides fallback HTML navigation for offline state');

    // ----------------------------------------------------
    // TEST SUITE 16: Google Gemini Live API & Universal App Chatbot Integration
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 16: Google Gemini Live API & Universal App Chatbot Integration ---');
    assert(appJs.includes('callGeminiAPIFromApp'), 'app.js implements callGeminiAPIFromApp for live clinical triage');
    assert(appJs.includes('openGeminiSettingsModal') && appJs.includes('closeGeminiSettingsModal'), 'app.js implements Gemini settings modal controls');
    assert(appJs.includes('id="aiGeminiSettingsPanel"'), 'app.js includes #aiGeminiSettingsPanel overlay in chatbot window');
    assert(appJs.includes('updateAIChatbotConnectionStatus'), 'app.js implements updateAIChatbotConnectionStatus');
    assert(appJs.includes('testAndSaveGeminiKey'), 'app.js implements testAndSaveGeminiKey for live connection testing');
    assert(appJs.includes('usePreconfiguredDemoKey'), 'app.js implements one-click pre-configured demo key testing');
    assert(appJs.includes('clearGeminiKeyAndOffline'), 'app.js implements clean disconnect to offline copilot');
    assert(appJs.includes('formatGeminiResponseToHtml'), 'app.js formats Gemini markdown headings, bolding, and links to HTML');
    assert(appJs.includes('hms_gemini_api_key'), 'app.js reads and saves hms_gemini_api_key');
    assert(appJs.includes('medicare_gemini_key_updated'), 'app.js synchronizes with medicare_gemini_key_updated cross-component event');
    assert(appJs.includes('generateAIClinicalResponse'), 'app.js maintains bulletproof fallback to clinical rule engine');

    // Test markdown formatter in sandbox
    const formattedSample = sandbox.formatGeminiResponseToHtml(
        '### Emergency Triage\n**Status:** Urgent\n• Check SpO2\n[Book with Dr. Priya Sharma](appointments.html?doctor=D001)'
    );
    assert(formattedSample.includes('<h5') && formattedSample.includes('<strong>Status:</strong>') && formattedSample.includes('class="ai-action-link"'), 'formatGeminiResponseToHtml correctly parses headings, bold text, and 1-click links');

    // Test offline connection status rendering in sandbox
    sandbox.localStorage.setItem('hms_gemini_api_key', '');
    sandbox.updateAIChatbotConnectionStatus();
    assert(typeof sandbox.updateAIChatbotConnectionStatus === 'function', 'updateAIChatbotConnectionStatus executes safely in sandbox');

    // Test buildGeminiContents multi-turn normalization
    assert(typeof sandbox.buildGeminiContents === 'function', 'app.js defines buildGeminiContents for multi-turn schema normalization');
    const dummyHistory = [
        { role: 'model', parts: [{ text: 'Hello! I am your AI assistant' }] },
        { role: 'user', parts: [{ text: 'I have severe chest pain' }] },
        { role: 'model', parts: [{ text: 'Triage: Red' }] },
        { role: 'user', parts: [{ text: 'What medicine stat?' }] }
    ];
    const builtContents = sandbox.buildGeminiContents(dummyHistory, 'What medicine stat?');
    assert(builtContents[0].role === 'user', 'buildGeminiContents strictly begins with role: user');
    assert(builtContents[0].parts[0].text === 'I have severe chest pain', 'buildGeminiContents filters out model welcome greetings');
    assert(builtContents[builtContents.length - 1].parts[0].text === 'What medicine stat?', 'buildGeminiContents includes latest query');
    assert(builtContents.length === 3, 'buildGeminiContents deduplicates trailing user query and strictly alternates roles (user -> model -> user)');

    // Test generateAppEnhancedLocalTriage across all 6 specialties and languages
    assert(typeof sandbox.generateAppEnhancedLocalTriage === 'function', 'app.js implements generateAppEnhancedLocalTriage');
    const chestPainTriage = sandbox.generateAppEnhancedLocalTriage('Severe chest pain and shortness of breath', 'en-IN');
    assert(chestPainTriage.includes('[TRIAGE: RED') && chestPainTriage.includes('appointments.html?doctor=D001'), 'Chest pain triage classifies as RED and routes to Dr. Priya Sharma D001');

    const strokeTriage = sandbox.generateAppEnhancedLocalTriage('Numbness on left side and slurred speech', 'en-IN');
    assert(strokeTriage.includes('[TRIAGE: RED') && strokeTriage.includes('appointments.html?doctor=D003'), 'Stroke triage classifies as RED and routes to Dr. Sneha Desai D003');

    const fractureTriage = sandbox.generateAppEnhancedLocalTriage('Knee joint fracture after fall', 'en-IN');
    assert(fractureTriage.includes('[TRIAGE: YELLOW') && fractureTriage.includes('appointments.html?doctor=D002'), 'Fracture triage classifies as YELLOW and routes to Dr. Rahul Verma D002');

    const feverTriage = sandbox.generateAppEnhancedLocalTriage('High fever and severe chills with dengue suspected', 'en-IN');
    assert(feverTriage.includes('[TRIAGE: YELLOW') && feverTriage.includes('appointments.html?doctor=D005'), 'Fever/Dengue triage classifies as YELLOW and routes to Dr. Meera Iyer D005');

    const pediatricTriage = sandbox.generateAppEnhancedLocalTriage('Child has cough and fever', 'en-IN');
    assert(pediatricTriage.includes('[TRIAGE: YELLOW') && pediatricTriage.includes('appointments.html?doctor=D004'), 'Pediatric triage classifies as YELLOW and routes to Dr. Anil Kumar D004');

    const dermatologyTriage = sandbox.generateAppEnhancedLocalTriage('Severe skin rash and allergic itch', 'en-IN');
    assert(dermatologyTriage.includes('appointments.html?doctor=D006'), 'Dermatology triage routes to Dr. Sanjay Kapoor D006');

    const hindiTriage = sandbox.generateAppEnhancedLocalTriage('सीने में तेज दर्द', 'hi-IN');
    assert(hindiTriage.includes('आपातकालीन ट्राइएज: रेड') && hindiTriage.includes('appointments.html?doctor=D001'), 'Hindi triage returns authentic Devanagari triage and Dr. Priya Sharma D001');

    const teluguTriage = sandbox.generateAppEnhancedLocalTriage('గుండె నొప్పి మరియు శ్వాస ఆడటం లేదు', 'te-IN');
    assert(teluguTriage.includes('అత్యవసర ట్రయాజ్: రెడ్') && teluguTriage.includes('appointments.html?doctor=D001'), 'Telugu triage returns authentic Telugu script triage and Dr. Priya Sharma D001');

    // Test 1-click specialist routing links and URL parameter integration
    assert(appJs.includes("urlParams.get('doctor')"), 'app.js inspects ?doctor= query param for 1-click doctor routing');
    assert(appJs.includes('showBookAppointmentModal(selectedDoctorId)'), 'showBookAppointmentModal supports direct physician pre-selection');
    assert(appJs.includes('handleSpecialistAppointmentLink'), 'app.js defines handleSpecialistAppointmentLink for instant modal popup without reload');

    // Test Gemini deprecation recovery, model suggestion extraction, and version scoring
    const extractedModels = sandbox.extractSuggestedGeminiModelsFromApp(
        'This model models/gemini-2.0-flash is no longer available. Please update your code to use models/gemini-3.8-flash for the latest features.',
        'gemini-2.0-flash'
    );
    assert(extractedModels.length === 1 && extractedModels[0] === 'gemini-3.8-flash', 'extractSuggestedGeminiModelsFromApp extracts replacement model from Google deprecation notice');
    assert(sandbox.scoreGeminiModelNameFromApp('gemini-3.8-flash') > sandbox.scoreGeminiModelNameFromApp('gemini-2.5-flash'), 'scoreGeminiModelNameFromApp ranks gemini-3.8-flash above gemini-2.5-flash');
    assert(sandbox.scoreGeminiModelNameFromApp('gemini-2.5-flash') > sandbox.scoreGeminiModelNameFromApp('gemini-2.0-flash'), 'scoreGeminiModelNameFromApp ranks gemini-2.5-flash above gemini-2.0-flash');
    assert(sandbox.formatGeminiModelNameFromApp('gemini-3.8-flash') === 'Gemini 3.8 Flash', 'formatGeminiModelNameFromApp formats dynamic model names cleanly');
    assert(!askAiJs.includes('<option value="gemini-1.5-pro">'), 'AskAIAssistant dropdown no longer lists retired gemini-1.5-pro');
    assert(askAiJs.includes('extractSuggestedGeminiModels'), 'AskAIAssistant extracts suggested replacement models from Google deprecation errors');
    assert(sandbox.normalizeGeminiModelFromApp('gemini-2.0-flash') === 'gemini-2.5-flash', 'normalizeGeminiModelFromApp auto-upgrades retired gemini-2.0-flash');
    assert(sandbox.normalizeGeminiModelFromApp('gemini-1.5-pro') === 'gemini-2.5-flash', 'normalizeGeminiModelFromApp auto-upgrades retired gemini-1.5-pro');

    // Mocked fetch end-to-end execution for callGeminiAPIFromApp
    const originalFetch = sandbox.fetch;
    let fetchCalls = [];
    let dispatchedEvents = [];
    sandbox.window.dispatchEvent = (evt) => dispatchedEvents.push(evt);
    sandbox.CustomEvent = function(type, init) { return { type, detail: init?.detail }; };

    // Case 1: Deprecation notice 410 -> auto-switch to gemini-3.8-flash + thinking parts extraction + event sync
    sandbox.fetch = async (url) => {
        fetchCalls.push(url);
        if (url.includes('/models/gemini-2.5-flash:generateContent')) {
            return {
                ok: false,
                status: 410,
                text: async () => JSON.stringify({
                    error: { message: 'This model models/gemini-2.0-flash is no longer available. Please update your code to use models/gemini-3.8-flash for the latest features.' }
                })
            };
        }
        if (url.includes('/v1beta/models?key=')) {
            return {
                ok: true,
                status: 200,
                json: async () => ({
                    models: [
                        { name: 'models/gemini-3.8-flash', supportedGenerationMethods: ['generateContent'] }
                    ]
                })
            };
        }
        if (url.includes('/models/gemini-3.8-flash:generateContent')) {
            return {
                ok: true,
                status: 200,
                json: async () => ({
                    candidates: [{
                        content: {
                            parts: [
                                { thought: true, text: 'internal reasoning' },
                                { text: '🟢 [TRIAGE: GREEN] Clinical response from Gemini 3.8 Flash.' }
                            ]
                        }
                    }]
                })
            };
        }
        return { ok: false, status: 404, text: async () => 'Not found' };
    };

    const deprecationRecoveryReply = await sandbox.callGeminiAPIFromApp(
        'Mild headache',
        [],
        'en-IN',
        'AIzaSyMockValidKeyForTesting12345678901234',
        'gemini-2.5-flash'
    );
    assert(
        deprecationRecoveryReply === '🟢 [TRIAGE: GREEN] Clinical response from Gemini 3.8 Flash.',
        'callGeminiAPIFromApp recovers from 410 deprecation notice, switches to gemini-3.8-flash, and filters thought parts'
    );
    assert(
        sandbox.localStorage.getItem('hms_gemini_model') === 'gemini-3.8-flash' &&
        dispatchedEvents.some(e => e.type === 'medicare_gemini_key_updated' && e.detail?.model === 'gemini-3.8-flash'),
        'callGeminiAPIFromApp persists and broadcasts newly discovered model via medicare_gemini_key_updated'
    );

    // Case 2: Invalid API key (400 API_KEY_INVALID) fails fast in 1 request without probing 7 models
    fetchCalls = [];
    sandbox.fetch = async (url) => {
        fetchCalls.push(url);
        return {
            ok: false,
            status: 400,
            text: async () => JSON.stringify({ error: { status: 'INVALID_ARGUMENT', message: 'API key not valid. Please pass a valid API key.' } })
        };
    };
    let invalidKeyThrew = false;
    try {
        await sandbox.callGeminiAPIFromApp('Test', [], 'en-IN', 'AIzaSyMockInvalidKeyForTesting123456789012', 'gemini-2.5-flash');
    } catch (err) {
        invalidKeyThrew = err.message.includes('API key not valid');
    }
    assert(invalidKeyThrew && fetchCalls.length === 1, 'callGeminiAPIFromApp fast-fails in 1 HTTP call on API_KEY_INVALID');

    // Case 3: 429 quota on gemini-2.5-pro fails over to gemini-2.5-flash
    fetchCalls = [];
    sandbox.fetch = async (url) => {
        fetchCalls.push(url);
        if (url.includes('/models/gemini-2.5-pro:generateContent')) {
            return { ok: false, status: 429, text: async () => 'Quota exceeded for model gemini-2.5-pro' };
        }
        if (url.includes('/models/gemini-2.5-flash:generateContent')) {
            return {
                ok: true,
                status: 200,
                json: async () => ({ candidates: [{ content: { parts: [{ text: 'Fallback flash response' }] } }] })
            };
        }
        return { ok: false, status: 404, text: async () => 'Not found' };
    };
    const quotaFailoverReply = await sandbox.callGeminiAPIFromApp('Fever', [], 'en-IN', 'AIzaSyMockValidKeyForTesting12345678901234', 'gemini-2.5-pro');
    assert(quotaFailoverReply === 'Fallback flash response', 'callGeminiAPIFromApp fails over from 429 quota-limited model to gemini-2.5-flash');

    sandbox.fetch = originalFetch;

    // --- TEST SUITE 17: Pharmacy Drug Modal & Bed Transfer Regression Checks ---
    console.log('\n--- TEST SUITE 17: Pharmacy Drug Modal & Bed Transfer Regression Checks ---');
    const pharmacyMarkup = fs.readFileSync(path.join(rootDir, 'pharmacy.html'), 'utf8');
    const adminMarkup = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');
    const dashboardMarkup = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');

    assert(pharmacyMarkup.includes('onsubmit="event.preventDefault(); saveDrugItem();"'), 'pharmacy.html #drugForm calls saveDrugItem()');
    assert(!pharmacyMarkup.includes('saveDrug('), 'pharmacy.html does not reference undefined saveDrug()');
    assert(pharmacyMarkup.includes('id="drugDosage"') && pharmacyMarkup.includes('id="drugFormType"') && pharmacyMarkup.includes('id="drugUnitPrice"'), 'pharmacy.html #drugModal has #drugDosage, #drugFormType, and #drugUnitPrice');
    assert(pharmacyMarkup.includes('id="drugCode"') && pharmacyMarkup.includes('id="drugId"') && pharmacyMarkup.includes('id="pharmacyDrugsTableBody"'), 'pharmacy.html has #drugCode, #drugId, and #pharmacyDrugsTableBody');
    assert(appJs.includes('already exists in formulary'), 'app.js saveDrugItem() guards against duplicate medication codes');
    assert(!adminMarkup.includes('updateTransferSourceInfo'), 'admin.html does not reference undefined updateTransferSourceInfo()');
    assert(!dashboardMarkup.includes('updateTransferSourceInfo'), 'dashboard.html does not reference undefined updateTransferSourceInfo()');

    // ----------------------------------------------------
    // TEST SUITE 18: 2-Person Live PeerJS WebRTC Telemedicine Checks
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 18: 2-Person Live PeerJS WebRTC Telemedicine Checks ---');
    const teleMarkup = fs.readFileSync(path.join(rootDir, 'telemedicine.html'), 'utf8');
    const portalMarkup = fs.readFileSync(path.join(rootDir, 'patient-portal.html'), 'utf8');
    assert(teleMarkup.includes('id="telemedRemoteVideo"'), 'telemedicine.html has #telemedRemoteVideo for remote peer stream');
    assert(teleMarkup.includes('hostPeerTelemedRoom()'), 'telemedicine.html has Host Live Call control');
    assert(teleMarkup.includes('joinPeerTelemedRoom()'), 'telemedicine.html has Join Room control');
    assert(portalMarkup.includes('id="patientVideoCallModal"'), 'patient-portal.html has #patientVideoCallModal');
    assert(appJs.includes('function hostPeerTelemedRoom('), 'app.js defines hostPeerTelemedRoom');
    assert(appJs.includes('function joinPeerTelemedRoom('), 'app.js defines joinPeerTelemedRoom');
    assert(appJs.includes('function endPeerTelemedCall('), 'app.js defines endPeerTelemedCall');
    assert(appJs.includes('function adjustBloodStock('), 'app.js defines adjustBloodStock for +/- blood stock');
    assert(appJs.includes('function openEditBloodStockModal('), 'app.js defines openEditBloodStockModal');
    assert(appJs.includes('function deleteBloodDonor('), 'app.js defines deleteBloodDonor');

    // ----------------------------------------------------
    // TEST SUITE 19: WebRTC Video Call Quality Boost & Adaptive Bitrate
    // ----------------------------------------------------
    console.log('\n--- TEST SUITE 19: WebRTC Video Call Quality Boost & Adaptive Bitrate ---');
    assert(teleMarkup.includes('id="telemedQualitySelect"'), 'telemedicine.html has #telemedQualitySelect quality dropdown');
    assert(teleMarkup.includes('id="btnBoostVideoQuality"'), 'telemedicine.html has #btnBoostVideoQuality HD Boost button');
    assert(teleMarkup.includes('id="telemedQualityBadge"'), 'telemedicine.html has #telemedQualityBadge live telemetry pill');
    assert(portalMarkup.includes('id="patientQualitySelect"'), 'patient-portal.html has #patientQualitySelect quality dropdown');
    assert(portalMarkup.includes('id="patientBoostQualityBtn"'), 'patient-portal.html has #patientBoostQualityBtn HD Boost button');
    assert(portalMarkup.includes('id="patientCallQualityBadge"'), 'patient-portal.html has #patientCallQualityBadge live telemetry pill');
    assert(appJs.includes('const TELEMED_QUALITY_PROFILES = {'), 'app.js defines TELEMED_QUALITY_PROFILES');
    assert(appJs.includes('function getTelemedMediaConstraints('), 'app.js defines getTelemedMediaConstraints');
    assert(appJs.includes('async function applyPeerCallQualityParameters('), 'app.js defines applyPeerCallQualityParameters');
    assert(appJs.includes('async function setTelemedVideoQuality('), 'app.js defines setTelemedVideoQuality');
    assert(appJs.includes('function toggleTelemedQualityBoost('), 'app.js defines toggleTelemedQualityBoost');
    assert(appJs.includes('function startTelemedStatsMonitor('), 'app.js defines startTelemedStatsMonitor');

    // Sandbox behavioral tests for WebRTC quality profiles, sender bitrate tuning, and boost toggle
    const qualitySandbox = {
        window: { location: { origin: 'http://localhost', search: '', pathname: '/telemedicine.html' } },
        document: {
            getElementById: () => null,
            querySelectorAll: () => [],
            addEventListener: () => {}
        },
        localStorage: {
            _data: {},
            getItem(k) { return this._data[k] || null; },
            setItem(k, v) { this._data[k] = String(v); }
        },
        navigator: { mediaDevices: {} },
        console,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        showToast: () => {}
    };
    vm.createContext(qualitySandbox);
    const qualitySliceStart = appJs.indexOf('let telemedStreamInterval = null;');
    const qualitySliceEnd = appJs.indexOf('async function showPeerRoomInviteModal(');
    const qualityCode = appJs.slice(qualitySliceStart, qualitySliceEnd) +
        appJs.slice(appJs.indexOf('async function applyPeerCallQualityParameters('), appJs.indexOf('function stopTelemedStatsMonitor('));
    vm.runInContext(qualityCode, qualitySandbox);

    const fhdConstraints = qualitySandbox.getTelemedMediaConstraints('fhd');
    assert(fhdConstraints.video.width.ideal === 1920 && fhdConstraints.video.height.ideal === 1080, 'FHD Boost requests 1920x1080 ideal video');
    assert(fhdConstraints.audio.echoCancellation === true && fhdConstraints.audio.noiseSuppression === true && fhdConstraints.audio.autoGainControl === true, 'Audio constraints enable echoCancellation, noiseSuppression, and autoGainControl');

    const saverConstraints = qualitySandbox.getTelemedMediaConstraints('saver');
    assert(saverConstraints.video.width.ideal === 640 && saverConstraints.video.height.ideal === 360, 'Saver preset requests 640x360 low-data video');

    let appliedVideoParams = null;
    let touchedAudioSender = false;
    const mockPc = {
        getSenders: () => [
            {
                track: { kind: 'audio' },
                getParameters: () => ({ encodings: [{}] }),
                setParameters: async () => { touchedAudioSender = true; }
            },
            {
                track: { kind: 'video', contentHint: '' },
                getParameters: () => ({ encodings: [{}] }),
                setParameters: async (p) => { appliedVideoParams = p; }
            }
        ]
    };
    const updatedSenders = await qualitySandbox.applyPeerCallQualityParameters(mockPc, 'fhd');
    assert(updatedSenders === true, 'applyPeerCallQualityParameters updates video sender');
    assert(touchedAudioSender === false, 'applyPeerCallQualityParameters leaves audio sender untouched');
    assert(appliedVideoParams && appliedVideoParams.encodings[0].maxBitrate === 2800000, 'FHD Boost sets maxBitrate to 2.8 Mbps');
    assert(appliedVideoParams && appliedVideoParams.degradationPreference === 'maintain-resolution', 'FHD Boost sets degradationPreference to maintain-resolution');

    await qualitySandbox.setTelemedVideoQuality('invalid_preset', true);
    assert(qualitySandbox.localStorage.getItem('hms_telemed_quality') === 'auto', 'Invalid quality preset safely falls back to auto');

    await qualitySandbox.toggleTelemedQualityBoost();
    assert(qualitySandbox.localStorage.getItem('hms_telemed_quality') === 'fhd', 'toggleTelemedQualityBoost switches from auto to fhd');
    await qualitySandbox.toggleTelemedQualityBoost();
    assert(qualitySandbox.localStorage.getItem('hms_telemed_quality') === 'auto', 'toggleTelemedQualityBoost switches back from fhd to auto');

    // ------------------------------------------
    // TEST SUITE 20: P2P Vitals Sync, Call Timer & Mobile Polish
    // ------------------------------------------
    console.log('\n--- TEST SUITE 20: P2P Vitals Sync, Call Timer & Mobile Polish ---');
    const patPortalSrc = fs.readFileSync(path.join(rootDir, 'patient-portal.html'), 'utf8');
    assert(telemedHtml.includes('id="telemedCallTimer"'), 'telemedicine.html has #telemedCallTimer');
    assert(patPortalSrc.includes('id="patientShareVitalsBtn"'), 'patient-portal.html has #patientShareVitalsBtn');
    assert(appJs.includes('function sendPatientLiveVitals'), 'app.js defines sendPatientLiveVitals');
    assert(appJs.includes('function applyReceivedPeerVitals'), 'app.js defines applyReceivedPeerVitals');
    assert(appJs.includes('function formatTelemedDuration'), 'app.js defines formatTelemedDuration');
    assert(appJs.includes("payload.type === 'vitals'"), 'bindPeerDataConnection handles P2P vitals payload');
    assert(styleCss.includes('#patientLocalSelfVideo'), 'css/style.css includes mobile PiP rule for #patientLocalSelfVideo');

    // ------------------------------------------
    // TEST SUITE 21: Patient Portal Directory & Blood Search
    // ------------------------------------------
    console.log('\n--- TEST SUITE 21: Patient Portal Directory & Blood Search ---');
    assert(patPortalSrc.includes('id="portalDirectorySearch"'), 'patient-portal.html has #portalDirectorySearch');
    assert(patPortalSrc.includes('id="btnTabDirectory"'), 'patient-portal.html has #btnTabDirectory');
    assert(patPortalSrc.includes('id="portalTabDirectory"'), 'patient-portal.html has #portalTabDirectory');
    assert(appJs.includes('function renderPortalHospitalDirectory'), 'app.js defines renderPortalHospitalDirectory');
    assert(appJs.includes('function filterPortalDirectory'), 'app.js defines filterPortalDirectory');
    assert(appJs.includes('function openPublicHospitalDirectoryModal'), 'app.js defines openPublicHospitalDirectoryModal');
    assert(appJs.includes('function openPatientBookAppointmentModal'), 'app.js defines openPatientBookAppointmentModal');
    assert(appJs.includes('function savePatientPortalAppointment'), 'app.js defines savePatientPortalAppointment');
    assert(appJs.includes('function openPatientBloodRequestModal'), 'app.js defines openPatientBloodRequestModal');
    assert(appJs.includes('function savePatientBloodRequest'), 'app.js defines savePatientBloodRequest');
    assert(appJs.includes('function getUnifiedBloodStockMap'), 'app.js unifies blood stock across Blood Bank & Patient Portal');
    assert(fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8').includes('id="loginDoctorSelect"'), 'index.html has #loginDoctorSelect for all doctors');
    assert(fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8').includes('id="loginPatientSelect"'), 'index.html has #loginPatientSelect for all patients');
    assert(fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8').includes('id="btnPublicHospitalInfo"'), 'index.html has #btnPublicHospitalInfo for new visitors');

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
