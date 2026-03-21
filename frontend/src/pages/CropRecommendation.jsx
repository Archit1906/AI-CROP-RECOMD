import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IndiaMap from '../components/IndiaMap'
import { SOIL_DATA } from '../data/soilData'
import api from '../api/axios'

const CROP_INFO = {
  rice:        { emoji:'🌾', profit:'₹28,000/acre', season:'Kharif',  water:'High'   },
  wheat:       { emoji:'🌿', profit:'₹22,000/acre', season:'Rabi',    water:'Medium' },
  maize:       { emoji:'🌽', profit:'₹18,000/acre', season:'Kharif',  water:'Medium' },
  cotton:      { emoji:'🌱', profit:'₹35,000/acre', season:'Kharif',  water:'Medium' },
  sugarcane:   { emoji:'🎋', profit:'₹45,000/acre', season:'Annual',  water:'High'   },
  jute:        { emoji:'🌿', profit:'₹20,000/acre', season:'Kharif',  water:'High'   },
  coffee:      { emoji:'☕', profit:'₹75,000/acre', season:'Annual',  water:'High'   },
  coconut:     { emoji:'🥥', profit:'₹40,000/acre', season:'Annual',  water:'High'   },
  banana:      { emoji:'🍌', profit:'₹60,000/acre', season:'Annual',  water:'High'   },
  mango:       { emoji:'🥭', profit:'₹70,000/acre', season:'Annual',  water:'Medium' },
  chickpea:    { emoji:'🫘', profit:'₹22,000/acre', season:'Rabi',    water:'Low'    },
  lentil:      { emoji:'🫘', profit:'₹21,000/acre', season:'Rabi',    water:'Low'    },
  mungbean:    { emoji:'🌿', profit:'₹16,000/acre', season:'Kharif',  water:'Low'    },
  blackgram:   { emoji:'🫘', profit:'₹17,000/acre', season:'Kharif',  water:'Low'    },
  pomegranate: { emoji:'🍎', profit:'₹80,000/acre', season:'Annual',  water:'Low'    },
  grapes:      { emoji:'🍇', profit:'₹90,000/acre', season:'Annual',  water:'Medium' },
  watermelon:  { emoji:'🍉', profit:'₹30,000/acre', season:'Summer',  water:'Medium' },
  papaya:      { emoji:'🍈', profit:'₹50,000/acre', season:'Annual',  water:'High'   },
  orange:      { emoji:'🍊', profit:'₹65,000/acre', season:'Annual',  water:'Medium' },
}

export default function CropRecommendation() {
  const [selectedState, setSelectedState] = useState(null)
  const [weather,       setWeather]       = useState(null)
  const [soil,          setSoil]          = useState(null)
  const [result,        setResult]        = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [loadPhase,     setLoadPhase]     = useState('')
  const [history,       setHistory]       = useState([])
  const [error,         setError]         = useState(null)

  const LOAD_PHASES = [
    '// LOCATING STATE COORDINATES...',
    '// FETCHING ATMOSPHERIC DATA...',
    '// RETRIEVING SOIL COMPOSITION...',
    '// RUNNING MAGI ANALYSIS...',
    '// GENERATING RECOMMENDATION...',
  ]

  const handleStateSelect = useCallback(async (stateName) => {
    if (!stateName) return
    setSelectedState(stateName)
    setLoading(true)
    setResult(null)
    setError(null)
    setWeather(null)
    setSoil(null)

    try {
      // Phase 1 — locate
      setLoadPhase(LOAD_PHASES[0])
      await new Promise(r => setTimeout(r, 400))

      // Phase 2 — weather
      setLoadPhase(LOAD_PHASES[1])
      let weatherData
      try {
        const wRes = await api.get(`/api/weather/state/${encodeURIComponent(stateName)}`)
        weatherData = wRes.data
      } catch {
        // Fallback mock weather
        const soil = SOIL_DATA[stateName] || {}
        const regionWeather = {
          coastal:      { temperature:28, humidity:78, rainfall:180 },
          gangetic:     { temperature:26, humidity:70, rainfall:120 },
          northeastern: { temperature:22, humidity:85, rainfall:220 },
          himalayan:    { temperature:12, humidity:60, rainfall:150 },
          central:      { temperature:30, humidity:55, rainfall:90  },
          western:      { temperature:32, humidity:50, rainfall:70  },
          southern:     { temperature:29, humidity:72, rainfall:130 },
          arid:         { temperature:35, humidity:25, rainfall:30  },
          eastern:      { temperature:27, humidity:75, rainfall:160 },
        }
        weatherData = regionWeather[soil.region] || regionWeather.central
      }
      setWeather(weatherData)
      await new Promise(r => setTimeout(r, 400))

      // Phase 3 — soil
      setLoadPhase(LOAD_PHASES[2])
      const soilData = SOIL_DATA[stateName] || {
        N:80, P:40, K:50, ph:7.0, region:'central'
      }
      setSoil(soilData)
      await new Promise(r => setTimeout(r, 400))

      // Phase 4 — predict
      setLoadPhase(LOAD_PHASES[3])
      const predRes = await api.post('/api/predict-crop', {
        nitrogen:    soilData.N,
        phosphorus:  soilData.P,
        potassium:   soilData.K,
        temperature: weatherData.temperature,
        humidity:    weatherData.humidity,
        ph:          soilData.ph,
        rainfall:    weatherData.rainfall,
      })

      setLoadPhase(LOAD_PHASES[4])
      await new Promise(r => setTimeout(r, 300))

      const prediction = predRes.data
      setResult(prediction)

      // Save to history
      setHistory(prev => [{
        state:      stateName,
        crop:       prediction.recommended_crop,
        confidence: prediction.confidence,
        time:       new Date().toLocaleTimeString('en-IN')
      }, ...prev].slice(0, 5))

    } catch (err) {
      setError(`Analysis failed for ${stateName}. Check backend connection.`)
    } finally {
      setLoading(false)
      setLoadPhase('')
    }
  }, [])

  const cropKey  = result?.recommended_crop?.toLowerCase().replace(/\s/g,'')
  const cropInfo = CROP_INFO[cropKey] || { emoji:'🌱', profit:'N/A', season:'N/A', water:'N/A' }

  return (
    <div style={{ padding:24, background:'#0A0A0F', minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ marginBottom:20, paddingBottom:16,
                    borderBottom:'1px solid #FF660022' }}>
        <p style={{ fontFamily:"'Courier New'", fontSize:9,
                     color:'#FF660066', letterSpacing:4, margin:'0 0 6px' }}>
          // MAGI CROP ANALYSIS SYSTEM
        </p>
        <h1 style={{ fontFamily:"'Orbitron'", fontSize:24, fontWeight:900,
                     color:'#FF6600', margin:0, letterSpacing:4,
                     textShadow:'0 0 20px #FF660066' }}>
          CROP RECOMMENDATION
        </h1>
        <p style={{ fontFamily:"'Courier New'", fontSize:10,
                     color:'#666680', margin:'4px 0 0', letterSpacing:2 }}>
          SELECT A STATE ON THE MAP TO BEGIN ANALYSIS
        </p>
      </div>

      {/* Main layout */}
      <div style={{ display:'grid',
                    gridTemplateColumns: window.innerWidth < 1000 ? '1fr' : '440px 1fr',
                    gap:20, alignItems:'start' }}>

        {/* LEFT — India Map */}
        <div style={{ background:'#0D0D1A',
                      border:'1px solid #FF660033',
                      borderRadius:4, padding:16 }}>

          <p style={{ fontFamily:"'Courier New'", fontSize:9,
                       color:'#FF660066', letterSpacing:3, margin:'0 0 12px' }}>
            // SELECT TARGET STATE
          </p>

          {/* Map */}
          <div style={{ display:'flex', justifyContent:'center' }}>
            <IndiaMap
              onStateSelect={handleStateSelect}
              selectedState={selectedState}
              activeStates={history.map(h => h.state)}
            />
          </div>

          {/* Selected state label */}
          {selectedState && (
            <div style={{ marginTop:12, padding:'8px 12px',
                          background:'#FF660011',
                          border:'1px solid #FF660033',
                          borderRadius:2, textAlign:'center' }}>
              <p style={{ fontFamily:"'Courier New'", fontSize:8,
                           color:'#FF660066', letterSpacing:3, margin:'0 0 2px' }}>
                // TARGET ACQUIRED
              </p>
              <p style={{ fontFamily:"'Orbitron'", fontSize:14,
                           color:'#FF6600', margin:0, fontWeight:700,
                           letterSpacing:3 }}>
                {selectedState.toUpperCase()}
              </p>
            </div>
          )}

          {/* Scan history */}
          {history.length > 0 && (
            <div style={{ marginTop:12 }}>
              <p style={{ fontFamily:"'Courier New'", fontSize:8,
                           color:'#FF660044', letterSpacing:3, margin:'0 0 6px' }}>
                // RECENT ANALYSES
              </p>
              {history.map((h, i) => (
                <div key={i}
                  onClick={() => handleStateSelect(h.state)}
                  style={{ display:'flex', justifyContent:'space-between',
                           padding:'5px 8px', marginBottom:3,
                           background: h.state===selectedState ? '#FF660011' : 'transparent',
                           border:'1px solid #FF660011',
                           borderRadius:1, cursor:'pointer',
                           transition:'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#FF660033'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='#FF660011'}>
                  <span style={{ fontFamily:"'Courier New'", fontSize:9,
                                  color:'#FF6600' }}>
                    {h.state}
                  </span>
                  <span style={{ fontFamily:"'Courier New'", fontSize:9,
                                  color:'#666680' }}>
                    {h.crop} // {h.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Results panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

          {/* Loading state */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity:0, y:-10 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0 }}
                style={{ background:'#0D0D1A',
                         border:'1px solid #FF660033',
                         borderRadius:4, padding:20 }}>
                <p style={{ fontFamily:"'Courier New'", fontSize:9,
                             color:'#FF660066', letterSpacing:3, margin:'0 0 16px' }}>
                  // MAGI ANALYSIS IN PROGRESS
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:12,
                              marginBottom:16 }}>
                  <div style={{ width:32, height:32,
                                border:'2px solid #FF660033',
                                borderTop:'2px solid #FF6600',
                                borderRadius:'50%',
                                animation:'spin 0.8s linear infinite' }} />
                  <p style={{ fontFamily:"'Courier New'", fontSize:11,
                               color:'#FF6600', margin:0, letterSpacing:1 }}>
                    {loadPhase}
                  </p>
                </div>
                {/* Phase progress dots */}
                <div style={{ display:'flex', gap:6 }}>
                  {LOAD_PHASES.map((p, i) => (
                    <div key={i} style={{
                      flex:1, height:2, borderRadius:1,
                      background: loadPhase === p ? '#FF6600' :
                                  LOAD_PHASES.indexOf(loadPhase) > i
                                    ? '#FF660044' : '#FF660011',
                      transition:'all 0.3s'
                    }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div style={{ background:'#2D0A0A', border:'1px solid #FF0033',
                          borderRadius:4, padding:16 }}>
              <p style={{ fontFamily:"'Courier New'", color:'#FF0033',
                           fontSize:11, margin:0, letterSpacing:1 }}>
                ⚠ {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !result && !error && (
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              style={{ background:'#0D0D1A',
                       border:'1px solid #FF660022',
                       borderRadius:4, padding:40,
                       textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16, opacity:0.2 }}>🗺️</div>
              <p style={{ fontFamily:"'Orbitron'", fontSize:14,
                           color:'#FF660033', letterSpacing:4, margin:'0 0 8px' }}>
                AWAITING STATE SELECTION
              </p>
              <p style={{ fontFamily:"'Courier New'", fontSize:10,
                           color:'#444', letterSpacing:2, margin:0 }}>
                CLICK ANY STATE ON THE MAP TO BEGIN
              </p>
            </motion.div>
          )}

          {/* Weather + Soil data cards */}
          <AnimatePresence>
            {weather && soil && !loading && (
              <motion.div
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.4 }}>

                {/* Data cards row */}
                <div style={{ display:'grid',
                              gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',
                              gap:10, marginBottom:12 }}>

                  {/* Weather card */}
                  <div style={{ background:'#0D0D1A',
                                border:'1px solid #00FFFF33',
                                borderTop:'2px solid #00FFFF',
                                borderRadius:2, padding:'12px' }}>
                    <p style={{ fontFamily:"'Courier New'", fontSize:8,
                                 color:'#00FFFF66', letterSpacing:3, margin:'0 0 10px' }}>
                      // ATMOSPHERIC DATA
                    </p>
                    {[
                      { label:'TEMPERATURE', value:`${weather.temperature}°C`, icon:'🌡️' },
                      { label:'HUMIDITY',    value:`${weather.humidity}%`,     icon:'💧' },
                      { label:'RAINFALL',    value:`${weather.rainfall}mm`,    icon:'🌧️' },
                    ].map(item => (
                      <div key={item.label} style={{ marginBottom:8 }}>
                        <p style={{ fontFamily:"'Courier New'", fontSize:7,
                                     color:'#666680', letterSpacing:2, margin:'0 0 2px' }}>
                          {item.label}
                        </p>
                        <p style={{ fontFamily:"'Orbitron'", fontSize:14,
                                     fontWeight:700, color:'#00FFFF',
                                     margin:0, letterSpacing:1 }}>
                          {item.icon} {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Soil NPK card */}
                  <div style={{ background:'#0D0D1A',
                                border:'1px solid #FF660033',
                                borderTop:'2px solid #FF6600',
                                borderRadius:2, padding:'12px' }}>
                    <p style={{ fontFamily:"'Courier New'", fontSize:8,
                                 color:'#FF660066', letterSpacing:3, margin:'0 0 10px' }}>
                      // SOIL COMPOSITION
                    </p>
                    {[
                      { label:'NITROGEN (N)',    value:`${soil.N} kg/ha`,  color:'#FF6600' },
                      { label:'PHOSPHORUS (P)',  value:`${soil.P} kg/ha`,  color:'#00FFFF' },
                      { label:'POTASSIUM (K)',   value:`${soil.K} kg/ha`,  color:'#FFD700' },
                      { label:'pH LEVEL',        value:soil.ph,            color:'#8B5CF6' },
                    ].map(item => (
                      <div key={item.label} style={{ marginBottom:6 }}>
                        <p style={{ fontFamily:"'Courier New'", fontSize:7,
                                     color:'#666680', letterSpacing:2, margin:'0 0 1px' }}>
                          {item.label}
                        </p>
                        <p style={{ fontFamily:"'Orbitron'", fontSize:12,
                                     fontWeight:700, color:item.color, margin:0 }}>
                          {item.value}
                        </p>
                        <div style={{ height:2, background:'#FF660011',
                                       borderRadius:1, marginTop:2 }}>
                          <div style={{
                            height:'100%', borderRadius:1,
                            background:item.color,
                            width:`${Math.min(100, (parseFloat(item.value)/120)*100)}%`,
                            transition:'width 0.8s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Region info card */}
                  <div style={{ background:'#0D0D1A',
                                border:'1px solid #8B5CF633',
                                borderTop:'2px solid #8B5CF6',
                                borderRadius:2, padding:'12px' }}>
                    <p style={{ fontFamily:"'Courier New'", fontSize:8,
                                 color:'#8B5CF666', letterSpacing:3, margin:'0 0 10px' }}>
                      // STATE PROFILE
                    </p>
                    <p style={{ fontFamily:"'Orbitron'", fontSize:11,
                                 fontWeight:700, color:'#FF6600',
                                 margin:'0 0 6px', letterSpacing:2 }}>
                      {selectedState?.toUpperCase()}
                    </p>
                    <p style={{ fontFamily:"'Courier New'", fontSize:9,
                                 color:'#8B5CF6', margin:'0 0 12px',
                                 letterSpacing:2, textTransform:'uppercase' }}>
                      {soil.region} ZONE
                    </p>
                    <div style={{ borderTop:'1px solid #FF660022', paddingTop:8 }}>
                      {[
                        { label:'SOIL TYPE',
                          value: soil.ph > 7.5 ? 'Alkaline' : soil.ph < 6.0 ? 'Acidic' : 'Neutral' },
                        { label:'FERTILITY',
                          value: soil.N > 85 ? 'High' : soil.N > 65 ? 'Medium' : 'Low' },
                        { label:'IRRIGATION',
                          value: weather.rainfall > 150 ? 'Low need' : 'Required' },
                      ].map(item => (
                        <div key={item.label} style={{
                          display:'flex', justifyContent:'space-between',
                          marginBottom:4
                        }}>
                          <span style={{ fontFamily:"'Courier New'",
                                          fontSize:8, color:'#666680',
                                          letterSpacing:1 }}>
                            {item.label}
                          </span>
                          <span style={{ fontFamily:"'Courier New'",
                                          fontSize:8, color:'#9CA3AF',
                                          letterSpacing:1 }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CROP RESULT */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity:0, scale:0.97 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ duration:0.5, ease:'backOut' }}>

                {/* Main recommendation */}
                <div style={{ background:'#0D0D1A',
                              border:'1px solid #FF6600',
                              borderRadius:4, padding:20,
                              boxShadow:'0 0 30px #FF660022',
                              marginBottom:12 }}>

                  <div style={{ display:'flex', justifyContent:'space-between',
                                alignItems:'flex-start', marginBottom:16 }}>
                    <div>
                      <p style={{ fontFamily:"'Courier New'", fontSize:9,
                                   color:'#FF660066', letterSpacing:3, margin:'0 0 4px' }}>
                        // MAGI RECOMMENDATION
                      </p>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <span style={{ fontSize:40 }}>{cropInfo.emoji}</span>
                        <p style={{ fontFamily:"'Orbitron'", fontSize:28,
                                     fontWeight:900, color:'#FF6600',
                                     margin:0, letterSpacing:3,
                                     textShadow:'0 0 20px #FF660088' }}>
                          {result.recommended_crop?.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontFamily:"'Courier New'", fontSize:8,
                                   color:'#666680', letterSpacing:2, margin:'0 0 4px' }}>
                        CONFIDENCE
                      </p>
                      <p style={{ fontFamily:"'Orbitron'", fontSize:32,
                                   fontWeight:900, color:'#00FF41',
                                   margin:0, textShadow:'0 0 15px #00FF4188' }}>
                        {result.confidence}
                      </p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ height:6, background:'#FF660011',
                                   borderRadius:1, overflow:'hidden' }}>
                      <motion.div
                        initial={{ width:0 }}
                        animate={{ width: result.confidence }}
                        transition={{ duration:1, ease:'easeOut' }}
                        style={{ height:'100%', borderRadius:1,
                                  background:'linear-gradient(90deg,#FF660088,#00FF41)',
                                  boxShadow:'0 0 8px #00FF4166' }} />
                    </div>
                  </div>

                  {/* Crop details */}
                  <div style={{ display:'grid',
                                gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:8 }}>
                    {[
                      { label:'AVG PROFIT',  value:cropInfo.profit,  color:'#FFD700' },
                      { label:'WATER NEED',  value:cropInfo.water,   color:'#00FFFF' },
                      { label:'SEASON',      value:cropInfo.season,  color:'#FF6600' },
                      { label:'STATE',       value:selectedState,    color:'#8B5CF6' },
                    ].map(item => (
                      <div key={item.label} style={{
                        background:'#0A0A0F',
                        border:`1px solid ${item.color}22`,
                        borderRadius:2, padding:'10px 8px',
                        textAlign:'center'
                      }}>
                        <p style={{ fontFamily:"'Courier New'", fontSize:7,
                                     color:'#666680', letterSpacing:2,
                                     margin:'0 0 4px', textTransform:'uppercase' }}>
                          {item.label}
                        </p>
                        <p style={{ fontFamily:"'Orbitron'", fontSize:10,
                                     fontWeight:700, color:item.color,
                                     margin:0, letterSpacing:1 }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 3 alternatives */}
                {result.top3?.length > 1 && (
                  <div style={{ background:'#0D0D1A',
                                border:'1px solid #FF660022',
                                borderRadius:4, padding:16 }}>
                    <p style={{ fontFamily:"'Courier New'", fontSize:8,
                                 color:'#FF660066', letterSpacing:3, margin:'0 0 10px' }}>
                      // ALTERNATIVE RECOMMENDATIONS
                    </p>
                    {result.top3.slice(1).map((alt, i) => {
                      const altKey  = alt.crop?.toLowerCase().replace(/\s/g,'')
                      const altInfo = CROP_INFO[altKey] || { emoji:'🌱' }
                      return (
                        <div key={i} style={{
                          display:'flex', alignItems:'center',
                          gap:10, marginBottom:8,
                          padding:'8px 10px',
                          background:'#0A0A0F',
                          borderRadius:2, border:'1px solid #FF660011'
                        }}>
                          <span style={{ fontSize:18 }}>{altInfo.emoji}</span>
                          <span style={{ fontFamily:"'Orbitron'", fontSize:11,
                                          color:'#9CA3AF', flex:1, letterSpacing:1 }}>
                            {alt.crop?.toUpperCase()}
                          </span>
                          <div style={{ width:80, height:4,
                                         background:'#FF660011', borderRadius:1 }}>
                            <div style={{
                              height:'100%', borderRadius:1,
                              background:'#FF660044',
                              width:`${alt.confidence}%`
                            }} />
                          </div>
                          <span style={{ fontFamily:"'Courier New'", fontSize:9,
                                          color:'#FF660066', minWidth:36,
                                          textAlign:'right' }}>
                            {alt.confidence}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Re-analyze button */}
                <button
                  onClick={() => { setResult(null); setSelectedState(null) }}
                  style={{ width:'100%', padding:'10px', marginTop:10,
                           background:'transparent',
                           border:'1px solid #FF660033',
                           color:'#FF660066',
                           fontFamily:"'Courier New'", fontSize:10,
                           letterSpacing:3, cursor:'pointer', borderRadius:2 }}>
                  // SELECT ANOTHER STATE ►
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from{ transform:rotate(0deg) }
          to  { transform:rotate(360deg) }
        }
      `}</style>
    </div>
  )
}
