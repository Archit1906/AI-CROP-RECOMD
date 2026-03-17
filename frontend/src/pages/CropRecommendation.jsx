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
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-farm-green rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Sprout size={36} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">AI Crop Recommendation</h1>
              <p className="text-sm text-green-100 mt-1">Discover the most profitable crop based on your soil and climate data.</p>
            </div>
          </div>
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Sprout size={200} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Soil & Weather Inputs</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Nitrogen (N)</span> <span>{formData.nitrogen} mg/kg</span>
                </label>
                <input type="range" name="nitrogen" min="0" max="140" value={formData.nitrogen} onChange={handleChange} className="w-full accent-farm-green" />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Phosphorus (P)</span> <span>{formData.phosphorus} mg/kg</span>
                </label>
                <input type="range" name="phosphorus" min="0" max="145" value={formData.phosphorus} onChange={handleChange} className="w-full accent-farm-green" />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Potassium (K)</span> <span>{formData.potassium} mg/kg</span>
                </label>
                <input type="range" name="potassium" min="0" max="205" value={formData.potassium} onChange={handleChange} className="w-full accent-farm-green" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Humidity (%)</span> <span>{formData.humidity}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <Wind size={16} className="text-blue-400" />
                  <input type="range" name="humidity" min="0" max="100" value={formData.humidity} onChange={handleChange} className="w-full accent-blue-500" />
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Soil pH Level</span> <span>{formData.ph}</span>
                </label>
                <div className="flex items-center gap-2">
                  <Beaker size={16} className="text-purple-400" />
                  <input type="range" name="ph" min="0" max="14" step="0.1" value={formData.ph} onChange={handleChange} className="w-full accent-purple-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <div className="relative">
                    <Thermometer size={16} className="absolute left-3 top-3 text-red-400" />
                    <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-farm-green" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
                  <div className="relative">
                    <Droplets size={16} className="absolute left-3 top-3 text-blue-400" />
                    <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-farm-green" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-farm-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-sm flex justify-center items-center">
              {loading ? (
                 <span className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full"></span>
              ) : 'Get Recommendation'}
            </button>
          </form>

          {/* Result Section */}
          <div className="h-full">
            {result ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-farm-green animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-4 rounded-full text-farm-green">
                    <CheckCircle size={48} />
                  </div>
                </div>
                <h2 className="text-center text-gray-500 font-medium">Recommended Crop</h2>
                <h3 className="text-center text-4xl font-display font-bold text-gray-800 mt-2 flex items-center justify-center gap-2">
                  🌾 {result.recommended_crop}
                </h3>
                <div className="mt-4 text-center">
                   <span className="inline-block bg-green-50 text-farm-green px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                     {result.confidence} Confidence Score
                   </span>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-bold">Water Requirement</p>
                    <p className="text-gray-700">{result.details.water_req}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <p className="text-sm text-yellow-600 font-bold">Best Season</p>
                      <p className="text-gray-700">{result.details.season}</p>
                    </div>
                    <div className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-sm text-green-600 font-bold">Est. Profit</p>
                      <p className="text-gray-700">{result.details.avg_profit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border border-dashed border-gray-300 rounded-2xl h-full flex flex-col items-center justify-center text-gray-400 p-12 min-h-[400px]">
                <Sprout size={64} className="mb-4 text-gray-300" />
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
