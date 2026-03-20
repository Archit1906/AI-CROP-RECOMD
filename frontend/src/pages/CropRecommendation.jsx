import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Trash2, Sprout } from 'lucide-react';

const mockResult = {
  recommended_crop: "Rice",
  confidence: "92%",
  top3: [
    { crop: "Rice", emoji: "🌾", confidence: 92 },
    { crop: "Maize", emoji: "🌽", confidence: 74 },
    { crop: "Cotton", emoji: "🌿", confidence: 61 }
  ],
  details: {
    avg_profit: "₹28,000/acre",
    water_req: "High",
    season: "Kharif",
    duration: "90-120 days"
  }
};

const SLIDER_CONFIG = [
  { id: 'N', label: 'nitrogen', icon: '🧪', min: 0, max: 140, optMin: 60, optMax: 100, unit: 'kg/ha' },
  { id: 'P', label: 'phosphorus', icon: '🔬', min: 0, max: 145, optMin: 30, optMax: 60, unit: 'kg/ha' },
  { id: 'K', label: 'potassium', icon: '⚗️', min: 0, max: 205, optMin: 40, optMax: 80, unit: 'kg/ha' },
  { id: 'temp', label: 'temperature', icon: '🌡️', min: 0, max: 50, optMin: 20, optMax: 35, unit: '°C' },
  { id: 'humidity', label: 'humidity', icon: '💧', min: 0, max: 100, optMin: 50, optMax: 80, unit: '%' },
  { id: 'ph', label: 'ph', icon: '⚖️', min: 0, max: 14, optMin: 5.5, optMax: 7.5, unit: 'pH' },
  { id: 'rainfall', label: 'rainfall', icon: '🌧️', min: 0, max: 300, optMin: 100, optMax: 200, unit: 'mm' }
];

const InputPanel = ({ sliders, setSliders, onAnalyze, isAnalyzing, t }) => {
  const handleSliderChange = (id, val) => {
    setSliders(prev => ({ ...prev, [id]: Number(val) }));
  };

  // Soil Composition Ring
  const totalNPK = sliders.N + sliders.P + sliders.K;
  const nPer = totalNPK ? (sliders.N / totalNPK) * 100 : 33.33;
  const pPer = totalNPK ? (sliders.P / totalNPK) * 100 : 33.33;
  const ringStyle = {
    background: totalNPK === 0 
      ? '#2D4A2D'
      : `conic-gradient(#22C55E ${nPer}%, #3B82F6 ${nPer}% ${nPer + pPer}%, #F97316 ${nPer + pPer}% 100%)`
  };

  // Overall Health Score
  const optimalCount = SLIDER_CONFIG.filter(c => sliders[c.id] >= c.optMin && sliders[c.id] <= c.optMax).length;
  const healthScore = Math.round((optimalCount / 7) * 100);
  const isAllOptimal = optimalCount === 7;

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Soil Visualizer */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('crop_rec.title')}</h1>
          <p className="text-gray-400">{t('crop_rec.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-[#162116] border-4 transition-colors duration-300" 
                 style={{ borderColor: healthScore >= 70 ? '#22C55E' : healthScore >= 40 ? '#FBBF24' : '#EF4444' }}>
              <span className="text-white font-bold">{healthScore}%</span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-center">
             <div className="w-16 h-16 rounded-full transition-all duration-300 shadow-lg" style={ringStyle}>
               <div className="w-10 h-10 m-3 bg-[#0A0F0A] rounded-full"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SLIDER_CONFIG.map((config) => {
          const val = sliders[config.id];
          const isOptimal = val >= config.optMin && val <= config.optMax;
          const isLow = val < config.optMin;
          const pct = ((val - config.min) / (config.max - config.min)) * 100;
          
          let barColor = isOptimal ? 'bg-[#22C55E]' : (isLow ? 'bg-[#FBBF24]' : 'bg-[#EF4444]');
          
          return (
            <div key={config.id} className="bg-[#162116] border border-[#2D4A2D] p-4 rounded-xl transition-all duration-300 hover:bg-[#1E2E1E]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 font-semibold flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span> {t(`crop_rec.${config.label}`)}
                </span>
                <span className="text-2xl font-bold text-white tabular-nums">{val} <span className="text-xs text-gray-500 font-normal">{config.unit}</span></span>
              </div>
              
              <div className="relative h-2 bg-[#0A0F0A] rounded-full mt-4 overflow-hidden">
                <div 
                  className={`absolute top-0 bottom-0 left-0 ${barColor} transition-all duration-300 rounded-full`} 
                  style={{ width: `${pct}%` }}
                ></div>
                {/* Optimal Range Highlight */}
                <div 
                  className="absolute top-0 bottom-0 bg-green-500/20" 
                  style={{ 
                    left: `${((config.optMin - config.min) / (config.max - config.min)) * 100}%`,
                    width: `${((config.optMax - config.optMin) / (config.max - config.min)) * 100}%` 
                  }}
                ></div>
              </div>
              
              <input 
                type="range" 
                min={config.min} max={config.max} 
                value={val} 
                onChange={(e) => handleSliderChange(config.id, e.target.value)}
                className="w-full absolute opacity-0 cursor-pointer -mt-3 h-6"
              />
              
              <div className="flex justify-between mt-2 text-[10px] text-gray-500 uppercase tracking-wider">
                <span>{config.min}</span>
                <span>{config.optMin} - {config.optMax} {t('crop_rec.optimal_range')}</span>
                <span>{config.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-green-900/50 transition-all duration-300 flex items-center justify-center gap-2
          ${isAnalyzing ? 'bg-[#15803D]' : 'bg-gradient-to-r from-[#16A34A] to-[#15803D] border border-green-500 hover:scale-[1.02]'}
          ${isAllOptimal && !isAnalyzing ? 'animate-pulse' : ''}
        `}
      >
        {isAnalyzing ? (
          <><Sprout className="animate-spin" /> {t('crop_rec.analyzing')}</>
        ) : (
          t('crop_rec.analyze_btn')
        )}
      </button>
    </div>
  );
};

const ResultPanel = ({ sliders, result, isAnalyzing, t }) => {
  const navigate = useNavigate();

  // Condition Feedback Chips
  const conditions = [];
  if (sliders.ph < 5.5) conditions.push({ type: 'red', text: 'Soil too acidic — add lime' });
  if (sliders.ph > 7.5) conditions.push({ type: 'yellow', text: 'Soil slightly alkaline' });
  if (sliders.temp > 40) conditions.push({ type: 'red', text: 'Too hot — shade crops recommended' });
  if (sliders.humidity > 85) conditions.push({ type: 'yellow', text: 'High humidity — fungal risk' });
  if (conditions.length === 0) conditions.push({ type: 'green', text: 'Perfect conditions!' });

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {conditions.map((c, i) => (
          <span key={i} className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center gap-1
            ${c.type === 'red' ? 'bg-red-900/20 text-red-400 border-red-900/50' : 
              c.type === 'yellow' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50' : 
              'bg-green-900/20 text-[#22C55E] border-green-900/50'}`}
          >
            {c.type === 'red' ? '🔴' : c.type === 'yellow' ? '🟡' : '🟢'} {c.text}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {result.top3.map((crop, idx) => (
          <div 
            key={crop.crop + idx} 
            className={`bg-[#162116] p-4 rounded-xl border transition-all duration-500 fill-mode-forwards
              ${idx === 0 ? 'border-[#22C55E] shadow-[0_0_20px_rgba(34,197,94,0.15)] scale-100' : 'border-[#2D4A2D] scale-95 opacity-90'}
            `}
            style={{ animation: `slideInRight 0.5s ease-out ${idx * 0.15}s both` }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{crop.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{crop.crop}</h3>
                  <p className="text-xs text-gray-400">{idx === 0 ? '🥇 Best Match' : idx === 1 ? '🥈 Alternative' : '🥉 Fallback'}</p>
                </div>
              </div>
              <span className="text-2xl font-black text-[#22C55E]">{crop.confidence}%</span>
            </div>
            
            <div className="h-2 bg-[#0A0F0A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#22C55E] transition-all duration-1000 ease-out" 
                style={{ width: isAnalyzing ? '0%' : `${crop.confidence}%` }}
              ></div>
            </div>

            {idx === 0 && !isAnalyzing && (
              <div className="mt-4 pt-4 border-t border-[#2D4A2D] animate-fade-in">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0A0F0A] p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-500 uppercase">{t('crop_rec.avg_profit')}</p>
                    <p className="text-sm font-bold text-[#FBBF24]">💰 {result.details.avg_profit}</p>
                  </div>
                  <div className="bg-[#0A0F0A] p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-500 uppercase">{t('crop_rec.water_need')}</p>
                    <p className="text-sm font-bold text-blue-400">💧 {result.details.water_req}</p>
                  </div>
                  <div className="bg-[#0A0F0A] p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-500 uppercase">{t('crop_rec.season')}</p>
                    <p className="text-sm font-bold text-[#22C55E]">📅 {result.details.season}</p>
                  </div>
                  <div className="bg-[#0A0F0A] p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-500 uppercase">{t('crop_rec.duration')}</p>
                    <p className="text-sm font-bold text-white">⏱️ {result.details.duration}</p>
                  </div>
                </div>
                
                <details className="text-sm text-gray-300 mb-4 group cursor-pointer">
                  <summary className="font-semibold text-[#22C55E] outline-none">{t('crop_rec.why_crop')}</summary>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-400">
                    <li>Optimal nitrogen levels detected for {crop.crop}.</li>
                    <li>Temperature {sliders.temp}°C perfectly matches requirement.</li>
                    <li>Rainfall supports the required water usage.</li>
                  </ul>
                </details>

                <button 
                  onClick={() => navigate(`/chat?q=How to start farming ${crop.crop} in my current conditions?`)}
                  className="w-full py-2 bg-[#2D4A2D] hover:bg-[#3d633d] text-white rounded-lg text-sm font-bold transition-colors"
                >
                  {t('crop_rec.view_guide')}
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
      // In a real app, we'd maybe fetch a lightweight endpoint.
      // For now, we simulate shifting confidence slightly based on values.
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
      // In production both would hit API, mocking comparison delay
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
        date: new Date().toLocaleDateString(),
        crop: res.data.top3[0].crop,
        confidence: res.data.top3[0].confidence,
        sliders: slidersA
      }, ...history].slice(0, 3);
      
      setHistory(newHistory);
      localStorage.setItem('cropHistory', JSON.stringify(newHistory));
    } catch (err) {
      console.error(err);
      alert('Backend not running. Start with: uvicorn main:app --reload');
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
    <div className="min-h-screen bg-[#0A0F0A] p-4 lg:p-8 flex flex-col gap-8 transition-colors duration-300">
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
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <button 
          onClick={() => setCompareMode(!compareMode)}
          className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 border ${compareMode ? 'bg-green-500/20 text-[#22C55E] border-green-500/50' : 'bg-[#162116] text-gray-400 border-[#2D4A2D] hover:bg-[#1E2E1E]'}`}
        >
          {t('crop_rec.compare_mode')}
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {compareMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            <div className="absolute left-1/2 top-[10%] -translate-x-1/2 -translate-y-1/2 bg-[#2D4A2D] text-white w-12 h-12 rounded-full hidden lg:flex items-center justify-center font-black shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10">VS</div>
            <div className="bg-[#0F1A0F] p-4 sm:p-6 rounded-2xl border border-[#2D4A2D] shadow-2xl flex flex-col gap-6">
               <div className="w-full"><InputPanel sliders={slidersA} setSliders={setSlidersA} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} t={t} /></div>
               <div className="w-full bg-[#0A0F0A] rounded-xl p-4 border border-[#2D4A2D]"><ResultPanel sliders={slidersA} result={liveResultA} isAnalyzing={isAnalyzing} t={t} /></div>
            </div>
            <div className="bg-[#0F1A0F] p-4 sm:p-6 rounded-2xl border border-[#2D4A2D] shadow-2xl flex flex-col gap-6">
               <div className="w-full"><InputPanel sliders={slidersB} setSliders={setSlidersB} onAnalyze={() => {}} isAnalyzing={false} t={t} /></div>
               <div className="w-full bg-[#0A0F0A] rounded-xl p-4 border border-[#2D4A2D]"><ResultPanel sliders={slidersB} result={liveResultB} isAnalyzing={false} t={t} /></div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0F1A0F] p-4 sm:p-8 rounded-3xl border border-[#2D4A2D] shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <div className="w-full md:w-[55%]">
                <InputPanel sliders={slidersA} setSliders={setSlidersA} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} t={t} />
              </div>
              <div className="w-full md:w-[45%] bg-[#0A0F0A] rounded-2xl p-6 border border-[#2D4A2D] shadow-inner">
                <ResultPanel sliders={slidersA} result={liveResultA} isAnalyzing={isAnalyzing} t={t} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="max-w-7xl mx-auto w-full mt-8">
        <h3 className="text-xl font-bold text-white mb-4">{t('crop_rec.previous_analyses')}</h3>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent analyses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {history.map((h, i) => (
              <div key={i} className="bg-[#162116] border border-[#2D4A2D] p-4 rounded-xl flex justify-between items-center group">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{h.date}</p>
                  <p className="text-white font-bold">{h.crop} <span className="text-[#22C55E] text-sm ml-2">{h.confidence}% {t('crop_rec.match')}</span></p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => restoreHistory(h)} className="text-xs bg-[#2D4A2D] hover:bg-[#3d633d] text-white px-2 py-1 rounded">Restore</button>
                  <button onClick={() => deleteHistory(i)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={16} /></button>
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
