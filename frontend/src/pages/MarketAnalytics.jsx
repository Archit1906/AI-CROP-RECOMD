import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Cell
} from 'recharts'

const CROP_ANALYTICS = [
  { crop: "Rice (Samba)",  emoji:"🌾", current:2400, lastMonth:2100, lastYear:1900, predicted:2650, trend:"up",   volatility:"Low",    bestMonth:"October",   worstMonth:"March"  },
  { crop: "Tomato",        emoji:"🍅", current:800,  lastMonth:600,  lastYear:500,  predicted:950, trend:"up",   volatility:"High",   bestMonth:"December",  worstMonth:"July"   },
  { crop: "Cotton",        emoji:"🌱", current:6500, lastMonth:6200, lastYear:5800, predicted:6800,trend:"up",   volatility:"Medium", bestMonth:"November",  worstMonth:"May"    },
  { crop: "Onion",         emoji:"🧅", current:1200, lastMonth:1400, lastYear:1100, predicted:1050,trend:"down", volatility:"High",   bestMonth:"January",   worstMonth:"August" },
  { crop: "Banana",        emoji:"🍌", current:1800, lastMonth:1750, lastYear:1600, predicted:1900,trend:"up",   volatility:"Low",    bestMonth:"February",  worstMonth:"June"   },
  { crop: "Groundnut",     emoji:"🥜", current:5200, lastMonth:5100, lastYear:4800, predicted:5400,trend:"up",   volatility:"Medium", bestMonth:"December",  worstMonth:"April"  },
]

const MONTHLY_COMPARISON = [
  { month:"Jan", rice:2100, tomato:900,  cotton:6100, onion:1500 },
  { month:"Feb", rice:2150, tomato:850,  cotton:6200, onion:1400 },
  { month:"Mar", rice:2000, tomato:700,  cotton:6000, onion:1200 },
  { month:"Apr", rice:2050, tomato:600,  cotton:5900, onion:1100 },
  { month:"May", rice:2200, tomato:550,  cotton:5800, onion:1000 },
  { month:"Jun", rice:2300, tomato:500,  cotton:6000, onion:950  },
  { month:"Jul", rice:2250, tomato:450,  cotton:6100, onion:900  },
  { month:"Aug", rice:2100, tomato:500,  cotton:6200, onion:850  },
  { month:"Sep", rice:2200, tomato:600,  cotton:6300, onion:950  },
  { month:"Oct", rice:2350, tomato:700,  cotton:6400, onion:1100 },
  { month:"Nov", rice:2400, tomato:750,  cotton:6500, onion:1300 },
  { month:"Dec", rice:2400, tomato:800,  cotton:6500, onion:1200 },
]

const COLORS = ["#22C55E","#FBBF24","#3B82F6","#EF4444","#8B5CF6","#F97316"]

export default function MarketAnalytics() {
  const navigate = useNavigate()
  const [selectedCrops, setSelectedCrops] = useState(["rice","tomato"])

  const toggleCrop = (crop) => {
    const key = crop.toLowerCase().split(" ")[0]
    setSelectedCrops(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
      <div style={{ background:'#162116', border:'1px solid #2D4A2D',
                    borderRadius:8, padding:'10px 14px' }}>
        <p style={{ color:'#9CA3AF', fontSize:12, margin:'0 0 6px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color:p.color, fontWeight:600, fontSize:13, margin:'2px 0' }}>
            {p.name}: ₹{p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
    return null
  }

  return (
    <div style={{ padding:24, background:'#0A0F0A', minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
        <button onClick={() => navigate('/market')}
          style={{ background:'#162116', border:'1px solid #2D4A2D',
                   borderRadius:8, color:'#9CA3AF', padding:'8px 14px',
                   cursor:'pointer', fontSize:14 }}>
          ← Back
        </button>
        <div>
          <h1 style={{ fontSize:28, fontWeight:700, color:'#22C55E', margin:0 }}>
            Price Analytics
          </h1>
          <p style={{ color:'#6B7280', fontSize:13, margin:'4px 0 0' }}>
            Tamil Nadu Mandi — Historical trends and predictions
          </p>
        </div>
      </div>

      {/* Crop Performance Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {CROP_ANALYTICS.map((crop, i) => {
          const changePercent = (((crop.current - crop.lastMonth) / crop.lastMonth) * 100).toFixed(1)
          const isUp = crop.trend === "up"
          return (
            <div key={i}
              style={{ background:'#162116', border:'1px solid #2D4A2D',
                       borderLeft:`4px solid ${isUp ? '#22C55E' : '#EF4444'}`,
                       borderRadius:12, padding:'16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ color:'#9CA3AF', fontSize:12, margin:'0 0 4px',
                               textTransform:'uppercase', letterSpacing:1 }}>
                    {crop.emoji} {crop.crop}
                  </p>
                  <p style={{ color:'#fff', fontWeight:700, fontSize:22, margin:0 }}>
                    ₹{crop.current.toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ color: isUp ? '#22C55E' : '#EF4444',
                               fontWeight:700, fontSize:16, margin:'0 0 4px' }}>
                    {isUp ? '↑' : '↓'} {Math.abs(changePercent)}%
                  </p>
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10,
                                 background: crop.volatility==='High' ? '#2D0A0A' :
                                             crop.volatility==='Medium' ? '#2D1A00' : '#0A2D0A',
                                 color: crop.volatility==='High' ? '#EF4444' :
                                        crop.volatility==='Medium' ? '#FBBF24' : '#22C55E' }}>
                    {crop.volatility} volatility
                  </span>
                </div>
              </div>
              <div style={{ marginTop:12, display:'flex', justifyContent:'space-between' }}>
                <div>
                  <p style={{ color:'#6B7280', fontSize:11, margin:'0 0 2px' }}>Predicted next month</p>
                  <p style={{ color:'#FBBF24', fontWeight:600, fontSize:14, margin:0 }}>
                    ₹{crop.predicted.toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ color:'#6B7280', fontSize:11, margin:'0 0 2px' }}>Best month to sell</p>
                  <p style={{ color:'#22C55E', fontWeight:600, fontSize:14, margin:0 }}>
                    {crop.bestMonth}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Crop Toggle Filter */}
      <div style={{ background:'#162116', border:'1px solid #2D4A2D',
                    borderRadius:12, padding:'16px 20px', marginBottom:20 }}>
        <p style={{ color:'#9CA3AF', fontSize:13, margin:'0 0 12px' }}>
          Select crops to compare:
        </p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {CROP_ANALYTICS.map((crop, i) => {
            const key = crop.crop.toLowerCase().split(" ")[0]
            const active = selectedCrops.includes(key)
            return (
              <button key={i} onClick={() => toggleCrop(crop.crop)}
                style={{ padding:'6px 14px', borderRadius:20, fontSize:13,
                         cursor:'pointer', border:`1px solid ${active ? COLORS[i] : '#2D4A2D'}`,
                         background: active ? `${COLORS[i]}22` : 'transparent',
                         color: active ? COLORS[i] : '#6B7280',
                         transition:'all 0.15s' }}>
                {crop.emoji} {crop.crop}
              </button>
            )
          })}
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div style={{ background:'#162116', border:'1px solid #2D4A2D',
                    borderRadius:12, padding:20, marginBottom:20 }}>
        <p style={{ color:'#fff', fontWeight:700, fontSize:16, margin:'0 0 4px' }}>
          📈 12-Month Price Comparison
        </p>
        <p style={{ color:'#6B7280', fontSize:13, margin:'0 0 16px' }}>
          Toggle crops above to compare
        </p>
        <div style={{ height:300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTHLY_COMPARISON}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D4A2D" />
              <XAxis dataKey="month" tick={{ fill:'#9CA3AF', fontSize:11 }}
                     axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#9CA3AF', fontSize:11 }}
                     axisLine={false} tickLine={false}
                     tickFormatter={v => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color:'#9CA3AF', fontSize:12 }} />
              {selectedCrops.includes("rice") &&
                <Line type="monotone" dataKey="rice" stroke="#22C55E"
                      strokeWidth={2} dot={false} name="Rice" />}
              {selectedCrops.includes("tomato") &&
                <Line type="monotone" dataKey="tomato" stroke="#EF4444"
                      strokeWidth={2} dot={false} name="Tomato" />}
              {selectedCrops.includes("cotton") &&
                <Line type="monotone" dataKey="cotton" stroke="#FBBF24"
                      strokeWidth={2} dot={false} name="Cotton" />}
              {selectedCrops.includes("onion") &&
                <Line type="monotone" dataKey="onion" stroke="#3B82F6"
                      strokeWidth={2} dot={false} name="Onion" />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Time to Sell Table */}
      <div style={{ background:'#162116', border:'1px solid #2D4A2D',
                    borderRadius:12, padding:20 }}>
        <p style={{ color:'#fff', fontWeight:700, fontSize:16, margin:'0 0 16px' }}>
          🗓️ Best & Worst Months to Sell
        </p>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #2D4A2D' }}>
                {['Crop','Current Price','Last Month','Change','Best Month to Sell','Predicted'].map(h => (
                  <th key={h} style={{ color:'#6B7280', fontSize:12, fontWeight:600,
                                       textAlign:'left', padding:'8px 12px',
                                       textTransform:'uppercase', letterSpacing:1 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CROP_ANALYTICS.map((crop, i) => {
                const change = (((crop.current-crop.lastMonth)/crop.lastMonth)*100).toFixed(1)
                const isUp = parseFloat(change) > 0
                return (
                  <tr key={i} style={{ borderBottom:'1px solid #1E2E1E' }}>
                    <td style={{ padding:'12px', color:'#fff', fontWeight:600 }}>
                      {crop.emoji} {crop.crop}
                    </td>
                    <td style={{ padding:'12px', color:'#fff' }}>
                      ₹{crop.current.toLocaleString()}
                    </td>
                    <td style={{ padding:'12px', color:'#9CA3AF' }}>
                      ₹{crop.lastMonth.toLocaleString()}
                    </td>
                    <td style={{ padding:'12px',
                                 color: isUp ? '#22C55E' : '#EF4444', fontWeight:600 }}>
                      {isUp ? '↑' : '↓'} {Math.abs(change)}%
                    </td>
                    <td style={{ padding:'12px' }}>
                      <span style={{ background:'#14532D', color:'#22C55E',
                                     padding:'3px 10px', borderRadius:6, fontSize:12 }}>
                        {crop.bestMonth}
                      </span>
                    </td>
                    <td style={{ padding:'12px', color:'#FBBF24', fontWeight:600 }}>
                      ₹{crop.predicted.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
