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
    <div className={`bg-white dark:bg-gray-800 shadow-xl h-full flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20 lg:w-64'} fixed lg:relative z-50 border-r border-gray-100 dark:border-gray-700`}>
      <div className="flex items-center justify-between p-4 bg-farm-green dark:bg-gray-900 text-white transition-colors duration-300">
        <div className={`flex items-center space-x-2 font-display font-bold text-xl ${!isExpanded && 'lg:flex hidden'}`}>
          <Sprout size={28} className="text-farm-gold" />
          <span>AmritKrishi</span>
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
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 ${
                isActive ? 'bg-farm-light/10 dark:bg-farm-light/20 text-farm-green dark:text-farm-light font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-farm-green dark:hover:text-farm-light'
              }`
            }
            onClick={() => setIsExpanded(false)} // Close on mobile navigation
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className={`whitespace-nowrap ${!isExpanded && 'lg:block hidden'}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className={`w-full flex items-center justify-center lg:justify-start space-x-3 p-3 rounded-lg mb-4 transition-colors duration-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300`}
        >
          {isDarkMode ? <Sun size={20} className="text-farm-gold" /> : <Moon size={20} />}
          <span className={`font-semibold ${!isExpanded && 'lg:block hidden'}`}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <div className={`bg-gray-50 dark:bg-gray-700 p-2 rounded-lg transition-colors duration-300 ${!isExpanded && 'lg:block hidden'}`}>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2 font-semibold">
            <Languages size={16} />
            <span className={`${!isExpanded && 'lg:block hidden'}`}>Language</span>
          </div>
          <div className={`flex flex-col space-y-1 ${!isExpanded && 'lg:block hidden'}`}>
            <button onClick={() => changeLanguage('en')} className={`text-left text-sm p-1 rounded hover:bg-white dark:hover:bg-gray-600 dark:text-gray-200 ${i18n.language === 'en' ? 'font-bold text-farm-green dark:text-farm-light' : ''}`}>English</button>
            <button onClick={() => changeLanguage('ta')} className={`text-left text-sm p-1 rounded hover:bg-white dark:hover:bg-gray-600 dark:text-gray-200 ${i18n.language === 'ta' ? 'font-bold text-farm-green dark:text-farm-light' : ''}`}>தமிழ்</button>
            <button onClick={() => changeLanguage('hi')} className={`text-left text-sm p-1 rounded hover:bg-white dark:hover:bg-gray-600 dark:text-gray-200 ${i18n.language === 'hi' ? 'font-bold text-farm-green dark:text-farm-light' : ''}`}>हिंदी</button>
          </div>
          {/* Condensed lang toggle */}
          <div className={`lg:hidden flex flex-col items-center space-y-2 py-2 ${isExpanded ? 'hidden' : 'flex'}`}>
            <button onClick={() => changeLanguage('en')} className={`text-xs ${i18n.language === 'en' ? 'text-farm-green dark:text-farm-light font-bold' : 'text-gray-400 dark:text-gray-500'}`}>EN</button>
            <button onClick={() => changeLanguage('ta')} className={`text-xs ${i18n.language === 'ta' ? 'text-farm-green dark:text-farm-light font-bold' : 'text-gray-400 dark:text-gray-500'}`}>TA</button>
            <button onClick={() => changeLanguage('hi')} className={`text-xs ${i18n.language === 'hi' ? 'text-farm-green dark:text-farm-light font-bold' : 'text-gray-400 dark:text-gray-500'}`}>HI</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
