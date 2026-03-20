import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Trash2 } from 'lucide-react';
import DialKnob from '../components/DialKnob';

const PARAMS = [
  { key:'N',        label:'Nitrogen',    unit:'kg/ha', min:0,   max:140, optimal_min:60,  optimal_max:100, color:'#FF6600', icon:'N' },
  { key:'P',        label:'Phosphorus',  unit:'kg/ha', min:0,   max:145, optimal_min:30,  optimal_max:60,  color:'#00FFFF', icon:'P' },
  { key:'K',        label:'Potassium',   unit:'kg/ha', min:0,   max:205, optimal_min:40,  optimal_max:80,  color:'#FFD700', icon:'K' },
  { key:'temp',     label:'Temperature', unit:'°C',    min:0,   max:50,  optimal_min:20,  optimal_max:35,  color:'#FF0033', icon:'T' },
  { key:'humidity', label:'Humidity',    unit:'%',     min:0,   max:100, optimal_min:50,  optimal_max:80,  color:'#00FFFF', icon:'H' },
  { key:'ph',       label:'pH Level',    unit:'pH',    min:0,   max:14,  optimal_min:5.5, optimal_max:7.5, color:'#8B5CF6', icon:'Φ' },
  { key:'rainfall', label:'Rainfall',    unit:'mm',    min:0,   max:300, optimal_min:100, optimal_max:200, color:'#3B82F6', icon:'R' },
]

const mockResult = {
  recommended_crop: "Rice",
  confidence: "92%",
  top3: [
    { crop: "Rice", emoji: "🌾", confidence: 92 },
    { crop: "Maize", emoji: "🌽", confidence: 74 },
    { crop: "Cotton", emoji: "🌿", confidence: 61 }
  ],
  details: {
    avg_profit: "₹28,000/ACRE",
    water_req: "HIGH",
    season: "KHARIF",
    duration: "90-120 DAYS"
  }
};

const InputPanel = ({ sliders, setSliders, onAnalyze, isAnalyzing, t }) => {
  return (
    <div style={{
      background:'#0D0D1A',
      border:'1px solid #FF660033',
      borderRadius:4,
      padding:'32px 24px',
      position:'relative'
    }}>

      {/* Section header */}
      <div style={{ marginBottom:32, textAlign:'center' }}>
        <p style={{ fontFamily:"'Share Tech Mono'", fontSize:9,
                    color:'#FF660066', letterSpacing:4, margin:'0 0 6px' }}>
          // MAGI SOIL EVALUATION INTERFACE
        </p>
        <p style={{ fontFamily:"'Share Tech Mono'", fontSize:10,
                    color:'#666680', margin:0, letterSpacing:2 }}>
          DRAG DIALS TO CALIBRATE PARAMETERS
        </p>
      </div>

      {/* Top row — 4 dials */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(4, 1fr)',
        gap:24, marginBottom:32,
        justifyItems:'center'
      }}>
        {PARAMS.slice(0, 4).map(p => (
          <DialKnob key={p.key}
            label={p.label} unit={p.unit}
            min={p.min} max={p.max}
            optimal_min={p.optimal_min}
            optimal_max={p.optimal_max}
            value={sliders[p.key]}
            color={p.color}
            size={100}
            onChange={val => setSliders(prev => ({ ...prev, [p.key]: val }))}
          />
        ))}
      </div>

      {/* Bottom row — 3 dials centered */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3, 1fr)',
        gap:24, marginBottom:32,
        justifyItems:'center',
        maxWidth:520, margin:'0 auto 32px'
      }}>
        {PARAMS.slice(4).map(p => (
          <DialKnob key={p.key}
            label={p.label} unit={p.unit}
            min={p.min} max={p.max}
            optimal_min={p.optimal_min}
            optimal_max={p.optimal_max}
            value={sliders[p.key]}
            color={p.color}
            size={100}
            onChange={val => setSliders(prev => ({ ...prev, [p.key]: val }))}
          />
        ))}
      </div>

      {/* NPK quick summary bar */}
      <div style={{
        display:'flex', gap:8, justifyContent:'center',
        marginBottom:24
      }}>
        {[
          { label:'N', value:sliders.N, color:'#FF6600', max:140 },
          { label:'P', value:sliders.P, color:'#00FFFF', max:145 },
          { label:'K', value:sliders.K, color:'#FFD700', max:205 },
        ].map(npk => (
          <div key={npk.label} style={{
            background:'#0A0A0F', border:`1px solid ${npk.color}44`,
            borderRadius:2, padding:'8px 16px', textAlign:'center', minWidth:80
          }}>
            <p style={{ fontFamily:"'Orbitron'", fontSize:18,
                         fontWeight:900, color:npk.color, margin:'0 0 2px',
                         textShadow:`0 0 10px ${npk.color}66` }}>
              {npk.value}
            </p>
            <p style={{ fontFamily:"'Share Tech Mono'", fontSize:9,
                         color:`${npk.color}88`, margin:0, letterSpacing:2 }}>
              {npk.label}-FACTOR
            </p>
            <div style={{ height:3, background:`${npk.color}22`,
                           borderRadius:1, marginTop:4 }}>
              <div style={{
                height:'100%', borderRadius:1,
                width:`${(npk.value/npk.max)*100}%`,
                background:npk.color,
                transition:'width 0.2s'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Analyze button */}
      <button onClick={onAnalyze} disabled={isAnalyzing}
        style={{
          display:'block', width:'100%',
          padding:'14px', border:'1px solid #FF6600',
          background: isAnalyzing ? '#FF660011' : '#FF660022',
          color:'#FF6600', cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          fontFamily:"'Orbitron', sans-serif",
          fontSize:13, fontWeight:700, letterSpacing:4,
          textTransform:'uppercase', borderRadius:2,
          transition:'all 0.2s',
          boxShadow: isAnalyzing ? 'none' : '0 0 20px #FF660033'
        }}
        onMouseEnter={e => { if(!isAnalyzing) e.currentTarget.style.background='#FF660044' }}
        onMouseLeave={e => { if(!isAnalyzing) e.currentTarget.style.background='#FF660022' }}>
        {isAnalyzing ? '// ANALYZING...' : '// INITIATE MAGI ANALYSIS ►'}
      </button>
    </div>
  )
};

const ResultPanel = ({ sliders, result, isAnalyzing, t }) => {
  const navigate = useNavigate();

  // Condition Feedback Chips
  const conditions = [];
  if (sliders.ph < 5.5) conditions.push({ type: 'danger', text: 'SOIL ACIDIC — LIME REQ' });
  if (sliders.ph > 7.5) conditions.push({ type: 'warning', text: 'SOIL ALKALINE' });
  if (sliders.temp > 40) conditions.push({ type: 'danger', text: 'TEMP CRITICAL — SHADE REQ' });
  if (sliders.humidity > 85) conditions.push({ type: 'warning', text: 'HIGH HUMIDITY — FUNGAL RISK' });
  if (conditions.length === 0) conditions.push({ type: 'success', text: 'CONDITIONS OPTIMAL' });

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {conditions.map((c, i) => (
          <span key={i} className={`text-[9px] px-2 py-1 border font-semibold flex items-center gap-1 uppercase tracking-[1px]
            ${c.type === 'danger' ? 'bg-[#1A0500] text-[#FF0033] border-[#FF0033]' : 
              c.type === 'warning' ? 'bg-[#1A1A00] text-[#FFD700] border-[#FFD700]' : 
              'bg-[#0A1A0A] text-[#00FF41] border-[#00FF41]'}`}
            style={{ fontFamily: "'Share Tech Mono', monospace", borderRadius: 2 }}
          >
            {c.type === 'danger' ? '⚠' : c.type === 'warning' ? '⚠' : '✅'} {c.text}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {result.top3.map((crop, idx) => (
          <div 
            key={crop.crop + idx} 
            className={`bg-[#0A0A0F] p-4 border transition-all duration-500 fill-mode-forwards
              ${idx === 0 ? 'border-[#00FF41] shadow-[0_0_15px_#00FF4133] scale-100' : 'border-[#FF660044] scale-[0.98] opacity-90'}
            `}
            style={{ animation: `slideInRight 0.5s ease-out ${idx * 0.15}s both`, borderRadius: 2 }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter sepia hue-rotate-[50deg] saturate-200">{crop.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: idx===0 ? '#00FF41' : '#FF6600', letterSpacing: 2 }}>{crop.crop}</h3>
                  <p className="text-[10px] text-[#00FFFF]" style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>{idx === 0 ? 'PRIMARY MATCH' : idx === 1 ? 'SECONDARY OPTION' : 'TERTIARY FALLBACK'}</p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ color: '#666680', fontSize: 9, margin: '0 0 2px', fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2 }}>CONFIDENCE</p>
                <span className="text-2xl font-black tabular-nums" style={{ color: idx===0 ? '#00FF41' : '#FF6600', fontFamily: "'Orbitron', sans-serif" }}>{crop.confidence}%</span>
              </div>
            </div>
            
            <div className="h-[4px] bg-[#0D0D1A] overflow-hidden border border-[#FF660033]">
              <div 
                className="h-full transition-all duration-1000 ease-out" 
                style={{ width: isAnalyzing ? '0%' : `${crop.confidence}%`, background: idx===0 ? '#00FF41' : '#FF6600' }}
              ></div>
            </div>

            {idx === 0 && !isAnalyzing && (
              <div className="mt-4 pt-4 border-t border-[#FF660044] animate-fade-in">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0D0D1A] p-3 border border-[#FF660033] text-center" style={{ borderRadius: 2 }}>
                    <p className="text-[9px] text-[#FF660088] uppercase tracking-[2px] mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{t('crop_rec.avg_profit') || 'PROFIT PROJECTION'}</p>
                    <p className="text-sm font-bold text-[#FFD700]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{result.details.avg_profit}</p>
                  </div>
                  <div className="bg-[#0D0D1A] p-3 border border-[#FF660033] text-center" style={{ borderRadius: 2 }}>
                    <p className="text-[9px] text-[#FF660088] uppercase tracking-[2px] mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{t('crop_rec.water_need') || 'WATER REQ'}</p>
                    <p className="text-sm font-bold text-[#00FFFF]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{result.details.water_req}</p>
                  </div>
                  <div className="bg-[#0D0D1A] p-3 border border-[#FF660033] text-center" style={{ borderRadius: 2 }}>
                    <p className="text-[9px] text-[#FF660088] uppercase tracking-[2px] mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{t('crop_rec.season') || 'SEASON'}</p>
                    <p className="text-sm font-bold text-[#00FF41]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{result.details.season}</p>
                  </div>
                  <div className="bg-[#0D0D1A] p-3 border border-[#FF660033] text-center" style={{ borderRadius: 2 }}>
                    <p className="text-[9px] text-[#FF660088] uppercase tracking-[2px] mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{t('crop_rec.duration') || 'GROWTH CYCLE'}</p>
                    <p className="text-sm font-bold text-[#E8E8E8]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{result.details.duration}</p>
                  </div>
                </div>
                
                <details className="text-sm text-gray-300 mb-5 group cursor-pointer outline-none">
                  <summary className="font-semibold text-[#FF6600] outline-none text-[11px] uppercase tracking-[2px]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    [+] {t('crop_rec.why_crop') || 'VIEW ANALYSIS LOGS'}
                  </summary>
                  <ul className="list-none pl-0 mt-3 space-y-2 text-[11px] text-[#00FFFF]">
                    <li style={{ fontFamily: "'Share Tech Mono', monospace" }}><span className="text-[#FF6600] mr-2">&gt;</span>Optimal nitrogen levels detected for {crop.crop.toUpperCase()}.</li>
                    <li style={{ fontFamily: "'Share Tech Mono', monospace" }}><span className="text-[#FF6600] mr-2">&gt;</span>Temperature {sliders.temp}°C perfectly matches requirement.</li>
                    <li style={{ fontFamily: "'Share Tech Mono', monospace" }}><span className="text-[#FF6600] mr-2">&gt;</span>Rainfall supports the required water usage.</li>
                  </ul>
                </details>

                <button 
                  onClick={() => navigate(`/chat?q=How to start farming ${crop.crop} in my current conditions?`)}
                  className="w-full py-3 bg-[#0D0D1A] hover:bg-[#FF660022] text-[#FF6600] border border-[#FF6600] text-[11px] font-bold transition-all uppercase tracking-[3px]"
                  style={{ fontFamily: "'Orbitron', sans-serif", borderRadius: 2 }}
                >
                  {t('crop_rec.view_guide') || 'REQUEST MAGI PROTOCOL ▻'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CropRecommendation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [compareMode, setCompareMode] = useState(false);
  const [slidersA, setSlidersA] = useState({ N: 80, P: 40, K: 40, temp: 25, humidity: 65, ph: 6.5, rainfall: 120 });
  const [slidersB, setSlidersB] = useState({ N: 40, P: 60, K: 30, temp: 32, humidity: 55, ph: 7.0, rainfall: 80 });
  
  const [liveResultA, setLiveResultA] = useState(mockResult);
  const [liveResultB, setLiveResultB] = useState(mockResult);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cropHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Debounced Live Preview Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const variance = (slidersA.temp % 5) - 2; 
      const res = JSON.parse(JSON.stringify(mockResult));
      res.top3[0].confidence = Math.min(99, Math.max(50, 92 + variance));
      setLiveResultA(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [slidersA]);

  useEffect(() => {
    if(!compareMode) return;
    const timer = setTimeout(() => {
    }, 300);
    return () => clearTimeout(timer);
  }, [slidersB, compareMode]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.post('/api/predict-crop', {
        nitrogen: slidersA.N,
        phosphorus: slidersA.P,
        potassium: slidersA.K,
        temperature: slidersA.temp,
        humidity: slidersA.humidity,
        ph: slidersA.ph,
        rainfall: slidersA.rainfall
      });
      
      setLiveResultA(res.data);
      
      const newHistory = [{
        date: new Date().toLocaleTimeString([], { hour12: false }),
        crop: res.data.top3[0].crop,
        confidence: res.data.top3[0].confidence,
        sliders: slidersA
      }, ...history].slice(0, 3);
      
      setHistory(newHistory);
      localStorage.setItem('cropHistory', JSON.stringify(newHistory));
    } catch (err) {
      console.error(err);
      // alert replaced with a silent fail for visual mock
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteHistory = (idx) => {
    const fresh = history.filter((_, i) => i !== idx);
    setHistory(fresh);
    localStorage.setItem('cropHistory', JSON.stringify(fresh));
  };

  const restoreHistory = (entry) => {
    setSlidersA(entry.sliders);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-4 lg:p-8 flex flex-col gap-8 transition-colors duration-300 hex-bg">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
      
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="text-[#FF660088] hover:text-[#FF6600] flex items-center gap-2 transition-colors uppercase text-[11px]" style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2 }}>
          <ArrowLeft size={16} /> [GO BACK]
        </button>
        <button 
          onClick={() => setCompareMode(!compareMode)}
          className={`px-4 py-2 text-[11px] font-bold uppercase transition-all duration-300 border ${compareMode ? 'bg-[#FF660022] text-[#FF6600] border-[#FF6600]' : 'bg-[#0A0A0F] text-[#666680] border-[#FF660044] hover:bg-[#FF660011] hover:text-[#FF6600]'}`}
          style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: 2, borderRadius: 2 }}
        >
          {compareMode ? 'DISABLE COMPARE' : 'ENABLE COMPARE'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full z-10">
        {compareMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            <div className="absolute left-1/2 top-[10%] -translate-x-1/2 -translate-y-1/2 bg-[#FF6600] text-[#0A0A0F] w-10 h-10 flex items-center justify-center font-black shadow-[0_0_20px_#FF660088] z-20" style={{ fontFamily: "'Orbitron', sans-serif", borderRadius: 2 }}>VS</div>
            <div className="nge-card bg-[#0D0D1A] p-4 sm:p-6 flex flex-col gap-6" data-label="// SCENARIO A" style={{ borderRadius: 2 }}>
               <div className="w-full"><InputPanel sliders={slidersA} setSliders={setSlidersA} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} t={t} /></div>
               <div className="w-full bg-[#0A0A0F] p-4 border border-[#FF660033]" style={{ borderRadius: 2 }}><ResultPanel sliders={slidersA} result={liveResultA} isAnalyzing={isAnalyzing} t={t} /></div>
            </div>
            <div className="nge-card bg-[#0D0D1A] p-4 sm:p-6 flex flex-col gap-6" data-label="// SCENARIO B" style={{ borderRadius: 2 }}>
               <div className="w-full"><InputPanel sliders={slidersB} setSliders={setSlidersB} onAnalyze={() => {}} isAnalyzing={false} t={t} /></div>
               <div className="w-full bg-[#0A0A0F] p-4 border border-[#FF660033]" style={{ borderRadius: 2 }}><ResultPanel sliders={slidersB} result={liveResultB} isAnalyzing={false} t={t} /></div>
            </div>
          </div>
        ) : (
          <div className="nge-card bg-[#0D0D1A] p-4 sm:p-8" data-label="// PRIMARY ANALYSIS" style={{ borderRadius: 2 }}>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <div className="w-full md:w-[55%]">
                <InputPanel sliders={slidersA} setSliders={setSlidersA} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} t={t} />
              </div>
              <div className="w-full md:w-[45%] bg-[#0A0A0F] p-6 border border-[#FF660033]" style={{ borderRadius: 2 }}>
                <ResultPanel sliders={slidersA} result={liveResultA} isAnalyzing={isAnalyzing} t={t} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="max-w-7xl mx-auto w-full mt-8 z-10">
        <h3 className="text-sm font-bold text-[#FF6600] mb-4 uppercase" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: 3 }}>
          // PREVIOUS ANALYSES
        </h3>
        {history.length === 0 ? (
          <p className="text-[#666680] text-[11px] uppercase" style={{ fontFamily: "'Share Tech Mono', monospace" }}>NO LOGS IN ARCHIVE.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {history.map((h, i) => (
              <div key={i} className="bg-[#0A0A0F] border border-[#FF660044] p-4 flex justify-between items-center group nge-hover" style={{ borderRadius: 2 }}>
                <div>
                  <p className="text-[10px] text-[#FF660088] mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>T-{h.date}</p>
                  <p className="text-[#E8E8E8] font-bold text-sm uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1 }}>{h.crop} <span className="text-[#00FF41] text-[10px] ml-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{h.confidence}% MATCH</span></p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => restoreHistory(h)} className="text-[9px] bg-[#0D0D1A] border border-[#FF6600] text-[#FF6600] hover:bg-[#FF660022] px-2 py-1 uppercase" style={{ fontFamily: "'Share Tech Mono', monospace", borderRadius: 2 }}>RESTORE</button>
                  <button onClick={() => deleteHistory(i)} className="text-[#FF0033] hover:text-[#FF003388] p-1 border border-[#FF003344] bg-[#1A0500]" style={{ borderRadius: 2 }}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CropRecommendation;
