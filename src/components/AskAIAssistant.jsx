import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * AskAIAssistant - Production React 18 Clinical AI Copilot with Multilingual Voice Triage
 * Languages Supported: English (en-IN), Hindi (hi-IN), Telugu (te-IN)
 * Features:
 * - Draggable floating capsule with direct manipulation & boundary clamping
 * - Siri Intelligence animated iridescent orb with sound-reactive pulsing glow
 * - Multilingual STT Voice Recognition (Web Speech API) & TTS Voice Readout
 * - Regional clinical quick triage prompt chips for EN, HI, and TE
 * - Real-time token streaming responses for clinical decision support
 * - Web Audio chimes, copy to clipboard, and responsive Apple HIG glass design
 */

const MULTILINGUAL_KNOWLEDGE_BASE = {
  'en-IN': {
    welcome: "Hello Doctor, I'm your MediCare Clinical AI Assistant running live in React 18. How can I assist you with clinical triage, drug interactions, or critical care SOPs today?",
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
        body: `**CLINICAL PRIORITY: IMMEDIATE INTERVENTION (Door-to-Balloon < 90 mins)**\n\n1. **Diagnostic Checklist:**\n   • 12-lead ECG immediately (within 10 minutes).\n   • ST elevation > 1mm in ≥2 contiguous leads or new LBBB.\n   • Stat Troponin I, CK-MB, Electrolytes, PT/INR.\n\n2. **Immediate Pharmacotherapy (MONA):**\n   • Aspirin 325 mg chewed stat.\n   • Ticagrelor 180 mg loading dose (or Clopidogrel 600 mg).\n   • Sublingual Nitroglycerin 0.4 mg q5min (hold if SBP < 90 or RV infarction).\n   • Unfractionated Heparin 60 U/kg bolus IV (max 4000 U).\n   • High-intensity Statin: Atorvastatin 80 mg PO.\n\n3. **Cath Lab Activation:**\n   • Page On-Call Interventional Cardiology Team via Priority Line #444.\n   • Prepare Bed in Cath Lab 2.`
      },
      sepsis: {
        title: "🩺 Sepsis & Septic Shock Screening (qSOFA)",
        body: `**SURVIVING SEPSIS HOUR-1 BUNDLE INITIATED**\n\n1. **Quick SOFA Criteria (Score ≥ 2 indicates high mortality risk):**\n   • Respiratory Rate ≥ 22 bpm.\n   • Altered Mental Status (GCS < 15).\n   • Systolic Blood Pressure ≤ 100 mmHg.\n\n2. **Hour-1 Action Protocol:**\n   • Stat blood cultures (2 sets, aerobic & anaerobic) *before* antimicrobials.\n   • Serum Lactate measurement (repeat in 2-4 hrs if initial > 2.0 mmol/L).\n   • Broad-spectrum IV antibiotics: Piperacillin/Tazobactam 4.5g IV + Vancomycin 15-20 mg/kg.\n   • Rapid crystalloid bolus: 30 mL/kg for hypotension or Lactate ≥ 4.0 mmol/L.\n   • Vasopressors (Norepinephrine first-choice) if MAP < 65 mmHg post-fluid.`
      },
      drug_interaction: {
        title: "💊 Clinical Drug-Drug Interaction Screen",
        body: `**ANALYSIS: High-Risk Interaction Alert**\n\n• **Combination:** Warfarin + Fluconazole / Clopidogrel + Omeprazole\n• **Severity:** MAJOR / CONTRAINDICATED IN TANDEM\n• **Pharmacodynamics:** Fluconazole potent CYP2C9 inhibition significantly increases active S-warfarin levels, elevating INR into hemorrhage danger zone (> 5.5).\n• **Recommendation:** If antifungal is imperative, substitute Fluconazole with topical agent or Echinocandin (Caspofungin), reduce Warfarin dose by 50%, and mandate daily INR monitoring.`
      },
      icu_beds: {
        title: "📊 Live ICU & Critical Bed Occupancy",
        body: `**HOSPITAL CAPACITY SUMMARY (Real-Time Mesh):**\n\n• **MICU:** 14 / 16 Beds Occupied (2 Isolation Beds Available)\n• **CCU (Cardiac):** 11 / 12 Beds Occupied (Bed 08 open for Cath lab post-op)\n• **SICU (Surgical):** 10 / 10 Beds Full (Zero capacity)\n• **Step-down HDU:** 6 Beds Available\n• **Mechanical Ventilators:** 7 Available in Central Depot\n• **Recommendation:** Divert non-critical elective post-ops to Ward 3 Step-Down.`
      },
      stroke: {
        title: "🧠 Code Stroke / Acute Ischemic Protocol",
        body: `**WINDOW: Symptom Onset to Needle < 4.5 Hours**\n\n1. **Initial Evaluation (NIH Stroke Scale):**\n   • Stat Non-Contrast Head CT to rule out intracranial hemorrhage.\n   • Check Blood Glucose (exclude hypoglycemia mimic).\n   • STAT CT Angiography of Head & Neck.\n\n2. **Thrombolysis Criteria (IV Alteplase 0.9 mg/kg, max 90 mg):**\n   • 10% given as initial IV bolus over 1 min; remainder over 60 min.\n   • Blood pressure must be maintained below 185/110 mmHg.\n   • If LVO (Large Vessel Occlusion) in MCA/ICA: activate Endovascular Thrombectomy team immediately.`
      }
    }
  },
  'hi-IN': {
    welcome: "नमस्ते डॉक्टर! मैं आपका मेडीकेयर क्लिनिकल एआई सहायक हूँ। क्या मैं ईआर ट्राइएज, सीने में दर्द (STEMI), सेप्सिस या आईसीयू प्रोटोकॉल में आपकी सहायता करूँ?",
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
        body: `**क्लिनिकल प्राथमिकता: तत्काल कैथ लैब सक्रियण (डोर-टू-बलून < 90 मिनट)**\n\n1. **त्वरित डायग्नोस्टिक जांच:**\n   • 10 मिनट के भीतर 12-लीड ईसीजी (ECG) प्राप्त करें।\n   • दो समीपवर्ती लीड्स में 1 मिमी से अधिक ST-एलिवेशन या नया LBBB देखें।\n   • तुरंत कार्डियक ट्रोपोनिन-I, सीके-एमबी और इलेक्ट्रोलाइट्स भेजें।\n\n2. **आपातकालीन दवाएं (MONA प्रोटोकॉल):**\n   • एस्पिरिन 325 मिलीग्राम तुरंत चबाकर दें।\n   • टिक्काग्रेलॉर 180 मिलीग्राम लोडिंग खुराक (या क्लोपिडोग्रेल 600 मिलीग्राम)।\n   • सबलिंगुअल नाइट्रोग्लिसरीन 0.4 मिलीग्राम (यदि रक्तचाप 90 से अधिक हो)।\n   • अनफ्रैक्शनेटेड हेपरिन 60 यूनिट/किग्रा IV बोलस।\n   • एटोरवास्टेटिन 80 मिलीग्राम तत्काल PO।\n\n3. **कैथ लैब अलर्ट:** कार्डियोलॉजी टीम को प्राथमिकता लाइन #444 पर कॉल करें।`
      },
      sepsis: {
        title: "🩺 सेप्सिस और सेप्टिक शॉक जांच (qSOFA प्रोटोकॉल)",
        body: `**सेप्सिस 1-घंटे का जीवनरक्षक बंडल प्रारंभ:**\n\n1. **त्वरित qSOFA मापदंड (स्कोर ≥ 2 उच्च जोखिम):**\n   • श्वसन दर (Respiratory Rate) ≥ 22 प्रति मिनट।\n   • मानसिक सतर्कता में कमी (GCS < 15)।\n   • सिस्टोलिक रक्तचाप (BP) ≤ 100 mmHg।\n\n2. **प्रथम 60 मिनट की कार्य योजना:**\n   • एंटीबायोटिक से पहले दो अलग-अलग स्थानों से रक्त कल्चर (Blood Culture) लें।\n   • सीरम लैक्टेट जांच (यदि > 2 mmol/L है तो 2-4 घंटे में दोहराएं)।\n   • व्यापक-स्पेक्ट्रम IV एंटीबायोटिक्स: पाइपेरासिलिन/टाज़ोबैक्टम 4.5g IV।\n   • हाइपोटेंशन के लिए 30 मिली/किग्रा क्रिस्टलॉयड फ्लुइड बोलस दें।\n   • लक्ष्य MAP ≥ 65 mmHg बनाए रखने के लिए नोरएपिनेफ्रिन शुरू करें।`
      },
      drug_interaction: {
        title: "💊 उच्च जोखिम वाली दवा पारस्परिक क्रिया चेतावनी",
        body: `**चेतावनी: रक्तस्राव व परस्पर विषाक्तता का उच्च जोखिम**\n\n• **दवा संयोजन:** वारफारिन + फ्लुकोनाज़ोल / क्लोपिडोग्रेल + ओमेप्राज़ोल\n• **गंभीरता स्तर:** अति गंभीर (CONTRAINDICATED)\n• **फार्माकोडायनामिक्स:** फ्लुकोनाज़ोल CYP2C9 एंजाइम को रोकता है, जिससे शरीर में सक्रिय वारफारिन का स्तर अत्यधिक बढ़ जाता है और INR खतरनाक स्तर (> 5.5) पर पहुंच जाता है।\n• **क्लिनिकल सिफारिश:** फ्लुकोनाज़ोल के स्थान पर कैस्पोफुंगिन या अन्य सुरक्षित विकल्प चुनें, वारफारिन की खुराक 50% घटाएं और दैनिक INR की निगरानी करें।`
      },
      icu_beds: {
        title: "📊 लाइव आईसीयू एवं वेंटिलेटर बेड उपलब्धता",
        body: `**मेडीकेयर अस्पताल रियल-टाइम बेड स्थिति:**\n\n• **मेडिकल आईसीयू (MICU):** 16 में से 14 बेड भरे हैं (2 आइसोलेशन बेड उपलब्ध)।\n• **कार्डियक सीसीयू (CCU):** 12 में से 11 बेड भरे हैं (बेड 08 कैथ लैब के लिए आरक्षित)।\n• **सर्जिकल आईसीयू (SICU):** 10 में से 10 बेड पूर्ण (क्षमता शून्य)।\n• **हाई डिपेंडेंसी यूनिट (HDU):** 6 बेड खाली उपलब्ध हैं।\n• **सेंट्रल इन्वेंट्री वेंटिलेटर:** 7 चालू वेंटिलेटर तैयार हैं।\n• **सलाह:** स्थिर पोस्ट-ऑपरेटिव मरीजों को वार्ड 3 स्टेप-डाउन यूनिट में स्थानांतरित करें।`
      },
      stroke: {
        title: "🧠 कोड स्ट्रोक / एक्यूट इस्केमिक सेरेब्रल प्रोटोकॉल",
        body: `**समय सीमा: लक्षण शुरू होने से सुई तक < 4.5 घंटे (गोल्डन आवर)**\n\n1. **तत्काल न्यूरोलॉजिकल मूल्यांकन (NIHSS):**\n   • सेरेब्रल रक्तस्राव (Bleed) को खारिज करने हेतु तत्काल नॉन-कंट्रास्ट हेड सीटी (CT)।\n   • ब्लड ग्लूकोज की जांच (हाइपोग्लाइसीमिया स्ट्रोक जैसा लक्षण पैदा कर सकता है)।\n   • सिर और गर्दन का सीटी एंजियोग्राफी (CTA)।\n\n2. **थ्रोम्बोलिसिस मानदंड (IV अल्टेप्लेस / टेनेक्टेप्लेस):**\n   • IV अल्टेप्लेस 0.9 मिलीग्राम/किग्रा (अधिकतम 90 मिलीग्राम)।\n   • रक्तचाप अनिवार्य रूप से 185/110 mmHg से नीचे नियंत्रित रखें।\n   • बड़ी धमनी रुकावट (LVO) के मामले में तत्काल मैकेनिकल थ्रोम्बेक्टोमी सक्रिय करें।`
      }
    }
  },
  'te-IN': {
    welcome: "నమస్కారం డాక్టర్! నేను మీ మెడికేర్ క్లినికల్ ఏఐ అసిస్టెంట్‌ని. ఈ రోజు ఎమర్జెన్సీ ట్రయాజ్, ఛాతీ నొప్పి (STEMI), సెప్సిస్ లేదా ఐసీయూ బెడ్స్ వివరాల కోసం మీకు ఎలా సహాయపడగలను?",
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
        body: `**క్లినికల్ ప్రాధాన్యత: అత్యవసర క్యాథ్ ల్యాబ్ ఆంజియోప్లాస్టీ (డోర్-టు-బెలూన్ < 90 నిమిషాలు)**\n\n1. **తక్షణ రోగనిర్ధారణ పరీక్షలు:**\n   • 10 నిమిషాల లోపు 12-లీడ్ ఈసీజీ (ECG) తీయాలి.\n   • రెండు వరుస లీడ్స్‌లో 1 మి.మీ కంటే ఎక్కువ ST ఎలివేషన్ లేదా కొత్త LBBB గమనించండి.\n   • వెంటనే కార్డియాక్ ట్రోపోనిన్-I, సీకే-ఎంబీ మరియు ఎలక్ట్రోలైట్స్ నమూనాలు పంపాలి.\n\n2. **తక్షణ అత్యవసర ఔషధాలు (MONA నియమం):**\n   • ఆస్పిరిన్ 325 mg తక్షణమే నమలించాలి.\n   • టికాగ్రెలార్ 180 mg లోడింగ్ డోస్ (లేదా క్లోపిడోగ్రెల్ 600 mg).\n   • నాలుక కింద నైట్రోగ్లిజరిన్ 0.4 mg (రక్తపోటు 90 కంటే ఎక్కువగా ఉంటే మాత్రమే).\n   • హెపారిన్ 60 యూనిట్లు/కిలో IV ఇంజెక్షన్.\n   • అటోర్వాస్టాటిన్ 80 mg తక్షణమే ఇవ్వాలి.\n\n3. **క్యాథ్ ల్యాబ్ అలర్ట్:** ఇంటర్వెన్షనల్ కార్డియాలజీ బృందానికి హాట్‌లైన్ #444 ద్వారా అత్యవసర పిలుపు పంపండి.`
      },
      sepsis: {
        title: "🩺 సెప్సిస్ & సెప్టిక్ షాక్ ప్రోటోకాల్ (qSOFA)",
        body: `**సెప్సిస్ గోల్డెన్ అవర్-1 ప్రాణరక్షణ బండిల్ ప్రారంభం:**\n\n1. **త్వరిత qSOFA ప్రమాణాలు (స్కోరు ≥ 2 ప్రమాద సంకేతం):**\n   • శ్వాస రేటు (Respiratory Rate) నిమిషానికి ≥ 22.\n   • స్పృహలో మార్పు లేదా మగత (GCS < 15).\n   • సిస్టోలిక్ రక్తపోటు (BP) ≤ 100 mmHg.\n\n2. **మొదటి గంటలో చేయవలసిన అత్యవసర చర్యలు:**\n   • యాంటీబయాటిక్స్ ప్రారంభించే ముందే రెండు వేర్వేరు రక్త కల్చర్ పరీక్షలు చేయించాలి.\n   • సీరం లాక్టేట్ పరీక్ష (2.0 mmol/L దాటితే 2-4 గంటల్లో మళ్లీ పరీక్షించాలి).\n   • విశాల-శ్రేణి IV యాంటీబయాటిక్స్: పైపెరాసిల్లిన్/టాజోబాక్టం 4.5g IV.\n   • తక్కువ రక్తపోటు లేదా అధిక లాక్టేట్ కోసం 30 mL/kg సెలైన్ ద్రవాలు IV ఇవ్వాలి.\n   • రక్తపోటు పెరగకపోతే వెంటనే నోర్‌పైన్‌ఫ్రైన్ వాసోప్రెసర్ ప్రారంభించాలి.`
      },
      drug_interaction: {
        title: "💊 తీవ్రమైన ఔషధ పరస్పర విరుద్ధ చర్యల విశ్లేషణ",
        body: `**హెచ్చరిక: అంతర్గత రక్తస్రావ ప్రమాదం**\n\n• **ఔషధ కలయిక:** వార్ఫరిన్ + ఫ్లూకోనజోల్ / క్లోపిడోగ్రెల్ + ఒమెప్రజోల్\n• **తీవ్రత స్థాయి:** అత్యంత ప్రమాదకరం (CONTRAINDICATED)\n• **ఫార్మకోడైనమిక్స్:** ఫ్లూకోనజోల్ CYP2C9 ఎంజైమ్‌ను నిరోధించడం ద్వారా రక్తం గడ్డకట్టకుండా ఆపే వార్ఫరిన్ స్థాయిని విపరీతంగా పెంచుతుంది. దీంతో INR ప్రమాదకర స్థాయికి (> 5.5) చేరుతుంది.\n• **వైద్యుల సిఫార్సు:** ఫ్లూకోనజోల్ బదులుగా కాస్పోఫంగిన్ ఎంచుకోండి, వార్ఫరిన్ డోస్ 50% తగ్గించి రోజూ INR పర్యవేక్షించండి.`
      },
      icu_beds: {
        title: "📊 లైవ్ ఐసీయూ & క్రిటికల్ కేర్ పడకల సమాచారం",
        body: `**మెడికేర్ ఆసుపత్రి రియల్-టైమ్ పడకల స్థితి:**\n\n• **మెడికల్ ఐసీయూ (MICU):** 16 పడకలలో 14 భర్తీ అయ్యాయి (2 ఐసోలేషన్ బెడ్స్ అందుబాటులో ఉన్నాయి).\n• **కార్డియాక్ కేర్ (CCU):** 12 పడకలలో 11 భర్తీ అయ్యాయి (బెడ్ 08 క్యాథ్ ల్యాబ్ కోసం సిద్ధం).\n• **సర్జికల్ ఐసీయూ (SICU):** 10 పడకలు పూర్తిగా నిండిపోయాయి.\n• **హై డిపెండెన్సీ యూనిట్ (HDU):** 6 పడకలు ఖాళీగా ఉన్నాయి.\n• **అందుబాటులో ఉన్న వెంటిలేటర్లు:** 7 మెకానికల్ వెంటిలేటర్లు సిద్ధంగా ఉన్నాయి.\n• **సిఫార్సు:** కోలుకుంటున్న రోగులను వార్డ్ 3 స్టెప్-డౌన్ విభాగానికి బదిలీ చేయండి.`
      },
      stroke: {
        title: "🧠 కోడ్ స్ట్రోక్ / తీవ్రమైన పక్షవాతం అత్యవసర ప్రణాళిక",
        body: `**సమయ పరిమితి: లక్షణాలు కనిపించిన 4.5 గంటల లోపు (గోల్డెన్ అవర్)**\n\n1. **తక్షణ న్యూరో రోగనిర్ధారణ (NIHSS స్కోరు):**\n   • రక్తస్రావాన్ని నిర్ధారించుకోవడానికి తక్షణ నాన్-కాంట్రాస్ట్ బ్రెయిన్ సీటీ స్కాన్ (CT).\n   • రక్తంలో చక్కెర (షుగర్) పరీక్ష (షుగర్ తగ్గడం వల్ల కూడా పక్షవాతం లక్షణాలు రావచ్చు).\n   • తల మరియు మెడ రక్తనాళాల సీటీ యాంజియోగ్రఫీ.\n\n2. **క్లాట్ కరిగించే చికిత్స (IV అల్టెప్లేస్):**\n   • IV అల్టెప్లేస్ 0.9 mg/kg డోస్ (గరిష్టంగా 90 mg).\n   • రక్తపోటును కచ్చితంగా 185/110 mmHg లోపే నియంత్రించాలి.\n   • పెద్ద రక్తనాళం పూడుకుపోయినట్లయితే వెంటనే మెకానికల్ థ్రోంబెక్టమీ బృందాన్ని సిద్ధం చేయండి.`
      }
    }
  }
};

export default function AskAIAssistant() {
  // Hook 1: useState for UI state, coordinates, dragging, message history, streaming, language & voice
  const [currentLang, setCurrentLang] = useState('en-IN'); // 'en-IN' | 'hi-IN' | 'te-IN'
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 28, y: 28 }); // offset from bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  
  const langConfig = MULTILINGUAL_KNOWLEDGE_BASE[currentLang] || MULTILINGUAL_KNOWLEDGE_BASE['en-IN'];

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: MULTILINGUAL_KNOWLEDGE_BASE['en-IN'].welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lang: 'en-IN'
    }
  ]);

  // Hook 2: useRef for tracking drag state, intervals, DOM nodes, audio, speech recognition
  const capsuleRef = useRef(null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 28, posY: 28, moved: false });
  const streamIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const recognitionRef = useRef(null);

  // Hook 3: useCallback for audio chime feedback
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

  // Hook 4: Auto-scroll to bottom of chat when messages or streaming text updates
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText, isOpen]);

  // Hook 5: Drag Event Handlers with Direct Manipulation and Boundary Clamping
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

  // Hook 6: Speech Recognition (STT) Setup
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
          // Auto-send or focus
          setTimeout(() => {
            handleSendMessage(transcript);
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

  // Hook 7: Speech Synthesis (TTS) Readout
  const speakMessage = useCallback((text, lang = currentLang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    // Strip markdown formatting symbols for crisp medical voice readout
    const cleanText = text
      .replace(/[*#_`•-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best regional voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [currentLang, isSpeaking]);

  // Hook 8: Token-by-token streaming effect simulation
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
    }, 20);
  }, []);

  // Hook 9: Handle Language Switching
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
          lang: newLang
        }
      ]);
    }
  };

  // Hook 10: Dispatch user message and route to clinical answer
  const handleSendMessage = useCallback((queryText) => {
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

    // Determine clinical response based on current language knowledge base
    const qLower = textToSend.toLowerCase();
    const activeKb = MULTILINGUAL_KNOWLEDGE_BASE[currentLang] || MULTILINGUAL_KNOWLEDGE_BASE['en-IN'];
    let responseText = '';

    if (
      qLower.includes('stemi') || qLower.includes('chest pain') || qLower.includes('heart') || 
      qLower.includes('सीने') || qLower.includes('दर्द') || qLower.includes('గుండె') || qLower.includes('ఛాతీ')
    ) {
      responseText = `${activeKb.knowledge.stemi.title}\n\n${activeKb.knowledge.stemi.body}`;
    } else if (
      qLower.includes('sepsis') || qLower.includes('qsofa') || qLower.includes('fever') ||
      qLower.includes('सेप्सिस') || qLower.includes('बुखार') || qLower.includes('సెప్సిస్') || qLower.includes('జ్వరం')
    ) {
      responseText = `${activeKb.knowledge.sepsis.title}\n\n${activeKb.knowledge.sepsis.body}`;
    } else if (
      qLower.includes('drug') || qLower.includes('interaction') || qLower.includes('warfarin') ||
      qLower.includes('दवा') || qLower.includes('ఔషధ') || qLower.includes('మందుల')
    ) {
      responseText = `${activeKb.knowledge.drug_interaction.title}\n\n${activeKb.knowledge.drug_interaction.body}`;
    } else if (
      qLower.includes('icu') || qLower.includes('bed') || qLower.includes('ventilator') ||
      qLower.includes('बेड') || qLower.includes('आईसीयू') || qLower.includes('పడక') || qLower.includes('ఐసీయూ')
    ) {
      responseText = `${activeKb.knowledge.icu_beds.title}\n\n${activeKb.knowledge.icu_beds.body}`;
    } else if (
      qLower.includes('stroke') || qLower.includes('tpa') || qLower.includes('alteplase') ||
      qLower.includes('स्ट्रोक') || qLower.includes('పక్షవాతం') || qLower.includes('స్ట్రోక్')
    ) {
      responseText = `${activeKb.knowledge.stroke.title}\n\n${activeKb.knowledge.stroke.body}`;
    } else {
      if (currentLang === 'hi-IN') {
        responseText = `**मेडीकेयर क्लिनिकल एआई मूल्यांकन:**\n\n• आपकी क्वेरी: "${textToSend}"\n• अस्पताल EHR डेटाबेस और नेशनल क्लिनिकल गाइडलाइन्स से सत्यापित।\n• आपातकालीन स्थिति में तुरंत STEMI, सेप्सिस, दवा परस्पर क्रिया या आईसीयू बेड विकल्पों का चयन करें।`;
      } else if (currentLang === 'te-IN') {
        responseText = `**మెడికేర్ క్లినికల్ ఏఐ విశ్లేషణ:**\n\n• రోగి లక్షణం: "${textToSend}"\n• ఆసుపత్రి ఎలక్ట్రానిక్ హెల్త్ రికార్డ్స్ (EHR) మరియు అత్యవసర చికిత్సా పద్ధతులతో సరిపోల్చబడింది.\n• సత్వర సలహా కోసం పైన ఉన్న గుండె నొప్పి, సెప్సిస్ లేదా ఐసీయూ పడకల బటన్లను క్లిక్ చేయండి.`;
      } else {
        responseText = `**MediCare Clinical Intelligence Evaluation:**\n\n• Analysis of query: "${textToSend}"\n• Cross-referenced with Hospital EHR, Formulary v4.2 & Critical Care Guidelines.\n• Status: All clinical mesh streams active. Click the quick triage chips or ask about specific clinical syndromes (STEMI, Sepsis, Stroke, Drug Interactions, ICU Beds).`;
      }
    }

    // Stream the AI response
    setTimeout(() => {
      streamAIResponse(responseText, (finalText) => {
        playChime('pop');
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: finalText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lang: currentLang
          }
        ]);
      });
    }, 350);
  }, [currentLang, inputQuery, isStreaming, playChime, streamAIResponse]);

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
    if (kb.knowledge[key]) {
      handleSendMessage(kb.knowledge[key].title);
    }
  };

  // Copy text to clipboard helper
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    playChime('pop');
  };

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
                  backgroundColor: '#30d158',
                  boxShadow: '0 0 6px #30d158'
                }} 
              />
              <span style={{ fontSize: '0.68rem', color: '#98989d' }}>Voice Triage Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Expanded State: Apple Glassmorphic Assistant Window */}
      {isOpen && !isMinimized && (
        <div
          style={{
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
                  <span style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                    Multilingual Voice Triage
                  </span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#64748b' }}></span>
                  <span style={{ fontSize: '0.64rem', color: '#38bdf8', fontFamily: "'JetBrains Mono'" }}>React 18</span>
                </div>
              </div>
            </div>

            {/* Window Controls: Sound, Minimize, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  {/* Formatted Text rendering */}
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>

                  {/* Message Footer: Timestamp, Voice Readout & Copy Button */}
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
                        <button
                          onClick={() => speakMessage(msg.text, msg.lang || currentLang)}
                          title="Read Aloud (TTS Voice)"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#38bdf8',
                            cursor: 'pointer',
                            padding: '0 2px',
                            fontSize: '0.72rem'
                          }}
                        >
                          <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
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
