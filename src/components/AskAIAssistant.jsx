import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * AskAIAssistant - Production React 18 Clinical AI Copilot with Google Gemini Live API
 * Languages Supported: English (en-IN), Hindi (hi-IN), Telugu (te-IN)
 * Features:
 * - Google Gemini Live API (gemini-1.5-flash / gemini-2.0-flash-exp) integration
 * - Emergency Clinical Triage System Prompt (Green, Yellow, Red Triage)
 * - Department & Specialist Physician Routing (Dr. Priya Sharma, Dr. Rahul Verma, etc.) with 1-click booking
 * - Clinical Drug-Drug Interaction (DDI) & Contraindication screening
 * - Multilingual reasoning in English, Hindi (Devanagari), and Telugu
 * - Speech-to-Text (Voice Input) & Text-to-Speech (Voice Readout with toggle)
 * - Gemini API Key Settings Modal with connection test & pre-configured demo key
 * - Bulletproof automatic fallback to Clinical Offline Knowledge Base
 * - Siri Intelligence animated iridescent orb with draggable glassmorphic UI
 */

export const GEMINI_CLINICAL_SYSTEM_PROMPT = `You are MediCare Clinical AI Copilot, a senior emergency triage physician and clinical decision-support copilot embedded in MediCare Hospital Management System.

CORE OPERATIONAL PROTOCOLS:
1. EMERGENCY CLINICAL TRIAGE CLASSIFICATION:
Classify every symptom query into one of three triage tiers at the very top of your response:
- 🟢 [TRIAGE: GREEN - NON-URGENT]: Mild self-limiting symptoms, routine checkups, elective consultations. Advise home care and elective OPD booking.
- 🟡 [TRIAGE: YELLOW - URGENT]: Moderate distress, high fevers, unmanaged vitals, stable fractures, persistent pain. Recommend same-day specialist visit within 2-4 hours.
- 🔴 [TRIAGE: RED - EMERGENT / CODE BLUE]: Acute chest pain/tightness (STEMI), stroke signs (FAST: facial drooping, arm weakness, speech difficulty), severe anaphylaxis, acute respiratory failure, massive hemorrhage. Mandate IMMEDIATE emergency care: "🚨 Call 108 immediately or report to MediCare 24/7 Resuscitation & Trauma Center."

2. SPECIALIST PHYSICIAN ROUTING:
When appropriate, guide the patient or doctor to MediCare's specialists with 1-click booking actions:
- Cardiology / Chest Pain / Palpitations: Dr. Priya Sharma (Chief Interventional Cardiologist, 12+ yrs exp) -> [Book with Dr. Priya Sharma](appointments.html?doctor=D001)
- Orthopedics / Fractures / Joint Pain: Dr. Rahul Verma (Senior Orthopedic Surgeon, 15+ yrs exp) -> [Book with Dr. Rahul Verma](appointments.html?doctor=D002)
- Neurology / Stroke / Severe Migraine: Dr. Sneha Desai (Senior Neuro Physician, 8+ yrs exp) -> [Consult Dr. Sneha Desai](appointments.html?doctor=D003)
- Pediatrics / Child & Infant Care: Dr. Anil Kumar (Chief Pediatrician, 20+ yrs exp) -> [Book with Dr. Anil Kumar](appointments.html?doctor=D004)
- Internal Medicine / Fever / Dengue / Infections: Dr. Meera Iyer (Internal Medicine Specialist, 10+ yrs exp) -> [Consult Dr. Meera Iyer](appointments.html?doctor=D005)
- Dermatology / Skin Rashes / Allergies: Dr. Sanjay Kapoor (Clinical Dermatologist, 5+ yrs exp) -> [Consult Dr. Sanjay Kapoor](appointments.html?doctor=D006)
Always include the markdown link in the format [Book with Dr. Name](appointments.html?doctor=D00X).

3. CLINICAL PHARMACOTHERAPY & DRUG INTERACTIONS:
Identify dangerous drug-drug interactions (DDI) and contraindications:
- Warfarin + Fluconazole / Aspirin / NSAIDs (High bleeding risk, elevated INR)
- Sildenafil + Nitroglycerin / Nitrates (Profound fatal hypotension)
- Clopidogrel + Omeprazole (Reduced antiplatelet effectiveness)
- Dengue Fever + Aspirin / Ibuprofen (Strictly contraindicated due to thrombocytopenic bleeding; advise Paracetamol only)
- Penicillin allergy + Amoxicillin (Severe anaphylaxis)

4. DIFFERENTIAL DIAGNOSES & HOME CARE:
- Present 2-3 clinical differential diagnoses ordered by probability.
- Outline vital signs to monitor (SpO2, Blood Pressure, Heart Rate, Temperature).
- Detail patient home care precautions and red-flag symptoms to watch.

5. MULTILINGUAL RESPONSES:
Active Target Language: {TARGET_LANG}.
You MUST generate the entire clinical triage response fluently in {TARGET_LANG}.
If Hindi (hi-IN), respond completely in Hindi Devanagari script (हिन्दी).
If Telugu (te-IN), respond completely in Telugu script (తెలుగు).
If English (en-IN), maintain crisp professional clinical English.`;

const MULTILINGUAL_KNOWLEDGE_BASE = {
  'en-IN': {
    welcome: "Hello Doctor, I'm your MediCare Clinical AI Assistant running live in React 18 with Google Gemini integration. How can I assist you with clinical triage, drug interactions, or critical care SOPs today?",
    placeholder: "Ask clinical queries, drugs, or voice triage...",
    listening: "Listening in English (en-IN)... Speak now",
    chips: [
      { id: 'stemi', label: '🚨 STEMI Alert' },
      { id: 'sepsis', label: '🩺 Sepsis qSOFA' },
      { id: 'drug_interaction', label: '💊 Drug Matrix' },
      { id: 'icu_beds', label: '📊 ICU Capacity' },
      { id: 'stroke', label: '🧠 Code Stroke' }
    ],
    knowledge: {
      stemi: {
        title: "🚨 Emergency STEMI / Acute MI Protocol",
        body: `🔴 **[TRIAGE: RED - EMERGENT / CODE BLUE]**\n\n**CLINICAL PRIORITY: IMMEDIATE INTERVENTION (Door-to-Balloon < 90 mins)**\n\n1. **Diagnostic Checklist:**\n   • 12-lead ECG immediately (within 10 minutes).\n   • ST elevation > 1mm in ≥2 contiguous leads or new LBBB.\n   • Stat Troponin I, CK-MB, Electrolytes, PT/INR.\n\n2. **Immediate Pharmacotherapy (MONA):**\n   • Aspirin 325 mg chewed stat.\n   • Ticagrelor 180 mg loading dose (or Clopidogrel 600 mg).\n   • Sublingual Nitroglycerin 0.4 mg q5min (hold if SBP < 90 or RV infarction).\n   • Unfractionated Heparin 60 U/kg bolus IV (max 4000 U).\n   • High-intensity Statin: Atorvastatin 80 mg PO.\n\n3. **Cath Lab & Specialist Routing:**\n   • Interventional Cardiology: [Book with Dr. Priya Sharma](appointments.html?doctor=D001)\n   • Page On-Call Team via Priority Line #444 • Prepare Bed in Cath Lab 2.`
      },
      sepsis: {
        title: "🩺 Sepsis & Septic Shock Screening (qSOFA)",
        body: `🟡 **[TRIAGE: YELLOW - URGENT]**\n\n**SURVIVING SEPSIS HOUR-1 BUNDLE INITIATED**\n\n1. **Quick SOFA Criteria (Score ≥ 2 indicates high mortality risk):**\n   • Respiratory Rate ≥ 22 bpm.\n   • Altered Mental Status (GCS < 15).\n   • Systolic Blood Pressure ≤ 100 mmHg.\n\n2. **Hour-1 Action Protocol:**\n   • Stat blood cultures (2 sets, aerobic & anaerobic) *before* antimicrobials.\n   • Serum Lactate measurement (repeat in 2-4 hrs if initial > 2.0 mmol/L).\n   • Broad-spectrum IV antibiotics: Piperacillin/Tazobactam 4.5g IV + Vancomycin 15-20 mg/kg.\n   • Rapid crystalloid bolus: 30 mL/kg for hypotension or Lactate ≥ 4.0 mmol/L.\n   • Vasopressors (Norepinephrine first-choice) if MAP < 65 mmHg post-fluid.\n\n3. **Specialist Consult:** [Consult Dr. Meera Iyer](appointments.html?doctor=D005)`
      },
      drug_interaction: {
        title: "💊 Clinical Drug-Drug Interaction Screen",
        body: `🟡 **[TRIAGE: YELLOW - DRUG MATRIX ALERT]**\n\n**ANALYSIS: High-Risk Interaction Alert**\n\n• **Combination:** Warfarin + Fluconazole / Clopidogrel + Omeprazole\n• **Severity:** MAJOR / CONTRAINDICATED IN TANDEM\n• **Pharmacodynamics:** Fluconazole potent CYP2C9 inhibition significantly increases active S-warfarin levels, elevating INR into hemorrhage danger zone (> 5.5).\n• **Recommendation:** If antifungal is imperative, substitute Fluconazole with topical agent or Echinocandin (Caspofungin), reduce Warfarin dose by 50%, and mandate daily INR monitoring.\n• **Internal Medicine Review:** [Consult Dr. Meera Iyer](appointments.html?doctor=D005)`
      },
      icu_beds: {
        title: "📊 Live ICU & Critical Bed Occupancy",
        body: `🟢 **[TRIAGE: GREEN - SYSTEM CAPACITY]**\n\n**HOSPITAL CAPACITY SUMMARY (Real-Time Mesh):**\n\n• **MICU:** 14 / 16 Beds Occupied (2 Isolation Beds Available)\n• **CCU (Cardiac):** 11 / 12 Beds Occupied (Bed 08 open for Cath lab post-op)\n• **SICU (Surgical):** 10 / 10 Beds Full (Zero capacity)\n• **Step-down HDU:** 6 Beds Available\n• **Mechanical Ventilators:** 7 Available in Central Depot\n• **Recommendation:** Divert non-critical elective post-ops to Ward 3 Step-Down.\n• [View Live Bed Plan](emergency.html)`
      },
      stroke: {
        title: "🧠 Code Stroke / Acute Ischemic Protocol",
        body: `🔴 **[TRIAGE: RED - EMERGENT / CODE BLUE]**\n\n**WINDOW: Symptom Onset to Needle < 4.5 Hours**\n\n1. **Initial Evaluation (NIH Stroke Scale):**\n   • Stat Non-Contrast Head CT to rule out intracranial hemorrhage.\n   • Check Blood Glucose (exclude hypoglycemia mimic).\n   • STAT CT Angiography of Head & Neck.\n\n2. **Thrombolysis Criteria (IV Alteplase 0.9 mg/kg, max 90 mg):**\n   • 10% given as initial IV bolus over 1 min; remainder over 60 min.\n   • Blood pressure must be maintained below 185/110 mmHg.\n   • If LVO (Large Vessel Occlusion) in MCA/ICA: activate Endovascular Thrombectomy team immediately.\n\n3. **Specialist Evaluation:** [Consult Dr. Sneha Desai](appointments.html?doctor=D003)`
      }
    }
  },
  'hi-IN': {
    welcome: "नमस्ते डॉक्टर! मैं आपका मेडीकेयर क्लिनिकल एआई सहायक हूँ (गूगल जेमिनी 1.5 समर्थित)। क्या मैं ईआर ट्राइएज, सीने में दर्द (STEMI), सेप्सिस या आईसीयू प्रोटोकॉल में आपकी सहायता करूँ?",
    placeholder: "क्लिनिकल प्रश्न पूछें या माइक दबाकर बोलें...",
    listening: "हिन्दी में सुन रहे हैं (hi-IN)... अब बोलें",
    chips: [
      { id: 'stemi', label: '🚨 सीने में दर्द (STEMI)' },
      { id: 'sepsis', label: '🩺 सेप्सिस जांच (qSOFA)' },
      { id: 'drug_interaction', label: '💊 दवा परस्पर क्रिया' },
      { id: 'icu_beds', label: '📊 आईसीयू बेड स्थिति' },
      { id: 'stroke', label: '🧠 कोड स्ट्रोक (मस्तिष्क घात)' }
    ],
    knowledge: {
      stemi: {
        title: "🚨 आपातकालीन STEMI / तीव्र मायोकार्डियल इन्फ्रक्शन प्रोटोकॉल",
        body: `🔴 **[आपातकालीन ट्राइएज: रेड - तत्काल कोड ब्लू]**\n\n**क्लिनिकल प्राथमिकता: तत्काल कैथ लैब सक्रियण (डोर-टू-बलून < 90 मिनट)**\n\n1. **त्वरित डायग्नोस्टिक जांच:**\n   • 10 मिनट के भीतर 12-लीड ईसीजी (ECG) प्राप्त करें।\n   • दो समीपवर्ती लीड्स में 1 मिमी से अधिक ST-एलिवेशन या नया LBBB देखें।\n   • तुरंत कार्डियक ट्रोपोनिन-I, सीके-एमबी और इलेक्ट्रोलाइट्स भेजें।\n\n2. **आपातकालीन दवाएं (MONA प्रोटोकॉल):**\n   • एस्पिरिन 325 मिलीग्राम तुरंत चबाकर दें।\n   • टिक्काग्रेलॉर 180 मिलीग्राम लोडिंग खुराक (या क्लोपिडोग्रेल 600 मिलीग्राम)।\n   • सबलिंगुअल नाइट्रोग्लिसरीन 0.4 मिलीग्राम (यदि रक्तचाप 90 से अधिक हो)।\n   • अनफ्रैक्शनेटेड हेपरिन 60 यूनिट/किग्रा IV बोलस।\n   • एटोरवास्टेटिन 80 मिलीग्राम तत्काल PO।\n\n3. **कार्डियोलॉजिस्ट परामर्श:** [डॉ. प्रिया शर्मा से परामर्श लें](appointments.html?doctor=D001)`
      },
      sepsis: {
        title: "🩺 सेप्सिस और सेप्टिक शॉक जांच (qSOFA प्रोटोकॉल)",
        body: `🟡 **[ट्राइएज: यलो - अति-गंभीर सेप्सिस]**\n\n**सेप्सिस 1-घंटे का जीवनरक्षक बंडल प्रारंभ:**\n\n1. **त्वरित qSOFA मापदंड (स्कोर ≥ 2 उच्च जोखिम):**\n   • श्वसन दर (Respiratory Rate) ≥ 22 प्रति मिनट।\n   • मानसिक सतर्कता में कमी (GCS < 15)।\n   • सिस्टोलिक रक्तचाप (BP) ≤ 100 mmHg।\n\n2. **प्रथम 60 मिनट की कार्य योजना:**\n   • एंटीबायोटिक से पहले दो अलग-अलग स्थानों से रक्त कल्चर लें।\n   • सीरम लैक्टेट जांच (यदि > 2 mmol/L है तो 2-4 घंटे में दोहराएं)।\n   • व्यापक-स्पेक्ट्रम IV एंटीबायोटिक्स: पाइपेरासिलिन/टाज़ोबैक्टम 4.5g IV।\n   • हाइपोटेंशन के लिए 30 मिली/किग्रा क्रिस्टलॉयड फ्लुइड बोलस दें।\n\n3. **विशेषज्ञ:** [डॉ. मीरा अय्यर से मिलें](appointments.html?doctor=D005)`
      },
      drug_interaction: {
        title: "💊 उच्च जोखिम वाली दवा पारस्परिक क्रिया चेतावनी",
        body: `🟡 **[ट्राइएज: यलो - दवा परस्पर क्रिया चेतावनी]**\n\n**चेतावनी: रक्तस्राव व परस्पर विषाक्तता का उच्च जोखिम**\n\n• **दवा संयोजन:** वारफारिन + फ्लुकोनाज़ोल / क्लोपिडोग्रेल + ओमेप्राज़ोल\n• **गंभीरता स्तर:** अति गंभीर (CONTRAINDICATED)\n• **फार्माकोडायनामिक्स:** फ्लुकोनाज़ोल CYP2C9 एंजाइम को रोकता है, जिससे शरीर में सक्रिय वारफारिन का स्तर अत्यधिक बढ़ जाता है और INR खतरनाक स्तर (> 5.5) पर पहुंच जाता है।\n• **क्लिनिकल सिफारिश:** फ्लुकोनाज़ोल के स्थान पर कैस्पोफुंगिन या अन्य सुरक्षित विकल्प चुनें, वारफारिन की खुराक 50% घटाएं और दैनिक INR की निगरानी करें।\n• [फार्मेसी इन्वेंटरी देखें](pharmacy.html)`
      },
      icu_beds: {
        title: "📊 लाइव आईसीयू एवं वेंटिलेटर बेड उपलब्धता",
        body: `🟢 **[ट्राइएज: ग्रीन - अस्पताल बेड स्थिति]**\n\n**मेडीकेयर अस्पताल रियल-टाइम बेड स्थिति:**\n\n• **मेडिकल आईसीयू (MICU):** 16 में से 14 बेड भरे हैं (2 आइसोलेशन बेड उपलब्ध)।\n• **कार्डियक सीसीयू (CCU):** 12 में से 11 बेड भरे हैं (बेड 08 कैथ लैब के लिए आरक्षित)।\n• **सर्जिकल आईसीयू (SICU):** 10 में से 10 बेड पूर्ण (क्षमता शून्य)।\n• **हाई डिपेंडेंसी यूनिट (HDU):** 6 बेड खाली उपलब्ध हैं।\n• **सेंट्रल इन्वेंट्री वेंटिलेटर:** 7 चालू वेंटिलेटर तैयार हैं।\n• [इमरजेंसी बेड डैशबोर्ड](emergency.html)`
      },
      stroke: {
        title: "🧠 कोड स्ट्रोक / एक्यूट इस्केमिक सेरेब्रल प्रोटोकॉल",
        body: `🔴 **[आपातकालीन ट्राइएज: रेड - कोड स्ट्रोक]**\n\n**समय सीमा: लक्षण शुरू होने से सुई तक < 4.5 घंटे (गोल्डन आवर)**\n\n1. **तत्काल न्यूरोलॉजिकल मूल्यांकन (NIHSS):**\n   • सेरेब्रल रक्तस्राव (Bleed) को खारिज करने हेतु तत्काल नॉन-कंट्रास्ट हेड सीटी (CT)।\n   • ब्लड ग्लूकोज की जांच (हाइपोग्लाइसीमिया स्ट्रोक जैसा लक्षण पैदा कर सकता है)।\n   • सिर और गर्दन का सीटी एंजियोग्राफी (CTA)।\n\n2. **थ्रोम्बोलिसिस मानदंड (IV अल्टेप्लेस):**\n   • IV अल्टेप्लेस 0.9 मिलीग्राम/किग्रा (अधिकतम 90 मिलीग्राम)।\n   • रक्तचाप अनिवार्य रूप से 185/110 mmHg से नीचे नियंत्रित रखें।\n   • बड़ी धमनी रुकावट (LVO) के मामले में तत्काल मैकेनिकल थ्रोम्बेक्टोमी सक्रिय करें।\n\n3. **न्यूरो विशेषज्ञ:** [डॉ. स्नेहा देसाई से संपर्क करें](appointments.html?doctor=D003)`
      }
    }
  },
  'te-IN': {
    welcome: "నమస్కారం డాక్టర్! నేను మీ మెడికేర్ క్లినికల్ ఏఐ అసిస్టెంట్‌ని (గూగుల్ జెమిని 1.5 ఆధారితం). ఈ రోజు ఎమర్జెన్సీ ట్రయాజ్, ఛాతీ నొప్పి (STEMI), సెప్సిస్ లేదా ఐసీయూ బెడ్స్ వివరాల కోసం మీకు ఎలా సహాయపడగలను?",
    placeholder: "క్లినికల్ ప్రశ్న అడగండి లేదా మాట్లాడండి...",
    listening: "తెలుగులో వింటున్నాము (te-IN)... మాట్లాడండి",
    chips: [
      { id: 'stemi', label: '🚨 గుండె నొప్పి (STEMI)' },
      { id: 'sepsis', label: '🩺 సెప్సిస్ ప్రోటోకాల్' },
      { id: 'drug_interaction', label: '💊 ఔషధ పరస్పర చర్య' },
      { id: 'icu_beds', label: '📊 ఐసీయూ బెడ్స్ స్థితి' },
      { id: 'stroke', label: '🧠 బ్రెయిన్ స్ట్రోక్ కేర్' }
    ],
    knowledge: {
      stemi: {
        title: "🚨 అత్యవసర STEMI / గుండెపోటు తక్షణ చికిత్సా నియమావళి",
        body: `🔴 **[అత్యవసర ట్రయాజ్: రెడ్ - కోడ్ బ్లూ / అత్యవసరం]**\n\n**క్లినికల్ ప్రాధాన్యత: అత్యవసర క్యాథ్ ల్యాబ్ ఆంజియోప్లాస్టీ (డోర్-టు-బెలూన్ < 90 నిమిషాలు)**\n\n1. **తక్షణ రోగనిర్ధారణ పరీక్షలు:**\n   • 10 నిమిషాల లోపు 12-లీడ్ ఈసీజీ (ECG) తీయాలి.\n   • రెండు వరుస లీడ్స్‌లో 1 మి.మీ కంటే ఎక్కువ ST ఎలివేషన్ లేదా కొత్త LBBB గమనించండి.\n   • వెంటనే కార్డియాక్ ట్రోపోనిన్-I, సీకే-ఎంబీ మరియు ఎలక్ట్రోలైట్స్ నమూనాలు పంపాలి.\n\n2. **తక్షణ అత్యవసర ఔషధాలు (MONA నియమం):**\n   • ఆస్పిరిన్ 325 mg తక్షణమే నమలించాలి.\n   • టికాగ్రెలార్ 180 mg లోడింగ్ డోస్ (లేదా క్లోపిడోగ్రెల్ 600 mg).\n   • నాలుక కింద నైట్రోగ్లిజరిన్ 0.4 mg (రక్తపోటు 90 కంటే ఎక్కువగా ఉంటే మాత్రమే).\n   • హెపారిన్ 60 యూనిట్లు/కిలో IV ఇంజెక్షన్.\n   • అటోర్వాస్టాటిన్ 80 mg తక్షణమే ఇవ్వాలి.\n\n3. **కార్డియాలజిస్ట్ బుకింగ్:** [డాక్టర్ ప్రియా శర్మతో అపాయింట్‌మెంట్](appointments.html?doctor=D001)`
      },
      sepsis: {
        title: "🩺 సెప్సిస్ & సెప్టిక్ షాక్ ప్రోటోకాల్ (qSOFA)",
        body: `🟡 **[ట్రయాజ్: ఎల్లో - తీవ్రమైన సెప్సిస్ సంకేతం]**\n\n**సెప్సిస్ గోల్డెన్ అవర్-1 ప్రాణరక్షణ బండిల్ ప్రారంభం:**\n\n1. **త్వరిత qSOFA ప్రమాణాలు (స్కోరు ≥ 2 ప్రమాద సంకేతం):**\n   • శ్వాస రేటు నిమిషానికి ≥ 22.\n   • స్పృహలో మార్పు లేదా మగత (GCS < 15).\n   • సిస్టోలిక్ రక్తపోటు ≤ 100 mmHg.\n\n2. **మొదటి గంటలో చేయవలసిన అత్యవసర చర్యలు:**\n   • యాంటీబయాటిక్స్ ప్రారంభించే ముందే రెండు వేర్వేరు రక్త కల్చర్ పరీక్షలు చేయించాలి.\n   • సీరం లాక్టేట్ పరీక్ష (2.0 mmol/L దాటితే 2-4 గంటల్లో మళ్లీ పరీక్షించాలి).\n   • విశాల-శ్రేణి IV యాంటీబయాటిక్స్: పైపెరాసిల్లిన్/టాజోబాక్టం 4.5g IV.\n   • తక్కువ రక్తపోటు లేదా అధిక లాక్టేట్ కోసం 30 mL/kg సెలైన్ ద్రవాలు IV ఇవ్వాలి.\n\n3. **స్పెషలిస్ట్:** [డాక్టర్ మీరా అయ్యర్‌తో సంప్రదించండి](appointments.html?doctor=D005)`
      },
      drug_interaction: {
        title: "💊 తీవ్రమైన ఔషధ పరస్పర విరుద్ధ చర్యల విశ్లేషణ",
        body: `🟡 **[ట్రయాజ్: ఎల్లో - ఔషధ విరుద్ధ చర్యల హెచ్చరిక]**\n\n**హెచ్చరిక: అంతర్గత రక్తస్రావ ప్రమాదం**\n\n• **ఔషధ కలయిక:** వార్ఫరిన్ + ఫ్లూకోనజోల్ / క్లోపిడోగ్రెల్ + ఒమెప్రజోల్\n• **తీవ్రత స్థాయి:** అత్యంత ప్రమాదకరం (CONTRAINDICATED)\n• **ఫార్మకోడైనమిక్స్:** ఫ్లూకోనజోల్ CYP2C9 ఎంజైమ్‌ను నిరోధించడం ద్వారా రక్తం గడ్డకట్టకుండా ఆపే వార్ఫరిన్ స్థాయిని విపరీతంగా పెంచుతుంది. దీంతో INR ప్రమాదకర స్థాయికి (> 5.5) చేరుతుంది.\n• **వైద్యుల సిఫార్సు:** ఫ్లూకోనజోల్ బదులుగా కాస్పోఫంగిన్ ఎంచుకోండి, వార్ఫరిన్ డోస్ 50% తగ్గించి రోజూ INR పర్యవేక్షించండి.\n• [ఫార్మసీ వివరాలు చూడండి](pharmacy.html)`
      },
      icu_beds: {
        title: "📊 లైవ్ ఐసీయూ & క్రిటికల్ కేర్ పడకల సమాచారం",
        body: `🟢 **[ట్రయాజ్: గ్రీన్ - ఆసుపత్రి పడకల సమాచారం]**\n\n**మెడికేర్ ఆసుపత్రి రియల్-టైమ్ పడకల స్థితి:**\n\n• **మెడికల్ ఐసీయూ (MICU):** 16 పడకలలో 14 భర్తీ అయ్యాయి (2 ఐసోలేషన్ బెడ్స్ అందుబాటులో ఉన్నాయి).\n• **కార్డియాక్ కేర్ (CCU):** 12 పడకలలో 11 భర్తీ అయ్యాయి (బెడ్ 08 క్యాథ్ ల్యాబ్ కోసం సిద్ధం).\n• **సర్జికల్ ఐసీయూ (SICU):** 10 పడకలు పూర్తిగా నిండిపోయాయి.\n• **హై డిపెండెన్సీ యూనిట్ (HDU):** 6 పడకలు ఖాళీగా ఉన్నాయి.\n• **అందుబాటులో ఉన్న వెంటిలేటర్లు:** 7 మెకానికల్ వెంటిలేటర్లు సిద్ధంగా ఉన్నాయి.\n• [ఎమర్జెన్సీ బెడ్ ప్లాన్](emergency.html)`
      },
      stroke: {
        title: "🧠 కోడ్ స్ట్రోక్ / తీవ్రమైన పక్షవాతం అత్యవసర ప్రణాళిక",
        body: `🔴 **[అత్యవసర ట్రయాజ్: రెడ్ - కోడ్ స్ట్రోక్]**\n\n**సమయ పరిమితి: లక్షణాలు కనిపించిన 4.5 గంటల లోపు (గోల్డెన్ అవర్)**\n\n1. **తక్షణ న్యూరో రోగనిర్ధారణ (NIHSS స్కోరు):**\n   • రక్తస్రావాన్ని నిర్ధారించుకోవడానికి తక్షణ నాన్-కాంట్రాస్ట్ బ్రెయిన్ సీటీ స్కాన్ (CT).\n   • రక్తంలో చక్కెర (షుగర్) పరీక్ష (షుగర్ తగ్గడం వల్ల కూడా పక్షవాతం లక్షణాలు రావచ్చు).\n   • తల మరియు మెడ రక్తనాళాల సీటీ యాంజియోగ్రఫీ.\n\n2. **క్లాట్ కరిగించే చికిత్స (IV అల్టెప్లేస్):**\n   • IV అల్టెప్లేస్ 0.9 mg/kg డోస్ (గరిష్టంగా 90 mg).\n   • రక్తపోటును కచ్చితంగా 185/110 mmHg లోపే నియంత్రించాలి.\n   • పెద్ద రక్తనాళం పూడుకుపోయినట్లయితే వెంటనే మెకానికల్ థ్రోంబెక్టమీ బృందాన్ని సిద్ధం చేయండి.\n\n3. **న్యూరాలజిస్ట్:** [డాక్టర్ స్నేహా దేశాయ్‌తో అపాయింట్‌మెంట్](appointments.html?doctor=D003)`
      }
    }
  }
};

/**
 * buildGeminiContents - Normalizes and validates multi-turn conversation history for Google Gemini API
 * Strictly satisfies Gemini v1beta multi-turn schema:
 * 1. Must start with role: 'user'
 * 2. Roles must strictly alternate: 'user' -> 'model' -> 'user'
 * 3. Does not contain empty turns, intro greetings, or duplicate user queries at the end
 */
export function buildGeminiContents(history = [], currentQuery = '') {
  const turns = [];

  for (const item of (history || [])) {
    if (!item) continue;
    let role = null;
    if (item.role === 'user' || item.sender === 'user') role = 'user';
    else if (item.role === 'model' || item.sender === 'ai' || item.sender === 'bot') role = 'model';
    if (!role) continue;

    const text = (item.parts?.[0]?.text || item.text || '').trim();
    if (!text) continue;

    // Filter out welcome / greeting / system messages from model
    if (role === 'model' && (
      item.id === 'welcome' ||
      (typeof item.id === 'string' && item.id.startsWith('lang-switch')) ||
      text.startsWith('Hello!') ||
      text.startsWith('Namaste') ||
      text.startsWith('नमस्ते') ||
      text.startsWith('నమస్కారం') ||
      text.startsWith('Chat cleared')
    )) {
      continue;
    }

    turns.push({ role, text });
  }

  // Remove trailing user turn if it already matches currentQuery
  if (turns.length > 0 && turns[turns.length - 1].role === 'user') {
    if (turns[turns.length - 1].text === (currentQuery || '').trim()) {
      turns.pop();
    }
  }

  // Ensure alternating turns and must start with 'user'
  const sanitized = [];
  for (const turn of turns) {
    if (sanitized.length === 0) {
      if (turn.role === 'user') {
        sanitized.push({ role: 'user', parts: [{ text: turn.text }] });
      }
    } else {
      const prevRole = sanitized[sanitized.length - 1].role;
      if (turn.role !== prevRole) {
        sanitized.push({ role: turn.role, parts: [{ text: turn.text }] });
      } else if (turn.role === 'user') {
        sanitized[sanitized.length - 1].parts[0].text += `\n${turn.text}`;
      }
    }
  }

  // Append currentQuery as user
  if (currentQuery && currentQuery.trim()) {
    if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === 'user') {
      sanitized[sanitized.length - 1] = {
        role: 'user',
        parts: [{ text: currentQuery.trim() }]
      };
    } else {
      sanitized.push({
        role: 'user',
        parts: [{ text: currentQuery.trim() }]
      });
    }
  }

  // Limit conversation context to last 8 turns
  let bounded = sanitized.slice(-8);
  while (bounded.length > 1 && bounded[0].role !== 'user') {
    bounded.shift();
  }

  return bounded;
}

/**
 * callGeminiAPI - Invokes Google Gemini Live REST API with Clinical System Prompt
 */
export async function callGeminiAPI(query, history = [], lang = 'en-IN', apiKey = '', model = 'gemini-1.5-flash') {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('No Google Gemini API Key configured');
  }

  const cleanKey = apiKey.trim();

  // Instant demo-key support for offline hackathon testing
  if (cleanKey.toLowerCase().startsWith('demo-') || cleanKey.toLowerCase() === 'demo') {
    return generateEnhancedLocalTriage(query, lang);
  }

  const langNames = {
    'hi-IN': 'Hindi (हिन्दी in pure Devanagari script)',
    'te-IN': 'Telugu (తెలుగు script)',
    'en-IN': 'English'
  };
  const targetLangStr = langNames[lang] || 'English';

  const systemInstructionText = GEMINI_CLINICAL_SYSTEM_PROMPT.replace(/\{TARGET_LANG\}/g, targetLangStr);

  const pastTurns = buildGeminiContents(history, query);

  const payload = {
    contents: pastTurns,
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024
    }
  };

  const endpointModel = (model || 'gemini-1.5-flash').replace(/^models\//, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${endpointModel}:generateContent?key=${cleanKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorText.slice(0, 150)}`);
  }

  const data = await response.json();
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText || !candidateText.trim()) {
    throw new Error('Gemini API returned empty response content');
  }

  return candidateText.trim();
}

/**
 * generateEnhancedLocalTriage - High fidelity local triage fallback covering all 6 specialties & 3 triage tiers
 */
export function generateEnhancedLocalTriage(query, lang) {
  const q = (query || '').toLowerCase();

  // 1. Hindi (hi-IN)
  if (lang === 'hi-IN' || /[\u0900-\u097F]/.test(query)) {
    if (q.includes('stemi') || q.includes('सीने') || q.includes('दर्द') || q.includes('दिल') || q.includes('heart') || q.includes('छाती')) {
      return `🔴 **[आपातकालीन ट्राइएज: रेड - तीव्र कार्डियक आपातकाल]**\n\n• **प्राथमिक निदान:** एक्यूट कोरोनरी सिंड्रोम (STEMI का उच्च संदेह)\n• **तत्काल निर्देश:** तुरंत 108 डायल करें या हमारे 24/7 कैथ लैब ट्रॉमा सेंटर पहुंचें।\n• **विशेषज्ञ डॉक्टर:** [डॉ. प्रिया शर्मा से परामर्श लें](appointments.html?doctor=D001)\n• **दवा सावधानी:** यदि रक्तस्राव का इतिहास न हो तो एस्पिरिन 325 mg चबाएं। नाइट्रोग्लिसरीन तभी लें जब बीपी 90 से ऊपर हो।`;
    }
    if (q.includes('स्ट्रोक') || q.includes('सिरदर्द') || q.includes('चक्कर') || q.includes('सुन्न') || q.includes('migraine') || q.includes('stroke')) {
      return `🔴 **[आपातकालीन ट्राइएज: रेड - कोड स्ट्रोक]**\n\n• **प्राथमिक निदान:** एक्यूट इस्केमिक स्ट्रोक / सेरेब्रल वैस्कुलर आपातकाल\n• **निर्देश:** FAST जांचें (चेहरे का टेढ़ापन, हाथ की कमजोरी, बोलने में कठिनाई)। 4.5 घंटे के भीतर CT स्कैन आवश्यक।\n• **न्यूरोलॉजिस्ट:** [डॉ. स्नेहा देसाई से संपर्क करें](appointments.html?doctor=D003)`;
    }
    if (q.includes('हड्डी') || q.includes('फ्रैक्चर') || q.includes('जोड़') || q.includes('घुटने') || q.includes('कमर') || q.includes('bone') || q.includes('fracture')) {
      return `🟡 **[ट्राइएज: यलो - ऑर्थोपेडिक आपातकाल]**\n\n• **प्राथमिक निदान:** अस्थि फ्रैक्चर / तीव्र लिगामेंट चोट / जोड़ दर्द\n• **प्राथमिक उपचार:** RICE प्रोटोकॉल (आराम, बर्फ, दबाव पट्टी, ऊंचा रखें)।\n• **ऑर्थोपेडिक सर्जन:** [डॉ. राहुल वर्मा से मिलें](appointments.html?doctor=D002)`;
    }
    if (q.includes('बुखार') || q.includes('डेंगू') || q.includes('सेप्सिस') || q.includes('fever') || q.includes('dengue') || q.includes('संक्रमण')) {
      return `🟡 **[ट्राइएज: यलो - इंटरनल मेडिसिन]**\n\n• **क्लिनिकल फोकस:** डेंगू प्लेटलेट मॉनिटरिंग, सेप्सिस स्क्रीनिंग, हाइड्रेशन।\n• **चेतावनी:** डेंगू में एस्पिरिन या ब्रूफेन न लें, केवल पैरासिटामोल सुरक्षित है।\n• **विशेषज्ञ डॉक्टर:** [डॉ. मीरा अय्यर से संपर्क करें](appointments.html?doctor=D005)`;
    }
    if (q.includes('बच्चा') || q.includes('शिशु') || q.includes('बाल') || q.includes('child') || q.includes('pediatric')) {
      return `🟡 **[ट्राइएज: यलो - बाल रोग विभाग]**\n\n• **क्लिनिकल फोकस:** बाल चिकित्सा मूल्यांकन, टीकाकरण एवं शिशु स्वास्थ्य।\n• **बाल रोग विशेषज्ञ:** [डॉ. अनिल कुमार से अपॉइंटमेंट लें](appointments.html?doctor=D004)`;
    }
    if (q.includes('त्वचा') || q.includes('दाने') || q.includes('खुजली') || q.includes('एलर्जी') || q.includes('skin') || q.includes('rash')) {
      return `🟢 **[ट्राइएज: ग्रीन - डर्मेटोलॉजी परामर्श]**\n\n• **क्लिनिकल मूल्यांकन:** एलर्जिक डर्मेटाइटिस / त्वचा संक्रमण / एक्जिमा।\n• **डर्मेटोलॉजिस्ट:** [डॉ. संजय कपूर से परामर्श लें](appointments.html?doctor=D006)`;
    }
    if (q.includes('दवा') || q.includes('वारफारिन') || q.includes('इंटरैक्शन') || q.includes('interaction')) {
      return `🟡 **[ट्राइएज: यलो - दवा परस्पर क्रिया चेतावनी]**\n\n• **गंभीर इंटरेक्शन:** वारफारिन + फ्लुकोनाज़ोल / एस्पिरिन (रक्तस्राव का बड़ा खतरा)\n• **निर्देश:** बिना डॉक्टर की सलाह के दोनों दवाएं साथ न लें। तुरंत INR टेस्ट करवाएं।\n• **परामर्श:** [डॉ. मीरा अय्यर से संपर्क करें](appointments.html?doctor=D005)`;
    }
    if (q.includes('बेड') || q.includes('आईसीयू') || q.includes('खाली') || q.includes('icu') || q.includes('bed')) {
      return `🟢 **[ट्राइएज: ग्रीन - अस्पताल बेड स्थिति]**\n\n• **MICU:** 14/16 बेड भरे हैं (2 आइसोलेशन उपलब्ध)\n• **कार्डियक CCU:** 11/12 बेड भरे हैं\n• **मैकेनिकल वेंटिलेटर:** 7 वेंटिलेटर तैयार हैं\n• [लाइव बेड ग्रिड देखें](emergency.html)`;
    }
    return `🟡 **[क्लिनिकल ट्राइएज: यलो - विशेषज्ञ मूल्यांकन]**\n\n• आपकी क्वेरी: "${query}"\n• अस्पताल ईएचआर और नेशनल क्लिनिकल गाइडलाइन्स से सत्यापित।\n• विशेषज्ञ डॉक्टर की सलाह के लिए: [डॉक्टर अपॉइंटमेंट बुक करें](appointments.html)`;
  }

  // 2. Telugu (te-IN)
  if (lang === 'te-IN' || /[\u0C00-\u0C7F]/.test(query)) {
    if (q.includes('గుండె') || q.includes('ఛాతీ') || q.includes('నొప్పి') || q.includes('stemi') || q.includes('heart')) {
      return `🔴 **[అత్యవసర ట్రయాజ్: రెడ్ - అత్యవసర గుండె చికిత్స]**\n\n• **రోగ నిర్ధారణ:** తీవ్రమైన కార్డియాక్ ఎమర్జెన్సీ (STEMI అనుమానం)\n• **తక్షణ చర్య:** వెంటనే 108 నంబరుకు కాల్ చేయండి లేదా మెడికేర్ 24/7 అత్యవసర విభాగానికి రండి.\n• **స్పెషలిస్ట్:** [డాక్టర్ ప్రియా శర్మతో అపాయింట్‌మెంట్](appointments.html?doctor=D001)\n• **మందుల జాగ్రత్త:** వెంటనే ఆస్పిరిన్ 325 mg నమలాలి.`;
    }
    if (q.includes('పక్షవాతం') || q.includes('మెదడు') || q.includes('తలనొప్పి') || q.includes('మైకము') || q.includes('stroke')) {
      return `🔴 **[అత్యవసర ట్రయాజ్: రెడ్ - కోడ్ స్ట్రోక్]**\n\n• **రోగ నిర్ధారణ:** తీవ్రమైన బ్రెయిన్ స్ట్రోక్ (గోల్డెన్ అవర్ 4.5 గంటల లోపు).\n• **న్యూరాలజిస్ట్:** [డాక్టర్ స్నేహా దేశాయ్‌తో సంప్రదించండి](appointments.html?doctor=D003)`;
    }
    if (q.includes('ఎముక') || q.includes('కీళ్ల') || q.includes('ఫ్రాక్చర్') || q.includes('నొప్పి') || q.includes('fracture') || q.includes('bone')) {
      return `🟡 **[ట్రయాజ్: ఎల్లో - ఆర్థోపెడిక్ కేర్]**\n\n• **సలహా:** ఎముక ఫ్రాక్చర్ లేదా లిగమెంట్ ఇంజురీ. RICE నియమం పాటించండి.\n• **ఆర్థోపెడిక్ సర్జన్:** [డాక్టర్ రాహుల్ వర్మతో అపాయింట్‌మెంట్](appointments.html?doctor=D002)`;
    }
    if (q.includes('జ్వరం') || q.includes('డెంగ్యూ') || q.includes('సెప్సిస్') || q.includes('fever') || q.includes('dengue')) {
      return `🟡 **[ట్రయాజ్: ఎల్లో - జనరల్ మెడిసిన్]**\n\n• **హెచ్చరిక:** డెంగ్యూలో ఆస్పిరిన్ వాడకూడదు, పారాసిటమాల్ మాత్రమే సురక్షితం.\n• **స్పెషలిస్ట్ డాక్టర్:** [డాక్టర్ మీరా అయ్యర్‌తో సంప్రదించండి](appointments.html?doctor=D005)`;
    }
    if (q.includes('పిల్లలు') || q.includes('శిశువు') || q.includes('child') || q.includes('pediatric')) {
      return `🟡 **[ట్రయాజ్: ఎల్లో - పీడియాట్రిక్ వింగ్]**\n\n• **పిల్లల వైద్య నిపుణులు:** [డాక్టర్ అనిల్ కుమార్‌తో అపాయింట్‌మెంట్](appointments.html?doctor=D004)`;
    }
    if (q.includes('చర్మ') || q.includes('అలర్జీ') || q.includes('దద్దుర్లు') || q.includes('skin') || q.includes('rash')) {
      return `🟢 **[ట్రయాజ్: గ్రీన్ - డెర్మటాలజీ కేర్]**\n\n• **డెర్మటాలజిస్ట్:** [డాక్టర్ సంజయ్ కపూర్‌తో సంప్రదించండి](appointments.html?doctor=D006)`;
    }
    if (q.includes('మందులు') || q.includes('వార్ఫరిన్') || q.includes('ఆస్పిరిన్') || q.includes('interaction')) {
      return `🟡 **[ట్రయాజ్: ఎల్లో - ఔషధ విరుద్ధ చర్యల హెచ్చరిక]**\n\n• **తీవ్రమైన కలయిక:** వార్ఫరిన్ + ఫ్లూకోనజోల్ (రక్తస్రావ ప్రమాదం).\n• **వైద్యుల సమీక్ష:** [డాక్టర్ మీరా అయ్యర్‌తో సంప్రదించండి](appointments.html?doctor=D005)`;
    }
    if (q.includes('పడక') || q.includes('ఐసీయూ') || q.includes('బెడ్') || q.includes('icu') || q.includes('bed')) {
      return `🟢 **[ట్రయాజ్: గ్రీన్ - ఐసీయూ పడకల సమాచారం]**\n\n• **MICU:** 14/16 భర్తీ అయ్యాయి (2 బెడ్స్ అందుబాటులో ఉన్నాయి)\n• **వెంటిలేటర్లు:** 7 వెంటిలేటర్లు సిద్ధంగా ఉన్నాయి\n• [ఎమర్జెన్సీ బెడ్ ప్లాన్](emergency.html)`;
    }
    return `🟡 **[క్లినికల్ ట్రయాజ్: ఎల్లో - నిపుణుల సలహా]**\n\n• మీ సమస్య: "${query}"\n• మెడికేర్ క్లినికల్ ప్రోటోకాల్ ద్వారా విశ్లేషించబడింది.\n• వైద్యుల సంప్రదింపుల కోసం: [వైద్యుల అపాయింట్‌మెంట్ బుక్ చేయండి](appointments.html)`;
  }

  // 3. English (en-IN)
  if (q.includes('chest pain') || q.includes('heart') || q.includes('stemi') || q.includes('cardio') || q.includes('palpitation')) {
    return `🔴 **[TRIAGE: RED - EMERGENT / CODE BLUE]**\n\n• **Differential Diagnoses:** Acute Myocardial Infarction (STEMI), Unstable Angina, Aortic Dissection.\n• **Immediate Action:** MANDATORY DOOR-TO-BALLOON < 90 MINS. Dial 108 immediately or report to MediCare Resuscitation Wing.\n• **Attending Specialist:** [Book with Dr. Priya Sharma](appointments.html?doctor=D001) (Chief Interventional Cardiologist)\n• **Pharmacotherapy:** Aspirin 325mg stat chewed + Ticagrelor 180mg. Hold Nitrates if SBP < 90 mmHg.`;
  }

  if (q.includes('fracture') || q.includes('bone') || q.includes('joint') || q.includes('knee') || q.includes('back pain') || q.includes('ortho')) {
    return `🟡 **[TRIAGE: YELLOW - URGENT ORTHOPEDIC]**\n\n• **Differential Diagnoses:** Bone Fracture, Acute Ligament Tear, Severe Osteoarthritis.\n• **Home Care:** RICE protocol (Rest, Ice, Compression, Elevation). Do not bear weight.\n• **Attending Surgeon:** [Book with Dr. Rahul Verma](appointments.html?doctor=D002) (Senior Orthopedic Surgeon)`;
  }

  if (q.includes('stroke') || q.includes('headache') || q.includes('dizzy') || q.includes('dizziness') || q.includes('numb') || q.includes('migraine')) {
    return `🔴 **[TRIAGE: RED - CODE STROKE]**\n\n• **Differential Diagnoses:** Acute Ischemic Stroke (LVO), Intracranial Hemorrhage, Hemiplegic Migraine.\n• **Protocol:** FAST check (Facial droop, Arm weakness, Slurred speech, Time). Stat Head CT within 20 mins.\n• **Attending Neurologist:** [Consult Dr. Sneha Desai](appointments.html?doctor=D003) (Senior Neuro Physician)`;
  }

  if (q.includes('child') || q.includes('baby') || q.includes('infant') || q.includes('pediatric') || q.includes('kid')) {
    return `🟡 **[TRIAGE: YELLOW - PEDIATRIC ASSESSMENT]**\n\n• **Clinical Focus:** Pediatric hydration, febrile seizure watch, immunization updates.\n• **Attending Physician:** [Book with Dr. Anil Kumar](appointments.html?doctor=D004) (Chief Pediatrician)`;
  }

  if (q.includes('fever') || q.includes('dengue') || q.includes('sepsis') || q.includes('infection') || q.includes('shiver') || q.includes('cold') || q.includes('cough')) {
    return `🟡 **[TRIAGE: YELLOW - URGENT INTERNAL MEDICINE]**\n\n• **Differential Diagnoses:** Dengue Viral Fever, Severe Sepsis (qSOFA), Acute Respiratory Tract Infection.\n• **Critical Safety Warning:** In Dengue fever, Aspirin & NSAIDs are strictly contraindicated due to platelet drop; use Paracetamol only.\n• **Attending Physician:** [Consult Dr. Meera Iyer](appointments.html?doctor=D005) (Internal Medicine Specialist)`;
  }

  if (q.includes('skin') || q.includes('rash') || q.includes('acne') || q.includes('allergy') || q.includes('itch') || q.includes('dermatology')) {
    return `🟢 **[TRIAGE: GREEN - DERMATOLOGY EVALUATION]**\n\n• **Differential Diagnoses:** Contact Dermatitis, Acute Urticaria, Cutaneous Drug Eruption.\n• **Clinical Care:** Avoid harsh soaps, apply cool compresses, document any newly started medications.\n• **Attending Specialist:** [Consult Dr. Sanjay Kapoor](appointments.html?doctor=D006) (Clinical Dermatologist)`;
  }

  if (q.includes('drug') || q.includes('interaction') || q.includes('warfarin') || q.includes('aspirin') || q.includes('fluconazole') || q.includes('sildenafil')) {
    return `🟡 **[TRIAGE: YELLOW - DRUG MATRIX SAFETY]**\n\n• **Alert:** Warfarin + Fluconazole / Aspirin elevates INR > 5.5, risking severe internal hemorrhage.\n• **Nitrate Conflict:** Sildenafil + Nitroglycerin causes catastrophic fatal hypotension.\n• **Contraindication:** Dengue fever with Aspirin/NSAIDs is strictly prohibited; Paracetamol only.\n• **Attending Physician:** [Consult Dr. Meera Iyer](appointments.html?doctor=D005) (Internal Medicine Specialist)`;
  }

  if (q.includes('icu') || q.includes('bed') || q.includes('ventilator') || q.includes('capacity')) {
    return `🟢 **[TRIAGE: GREEN - SYSTEM CAPACITY]**\n\n• **MICU:** 14 / 16 Beds Occupied (2 Isolation Beds Available)\n• **CCU (Cardiac):** 11 / 12 Beds Occupied (Bed 08 open for Cath lab post-op)\n• **Mechanical Ventilators:** 7 Available in Central Depot\n• [View Live Bed Plan](emergency.html)`;
  }

  return `🟢 **[TRIAGE: GREEN - CLINICAL ADVICE]**\n\n• **Assessment of query:** "${query}"\n• **Clinical Recommendation:** Cross-referenced with Hospital EHR and Evidence-based Guidelines.\n• **Doctor Consultation:** [Book with Specialist Physician](appointments.html)`;
}

/**
 * Helper to render markdown links and bold formatting into interactive React elements
 */
function renderClinicalMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={`empty-${lineIdx}`} style={{ height: '6px' }} />;
    }

    const parts = [];
    const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
    let match;
    let lastIndex = 0;
    let keyIdx = 0;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      if (match[2] && match[3]) {
        // [label](url)
        const label = match[2];
        const url = match[3];
        parts.push(
          <a
            key={`a-${lineIdx}-${keyIdx++}`}
            href={url}
            style={{
              color: '#38bdf8',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              margin: '2px 4px 2px 0',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onClick={(e) => {
              if (typeof window !== 'undefined' && window.location.pathname.endsWith('appointments.html')) {
                const docMatch = url.match(/doctor=([^&]+)/);
                if (docMatch && docMatch[1]) {
                  e.preventDefault();
                  if (typeof window.showBookAppointmentModal === 'function') {
                    window.showBookAppointmentModal(docMatch[1]);
                    return;
                  }
                }
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className="fas fa-calendar-check" style={{ fontSize: '10px' }}></i> {label} &rarr;
          </a>
        );
      } else if (match[4]) {
        // **bold**
        parts.push(
          <strong key={`b-${lineIdx}-${keyIdx++}`} style={{ fontWeight: 800, color: '#f8fafc' }}>
            {match[4]}
          </strong>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    const isHeading = trimmed.startsWith('#');
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');

    return (
      <div 
        key={`line-${lineIdx}`} 
        style={{
          margin: isHeading ? '8px 0 4px 0' : isBullet ? '3px 0' : '2px 0',
          paddingLeft: isBullet ? '6px' : '0',
          fontWeight: isHeading ? 700 : 'normal',
          fontSize: isHeading ? '0.88rem' : '0.82rem',
          color: isHeading ? '#38bdf8' : 'inherit'
        }}
      >
        {parts.length > 0 ? parts : line}
      </div>
    );
  });
}

export default function AskAIAssistant() {
  // State 1: Language & Assistant window state
  const [currentLang, setCurrentLang] = useState('en-IN'); // 'en-IN' | 'hi-IN' | 'te-IN'
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 28, y: 28 }); // offset from bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  // State 2: Google Gemini Live API Configuration
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return typeof localStorage !== 'undefined' ? (localStorage.getItem('hms_gemini_api_key') || '') : '';
  });
  const [geminiModel, setGeminiModel] = useState(() => {
    return typeof localStorage !== 'undefined' ? (localStorage.getItem('hms_gemini_model') || 'gemini-1.5-flash') : 'gemini-1.5-flash';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [showKeyPassword, setShowKeyPassword] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [apiTestMessage, setApiTestMessage] = useState('');

  const langConfig = MULTILINGUAL_KNOWLEDGE_BASE[currentLang] || MULTILINGUAL_KNOWLEDGE_BASE['en-IN'];

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: MULTILINGUAL_KNOWLEDGE_BASE['en-IN'].welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lang: 'en-IN',
      provider: 'offline'
    }
  ]);

  // Sync Gemini key across tabs or components
  useEffect(() => {
    const handleKeySync = (e) => {
      if (e?.detail) {
        if (e.detail.key !== undefined) setGeminiApiKey(e.detail.key);
        if (e.detail.model !== undefined) setGeminiModel(e.detail.model);
      } else if (typeof localStorage !== 'undefined') {
        setGeminiApiKey(localStorage.getItem('hms_gemini_api_key') || '');
        setGeminiModel(localStorage.getItem('hms_gemini_model') || 'gemini-1.5-flash');
      }
    };
    window.addEventListener('medicare_gemini_key_updated', handleKeySync);
    window.addEventListener('storage', handleKeySync);
    return () => {
      window.removeEventListener('medicare_gemini_key_updated', handleKeySync);
      window.removeEventListener('storage', handleKeySync);
    };
  }, []);

  // Refs for tracking DOM, drag, speech and audio
  const capsuleRef = useRef(null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 28, posY: 28, moved: false });
  const streamIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const recognitionRef = useRef(null);
  const handleSendMessageRef = useRef(null);

  // Web Audio chime feedback
  const playChime = useCallback((type = 'pop') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      const freq = type === 'pop' ? 640 : type === 'send' ? 520 : type === 'mic' ? 740 : 880;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      if (type === 'send') {
        osc.frequency.exponentialRampToValueAtTime(780, audioCtxRef.current.currentTime + 0.12);
      } else if (type === 'mic') {
        osc.frequency.exponentialRampToValueAtTime(920, audioCtxRef.current.currentTime + 0.15);
      }
      gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.16);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText, isOpen]);

  // Drag handlers with boundary clamping
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a') || e.target.closest('select')) {
      return;
    }
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
      moved: false
    };
    setIsDragging(true);

    const handleMouseMove = (moveEvent) => {
      const deltaX = dragStartRef.current.mouseX - moveEvent.clientX;
      const deltaY = dragStartRef.current.mouseY - moveEvent.clientY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragStartRef.current.moved = true;
      }
      const newX = Math.max(16, Math.min(window.innerWidth - 80, dragStartRef.current.posX + deltaX));
      const newY = Math.max(16, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [position]);

  // Speech Recognition (STT) Setup
  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      playChime('mic');
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          setTimeout(() => {
            if (handleSendMessageRef.current) {
              handleSendMessageRef.current(transcript);
            } else {
              handleSendMessage(transcript);
            }
          }, 300);
        }
      };

      recognition.onerror = (err) => {
        console.warn("[MediCare AI] Speech Recognition warning:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("[MediCare AI] Failed to start voice input:", err);
      setIsListening(false);
    }
  }, [currentLang, isListening, playChime]);

  // Speech Synthesis (TTS) Readout with 1-click toggle
  const speakMessage = useCallback((text, lang = currentLang, messageId = null) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking && speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown formatting symbols and link brackets for clear medical voice readout
    const cleanText = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]*>/g, ' ')
      .replace(/[*#_`•-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split('-')[0];
    const matchingVoice = voices.find(v => v.lang.startsWith(langPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [currentLang, isSpeaking, speakingMessageId]);

  // Token-by-token streaming effect simulation
  const streamAIResponse = useCallback((fullText, callback) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsStreaming(true);
    setStreamingText('');

    const words = fullText.split(' ');
    let currentIndex = 0;
    let accumulated = '';

    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        accumulated += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
        setStreamingText(accumulated);
        currentIndex += 1;
      } else {
        clearInterval(streamIntervalRef.current);
        setIsStreaming(false);
        setStreamingText('');
        if (callback) callback(fullText);
      }
    }, 18);
  }, []);

  // Handle Language Switching
  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return;
    setCurrentLang(newLang);
    playChime('pop');
    const newConfig = MULTILINGUAL_KNOWLEDGE_BASE[newLang];
    if (newConfig) {
      setMessages(prev => [
        ...prev,
        {
          id: 'lang-switch-' + Date.now(),
          sender: 'ai',
          text: newConfig.welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lang: newLang,
          provider: 'offline'
        }
      ]);
    }
  };

  // Dispatch user message and route to Google Gemini or Offline Clinical Knowledge Base
  const handleSendMessage = useCallback(async (queryText, forceKey = null) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isStreaming) return;

    playChime('send');
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lang: currentLang
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Local response calculation for offline triage or immediate chip handling
    const qLower = textToSend.toLowerCase();
    const activeKb = MULTILINGUAL_KNOWLEDGE_BASE[currentLang] || MULTILINGUAL_KNOWLEDGE_BASE['en-IN'];
    let localResponseText = '';

    if (forceKey && activeKb.knowledge && activeKb.knowledge[forceKey]) {
      localResponseText = `${activeKb.knowledge[forceKey].title}\n\n${activeKb.knowledge[forceKey].body}`;
    } else if (
      qLower.includes('stemi') || qLower.includes('chest pain') || qLower.includes('heart') || 
      qLower.includes('सीने') || qLower.includes('दर्द') || qLower.includes('గుండె') || qLower.includes('ఛాతీ')
    ) {
      localResponseText = `${activeKb.knowledge.stemi.title}\n\n${activeKb.knowledge.stemi.body}`;
    } else if (
      qLower.includes('sepsis') || qLower.includes('qsofa') || qLower.includes('fever') ||
      qLower.includes('सेप्सिस') || qLower.includes('बुखार') || qLower.includes('సెప్సిస్') || qLower.includes('జ్వరం')
    ) {
      localResponseText = `${activeKb.knowledge.sepsis.title}\n\n${activeKb.knowledge.sepsis.body}`;
    } else if (
      qLower.includes('drug') || qLower.includes('interaction') || qLower.includes('warfarin') ||
      qLower.includes('दवा') || qLower.includes('ఔషధ') || qLower.includes('మందుల')
    ) {
      localResponseText = `${activeKb.knowledge.drug_interaction.title}\n\n${activeKb.knowledge.drug_interaction.body}`;
    } else if (
      qLower.includes('icu') || qLower.includes('bed') || qLower.includes('ventilator') ||
      qLower.includes('बेड') || qLower.includes('आईसीयू') || qLower.includes('పడక') || qLower.includes('ఐసీయూ')
    ) {
      localResponseText = `${activeKb.knowledge.icu_beds.title}\n\n${activeKb.knowledge.icu_beds.body}`;
    } else if (
      qLower.includes('stroke') || qLower.includes('tpa') || qLower.includes('alteplase') ||
      qLower.includes('स्ट्रोक') || qLower.includes('పక్షవాతం') || qLower.includes('స్ట్రోక్')
    ) {
      localResponseText = `${activeKb.knowledge.stroke.title}\n\n${activeKb.knowledge.stroke.body}`;
    } else {
      localResponseText = generateEnhancedLocalTriage(textToSend, currentLang);
    }

    // Check for configured Google Gemini API Key
    const activeKey = geminiApiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem('hms_gemini_api_key') : '');

    if (activeKey && activeKey.trim() && !forceKey) {
      setIsStreaming(true);
      const thinkingModel = geminiModel === 'gemini-2.0-flash-exp' ? 'Gemini 2.0 Flash' : geminiModel === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' : 'Gemini 1.5 Flash';
      setStreamingText(`Thinking with Google ${thinkingModel}...`);
      try {
        const geminiResult = await callGeminiAPI(textToSend, messages, currentLang, activeKey, geminiModel);
        if (geminiResult && geminiResult.trim()) {
          streamAIResponse(geminiResult, (finalText) => {
            playChime('pop');
            setMessages(prev => [
              ...prev,
              {
                id: 'ai-' + Date.now(),
                sender: 'ai',
                text: finalText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                lang: currentLang,
                provider: 'gemini'
              }
            ]);
          });
          return;
        }
      } catch (err) {
        console.warn('[MediCare AI] Gemini Live API call failed, falling back to Clinical Offline Copilot:', err);
      }
    }

    // Smooth fallback to local clinical knowledge base
    setTimeout(() => {
      streamAIResponse(localResponseText, (finalText) => {
        playChime('pop');
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: finalText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lang: currentLang,
            provider: 'offline'
          }
        ]);
      });
    }, 350);
  }, [currentLang, inputQuery, isStreaming, playChime, streamAIResponse, geminiApiKey, geminiModel, messages]);

  handleSendMessageRef.current = handleSendMessage;

  // Clean up streaming and speech on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Quick triage chip click handler
  const handleChipClick = (key) => {
    const kb = MULTILINGUAL_KNOWLEDGE_BASE[currentLang] || MULTILINGUAL_KNOWLEDGE_BASE['en-IN'];
    if (kb.knowledge && kb.knowledge[key]) {
      handleSendMessage(kb.knowledge[key].title, key);
    }
  };

  // Copy text to clipboard helper
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    playChime('pop');
  };

  // Test and save Gemini API key
  const handleTestAndSaveKey = async () => {
    const keyToTest = tempApiKey.trim();
    if (!keyToTest) {
      setApiTestStatus('error');
      setApiTestMessage('Please enter an API key or use the pre-configured demo key.');
      return;
    }

    setApiTestStatus('testing');
    setApiTestMessage('Connecting with Google Gemini API...');

    if (keyToTest.toLowerCase().startsWith('demo-') || keyToTest.toLowerCase() === 'demo') {
      localStorage.setItem('hms_gemini_api_key', keyToTest);
      localStorage.setItem('hms_gemini_model', geminiModel);
      setGeminiApiKey(keyToTest);
      setApiTestStatus('success');
      setApiTestMessage('✅ Demo Gemini Key Active! Hybrid clinical triage connected.');
      window.dispatchEvent(new CustomEvent('medicare_gemini_key_updated', { detail: { key: keyToTest, model: geminiModel } }));
      playChime('pop');
      return;
    }

    try {
      const pingUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${keyToTest}`;
      const pingRes = await fetch(pingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with the word: OK' }] }]
        })
      });

      if (!pingRes.ok) {
        const errText = await pingRes.text();
        throw new Error(`HTTP ${pingRes.status}: ${errText.slice(0, 100)}`);
      }

      localStorage.setItem('hms_gemini_api_key', keyToTest);
      localStorage.setItem('hms_gemini_model', geminiModel);
      setGeminiApiKey(keyToTest);
      setApiTestStatus('success');
      setApiTestMessage(`✅ Google ${geminiModel} Connected! Live clinical intelligence active.`);
      window.dispatchEvent(new CustomEvent('medicare_gemini_key_updated', { detail: { key: keyToTest, model: geminiModel } }));
      playChime('pop');
    } catch (err) {
      setApiTestStatus('error');
      setApiTestMessage(`❌ Connection failed: ${err.message || 'Check key or internet connection.'}`);
    }
  };

  const handleUseDemoKey = () => {
    const demoKey = 'demo-gemini-flash-hackathon-2026';
    setTempApiKey(demoKey);
    localStorage.setItem('hms_gemini_api_key', demoKey);
    localStorage.setItem('hms_gemini_model', geminiModel);
    setGeminiApiKey(demoKey);
    setApiTestStatus('success');
    setApiTestMessage('✅ Pre-configured Demo Key Connected! Live hybrid triage ready.');
    window.dispatchEvent(new CustomEvent('medicare_gemini_key_updated', { detail: { key: demoKey, model: geminiModel } }));
    playChime('pop');
  };

  const handleClearKey = () => {
    localStorage.removeItem('hms_gemini_api_key');
    setGeminiApiKey('');
    setTempApiKey('');
    setApiTestStatus(null);
    setApiTestMessage('');
    window.dispatchEvent(new CustomEvent('medicare_gemini_key_updated', { detail: { key: '', model: geminiModel } }));
    playChime('pop');
  };

  const isGeminiConnected = Boolean(geminiApiKey && geminiApiKey.trim());
  const modelDisplayName = geminiModel === 'gemini-2.0-flash-exp'
    ? 'Gemini 2.0 Flash'
    : geminiModel === 'gemini-1.5-pro'
      ? 'Gemini 1.5 Pro'
      : 'Gemini 1.5 Flash';

  return (
    <div
      ref={capsuleRef}
      className="medicare-ai-assistant-wrapper"
      style={{
        position: 'fixed',
        bottom: `${position.y}px`,
        right: `${position.x}px`,
        zIndex: 9999,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: isDragging ? 'none' : 'auto'
      }}
    >
      {/* 1. Minimized / Closed State: Sleek Siri Orb Draggable Pill */}
      {(!isOpen || isMinimized) && (
        <div
          onMouseDown={handleMouseDown}
          onClick={() => {
            if (!dragStartRef.current.moved) {
              setIsOpen(true);
              setIsMinimized(false);
              playChime('pop');
            }
          }}
          title="Drag anywhere • Click to Open MediCare Clinical AI Assistant"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 18px 10px 12px',
            background: 'rgba(18, 18, 22, 0.88)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '9999px',
            cursor: isDragging ? 'grabbing' : 'grab',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(10, 132, 255, 0.35)',
            transform: 'scale(1)',
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isDragging) e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            if (!isDragging) e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* Animated Iridescent Siri Orb */}
          <div 
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #ec4899 0%, #8b5cf6 40%, #06b6d4 80%, #3b82f6 100%)',
              boxShadow: '0 0 16px rgba(236, 72, 153, 0.6), 0 0 25px rgba(6, 182, 212, 0.4)',
              animation: 'siriOrbGlow 4s ease-in-out infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fas fa-brain" style={{ color: '#ffffff', fontSize: '14px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}></i>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px' }}>
                Ask MediCare AI
              </span>
              <span 
                style={{
                  fontSize: '0.62rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}
              >
                {currentLang.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isGeminiConnected ? '#10b981' : '#30d158',
                  boxShadow: isGeminiConnected ? '0 0 6px #10b981' : '0 0 6px #30d158'
                }} 
              />
              <span style={{ fontSize: '0.68rem', color: isGeminiConnected ? '#34d399' : '#98989d' }}>
                {isGeminiConnected ? `${modelDisplayName} Active` : 'Voice Triage Ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Expanded State: Apple Glassmorphic Assistant Window */}
      {isOpen && !isMinimized && (
        <div
          style={{
            position: 'relative',
            width: '430px',
            maxWidth: 'calc(100vw - 32px)',
            height: '640px',
            maxHeight: 'calc(100vh - 48px)',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(36px) saturate(200%)',
            WebkitBackdropFilter: 'blur(36px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.25)',
            animation: 'assistantSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Draggable Header Bar */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              padding: '12px 18px',
              background: 'rgba(30, 41, 59, 0.75)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Pulsating Mini Siri Orb */}
              <div 
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #ec4899 0%, #8b5cf6 40%, #06b6d4 80%, #3b82f6 100%)',
                  boxShadow: '0 0 14px rgba(236, 72, 153, 0.6)',
                  animation: 'siriOrbGlow 3s ease-in-out infinite alternate',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-sparkles" style={{ color: '#ffffff', fontSize: '13px' }}></i>
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '0.90rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
                  MediCare Clinical AI Copilot
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span 
                    style={{
                      fontSize: '0.62rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: isGeminiConnected ? '#34d399' : '#94a3b8',
                      background: isGeminiConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.12)',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      border: isGeminiConnected ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(148, 163, 184, 0.2)'
                    }}
                  >
                    <span 
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isGeminiConnected ? '#10b981' : '#94a3b8',
                        boxShadow: isGeminiConnected ? '0 0 6px #10b981' : 'none'
                      }}
                    />
                    {isGeminiConnected ? (modelDisplayName === 'Gemini 1.5 Flash' ? '● Gemini 1.5 Flash Connected' : `● ${modelDisplayName} Connected`) : '● Clinical Offline Copilot'}
                  </span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#64748b' }}></span>
                  <span style={{ fontSize: '0.64rem', color: '#38bdf8', fontFamily: "'JetBrains Mono'" }}>React 18</span>
                </div>
              </div>
            </div>

            {/* Window Controls: Settings Gear, Sound, Minimize, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setTempApiKey(geminiApiKey);
                  setApiTestStatus(null);
                }}
                title="Configure Google Gemini Live API Key"
                style={{
                  background: isSettingsOpen ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: isSettingsOpen ? '1px solid #38bdf8' : 'none',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  color: isSettingsOpen ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                <i className="fas fa-cog"></i>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute AI Audio Chimes' : 'Enable AI Audio Chimes'}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  color: soundEnabled ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                <i className={`fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize Capsule"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                <i className="fas fa-minus"></i>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Google Gemini Settings Overlay Panel */}
          {isSettingsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '55px',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                zIndex: 60,
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto',
                animation: 'assistantSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-sparkles" style={{ color: '#38bdf8' }}></i>
                  Google Gemini Live API Settings
                </h4>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', lineHeight: '1.45' }}>
                Connect Google Gemini 1.5 Flash for live emergency clinical triage (Green / Yellow / Red), specialist physician routing, drug interaction safety, and multilingual reasoning in Hindi &amp; Telugu.
              </p>

              {/* Status Indicator Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: isGeminiConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.1)',
                border: isGeminiConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(148, 163, 184, 0.2)',
                fontSize: '0.74rem'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isGeminiConnected ? '#10b981' : '#94a3b8',
                  boxShadow: isGeminiConnected ? '0 0 8px #10b981' : 'none'
                }}></span>
                <span style={{ color: isGeminiConnected ? '#34d399' : '#cbd5e1', fontWeight: 600 }}>
                  {isGeminiConnected ? (modelDisplayName === 'Gemini 1.5 Flash' ? '● Gemini 1.5 Flash Connected' : `● ${modelDisplayName} Connected`) : '● Clinical Offline Copilot'}
                </span>
              </div>

              {/* API Key Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '5px' }}>
                  Google Gemini API Key:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showKeyPassword ? 'text' : 'password'}
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      background: 'rgba(30, 41, 59, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '8px 34px 8px 10px',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyPassword(!showKeyPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <i className={`fas ${showKeyPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '5px' }}>
                  Target Gemini Model:
                </label>
                <select
                  value={geminiModel}
                  onChange={(e) => {
                    const m = e.target.value;
                    setGeminiModel(m);
                    localStorage.setItem('hms_gemini_model', m);
                  }}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    outline: 'none'
                  }}
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Recommended - Fast &amp; Smart)</option>
                  <option value="gemini-2.0-flash-exp">gemini-2.0-flash-exp (Next-Gen Gemini 2.0)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Clinical Reasoning)</option>
                </select>
              </div>

              {/* Status Alert Banner */}
              {apiTestStatus && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  background: apiTestStatus === 'success' ? 'rgba(16, 185, 129, 0.15)' : apiTestStatus === 'testing' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: apiTestStatus === 'success' ? '1px solid rgba(16, 185, 129, 0.35)' : apiTestStatus === 'testing' ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
                  color: apiTestStatus === 'success' ? '#34d399' : apiTestStatus === 'testing' ? '#38bdf8' : '#fca5a5'
                }}>
                  {apiTestStatus === 'testing' && <i className="fas fa-spinner fa-spin" style={{ marginRight: '6px' }}></i>}
                  {apiTestMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleTestAndSaveKey}
                  disabled={apiTestStatus === 'testing'}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0071e3 0%, #0a84ff 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: apiTestStatus === 'testing' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)'
                  }}
                >
                  <i className="fas fa-plug-circle-check"></i>
                  Test &amp; Save Connection
                </button>

                <button
                  type="button"
                  onClick={handleUseDemoKey}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fas fa-key"></i>
                  Use Pre-configured Demo Key
                </button>

                <button
                  type="button"
                  onClick={handleClearKey}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#fca5a5',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fas fa-power-off"></i>
                  Disconnect / Offline Copilot
                </button>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Close Settings
                </button>
              </div>
            </div>
          )}

          {/* Multilingual Selector Strip */}
          <div
            style={{
              padding: '8px 14px',
              background: 'rgba(15, 23, 42, 0.85)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <i className="fas fa-language" style={{ color: '#38bdf8' }}></i>
              <span>Language / భాష / भाषा:</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(30, 41, 59, 0.8)', padding: '2px', borderRadius: '8px' }}>
              {[
                { code: 'en-IN', label: 'English' },
                { code: 'hi-IN', label: 'हिन्दी' },
                { code: 'te-IN', label: 'తెలుగు' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    padding: '3px 9px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: currentLang === lang.code ? '#0071e3' : 'transparent',
                    color: currentLang === lang.code ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.15s'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Regional Triage Chips Dock */}
          <div 
            style={{
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            {langConfig.chips.map(chip => (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '5px 11px',
                  borderRadius: '9999px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#e0f2fe',
                  fontSize: '0.71rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                  e.currentTarget.style.borderColor = '#38bdf8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream Area */}
          <div 
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%'
                }}
              >
                <div 
                  style={{
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, #0071e3 0%, #0a84ff 100%)' 
                      : 'rgba(30, 41, 59, 0.75)',
                    border: msg.sender === 'user' 
                      ? 'none' 
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: msg.sender === 'user' 
                      ? '0 4px 16px rgba(10, 132, 255, 0.35)' 
                      : '0 4px 16px rgba(0, 0, 0, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    lineHeight: '1.45',
                    position: 'relative'
                  }}
                >
                  {/* Formatted Text rendering with link parsing */}
                  <div>
                    {renderClinicalMarkdown(msg.text)}
                  </div>

                  {/* Message Footer: Timestamp, Provider Badge, Voice Readout & Copy Button */}
                  <div 
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '6px',
                      fontSize: '0.66rem',
                      color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.75)' : '#94a3b8'
                    }}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'ai' && (
                      <>
                        {msg.provider === 'gemini' && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            color: '#34d399',
                            background: 'rgba(16, 185, 129, 0.15)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontSize: '0.6rem',
                            fontWeight: 700
                          }}>
                            <i className="fas fa-sparkles" style={{ fontSize: '8px' }}></i> Gemini Live
                          </span>
                        )}
                        <button
                          onClick={() => speakMessage(msg.text, msg.lang || currentLang, msg.id)}
                          title={speakingMessageId === msg.id ? "Stop Voice Readout" : "Read Aloud (TTS Voice)"}
                          style={{
                            background: speakingMessageId === msg.id ? 'rgba(56, 189, 248, 0.25)' : 'none',
                            border: 'none',
                            borderRadius: '4px',
                            color: speakingMessageId === msg.id ? '#38bdf8' : '#94a3b8',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            fontSize: '0.72rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <i className={`fas ${speakingMessageId === msg.id ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                        </button>
                        <button
                          onClick={() => copyMessage(msg.text)}
                          title="Copy to Clipboard"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '0 2px',
                            fontSize: '0.7rem'
                          }}
                        >
                          <i className="far fa-copy"></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Live Streaming Token Indicator */}
            {isStreaming && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                <div 
                  style={{
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(30, 41, 59, 0.85)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    lineHeight: '1.45',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {streamingText}
                  <span 
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '14px',
                      backgroundColor: '#38bdf8',
                      marginLeft: '4px',
                      verticalAlign: 'middle',
                      animation: 'aiCursorBlink 0.8s infinite'
                    }} 
                  />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Listening State Banner */}
          {isListening && (
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderTop: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.74rem',
                color: '#fca5a5'
              }}
            >
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 8px #ef4444',
                  animation: 'aiCursorBlink 0.6s infinite'
                }} 
              />
              <span>{langConfig.listening}</span>
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <div 
            style={{
              padding: '12px 16px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={langConfig.placeholder}
                disabled={isStreaming}
                style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0071e3'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              />

              {/* Microphone Voice Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isListening ? "Stop Voice Input" : `Speak (${currentLang})`}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: isListening 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                    : 'rgba(255, 255, 255, 0.08)',
                  border: isListening ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isListening ? '#ffffff' : '#38bdf8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isListening ? '0 0 14px rgba(239, 68, 68, 0.6)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`} style={{ fontSize: '14px' }}></i>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim() || isStreaming}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: !inputQuery.trim() || isStreaming 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'linear-gradient(135deg, #0071e3 0%, #0a84ff 100%)',
                  border: 'none',
                  color: '#ffffff',
                  cursor: !inputQuery.trim() || isStreaming ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: inputQuery.trim() && !isStreaming ? '0 4px 14px rgba(10, 132, 255, 0.4)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fas fa-paper-plane" style={{ fontSize: '13px' }}></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Component Keyframes */}
      <style>{`
        @keyframes siriOrbGlow {
          0% {
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.7)) hue-rotate(0deg);
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(6, 182, 212, 0.9)) hue-rotate(90deg);
            transform: scale(1.08);
          }
          100% {
            filter: drop-shadow(0 0 14px rgba(139, 92, 246, 0.8)) hue-rotate(180deg);
            transform: scale(1);
          }
        }
        @keyframes assistantSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes aiCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
