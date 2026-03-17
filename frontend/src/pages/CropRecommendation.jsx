import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Droplets, Thermometer, Wind, Beaker, CheckCircle } from 'lucide-react';
import axios from 'axios';

const CropRecommendation = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    temperature: 25,
    humidity: 60,
    ph: 7.0,
    rainfall: 150,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call for now structure
    setTimeout(() => {
      setResult({
        recommended_crop: 'Rice',
        confidence: '94%',
        details: {
          water_req: '1200-2000mm',
          season: 'Kharif',
          avg_profit: '₹25,000/acre'
        }
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-farm-green dark:bg-green-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden transition-colors duration-300">
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Sprout size={36} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">AI Crop Recommendation</h1>
              <p className="text-sm text-green-100 dark:text-green-200 mt-1">Discover the most profitable crop based on your soil and climate data.</p>
            </div>
          </div>
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Sprout size={200} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6 transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-300">Soil & Weather Inputs</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  <span>Nitrogen (N)</span> <span>{formData.nitrogen} mg/kg</span>
                </label>
                <input type="range" name="nitrogen" min="0" max="140" value={formData.nitrogen} onChange={handleChange} className="w-full accent-farm-green dark:accent-farm-light" />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  <span>Phosphorus (P)</span> <span>{formData.phosphorus} mg/kg</span>
                </label>
                <input type="range" name="phosphorus" min="0" max="145" value={formData.phosphorus} onChange={handleChange} className="w-full accent-farm-green dark:accent-farm-light" />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  <span>Potassium (K)</span> <span>{formData.potassium} mg/kg</span>
                </label>
                <input type="range" name="potassium" min="0" max="205" value={formData.potassium} onChange={handleChange} className="w-full accent-farm-green dark:accent-farm-light" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  <span>Humidity (%)</span> <span>{formData.humidity}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <Wind size={16} className="text-blue-400 dark:text-blue-500" />
                  <input type="range" name="humidity" min="0" max="100" value={formData.humidity} onChange={handleChange} className="w-full accent-blue-500 dark:accent-blue-400" />
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  <span>Soil pH Level</span> <span>{formData.ph}</span>
                </label>
                <div className="flex items-center gap-2">
                  <Beaker size={16} className="text-purple-400 dark:text-purple-500" />
                  <input type="range" name="ph" min="0" max="14" step="0.1" value={formData.ph} onChange={handleChange} className="w-full accent-purple-500 dark:accent-purple-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Temperature (°C)</label>
                  <div className="relative">
                    <Thermometer size={16} className="absolute left-3 top-3 text-red-400 dark:text-red-500" />
                    <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg outline-none focus:border-farm-green dark:focus:border-farm-light transition-colors duration-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Rainfall (mm)</label>
                  <div className="relative">
                    <Droplets size={16} className="absolute left-3 top-3 text-blue-400 dark:text-blue-500" />
                    <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg outline-none focus:border-farm-green dark:focus:border-farm-light transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-farm-gold hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 dark:text-gray-900 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-sm flex justify-center items-center">
              {loading ? (
                 <span className="animate-spin h-5 w-5 border-2 border-gray-900 dark:border-gray-900 border-t-transparent rounded-full"></span>
              ) : 'Get Recommendation'}
            </button>
          </form>

          {/* Result Section */}
          <div className="h-full">
            {result ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-farm-green dark:border-farm-light animate-in fade-in slide-in-from-bottom-4 transition-colors duration-300">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-full text-farm-green dark:text-farm-light transition-colors duration-300">
                    <CheckCircle size={48} />
                  </div>
                </div>
                <h2 className="text-center text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">Recommended Crop</h2>
                <h3 className="text-center text-4xl font-display font-bold text-gray-800 dark:text-white mt-2 flex items-center justify-center gap-2 transition-colors duration-300">
                  🌾 {result.recommended_crop}
                </h3>
                <div className="mt-4 text-center">
                   <span className="inline-block bg-green-50 dark:bg-green-900/30 text-farm-green dark:text-farm-light px-3 py-1 rounded-full text-sm font-bold border border-green-200 dark:border-green-800 transition-colors duration-300">
                     {result.confidence} Confidence Score
                   </span>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 transition-colors duration-300">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-bold">Water Requirement</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{result.details.water_req}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/50 transition-colors duration-300">
                      <p className="text-sm text-yellow-600 dark:text-yellow-500 font-bold">Best Season</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{result.details.season}</p>
                    </div>
                    <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50 transition-colors duration-300">
                      <p className="text-sm text-green-600 dark:text-green-400 font-bold">Est. Profit</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{result.details.avg_profit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-12 min-h-[400px] transition-colors duration-300">
                <Sprout size={64} className="mb-4 text-gray-300 dark:text-gray-600 transition-colors duration-300" />
                <p className="text-center">Enter your soil and weather data on the left to get a personalized crop recommendation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
