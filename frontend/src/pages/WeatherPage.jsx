import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Wind, Droplets, CloudRain, Sun, AlertTriangle, CalendarDays } from 'lucide-react';

const WeatherPage = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState('Chennai');
  const [loading, setLoading] = useState(false);

  // Mock Data
  const current = { temp: 32, humidity: 85, wind: 12, condition: 'Partly Cloudy' };
  const forecast = [
    { day: 'Mon', temp: 34, icon: <Sun size={24} className="text-yellow-500" /> },
    { day: 'Tue', temp: 31, icon: <CloudRain size={24} className="text-blue-500" /> },
    { day: 'Wed', temp: 29, icon: <CloudRain size={24} className="text-blue-500" /> },
    { day: 'Thu', temp: 33, icon: <Sun size={24} className="text-yellow-500" /> },
    { day: 'Fri', temp: 35, icon: <Sun size={24} className="text-yellow-500" /> }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 p-4 lg:p-8 relative overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute top-20 left-20 text-blue-500/20 dark:text-yellow-500/10 mix-blend-overlay animate-pulse"><Sun size={200} /></div>
      <div className="absolute bottom-20 right-20 text-blue-800/20 dark:text-blue-500/10 mix-blend-overlay opacity-50"><CloudRain size={300} /></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white transition-colors duration-300">Smart Weather</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Micro-climate intelligence for your farm.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-auto">
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search district..." 
              className="w-full md:w-64 pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all duration-300"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Farm Alerts Banner */}
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 p-4 rounded-r-xl shadow-sm flex gap-3 text-yellow-800 dark:text-yellow-400 transition-colors duration-300">
          <AlertTriangle className="flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">High Humidity Warning (85%)</p>
            <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-500">Conditions favor fungal growth. Inspect broad-leaf crops today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/50 dark:border-gray-700/50 lg:col-span-2 relative overflow-hidden transition-colors duration-300">
            <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-400 dark:bg-yellow-600 rounded-full blur-3xl opacity-20 dark:opacity-10 -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium mb-6 transition-colors duration-300">
              <MapPin size={18} className="text-blue-500 dark:text-blue-400" /> {city}, Tamil Nadu
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className="text-7xl font-display font-bold text-gray-800 dark:text-white transition-colors duration-300">{current.temp}°</span>
                  <Sun size={64} className="text-yellow-500 drop-shadow-lg" />
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mt-2 transition-colors duration-300">{current.condition}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl flex items-center gap-3 transition-colors duration-300">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-xl text-blue-500 dark:text-blue-400"><Droplets size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Humidity</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{current.humidity}%</p>
                  </div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-2xl flex items-center gap-3 transition-colors duration-300">
                  <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-xl text-indigo-500 dark:text-indigo-400"><Wind size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Wind</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{current.wind} km/h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Day Forecast */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><CalendarDays size={16} /> 5-Day Forecast</h4>
              <div className="flex justify-between">
                {forecast.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 bg-white/50 dark:bg-gray-700/50 px-3 py-4 rounded-2xl shadow-sm border border-white dark:border-gray-600 transition-colors duration-300">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{f.day}</span>
                    {f.icon}
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{f.temp}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sowing Recommendation */}
          <div className="bg-gradient-to-b from-farm-green to-green-800 dark:from-green-800 dark:to-green-900 p-8 rounded-3xl shadow-md border border-green-600 dark:border-green-800 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
            <div className="absolute -right-10 -bottom-10 opacity-20">
              <Sprout size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="bg-white/20 inline-block p-2 rounded-xl backdrop-blur-sm mb-4">
                <Sprout size={24} className="text-yellow-300" />
              </div>
              <h3 className="text-2xl font-display font-bold">Best Sowing Date</h3>
              <p className="text-green-100 mt-2 text-sm leading-relaxed">
                Soil moisture and upcoming rains make conditions ideal for sowing.
              </p>
            </div>
            
            <div className="relative z-10 mt-8 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-sm text-green-200 uppercase font-bold tracking-wider mb-1">Recommended Action</p>
              <p className="text-lg font-semibold text-white">Wait 3 Days</p>
              <p className="text-xs text-green-100 mt-2 line-clamp-2">Wait for the heavy rain to pass before planting seeds to avoid washout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
