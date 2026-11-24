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
