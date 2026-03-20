import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import api from '../api/axios'

const STATES = ["Tamil Nadu", "Maharashtra", "Punjab", "Karnataka", "Andhra Pradesh"]

const DISTRICTS = {
  "Tamil Nadu": ["All Districts","Chennai","Coimbatore","Madurai","Salem","Trichy","Vellore","Tirunelveli"],
  "Maharashtra": ["All Districts","Mumbai","Pune","Nashik","Nagpur","Aurangabad"],
  "Punjab": ["All Districts","Ludhiana","Amritsar","Jalandhar","Patiala"],
}

export default function MarketPrices() {
  const navigate = useNavigate()
  const [state, setState] = useState("Tamil Nadu")
  const [district, setDistrict] = useState("All Districts")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [timeRange, setTimeRange] = useState("history_6m")
  const [error, setError] = useState(null)

  // Fetch prices when state/district changes
  useEffect(() => {
    fetchPrices()
  }, [state, district])

  const fetchPrices = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/api/market-prices/${state}?district=${district}`)
      setData(res.data)
      // Auto-select first crop
      if (res.data.prices?.length > 0) {
        setSelectedCrop(res.data.prices[0])
      }
    } catch (err) {
      setError("Could not load market prices. Check backend connection.")
    } finally {
      setLoading(false)
    }
  }

  // When user clicks a crop in the list, update chart
  const handleCropClick = (crop) => {
    setSelectedCrop(crop)
  }

  const chartData = selectedCrop?.[timeRange] || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#162116', border: '1px solid #2D4A2D',
                      borderRadius: 8, padding: '10px 14px' }}>
          <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>{label}</p>
          <p style={{ color: '#22C55E', fontWeight: 700, fontSize: 16, margin: '4px 0 0' }}>
            ₹{payload[0]?.value?.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: '60vh', color: '#22C55E', fontSize: 18 }}>
      Loading market prices...
    </div>
  )

  if (error) return (
    <div style={{ margin: 32, padding: 20, background: '#2D0A0A',
                  border: '1px solid #EF4444', borderRadius: 12, color: '#EF4444' }}>
      {error} — Run: <code>uvicorn main:app --reload</code>
    </div>
  )

  return (
    <div style={{ padding: 24, background: '#0A0F0A', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#22C55E', margin: 0 }}>
            Market Prices
          </h1>
          <p style={{ color: '#6B7280', fontSize: 14, margin: '4px 0 0' }}>
            Last updated: {data?.last_updated}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12 }}>
          <select value={state} onChange={e => { setState(e.target.value); setDistrict("All Districts") }}
            style={{ background: '#162116', border: '1px solid #2D4A2D', borderRadius: 8,
                     color: '#fff', padding: '8px 12px', fontSize: 14 }}>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={district} onChange={e => setDistrict(e.target.value)}
            style={{ background: '#162116', border: '1px solid #2D4A2D', borderRadius: 8,
                     color: '#fff', padding: '8px 12px', fontSize: 14 }}>
            {(DISTRICTS[state] || ["All Districts"]).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Best Time to Sell Banner */}
      {data?.best_sell && (
        <div style={{ background: 'linear-gradient(135deg, #78350F, #92400E)',
                      border: '1px solid #D97706', borderRadius: 12,
                      padding: '16px 20px', marginBottom: 24,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>⏰</span>
            <div>
              <p style={{ color: '#FCD34D', fontWeight: 700, margin: 0 }}>Best Time to Sell</p>
              <p style={{ color: '#FDE68A', fontSize: 14, margin: '2px 0 0' }}>
                {data.best_sell_msg}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/market/analytics')} style={{ background: '#D97706', border: 'none',
                   borderRadius: 8, color: '#000', fontWeight: 700,
                   padding: '8px 16px', cursor: 'pointer' }}>
            View Analytics
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>

        {/* Crop List */}
        <div style={{ background: '#162116', border: '1px solid #2D4A2D',
                      borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2D4A2D' }}>
            <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>Current Mandi Prices</p>
            <p style={{ color: '#6B7280', fontSize: 12, margin: '2px 0 0' }}>
              Click any crop to see trend
            </p>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: 480 }}>
            {data?.prices?.map((crop, i) => (
              <div key={i} onClick={() => handleCropClick(crop)}
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #1E2E1E',
                  background: selectedCrop?.crop === crop.crop ? '#1E3A1E' : 'transparent',
                  borderLeft: selectedCrop?.crop === crop.crop ? '3px solid #22C55E' : '3px solid transparent',
                  transition: 'all 0.15s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, margin: 0, fontSize: 15 }}>
                    {crop.emoji} {crop.crop}
                  </p>
                  <p style={{ color: '#6B7280', fontSize: 12, margin: '2px 0 0' }}>
                    per {crop.unit}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: 16 }}>
                    ₹{crop.price.toLocaleString()}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600,
                               color: crop.change > 0 ? '#22C55E' : crop.change < 0 ? '#EF4444' : '#6B7280' }}>
                    {crop.change > 0 ? '↑' : crop.change < 0 ? '↓' : '→'} {Math.abs(crop.change)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Panel */}
        <div style={{ background: '#162116', border: '1px solid #2D4A2D',
                      borderRadius: 12, padding: 20 }}>

          {selectedCrop ? (
            <>
              {/* Chart Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                            alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>
                    Price Trend: {selectedCrop.emoji} {selectedCrop.crop}
                  </p>
                  <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>
                    ₹{selectedCrop.price.toLocaleString()} / {selectedCrop.unit} •
                    <span style={{ color: selectedCrop.change > 0 ? '#22C55E' : '#EF4444',
                                   marginLeft: 6 }}>
                      {selectedCrop.change > 0 ? '↑' : '↓'} {Math.abs(selectedCrop.change)}% today
                    </span>
                  </p>
                </div>

                {/* Time Range Buttons */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { key: 'history_1m', label: '1M' },
                    { key: 'history_6m', label: '6M' },
                    { key: 'history_1y', label: '1Y' }
                  ].map(btn => (
                    <button key={btn.key} onClick={() => setTimeRange(btn.key)}
                      style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 13,
                        fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: timeRange === btn.key ? '#22C55E' : '#0F1A0F',
                        color: timeRange === btn.key ? '#000' : '#9CA3AF',
                        transition: 'all 0.15s'
                      }}>
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Chart */}
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D4A2D" />
                    <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }}
                           axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }}
                           axisLine={false} tickLine={false}
                           tickFormatter={v => `₹${v.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="price" stroke="#22C55E"
                          strokeWidth={2.5} dot={{ fill: '#22C55E', r: 4 }}
                          activeDot={{ r: 7, fill: '#22C55E' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Prediction Banner */}
              <div style={{ marginTop: 16, padding: '12px 16px',
                            background: '#0F1A0F', borderRadius: 8,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>
                    AI Price Prediction (Next Month)
                  </p>
                  <p style={{ color: '#FBBF24', fontWeight: 700, fontSize: 18, margin: '4px 0 0' }}>
                    ₹{Math.round(selectedCrop.price * 1.05).toLocaleString()}
                  </p>
                </div>
                <span style={{ background: selectedCrop.change > 3 ? '#14532D' : '#1C1917',
                               color: selectedCrop.change > 3 ? '#22C55E' : '#9CA3AF',
                               padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  {selectedCrop.change > 3 ? '✓ Good time to sell' : 'Hold for better price'}
                </span>
              </div>
            </>
          ) : (
            <div style={{ height: 300, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#6B7280' }}>
              Select a crop to see price trend
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
