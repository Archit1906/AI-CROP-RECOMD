import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Clock, MapPin, Filter } from 'lucide-react';

const priceData = [
  { name: 'Jan', value: 1800 },
  { name: 'Feb', value: 1950 },
  { name: 'Mar', value: 1850 },
  { name: 'Apr', value: 2100 },
  { name: 'May', value: 2250 },
  { name: 'Jun', value: 2400 },
];

const currentPrices = [
  { crop: 'Rice (Samba)', price: 2400, unit: 'Quintal', change: '+5%', trend: 'up' },
  { crop: 'Wheat', price: 2100, unit: 'Quintal', change: '-2%', trend: 'down' },
  { crop: 'Cotton', price: 6500, unit: 'Quintal', change: '+1.5%', trend: 'up' },
  { crop: 'Tomato', price: 800, unit: 'Quintal', change: '+12%', trend: 'up' },
  { crop: 'Onion', price: 1200, unit: 'Quintal', change: '-4%', trend: 'down' },
  { crop: 'Sugarcane', price: 315, unit: 'Quintal', change: '0%', trend: 'neutral' },
];

const MarketPrices = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('Rice (Samba)');

  // Dynamic axis color based on theme
  const isDark = document.documentElement.classList.contains('dark');
  const axisColor = isDark ? '#9CA3AF' : '#888';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const tooltipBg = isDark ? '#1F2937' : '#fff';

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-farm-green dark:text-farm-light transition-colors duration-300">Market Prices</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Live Mandi prices and historical trends.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <MapPin size={16} className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
              <select className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg outline-none focus:border-farm-green dark:focus:border-farm-light shadow-sm text-sm transition-colors duration-300">
                <option>Tamil Nadu</option>
                <option>Karnataka</option>
                <option>Andhra Pradesh</option>
              </select>
            </div>
            <div className="relative flex-1 md:w-48">
              <Filter size={16} className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
              <select className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg outline-none focus:border-farm-green dark:focus:border-farm-light shadow-sm text-sm transition-colors duration-300">
                <option>All Districts</option>
                <option>Chennai</option>
                <option>Coimbatore</option>
                <option>Madurai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-farm-gold to-yellow-600 dark:from-yellow-700 dark:to-yellow-900 p-6 rounded-2xl shadow-md text-white flex items-center justify-between transition-colors duration-300">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2"><Clock size={20} /> Best Time to Sell</h3>
            <p className="mt-1 text-yellow-50 dark:text-yellow-100">Rice prices are at a 6-month high. Consider selling 50% of your stock now.</p>
          </div>
          <button className="hidden md:block bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg font-bold hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            View Analytics
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Price Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden lg:col-span-1 transition-colors duration-300">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
              <h3 className="font-bold text-gray-800 dark:text-white">Current Mandi Prices</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {currentPrices.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedCrop(item.crop)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors duration-300 ${selectedCrop === item.crop ? 'bg-green-50 dark:bg-green-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.crop}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">₹{item.price}</p>
                    <p className={`text-xs font-bold flex items-center justify-end gap-1
                      ${item.trend === 'up' ? 'text-green-600 dark:text-green-400' : item.trend === 'down' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      {item.trend === 'up' && <TrendingUp size={12} />}
                      {item.trend === 'down' && <TrendingDown size={12} />}
                      {item.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:col-span-2 flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg transition-colors duration-300">Price Trend: {selectedCrop}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comparing current month vs last 6 months</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded drop-shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300">1M</button>
                <button className="px-3 py-1 text-xs font-semibold bg-farm-green dark:bg-farm-light text-white dark:text-gray-900 rounded drop-shadow-sm transition-colors duration-300">6M</button>
                <button className="px-3 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded drop-shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300">1Y</button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} domain={['dataMin - 200', 'dataMax + 200']} />
                  <RechartsTooltip 
                    contentStyle={{backgroundColor: tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: isDark ? '#fff' : '#000'}} 
                    formatter={(value) => [`₹${value}`, 'Price (Quintal)']}
                  />
                  <Line type="monotone" dataKey="value" stroke={isDark ? '#4CAF50' : '#1B5E20'} strokeWidth={3} dot={{r: 4, fill: isDark ? '#4CAF50' : '#1B5E20', strokeWidth: 2, stroke: isDark ? '#1F2937' : '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketPrices;
