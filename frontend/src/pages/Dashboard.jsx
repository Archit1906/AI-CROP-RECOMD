import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { CloudSun, Sprout, AlertTriangle, Activity, ArrowRight, Bell } from 'lucide-react';
import { useWeather, useCropData, useMarketPrices, useFarmHealth } from '../hooks/useDashboardData';

const mockYieldData = [
  { name: 'Jan', expected: 4000, actual: 2400 },
  { name: 'Feb', expected: 3000, actual: 1398 },
  { name: 'Mar', expected: 2000, actual: 9800 },
  { name: 'Apr', expected: 2780, actual: 3908 },
  { name: 'May', expected: 1890, actual: 4800 },
  { name: 'Jun', expected: 2390, actual: 3800 },
];

const Skeleton = () => <div className="h-6 w-24 bg-nge-gray animate-pulse rounded"></div>;
const ErrorMsg = ({ msg }) => <p className="text-xs text-nge-red font-bold mt-1 terminal">{msg}</p>;

const NgeTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{
      background: '#0D0D1A',
      border: '1px solid #FF6600',
      borderRadius: 2, padding: '10px 14px',
      fontFamily: "'Share Tech Mono', monospace"
    }}>
      <p style={{ color:'#FF660088', fontSize:9, letterSpacing:2, margin:'0 0 4px' }}>
        // DATA POINT
      </p>
      <p style={{ color:'#FF6600', fontSize:12, margin:'0 0 2px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color:'#00FFFF', fontSize:13, fontWeight:700, margin:0 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
  return null
}

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chartFilter, setChartFilter] = useState('Last 6 Months');

  const { data: weatherData, loading: wLoading, error: wError } = useWeather();
  const { data: cropData, loading: cLoading, error: cError } = useCropData();
  const { data: marketData, loading: mLoading, error: mError } = useMarketPrices();
  const { data: healthData, loading: hLoading, error: hError } = useFarmHealth();

  return (
    <div className="min-h-screen bg-nge-black p-4 lg:p-8 relative hex-bg">
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Page header — NGE style */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #FF660033',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(90deg, #1A0500 0%, transparent 60%)'
        }}>
          <div>
            <p style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:'#FF660088',
                        letterSpacing:3, margin:'0 0 4px' }}>
              // MAGI SYSTEM — AGRICULTURAL INTELLIGENCE
            </p>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 28, fontWeight: 900,
              color: '#FF6600', margin: 0, letterSpacing: 4,
              textTransform: 'uppercase',
              textShadow: '0 0 20px #FF660066'
            }}
              className="glitch-text">
              {t('dashboard.title') || 'DASHBOARD'}
            </h1>
          </div>
          <div style={{
            background: '#0A0A0F', border: '1px solid #00FF41',
            borderRadius: 2, padding: '6px 14px',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <div style={{ width:6, height:6, borderRadius:'50%',
                          background:'#00FF41',
                          boxShadow:'0 0 8px #00FF41',
                          animation:'pulse-border 1s infinite' }} />
            <span style={{ fontFamily:"'Share Tech Mono'", fontSize:10,
                           color:'#00FF41', letterSpacing:2 }}>
              SENSORS ACTIVE
            </span>
          </div>
        </div>

        {/* Stat cards — NGE terminal style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* WEATHER DATA */}
          <div className="nge-card nge-hover" data-label="// WEATHER DATA" style={{ padding: '16px', cursor:'pointer' }}>
            <p style={{ fontFamily:"'Share Tech Mono'", fontSize:9,
                         color:'#FF660088', letterSpacing:3, margin:'0 0 8px',
                         textTransform:'uppercase' }}>
              {t('dashboard.weather') || "TODAY'S WEATHER"}
            </p>
            {wLoading ? <Skeleton /> : wError ? <ErrorMsg msg={wError} /> : (
              <>
                <p style={{ fontFamily:"'Orbitron'", fontSize:32,
                             fontWeight:900, color:'#FF6600', margin:'0 0 4px',
                             textShadow:'0 0 15px #FF660066' }}>
                  {weatherData?.temp || '32°C'}
                </p>
                <p style={{ fontFamily:"'Share Tech Mono'", fontSize:11,
                             color:'#00FFFF', margin:0 }}>
                  {weatherData?.location || 'CHENNAI, TN'} // ACTIVE
                </p>
              </>
            )}
          </div>

          {/* CROP DATA */}
          <div className="nge-card nge-hover" data-label="// BIOMETRICS" style={{ padding: '16px', cursor:'pointer' }}>
            <p style={{ fontFamily:"'Share Tech Mono'", fontSize:9,
                         color:'#FF660088', letterSpacing:3, margin:'0 0 8px',
                         textTransform:'uppercase' }}>
              {t('dashboard.crop') || "CROP STAGE"}
            </p>
            {cLoading ? <Skeleton /> : cError ? <ErrorMsg msg={cError} /> : (
              <>
                <p style={{ fontFamily:"'Orbitron'", fontSize:28,
                             fontWeight:900, color:'#FF6600', margin:'0 0 4px',
                             textShadow:'0 0 15px #FF660066', textTransform: 'uppercase' }}>
                  {cropData?.name || 'SAMBA RICE'}
                </p>
                <p style={{ fontFamily:"'Share Tech Mono'", fontSize:11,
                             color:'#00FFFF', margin:0, textTransform: 'uppercase' }}>
                  {cropData?.stage || 'DAY 45 / 120'}
                </p>
              </>
            )}
          </div>

          {/* MARKET DATA */}
          <div className="nge-card nge-hover" data-label="// MARKET INTEL" style={{ padding: '16px', cursor:'pointer' }}>
            <p style={{ fontFamily:"'Share Tech Mono'", fontSize:9,
                         color:'#FF660088', letterSpacing:3, margin:'0 0 8px',
                         textTransform:'uppercase' }}>
              {t('dashboard.market') || "MANDI PRICE"}
            </p>
            {mLoading ? <Skeleton /> : mError ? <ErrorMsg msg={mError} /> : (
              <>
                <p style={{ fontFamily:"'Orbitron'", fontSize:26,
                             fontWeight:900, color:'#FFD700', margin:'0 0 4px',
                             textShadow:'0 0 15px #FFD70066' }}>
                  {marketData?.price || '₹2,800/Q'}
                </p>
                <p style={{ fontFamily:"'Share Tech Mono'", fontSize:11,
                             color:'#00FF41', margin:0, textTransform: 'uppercase' }}>
                  {marketData?.trend || '+5% TODAY'}
                </p>
              </>
            )}
          </div>

          {/* HEALTH DATA */}
          <div className="nge-card nge-hover" data-label="// SYSTEM INTEGRITY" style={{ padding: '16px', cursor:'pointer' }}>
            <p style={{ fontFamily:"'Share Tech Mono'", fontSize:9,
                         color:'#FF660088', letterSpacing:3, margin:'0 0 8px',
                         textTransform:'uppercase' }}>
              {t('dashboard.health') || "FARM HEALTH"}
            </p>
            {hLoading ? <Skeleton /> : hError ? <ErrorMsg msg={hError} /> : (
              <>
                <p style={{ fontFamily:"'Orbitron'", fontSize:32,
                             fontWeight:900, color:'#00FF41', margin:'0 0 4px',
                             textShadow:'0 0 15px #00FF4166' }}>
                  {healthData?.score || '94%'}
                </p>
                <p style={{ fontFamily:"'Share Tech Mono'", fontSize:11,
                             color:'#00FFFF', margin:0, textTransform: 'uppercase' }}>
                  {healthData?.status || 'OPTIMAL'}
                </p>
              </>
            )}
          </div>

        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label:'CROP ANALYSIS',    icon:'🌾', color:'#FF6600', path:'/crop'    },
              { label:'THREAT DETECTION', icon:'🔬', color:'#FF0033', path:'/disease' },
              { label:'MAGI QUERY',       icon:'🤖', color:'#00FFFF', path:'/chat'    },
              { label:'MARKET INTEL',     icon:'📊', color:'#FFD700', path:'/market'  },
            ].map(action => (
              <button key={action.label} onClick={() => navigate(action.path)}
                style={{
                  background: '#0D0D1A',
                  border: `1px solid ${action.color}44`,
                  borderRadius: 2, padding: '20px 16px',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s', position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = action.color
                  e.currentTarget.style.boxShadow = `0 0 20px ${action.color}33`
                  e.currentTarget.style.background = `${action.color}11`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${action.color}44`
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = '#0D0D1A'
                }}>
                <span style={{ fontSize:28, display:'block', marginBottom:8, filter: 'sepia(1) hue-rotate(-50deg) saturate(3)' }}>{action.icon}</span>
                <p style={{
                  fontFamily:"'Orbitron', sans-serif",
                  fontSize:12, fontWeight:700, letterSpacing:2,
                  color: action.color, margin:0,
                  textShadow:`0 0 8px ${action.color}88`
                }}>
                  {action.label}
                </p>
              </button>
            ))}
          </div>

          {/* Alerts Feed */}
          <div className="nge-card" data-label="// ALERTS FEED" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="flex-1 w-full overflow-y-auto pr-2 mt-4" style={{ maxHeight: '240px' }}>
              {[
                { type: 'danger', title: 'Biological Threat', time: '10 mins ago', msg: 'High humidity detected. Check tomatoes for Early Blight.' },
                { type: 'warning', title: 'Atmospheric Alert', time: '2 hours ago', msg: 'Expected rain tomorrow evening. Pause irrigation.' },
                { type: 'info', title: 'Market Intel', time: '5 hours ago', msg: 'Rice prices up by 5% in your local mandi today.' }
              ].map((alert, i) => (
                <div key={i} style={{
                  borderLeft: `3px solid ${
                    alert.type==='danger'  ? '#FF0033' :
                    alert.type==='warning' ? '#FFD700' : '#FF6600'
                  }`,
                  background: '#0A0A0F',
                  padding: '10px 14px', marginBottom: 8,
                  borderRadius: '0 4px 4px 0'
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <p style={{
                      fontFamily:"'Orbitron'", fontSize:11, fontWeight:700,
                      color: alert.type==='danger' ? '#FF0033' : alert.type==='warning' ? '#FFD700' : '#00FFFF',
                      margin:0, letterSpacing:1
                    }}>
                      ⚠ {alert.title.toUpperCase()}
                    </p>
                    <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:'#666680' }}>
                      {alert.time}
                    </span>
                  </div>
                  <p style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:'#9CA3AF', margin:0 }}>
                    {alert.msg}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-[#FF660022] border border-[#FF6600] text-[#FF6600] text-[11px] font-display hover:bg-[#FF660044] hover:shadow-[0_0_20px_#FF660044] transition-all duration-200 tracking-[3px] uppercase rounded-[2px]" style={{ fontFamily: 'Orbitron' }}>
              VIEW ALL ALERTS
            </button>
          </div>
        </div>

        {/* Yield Chart */}
        <div className="nge-card" data-label="// HARVEST PROJECTION" style={{ padding: '24px' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 mt-2">
            <h3 className="font-semibold text-[#FF6600] text-lg tracking-[4px] uppercase" style={{ fontFamily: 'Orbitron', textShadow: '0 0 20px #FF660066' }}>{t('dashboard.yield_prediction') || 'YIELD PREDICTION'}</h3>
            <select 
              value={chartFilter}
              onChange={(e) => setChartFilter(e.target.value)}
              className="bg-black border border-[#FF660066] text-[#E8E8E8] rounded-[2px] px-3 py-2 outline-none focus:border-[#FF6600] focus:shadow-[0_0_10px_#FF660033] transition-all duration-200"
              style={{ fontFamily: 'Share Tech Mono', background: '#0A0A0F' }}
            >
              <option>LAST 3 MONTHS</option>
              <option>LAST 6 MONTHS</option>
              <option>THIS YEAR</option>
            </select>
          </div>
          
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockYieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FF660022" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666680', fontSize: 10, fontFamily: 'Share Tech Mono'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666680', fontSize: 10, fontFamily: 'Share Tech Mono'}} />
                <RechartsTooltip content={<NgeTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'Share Tech Mono', fontSize: '10px', color: '#666680' }} />
                <Bar dataKey="actual" fill="#FF6600" radius={[2, 2, 0, 0]} barSize={30} name="ACTUAL YIELD" />
                <Bar dataKey="expected" fill="#00FFFF" radius={[2, 2, 0, 0]} barSize={30} name="PREDICTED YIELD" />
                <Line type="monotone" dataKey="expected" stroke="#FF0033" strokeWidth={2} dot={{ r: 4, fill: '#FF0033' }} activeDot={{ r: 6, fill: '#FF0033', stroke: '#FF6600' }} name="TREND VECTOR" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
