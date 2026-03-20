import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, ResponsiveContainer, Cell } from 'recharts'
import api from '../api/axios'

const WEATHER_ICONS = {
  "01d":"☀️","01n":"🌙","02d":"⛅","02n":"⛅",
  "03d":"☁️","03n":"☁️","04d":"☁️","04n":"☁️",
  "09d":"🌧️","09n":"🌧️","10d":"🌦️","10n":"🌧️",
  "11d":"⛈️","11n":"⛈️","13d":"❄️","13n":"❄️","50d":"🌫️"
}

const TN_CITIES = [
  "Chennai","Coimbatore","Madurai","Salem","Trichy",
  "Tirunelveli","Vellore","Erode","Thanjavur","Dindigul"
]

export default function WeatherPage() {
  const [city, setCity] = useState("Chennai")
  const [searchInput, setSearchInput] = useState("Chennai")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWeather(city)
  }, [city])

  const fetchWeather = async (cityName) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await api.get(`/api/weather/${cityName}`)
      setData(res.data)
    } catch {
      setError(`Could not fetch weather for "${cityName}". Try another city.`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = searchInput.trim()
    if (trimmed && trimmed !== city) {
      setCity(trimmed)
    }
  }

  const handleCityChip = (selectedCity) => {
    setSearchInput(selectedCity)
    setCity(selectedCity)
  }

  const alertColors = {
    danger:  { bg: "#2D0A0A", border: "#EF4444", text: "#FCA5A5" },
    warning: { bg: "#2D1A00", border: "#FBBF24", text: "#FDE68A" },
    info:    { bg: "#0A1A2D", border: "#3B82F6", text: "#93C5FD" },
    success: { bg: "#0A2D0A", border: "#22C55E", text: "#86EFAC" },
  }

  const RainfallTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
      <div style={{ background: '#162116', border: '1px solid #2D4A2D',
                    borderRadius: 8, padding: '8px 14px' }}>
        <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>{label}</p>
        <p style={{ color: '#3B82F6', fontWeight: 700, margin: '4px 0 0' }}>
          {payload[0].value} mm
        </p>
      </div>
    )
    return null
  }

  if (loading) return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#22C55E', margin: '0 0 8px' }}>
        Weather Intelligence
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '50vh', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 52, animation: 'spin 1s linear infinite' }}>🌀</span>
        <p style={{ color: '#22C55E', fontSize: 16 }}>
          Fetching weather for {city}...
        </p>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  if (error) return (
    <div style={{ margin:32, padding:20, background:'#2D0A0A',
                  border:'1px solid #EF4444', borderRadius:12, color:'#EF4444' }}>
      {error}
    </div>
  )

  const c = data?.current
  const sowing = data?.sowing

  return (
    <div style={{ padding:24, background:'#0A0F0A', minHeight:'100vh' }}>

      {/* Header + Search */}
      <div style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:700, color:'#22C55E', margin:0 }}>
            Weather Intelligence
          </h1>
          <p style={{ color:'#6B7280', fontSize:13, margin:'4px 0 0' }}>
            Updated: {data?.last_updated}
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display:'flex', gap:8 }}>
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="Search any city..."
            style={{ background:'#162116', border:'1px solid #2D4A2D', borderRadius:8,
                     color:'#fff', padding:'8px 14px', fontSize:14, width:200,
                     outline:'none' }} />
          <button type="submit"
            style={{ background:'#22C55E', border:'none', borderRadius:8,
                     color:'#000', fontWeight:700, padding:'8px 16px', cursor:'pointer' }}>
            Search
          </button>
        </form>
      </div>

      {/* Quick city chips */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {TN_CITIES.map(c => (
          <button key={c} onClick={() => handleCityChip(c)}
            style={{ padding:'5px 14px', borderRadius:20, fontSize:13,
                     cursor:'pointer', border:'1px solid',
                     borderColor: city===c ? '#22C55E' : '#2D4A2D',
                     background: city===c ? '#14532D' : 'transparent',
                     color: city===c ? '#22C55E' : '#9CA3AF',
                     transition:'all 0.15s' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Current Weather Hero Card */}
      <div style={{ background:'linear-gradient(135deg, #0F2A0F, #162116)',
                    border:'1px solid #2D4A2D', borderRadius:16,
                    padding:28, marginBottom:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

          {/* Left: Main temp */}
          <div>
            <p style={{ color:'#9CA3AF', fontSize:14, margin:'0 0 4px' }}>
              📍 {data?.city}
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:72 }}>{WEATHER_ICONS[c?.icon] || '🌤️'}</span>
              <div>
                <p style={{ fontSize:64, fontWeight:800, color:'#fff', margin:0, lineHeight:1 }}>
                  {c?.temp}°
                </p>
                <p style={{ color:'#9CA3AF', fontSize:15, margin:'6px 0 0' }}>
                  {c?.description} · Feels like {c?.feels_like}°C
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stats grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { icon:'💧', label:'Humidity',    value:`${c?.humidity}%` },
              { icon:'💨', label:'Wind',         value:`${c?.wind_kmh} km/h` },
              { icon:'📊', label:'Pressure',     value:`${c?.pressure} hPa` },
              { icon:'👁️', label:'Visibility',   value:`${c?.visibility} km` },
            ].map(stat => (
              <div key={stat.label}
                style={{ background:'rgba(0,0,0,0.3)', borderRadius:10,
                         padding:'12px 14px', border:'1px solid #2D4A2D' }}>
                <p style={{ color:'#6B7280', fontSize:12, margin:'0 0 4px' }}>
                  {stat.icon} {stat.label}
                </p>
                <p style={{ color:'#fff', fontWeight:700, fontSize:18, margin:0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Humidity + Wind visual gauges */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:20 }}>
          {[
            { label:'Humidity', value:c?.humidity, max:100, color:'#3B82F6', unit:'%' },
            { label:'Wind Speed', value:c?.wind_kmh, max:100, color:'#8B5CF6', unit:' km/h' },
          ].map(gauge => (
            <div key={gauge.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ color:'#9CA3AF', fontSize:13 }}>{gauge.label}</span>
                <span style={{ color:'#fff', fontSize:13, fontWeight:600 }}>
                  {gauge.value}{gauge.unit}
                </span>
              </div>
              <div style={{ height:8, background:'#2D4A2D', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(gauge.value/gauge.max)*100}%`,
                              background:gauge.color, borderRadius:4,
                              transition:'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div style={{ background:'#162116', border:'1px solid #2D4A2D',
                    borderRadius:16, padding:20, marginBottom:20 }}>
        <p style={{ color:'#fff', fontWeight:700, fontSize:16, margin:'0 0 16px' }}>
          7-Day Forecast
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:8 }}>
          {data?.forecast?.map((day, i) => (
            <div key={i} style={{ background:'#0F1A0F', borderRadius:10,
                                   padding:'12px 8px', textAlign:'center',
                                   border:'1px solid #2D4A2D' }}>
              <p style={{ color:'#9CA3AF', fontSize:12, margin:'0 0 8px' }}>{day.day}</p>
              <span style={{ fontSize:28 }}>{WEATHER_ICONS[day.icon] || '🌤️'}</span>
              <p style={{ color:'#fff', fontWeight:700, fontSize:15, margin:'8px 0 2px' }}>
                {day.high}°
              </p>
              <p style={{ color:'#6B7280', fontSize:12, margin:'0 0 8px' }}>{day.low}°</p>
              <div style={{ background: day.rain_chance > 50 ? '#1E3A5F' : '#1A2E1A',
                            borderRadius:6, padding:'3px 0' }}>
                <p style={{ color: day.rain_chance > 50 ? '#60A5FA' : '#9CA3AF',
                             fontSize:11, margin:0 }}>
                  💧{day.rain_chance}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid: Alerts + Sowing + Rainfall Chart */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* Farming Alerts */}
        <div style={{ background:'#162116', border:'1px solid #2D4A2D',
                      borderRadius:16, padding:20 }}>
          <p style={{ color:'#fff', fontWeight:700, fontSize:16, margin:'0 0 14px' }}>
            🚨 Farming Alerts
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {data?.alerts?.map((alert, i) => {
              const colors = alertColors[alert.type] || alertColors.info
              return (
                <div key={i} style={{ background:colors.bg, border:`1px solid ${colors.border}`,
                                       borderRadius:10, padding:'12px 14px',
                                       borderLeft:`4px solid ${colors.border}` }}>
                  <p style={{ color:colors.text, fontWeight:700, fontSize:14, margin:'0 0 3px' }}>
                    {alert.icon} {alert.title}
                  </p>
                  <p style={{ color:'#9CA3AF', fontSize:12, margin:0 }}>{alert.msg}</p>
                </div>
              )
            })}
            {(!data?.alerts || data.alerts.length === 0) && (
              <div style={{ background:'#0A2D0A', border:'1px solid #22C55E',
                            borderRadius:10, padding:'12px 14px' }}>
                <p style={{ color:'#22C55E', fontWeight:700, margin:'0 0 3px' }}>
                  ✅ All Clear
                </p>
                <p style={{ color:'#9CA3AF', fontSize:12, margin:0 }}>
                  No major weather risks today.
                </p>
              </div>
            )}
          </div>

          {/* Sowing Recommendation */}
          <div style={{ marginTop:16, background:'#0F1A0F', borderRadius:10,
                        padding:'14px 16px', border:`1px solid ${sowing?.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ color:'#fff', fontWeight:700, margin:'0 0 4px' }}>
                🌱 Sowing Conditions
              </p>
              <span style={{ background:sowing?.color, color:'#000',
                             padding:'3px 12px', borderRadius:20,
                             fontSize:12, fontWeight:700 }}>
                {sowing?.label}
              </span>
            </div>
            <p style={{ color:'#9CA3AF', fontSize:13, margin:'6px 0 8px' }}>
              {sowing?.message}
            </p>
            {sowing?.crops?.length > 0 && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {sowing.crops.map(crop => (
                  <span key={crop} style={{ background:'#162116', color:'#22C55E',
                                            padding:'3px 10px', borderRadius:6,
                                            fontSize:12, border:'1px solid #2D4A2D' }}>
                    {crop}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Rainfall Chart */}
        <div style={{ background:'#162116', border:'1px solid #2D4A2D',
                      borderRadius:16, padding:20 }}>
          <p style={{ color:'#fff', fontWeight:700, fontSize:16, margin:'0 0 4px' }}>
            🌧️ Monthly Rainfall Pattern
          </p>
          <p style={{ color:'#6B7280', fontSize:13, margin:'0 0 16px' }}>
            Historical average for {data?.city}
          </p>
          <div style={{ height:280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthly_rainfall}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D4A2D" vertical={false} />
                <XAxis dataKey="month" tick={{ fill:'#9CA3AF', fontSize:11 }}
                       axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#9CA3AF', fontSize:11 }}
                       axisLine={false} tickLine={false}
                       tickFormatter={v => `${v}mm`} />
                <Tooltip content={<RainfallTooltip />} />
                <Bar dataKey="rainfall" radius={[4,4,0,0]}>
                  {data?.monthly_rainfall?.map((entry, i) => (
                    <Cell key={i}
                      fill={entry.rainfall > 100 ? '#3B82F6' :
                            entry.rainfall > 50  ? '#60A5FA' : '#93C5FD'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ color:'#6B7280', fontSize:12, textAlign:'center', margin:'8px 0 0' }}>
            Blue intensity = rainfall amount · Peak = monsoon season
          </p>
        </div>

      </div>
    </div>
  )
}
