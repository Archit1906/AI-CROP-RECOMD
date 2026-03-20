import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Sprout,
  Bug,
  Cloud,
  TrendingUp,
  MessageSquare,
  FileText,
  Menu,
  X,
  Languages,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false); // Can be toggled for mobile

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: t('nav.dashboard') },
    { to: '/crop', icon: <Sprout size={20} />, label: t('nav.crop') },
    { to: '/disease', icon: <Bug size={20} />, label: t('nav.disease') },
    { to: '/weather', icon: <Cloud size={20} />, label: t('nav.weather') },
    { to: '/market', icon: <TrendingUp size={20} />, label: t('nav.market') },
    { to: '/chat', icon: <MessageSquare size={20} />, label: t('nav.chatbot') },
    { to: '/schemes', icon: <FileText size={20} />, label: t('nav.schemes') },
  ];

  return (
    <div className={`bg-white dark:bg-[#0F1A0F] shadow-xl h-full flex flex-col transition-all duration-200 ${isExpanded ? 'w-64' : 'w-20 lg:w-64'} fixed lg:relative z-50 border-r border-gray-100 dark:border-[#2D4A2D]`}>
      <div className="flex items-center justify-between p-4 bg-farm-green dark:bg-transparent text-white transition-colors duration-200">
        <div className={`flex items-center space-x-2 font-display text-2xl ${!isExpanded && 'lg:flex hidden'}`}>
          <span>🌾</span>
          <span className="font-bold text-white">Amrit</span>
          <span className="font-bold text-[#22C55E]">Krishi</span>
        </div>
        <div className="lg:hidden flex items-center justify-center w-full">
           <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-farm-light rounded">
             {isExpanded ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      <nav className="flex-1 mt-4 space-y-2 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30 font-bold' : 'text-gray-400 hover:bg-[#1E2E1E] hover:text-white border border-transparent'
              }`
            }
            onClick={() => setIsExpanded(false)} // Close on mobile navigation
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className={`whitespace-nowrap ${!isExpanded && 'lg:block hidden'}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-[#2D4A2D] transition-colors duration-200">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className={`w-full flex items-center justify-center lg:justify-start space-x-3 p-3 rounded-xl mb-4 transition-colors duration-200 bg-gray-50 hover:bg-gray-100 dark:bg-[#162116] dark:hover:bg-[#1E2E1E] text-gray-600 dark:text-gray-400`}
        >
          {isDarkMode ? <Sun size={20} className="text-[#FBBF24]" /> : <Moon size={20} />}
          <span className={`font-semibold ${!isExpanded && 'lg:block hidden'}`}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <div className={`bg-gray-50 dark:bg-[#162116] p-2 rounded-xl transition-colors duration-200 ${!isExpanded && 'lg:block hidden'}`}>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2 font-semibold">
            <Languages size={16} />
            <span className={`${!isExpanded && 'lg:block hidden'}`}>Language</span>
          </div>
          <div className={`flex flex-col space-y-1 ${!isExpanded && 'lg:block hidden'}`}>
            <button onClick={() => changeLanguage('en')} className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-200 ${i18n.language === 'en' ? 'bg-green-500 text-black font-bold' : 'text-gray-400 hover:bg-[#1E2E1E] hover:text-white'}`}>English</button>
            <button onClick={() => changeLanguage('ta')} className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-200 ${i18n.language === 'ta' ? 'bg-green-500 text-black font-bold' : 'text-gray-400 hover:bg-[#1E2E1E] hover:text-white'}`}>தமிழ்</button>
            <button onClick={() => changeLanguage('hi')} className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-200 ${i18n.language === 'hi' ? 'bg-green-500 text-black font-bold' : 'text-gray-400 hover:bg-[#1E2E1E] hover:text-white'}`}>हिंदी</button>
          </div>
          {/* Condensed lang toggle */}
          <div className={`lg:hidden flex flex-col items-center space-y-2 py-2 ${isExpanded ? 'hidden' : 'flex'}`}>
            <button onClick={() => changeLanguage('en')} className={`text-xs px-2 py-1 rounded-full ${i18n.language === 'en' ? 'bg-green-500 text-black font-bold' : 'text-gray-400'}`}>EN</button>
            <button onClick={() => changeLanguage('ta')} className={`text-xs px-2 py-1 rounded-full ${i18n.language === 'ta' ? 'bg-green-500 text-black font-bold' : 'text-gray-400'}`}>த</button>
            <button onClick={() => changeLanguage('hi')} className={`text-xs px-2 py-1 rounded-full ${i18n.language === 'hi' ? 'bg-green-500 text-black font-bold' : 'text-gray-400'}`}>हि</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
