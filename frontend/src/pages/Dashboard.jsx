import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  CloudSun, Sprout, AlertTriangle, Activity, 
  ArrowRight, Bug, MessageSquare, TrendingUp, Bell
} from 'lucide-react';

const yieldData = [
  { name: 'Jan', expected: 4000, actual: 2400 },
  { name: 'Feb', expected: 3000, actual: 1398 },
  { name: 'Mar', expected: 2000, actual: 9800 },
  { name: 'Apr', expected: 2780, actual: 3908 },
  { name: 'May', expected: 1890, actual: 4800 },
  { name: 'Jun', expected: 2390, actual: 3800 },
];

const priceData = [
  { name: 'Week 1', rice: 4000, wheat: 2400 },
  { name: 'Week 2', rice: 3000, wheat: 1398 },
  { name: 'Week 3', rice: 2000, wheat: 3800 },
  { name: 'Week 4', rice: 2780, wheat: 3908 },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navCards = [
    { title: 'Recommend Crop', icon: <Sprout size={32} />, path: '/crop', color: 'bg-green-100 dark:bg-green-900/30 text-farm-green dark:text-green-400 border-green-200 dark:border-green-800/50 hover:bg-green-200 dark:hover:bg-green-900/50' },
    { title: 'Check Disease', icon: <Bug size={32} />, path: '/disease', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50 hover:bg-red-200 dark:hover:bg-red-900/50' },
    { title: 'Ask AI', icon: <MessageSquare size={32} />, path: '/chat', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 hover:bg-blue-200 dark:hover:bg-blue-900/50' },
    { title: 'Market Prices', icon: <TrendingUp size={32} />, path: '/market', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/50' },
  ];

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8 relative transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none dark:opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#1B5E20 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-farm-green dark:text-farm-light transition-colors duration-300">
              {t('nav.dashboard')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Welcome back! Here's your farm overview.</p>
          </div>
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Sensors Active
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Today's Weather</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">32°C</h3>
              <p className="text-sm text-farm-green dark:text-farm-light mt-1">Chennai, TN</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/40 p-3 rounded-xl text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <CloudSun size={28} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Crop</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">Samba Rice</h3>
              <p className="text-sm text-farm-green dark:text-farm-light mt-1">Day 45 / 120</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/40 p-3 rounded-xl text-farm-green dark:text-farm-light group-hover:scale-110 transition-transform">
              <Sprout size={28} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Market Alert</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹2,800/q</h3>
              <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                <TrendingUp size={14} /> +5% today
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/40 p-3 rounded-xl text-farm-gold dark:text-yellow-500 group-hover:scale-110 transition-transform">
              <AlertTriangle size={28} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-farm-green to-green-700 dark:from-green-800 dark:to-green-900 rounded-2xl p-6 shadow-md text-white flex items-start justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
              <p className="text-sm text-green-100 dark:text-green-200 font-medium">Farm Health Score</p>
              <h3 className="text-4xl font-bold mt-1">94%</h3>
              <p className="text-sm text-green-200 dark:text-green-300 mt-2">Excellent condition</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl text-white backdrop-blur-sm group-hover:rotate-12 transition-transform">
              <Activity size={28} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navCards.map((card, idx) => (
            <button 
              key={idx}
              onClick={() => navigate(card.path)}
              className={`${card.color} border p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-md transform hover:scale-105`}
            >
              {card.icon}
              <span className="font-semibold text-sm">{card.title}</span>
            </button>
          ))}
        </div>

        {/* Charts & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-gray-800 dark:text-white text-lg">Yield Prediction (kg)</h3>
              <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-gray-200 text-sm rounded-lg px-3 py-1 outline-none focus:border-farm-green dark:focus:border-farm-light transition-colors duration-300">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="opacity-50 dark:opacity-20" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="actual" fill="#1B5E20" radius={[4, 4, 0, 0]} barSize={30} name="Actual Yield" />
                  <Bar dataKey="expected" fill="#F9A825" radius={[4, 4, 0, 0]} barSize={30} name="Predicted Yield" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                <Bell size={18} className="text-farm-gold" /> Alerts Feed
              </h3>
              <span className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">3 New</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl relative overflow-hidden group hover:shadow-sm transition-all duration-300">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg text-red-600 dark:text-red-400"><AlertTriangle size={16} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Disease Risk</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">High humidity detected. Check tomatoes for Early Blight.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl relative overflow-hidden group hover:shadow-sm transition-all duration-300">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400"><CloudSun size={16} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Weather Update</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Expected rain tomorrow evening. Pause irrigation.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-xl relative overflow-hidden group hover:shadow-sm transition-all duration-300">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg text-farm-green dark:text-farm-light"><TrendingUp size={16} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Market Price Spike</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Rice prices up by 5% in your local mandi today.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 text-sm text-farm-green dark:text-farm-light font-semibold border border-farm-green dark:border-farm-light rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-300 flex items-center justify-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
