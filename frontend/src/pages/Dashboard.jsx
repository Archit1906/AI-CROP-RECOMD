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

const Skeleton = () => <div className="h-6 w-24 bg-gray-700 animate-pulse rounded"></div>;
const ErrorMsg = ({ msg }) => <p className="text-xs text-red-500 font-bold mt-1">{msg}</p>;

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chartFilter, setChartFilter] = useState('Last 6 Months');

  const { data: weatherData, loading: wLoading, error: wError } = useWeather();
  const { data: cropData, loading: cLoading, error: cError } = useCropData();
  const { data: marketData, loading: mLoading, error: mError } = useMarketPrices();
  const { data: healthData, loading: hLoading, error: hError } = useFarmHealth();

  const navCards = [
    { title: t('dashboard.recommend_crop'), icon: '🌱', path: '/crop', glow: 'hover:border-green-500', color: 'text-green-500' },
    { title: t('dashboard.check_disease'), icon: '🐛', path: '/disease', glow: 'hover:border-red-500', color: 'text-red-500' },
    { title: t('dashboard.ask_ai'), icon: '🤖', path: '/chat', glow: 'hover:border-blue-500', color: 'text-blue-500' },
    { title: t('dashboard.market_prices'), icon: '📈', path: '/market', glow: 'hover:border-yellow-500', color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F0A] p-4 lg:p-8 relative transition-colors duration-200 text-gray-400">
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-white transition-colors duration-200">
              {t('dashboard.title')}
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-[#162116] px-4 py-2 rounded-full border border-[#2D4A2D] text-gray-300 hover:bg-[#1E2E1E] transition-all duration-200">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            {t('dashboard.sensors_active')}
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#162116] rounded-2xl p-5 border-y border-r border-l-4 border-l-blue-500 border-y-[#2D4A2D] border-r-[#2D4A2D] hover:bg-[#1E2E1E] transition-all duration-200">
            <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mb-1">{t('dashboard.weather')}</p>
            {wLoading ? <Skeleton /> : wError ? <ErrorMsg msg={wError} /> : (
              <>
                <h3 className="text-3xl font-bold text-white mb-1">{weatherData?.temp || '32°C'}</h3>
                <p className="text-sm text-blue-400">{weatherData?.location || 'Chennai, TN'}</p>
              </>
            )}
          </div>

          <div className="bg-[#162116] rounded-2xl p-5 border-y border-r border-l-4 border-l-[#22C55E] border-y-[#2D4A2D] border-r-[#2D4A2D] hover:bg-[#1E2E1E] transition-all duration-200">
            <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mb-1">{t('dashboard.crop')}</p>
            {cLoading ? <Skeleton /> : cError ? <ErrorMsg msg={cError} /> : (
              <>
                <h3 className="text-3xl font-bold text-white mb-1">{cropData?.name || 'Samba Rice'}</h3>
                <p className="text-sm text-[#22C55E]">{cropData?.stage || 'Day 45 / 120'}</p>
              </>
            )}
          </div>

          <div className="bg-[#162116] rounded-2xl p-5 border-y border-r border-l-4 border-l-[#FBBF24] border-y-[#2D4A2D] border-r-[#2D4A2D] hover:bg-[#1E2E1E] transition-all duration-200">
            <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mb-1">{t('dashboard.market')}</p>
            {mLoading ? <Skeleton /> : mError ? <ErrorMsg msg={mError} /> : (
              <>
                <h3 className="text-3xl font-bold text-white mb-1">{marketData?.price || '₹2,800/q'}</h3>
                <p className="text-sm text-[#FBBF24]">{marketData?.trend || '+5% today'}</p>
              </>
            )}
          </div>

          <div className="bg-[#162116] rounded-2xl p-5 border-y border-r border-l-4 border-l-[#22C55E] border-y-[#2D4A2D] border-r-[#2D4A2D] hover:bg-[#1E2E1E] transition-all duration-200">
            <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mb-1">{t('dashboard.health')}</p>
            {hLoading ? <Skeleton /> : hError ? <ErrorMsg msg={hError} /> : (
              <>
                <h3 className="text-3xl font-bold text-white mb-1">{healthData?.score || '94%'}</h3>
                <p className="text-sm text-[#22C55E]">{healthData?.status || 'Excellent condition'}</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {navCards.map((card, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(card.path)}
                className={`bg-[#162116] border border-[#2D4A2D] p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 ${card.glow} hover:-translate-y-1 hover:bg-[#1E2E1E]`}
              >
                <span className="text-5xl mb-2">{card.icon}</span>
                <span className="font-semibold text-sm text-gray-300 tracking-widest uppercase">{card.title}</span>
              </button>
            ))}
          </div>

          {/* Alerts Feed */}
          <div className="bg-[#162116] p-6 rounded-2xl border border-[#2D4A2D] transition-colors duration-200 flex flex-col h-full hover:bg-[#1E2E1E]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                <Bell size={18} className="text-[#FBBF24]" /> {t('dashboard.alerts_feed')}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2" style={{ maxHeight: '280px' }}>
              <div className="p-4 bg-[#0A0F0A] border-l-4 border-red-500 border-y border-r border-y-[#2D4A2D] border-r-[#2D4A2D] rounded-xl transition-all duration-200 hover:bg-red-900/10">
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Disease Risk</h4>
                  <p className="text-xs text-gray-400">High humidity detected. Check tomatoes for Early Blight.</p>
                  <span className="text-[10px] text-gray-500 mt-2">10 mins ago</span>
                </div>
              </div>

              <div className="p-4 bg-[#0A0F0A] border-l-4 border-blue-500 border-y border-r border-y-[#2D4A2D] border-r-[#2D4A2D] rounded-xl transition-all duration-200 hover:bg-blue-900/10">
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Weather Update</h4>
                  <p className="text-xs text-gray-400">Expected rain tomorrow evening. Pause irrigation.</p>
                  <span className="text-[10px] text-gray-500 mt-2">2 hours ago</span>
                </div>
              </div>

              <div className="p-4 bg-[#0A0F0A] border-l-4 border-[#22C55E] border-y border-r border-y-[#2D4A2D] border-r-[#2D4A2D] rounded-xl transition-all duration-200 hover:bg-green-900/10">
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Market Price Spike</h4>
                  <p className="text-xs text-gray-400">Rice prices up by 5% in your local mandi today.</p>
                  <span className="text-[10px] text-gray-500 mt-2">5 hours ago</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 py-3 text-sm text-[#22C55E] font-bold uppercase tracking-widest border-t border-[#2D4A2D] hover:text-green-400 transition-colors duration-200 flex items-center justify-center gap-2">
              {t('dashboard.view_all')}
            </button>
          </div>
        </div>

        {/* Yield Chart */}
        <div className="bg-[#162116] p-6 rounded-2xl border border-[#2D4A2D] transition-colors duration-200 hover:bg-[#1E2E1E]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="font-semibold text-white text-lg tracking-widest uppercase">{t('dashboard.yield_prediction')}</h3>
            <select 
              value={chartFilter}
              onChange={(e) => setChartFilter(e.target.value)}
              className="bg-[#0A0F0A] border border-[#2D4A2D] text-gray-300 text-sm rounded-lg px-4 py-2 outline-none focus:border-[#22C55E] transition-colors duration-200"
            >
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockYieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D4A2D" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                  contentStyle={{
                    backgroundColor: '#1A2E1A', 
                    borderRadius: '8px', 
                    border: '1px solid #2D4A2D', 
                    color: '#FFF'
                  }} 
                  itemStyle={{ color: '#FFF' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="actual" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={40} name="Actual Yield" />
                <Bar dataKey="expected" fill="#FBBF24" radius={[4, 4, 0, 0]} barSize={40} name="Predicted Yield" />
                <Line type="monotone" dataKey="expected" stroke="#FFF" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Trend Line" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
