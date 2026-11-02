import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * LiveTelemetryMonitor - Real-time 60Hz ECG Waveform & ICU Telemetry Monitor
 * Demonstrates: useState, useEffect, useCallback, useRef
 * Features:
 * - 60FPS sweeping phosphor ECG waveform canvas with P-QRS-T complex calculation
 * - Audio synth QRS heartbeat blip via Web Audio API
 * - Real-time vitals HUD (HR, SpO2, NIBP, Respiration, Temp)
 * - Dynamic arrhythmia rhythm simulator (Normal, Tachycardia, Bradycardia, V-Tach, V-Fib)
 * - Multi-bed patient telemetry switching and waveform freeze/inspection
 */
export default function LiveTelemetryMonitor({ patientId = 'BED-04' }) {
  // Hook 1: useState for vitals, UI controls, and telemetry states
  const [currentPatient, setCurrentPatient] = useState({
    bed: 'ICU Bed 04',
    name: 'Eleanor Vance',
    mrn: 'MRN-89241',
    age: '54Y',
    gender: 'Female',
    diagnosis: 'Post-Coronary Angioplasty (Day 1)',
    lead: 'LEAD II'
  });

  const [rhythmMode, setRhythmMode] = useState('NSR'); // NSR, TACHY, BRADY, VTACH, VFIB
  const [heartRate, setHeartRate] = useState(72);
  const [spo2, setSpo2] = useState(98.5);
  const [bloodPressure, setBloodPressure] = useState({ sys: 118, dia: 76, map: 90 });
  const [respiration, setRespiration] = useState(16);
  const [temperature, setTemperature] = useState(36.9);
  const [isFrozen, setIsFrozen] = useState(false);
  const [sweepSpeed, setSweepSpeed] = useState(25); // 25mm/s or 50mm/s
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [alarmStatus, setAlarmStatus] = useState('NORMAL'); // NORMAL, WARNING, CRITICAL
  const [qrsBeatTrigger, setQrsBeatTrigger] = useState(false);

  // Hook 2: useRef for canvas, animation frame, audio context, and telemetry state math
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const audioCtxRef = useRef(null);
  const simStateRef = useRef({
    scanX: 0,
    lastX: 0,
    lastY: 100,
    phase: 0,
    points: [],
    lastBeatTime: 0,
    bpm: 72
  });

  // Keep ref in sync with heartRate state for canvas loop without recreation
  useEffect(() => {
    simStateRef.current.bpm = heartRate;
  }, [heartRate]);

  // Hook 3: useCallback for Web Audio API QRS Beep
  const playQRSBeep = useCallback((pitch = 880) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.08);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [audioEnabled]);

  // Hook 4: Rhythm mode change handler (updates vitals & alarm states)
  const handleRhythmChange = useCallback((mode) => {
    setRhythmMode(mode);
    switch (mode) {
      case 'NSR':
        setHeartRate(72);
        setSpo2(98.6);
        setBloodPressure({ sys: 120, dia: 78, map: 92 });
        setRespiration(16);
        setAlarmStatus('NORMAL');
        break;
      case 'TACHY':
        setHeartRate(128);
        setSpo2(97.2);
        setBloodPressure({ sys: 138, dia: 88, map: 104 });
        setRespiration(24);
        setAlarmStatus('WARNING');
        break;
      case 'BRADY':
        setHeartRate(44);
        setSpo2(96.0);
        setBloodPressure({ sys: 98, dia: 60, map: 72 });
        setRespiration(12);
        setAlarmStatus('WARNING');
        break;
      case 'VTACH':
        setHeartRate(165);
        setSpo2(91.0);
        setBloodPressure({ sys: 82, dia: 50, map: 60 });
        setRespiration(28);
        setAlarmStatus('CRITICAL');
        break;
      case 'VFIB':
        setHeartRate(220);
        setSpo2(84.0);
        setBloodPressure({ sys: 55, dia: 30, map: 38 });
        setRespiration(32);
        setAlarmStatus('CRITICAL');
        break;
      default:
        break;
    }
  }, []);

  // Hook 5: Continuous background subtle vitals drift
  useEffect(() => {
    const vitalsInterval = setInterval(() => {
      if (rhythmMode === 'NSR') {
        setHeartRate(prev => Math.min(84, Math.max(65, prev + (Math.random() * 2 - 1))));
        setSpo2(prev => Math.min(99.5, Math.max(97.5, prev + (Math.random() * 0.4 - 0.2))));
      }
    }, 2500);

    return () => clearInterval(vitalsInterval);
  }, [rhythmMode]);

  // Patient selector presets
  const handlePatientSelect = useCallback((e) => {
    const val = e.target.value;
    if (val === 'BED-04') {
      setCurrentPatient({
        bed: 'ICU Bed 04',
        name: 'Eleanor Vance',
        mrn: 'MRN-89241',
        age: '54Y',
        gender: 'Female',
        diagnosis: 'Post-Coronary Angioplasty (Day 1)',
        lead: 'LEAD II'
      });
      handleRhythmChange('NSR');
    } else if (val === 'BED-07') {
      setCurrentPatient({
        bed: 'ICU Bed 07',
        name: 'Marcus Holloway',
        mrn: 'MRN-77312',
        age: '62Y',
        gender: 'Male',
        diagnosis: 'Acute Coronary Syndrome (ACS)',
        lead: 'LEAD V5'
      });
      handleRhythmChange('TACHY');
    } else if (val === 'BED-12') {
      setCurrentPatient({
        bed: 'ICU Bed 12',
        name: 'Devi Saravanan',
        mrn: 'MRN-64209',
        age: '48Y',
        gender: 'Female',
        diagnosis: 'Septic Shock / Vasopressor Wean',
        lead: 'LEAD I'
      });
      handleRhythmChange('NSR');
    }
  }, [handleRhythmChange]);

  // Hook 6: 60Hz ECG Canvas Drawing Loop (P-QRS-T waveform synthesis)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const baseline = height * 0.52;

    let scanX = simStateRef.current.scanX || 0;
    let lastY = simStateRef.current.lastY || baseline;
    let phase = simStateRef.current.phase || 0;
    const eraseWidth = 22;

    // Pre-draw ECG Medical Millimeter Grid
    const drawGrid = (context) => {
      context.save();
      context.lineWidth = 0.5;
      context.strokeStyle = 'rgba(16, 185, 129, 0.08)'; // subtle green grid
      const smallGrid = 8;
      const largeGrid = smallGrid * 5;

      for (let x = 0; x < width; x += smallGrid) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += smallGrid) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      // Large 5mm boxes
      context.strokeStyle = 'rgba(16, 185, 129, 0.18)';
      context.lineWidth = 1;
      for (let x = 0; x < width; x += largeGrid) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += largeGrid) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      context.restore();
    };

    // Calculate realistic ECG voltage based on cardiac cycle phase (0.0 to 1.0)
    const getECGVoltage = (p, rhythm) => {
      if (rhythm === 'VFIB') {
        // Chaotic irregular fibrillatory baseline
        return (Math.sin(p * Math.PI * 16) * 18 + Math.cos(p * Math.PI * 27) * 14 + (Math.random() - 0.5) * 20);
      }
      if (rhythm === 'VTACH') {
        // Broad monomorphic sinusoidal ventricular tachycardia
        return Math.sin(p * Math.PI * 2) * 58 + Math.sin(p * Math.PI * 4) * 12;
      }

      // Normal Sinus Waveform (P, PR, Q, R, S, ST, T)
      // P wave (0.08 - 0.18)
      if (p >= 0.08 && p < 0.18) {
        return Math.sin(((p - 0.08) / 0.10) * Math.PI) * 11;
      }
      // PR segment (0.18 - 0.28) => flat
      if (p >= 0.18 && p < 0.28) {
        return 0;
      }
      // Q dip (0.28 - 0.31)
      if (p >= 0.28 && p < 0.31) {
        return -Math.sin(((p - 0.28) / 0.03) * Math.PI) * 8;
      }
      // R peak (0.31 - 0.36) -> Sharp Upward Spurt
      if (p >= 0.31 && p < 0.36) {
        return Math.sin(((p - 0.31) / 0.05) * Math.PI) * 78;
      }
      // S dip (0.36 - 0.40) -> Downward Under-shoot
      if (p >= 0.36 && p < 0.40) {
        return -Math.sin(((p - 0.36) / 0.04) * Math.PI) * 18;
      }
      // ST Segment (0.40 - 0.50)
      if (p >= 0.40 && p < 0.50) {
        return 1.5;
      }
      // T Wave (0.50 - 0.70)
      if (p >= 0.50 && p < 0.70) {
        return Math.sin(((p - 0.50) / 0.20) * Math.PI) * 20;
      }
      // Isoelectric baseline noise
      return (Math.random() - 0.5) * 1.2;
    };

    // Initialize grid background if blank
    ctx.fillStyle = '#050c09';
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx);

    const render = () => {
      if (!isFrozen) {
        const bpm = simStateRef.current.bpm || 72;
        // Pixels moved per frame depends on sweep speed
        const speedFactor = sweepSpeed === 50 ? 3.6 : 2.2;
        const currentSpeed = speedFactor;

        // Phase advance per frame: 60 frames/sec
        // cardiac cycles per sec = bpm / 60
        // phase advance per frame = (bpm / 60) / 60 = bpm / 3600
        const phaseStep = bpm / 2400;

        const nextScanX = scanX + currentSpeed;

        // Erase beam area ahead with dark trail
        ctx.fillStyle = '#050c09';
        ctx.fillRect(scanX, 0, eraseWidth, height);
        // Re-draw grid in erased segment
        ctx.save();
        ctx.beginPath();
        ctx.rect(scanX, 0, eraseWidth, height);
        ctx.clip();
        drawGrid(ctx);
        ctx.restore();

        // Calculate next ECG Y position
        phase = (phase + phaseStep) % 1.0;

        // Detect R-Peak trigger for visual pulse & audio beep
        if (phase >= 0.31 && phase <= 0.36 && !simStateRef.current.qrsTriggered) {
          simStateRef.current.qrsTriggered = true;
          setQrsBeatTrigger(true);
          playQRSBeep(rhythmMode === 'CRITICAL' || rhythmMode === 'VFIB' ? 980 : 880);
          setTimeout(() => setQrsBeatTrigger(false), 120);
        } else if (phase > 0.40) {
          simStateRef.current.qrsTriggered = false;
        }

        const voltage = getECGVoltage(phase, rhythmMode);
        const nextY = baseline - voltage;

        // Draw green phosphor ECG sweep line with glow
        ctx.save();
        ctx.strokeStyle = rhythmMode === 'VFIB' || rhythmMode === 'VTACH' ? '#ff453a' : '#30d158';
        ctx.shadowColor = rhythmMode === 'VFIB' || rhythmMode === 'VTACH' ? 'rgba(255, 69, 58, 0.8)' : 'rgba(48, 209, 88, 0.8)';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(scanX, lastY);
        ctx.lineTo(nextScanX, nextY);
        ctx.stroke();
        ctx.restore();

        // Glowing sweep head cursor dot
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#30d158';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(nextScanX, nextY, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        lastY = nextY;
        scanX = nextScanX;

        // Wrap around when reaching right boundary
        if (scanX >= width) {
          scanX = 0;
          lastY = baseline;
        }

        simStateRef.current.scanX = scanX;
        simStateRef.current.lastY = lastY;
        simStateRef.current.phase = phase;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isFrozen, sweepSpeed, rhythmMode, playQRSBeep]);

  return (
    <div 
      className="medicare-telemetry-container card"
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(28px) saturate(190%)',
        WebkitBackdropFilter: 'blur(28px) saturate(190%)',
        border: alarmStatus === 'CRITICAL' 
          ? '1px solid rgba(255, 69, 58, 0.65)' 
          : '1px solid rgba(48, 209, 88, 0.35)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: alarmStatus === 'CRITICAL' 
          ? '0 0 35px rgba(255, 69, 58, 0.25), 0 20px 40px rgba(0,0,0,0.6)' 
          : '0 0 30px rgba(48, 209, 88, 0.15), 0 20px 40px rgba(0,0,0,0.6)',
        color: '#f5f5f7',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        overflow: 'hidden',
        transition: 'border 0.3s, box-shadow 0.3s'
      }}
    >
      {/* Top Monitor Bar: Bed Selector, Alarm Badge, and Audio Toggle */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(48, 209, 88, 0.15)',
              border: '1px solid rgba(48, 209, 88, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fas fa-heartbeat" style={{ color: '#30d158', fontSize: '18px' }}></i>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.3px', color: '#ffffff' }}>
                ICU Multi-Parameter Telemetry
              </h3>
              <span 
                style={{
                  fontSize: '0.66rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  background: 'rgba(0, 216, 255, 0.12)',
                  color: '#00d8ff',
                  border: '1px solid rgba(0, 216, 255, 0.3)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                REACT 18 HOOKS • 60 FPS
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              {currentPatient.name} • {currentPatient.mrn} • {currentPatient.diagnosis}
            </span>
          </div>
        </div>

        {/* Right Bed Controls & Audio/Alarm Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Patient Bed Dropdown */}
          <select
            onChange={handlePatientSelect}
            defaultValue="BED-04"
            style={{
              background: 'rgba(28, 28, 30, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#f5f5f7',
              fontSize: '0.76rem',
              padding: '6px 10px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="BED-04">ICU Bed 04 (Vance, E.)</option>
            <option value="BED-07">ICU Bed 07 (Holloway, M.)</option>
            <option value="BED-12">ICU Bed 12 (Saravanan, D.)</option>
          </select>

          {/* Audio QRS Synth Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Mute QRS Heartbeat Audio' : 'Enable QRS Beep Audio Synth'}
            style={{
              background: audioEnabled ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: audioEnabled ? '1px solid #30d158' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: audioEnabled ? '#30d158' : '#94a3b8',
              padding: '6px 12px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className={`fas ${audioEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
            <span>{audioEnabled ? 'Beep ON' : 'Audio Muted'}</span>
          </button>

          {/* Alarm Status Badge */}
          <span 
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.5px',
              background: alarmStatus === 'CRITICAL' 
                ? 'rgba(255, 69, 58, 0.25)' 
                : alarmStatus === 'WARNING' 
                  ? 'rgba(255, 159, 10, 0.25)' 
                  : 'rgba(48, 209, 88, 0.2)',
              border: alarmStatus === 'CRITICAL' 
                ? '1px solid #ff453a' 
                : alarmStatus === 'WARNING' 
                  ? '1px solid #ff9f0a' 
                  : '1px solid #30d158',
              color: alarmStatus === 'CRITICAL' 
                ? '#ff453a' 
                : alarmStatus === 'WARNING' 
                  ? '#ff9f0a' 
                  : '#30d158',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <i className="fas fa-circle" style={{ fontSize: '6px' }}></i>
            {alarmStatus === 'CRITICAL' ? 'ALARM: CRITICAL' : alarmStatus === 'WARNING' ? 'ALARM: ADVISORY' : 'STATUS: STABLE'}
          </span>
        </div>
      </div>

      {/* Main Telemetry Body: Left Vitals Cards, Right Waveform Canvas */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '18px',
          marginTop: '16px'
        }}
      >
        {/* Left: Real-time Oscilloscope Waveform Display */}
        <div style={{ position: 'relative' }}>
          {/* Waveform Header HUD */}
          <div 
            style={{
              position: 'absolute',
              top: '10px',
              left: '12px',
              zIndex: 10,
              display: 'flex',
              gap: '12px',
              fontSize: '0.7rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255, 255, 255, 0.75)',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
            }}
          >
            <span style={{ color: '#30d158', fontWeight: 700 }}>{currentPatient.lead}</span>
            <span>25mm/s • 10mm/mV</span>
            <span>Filter: 0.05 - 40 Hz</span>
            <span>ST: +0.02 mV</span>
          </div>

          {/* Freeze Mode Badge */}
          {isFrozen && (
            <div 
              style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                zIndex: 10,
                background: 'rgba(255, 159, 10, 0.85)',
                color: '#000000',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              FREEZE INSPECTION
            </div>
          )}

          {/* 60Hz Canvas Element */}
          <div 
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(48, 209, 88, 0.25)',
              background: '#050c09',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.85)'
            }}
          >
            <canvas
              ref={canvasRef}
              width={720}
              height={230}
              style={{
                width: '100%',
                height: '230px',
                display: 'block'
              }}
            />
          </div>

          {/* Canvas Bottom Control Bar: Rhythm Selector & Freeze/Speed */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
              gap: '10px',
              flexWrap: 'wrap'
            }}
          >
            {/* Arrhythmia Simulation Buttons */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginRight: '4px' }}>Rhythm:</span>
              {[
                { label: 'Normal (NSR)', id: 'NSR' },
                { label: 'Tachycardia', id: 'TACHY' },
                { label: 'Bradycardia', id: 'BRADY' },
                { label: 'V-Tach', id: 'VTACH' },
                { label: 'V-Fib', id: 'VFIB' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleRhythmChange(item.id)}
                  style={{
                    padding: '4px 9px',
                    fontSize: '0.68rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    borderRadius: '6px',
                    border: rhythmMode === item.id 
                      ? '1px solid #38bdf8' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: rhythmMode === item.id 
                      ? 'rgba(56, 189, 248, 0.25)' 
                      : 'rgba(255, 255, 255, 0.04)',
                    color: rhythmMode === item.id ? '#38bdf8' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Sweep & Freeze Toggles */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSweepSpeed(sweepSpeed === 25 ? 50 : 25)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#f5f5f7',
                  cursor: 'pointer'
                }}
              >
                Speed: {sweepSpeed}mm/s
              </button>

              <button
                onClick={() => setIsFrozen(!isFrozen)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: isFrozen ? '#ff9f0a' : 'rgba(255, 255, 255, 0.06)',
                  border: isFrozen ? '1px solid #ff9f0a' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isFrozen ? '#000000' : '#f5f5f7',
                  cursor: 'pointer'
                }}
              >
                <i className={`fas ${isFrozen ? 'fa-play' : 'fa-pause'}`} style={{ marginRight: '4px' }}></i>
                {isFrozen ? 'Resume Stream' : 'Freeze'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Numerical Vitals HUD Cards */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {/* Heart Rate Card */}
          <div 
            style={{
              background: 'rgba(28, 28, 30, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i 
                  className="fas fa-heart" 
                  style={{
                    color: '#ff453a',
                    transform: qrsBeatTrigger ? 'scale(1.35)' : 'scale(1)',
                    transition: 'transform 0.12s ease-out'
                  }}
                ></i>
                <span style={{ fontSize: '0.72rem', color: '#98989d', fontWeight: 600 }}>PULSE / HR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span 
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: rhythmMode === 'VFIB' || rhythmMode === 'VTACH' ? '#ff453a' : '#30d158'
                  }}
                >
                  {Math.round(heartRate)}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6e6e73' }}>BPM</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.64rem', color: '#6e6e73', display: 'block' }}>Target</span>
              <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", color: '#98989d' }}>60 - 100</span>
            </div>
          </div>

          {/* SpO2 Blood Oxygen Card */}
          <div 
            style={{
              background: 'rgba(28, 28, 30, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fas fa-lungs" style={{ color: '#00d8ff' }}></i>
                <span style={{ fontSize: '0.72rem', color: '#98989d', fontWeight: 600 }}>SpO2 SAT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span 
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: spo2 < 92 ? '#ff453a' : '#00d8ff'
                  }}
                >
                  {spo2.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6e6e73' }}>%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.64rem', color: '#6e6e73', display: 'block' }}>Pleth PI</span>
              <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", color: '#00d8ff' }}>4.4%</span>
            </div>
          </div>

          {/* Blood Pressure (NIBP) Card */}
          <div 
            style={{
              background: 'rgba(28, 28, 30, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fas fa-stethoscope" style={{ color: '#ff9f0a' }}></i>
                <span style={{ fontSize: '0.72rem', color: '#98989d', fontWeight: 600 }}>NIBP (mmHg)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span 
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#ff9f0a'
                  }}
                >
                  {bloodPressure.sys}/{bloodPressure.dia}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#6e6e73' }}>MAP ({bloodPressure.map})</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.64rem', color: '#6e6e73', display: 'block' }}>Auto 15m</span>
              <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: '#98989d' }}>CUFF: OK</span>
            </div>
          </div>

          {/* Respiration & Temperature Quick Dual Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div 
              style={{
                background: 'rgba(28, 28, 30, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '8px 10px'
              }}
            >
              <span style={{ fontSize: '0.64rem', color: '#98989d', display: 'block' }}>RESP (rpm)</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: '#bf5af2' }}>
                {respiration}
              </span>
            </div>

            <div 
              style={{
                background: 'rgba(28, 28, 30, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '8px 10px'
              }}
            >
              <span style={{ fontSize: '0.64rem', color: '#98989d', display: 'block' }}>TEMP (°C)</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8' }}>
                {temperature.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
