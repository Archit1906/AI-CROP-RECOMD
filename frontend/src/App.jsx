import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherPage from './pages/WeatherPage';
import MarketPrices from './pages/MarketPrices';
import MarketAnalytics from './pages/MarketAnalytics';
import Chatbot from './pages/Chatbot';
import GovernmentSchemes from './pages/GovernmentSchemes';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex h-screen hex-bg overflow-hidden text-[#E8E8E8]" style={{ background: '#0A0A0F' }}>
          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full lg:ml-0 ml-20" style={{ background: '#0A0A0F' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crop" element={<CropRecommendation />} />
              <Route path="/disease" element={<DiseaseDetection />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/market" element={<MarketPrices />} />
              <Route path="/market/analytics" element={<MarketAnalytics />} />
              <Route path="/chat" element={<Chatbot />} />
              <Route path="/schemes" element={<GovernmentSchemes />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
