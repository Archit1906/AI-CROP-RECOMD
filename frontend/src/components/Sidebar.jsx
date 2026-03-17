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
  Languages
} from 'lucide-react';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
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
    <div className={`bg-white shadow-xl h-full flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20 lg:w-64'} fixed lg:relative z-50`}>
      <div className="flex items-center justify-between p-4 bg-farm-green text-white">
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
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-farm-light/10 text-farm-green font-bold' : 'text-gray-600 hover:bg-gray-100 hover:text-farm-green'
              }`
            }
            onClick={() => setIsExpanded(false)} // Close on mobile navigation
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className={`whitespace-nowrap ${!isExpanded && 'lg:block hidden'}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className={`bg-gray-50 p-2 rounded-lg ${!isExpanded && 'lg:block hidden'}`}>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2 font-semibold">
            <Languages size={16} />
            <span className={`${!isExpanded && 'lg:block hidden'}`}>Language</span>
          </div>
          <div className={`flex flex-col space-y-1 ${!isExpanded && 'lg:block hidden'}`}>
            <button onClick={() => changeLanguage('en')} className={`text-left text-sm p-1 rounded hover:bg-white ${i18n.language === 'en' ? 'font-bold text-farm-green' : ''}`}>English</button>
            <button onClick={() => changeLanguage('ta')} className={`text-left text-sm p-1 rounded hover:bg-white ${i18n.language === 'ta' ? 'font-bold text-farm-green' : ''}`}>தமிழ்</button>
            <button onClick={() => changeLanguage('hi')} className={`text-left text-sm p-1 rounded hover:bg-white ${i18n.language === 'hi' ? 'font-bold text-farm-green' : ''}`}>हिंदी</button>
          </div>
          {/* Condensed lang toggle */}
          <div className={`lg:hidden flex flex-col items-center space-y-2 py-2 ${isExpanded ? 'hidden' : 'flex'}`}>
            <button onClick={() => changeLanguage('en')} className={`text-xs ${i18n.language === 'en' ? 'text-farm-green font-bold' : 'text-gray-400'}`}>EN</button>
            <button onClick={() => changeLanguage('ta')} className={`text-xs ${i18n.language === 'ta' ? 'text-farm-green font-bold' : 'text-gray-400'}`}>TA</button>
            <button onClick={() => changeLanguage('hi')} className={`text-xs ${i18n.language === 'hi' ? 'text-farm-green font-bold' : 'text-gray-400'}`}>HI</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
