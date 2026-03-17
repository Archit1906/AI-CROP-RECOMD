import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherPage from './pages/WeatherPage';
import MarketPrices from './pages/MarketPrices';
import Chatbot from './pages/Chatbot';
import GovernmentSchemes from './pages/GovernmentSchemes';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-body overflow-hidden text-gray-900 dark:text-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full lg:ml-0 ml-20 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crop" element={<CropRecommendation />} />
              <Route path="/disease" element={<DiseaseDetection />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/market" element={<MarketPrices />} />
              <Route path="/chat" element={<Chatbot />} />
              <Route path="/schemes" element={<GovernmentSchemes />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
