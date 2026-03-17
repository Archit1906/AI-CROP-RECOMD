import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, FileText, CheckCircle2, BookmarkPlus, Filter, ChevronRight, ShieldCheck, Banknote, HelpCircle } from 'lucide-react';

const SCHEMES_DB = [
  {
    name: "PM-KISAN",
    description: "₹6,000/year direct income support to farmer families",
    eligibility: "All small & marginal farmers",
    benefit: "₹6,000 annually in 3 installments",
    category: "Income Support",
    tags: ["Central", "Direct Benefit"],
    icon: <Banknote className="text-green-600" size={24} />,
    color: "bg-green-100"
  },
  {
    name: "Fasal Bima Yojana (PMFBY)",
    description: "Crop insurance scheme for crop failure against natural calamities",
    eligibility: "All farmers growing notified crops",
    benefit: "Insurance coverage for crop loss",
    category: "Insurance",
    tags: ["Central", "Protection"],
    icon: <ShieldCheck className="text-blue-600" size={24} />,
    color: "bg-blue-100"
  },
  {
    name: "Tamil Nadu Chief Minister's Drought Relief",
    description: "Relief for farmers affected by drought in TN.",
    eligibility: "TN farmers in drought-declared districts",
    benefit: "₹5,000 per acre compensation",
    category: "Drought Relief",
    tags: ["State", "Relief"],
    icon: <HelpCircle className="text-red-600" size={24} />,
    color: "bg-red-100"
  }
];

const GovernmentSchemes = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-display font-bold text-farm-green">Government Schemes</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">Updated recently</span>
              Find subsidies and insurance programs.
            </p>
          </div>
          <button className="bg-farm-gold hover:bg-yellow-500 text-yellow-900 px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2">
             <CheckCircle2 size={20} /> Check My Eligibility
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search schemes by name or keyword..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-farm-green focus:ring-1 focus:ring-farm-green" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Insurance', 'Income Support', 'Drought Relief', 'Subsidies'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === f ? 'bg-farm-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {SCHEMES_DB.filter(s => filter === 'All' || s.category === filter).map((scheme, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 flex flex-col transition-all duration-300 group hover:-translate-y-1">
              
              <div className="flex justify-between items-start mb-4">
                <div className={`${scheme.color} p-3 rounded-2xl`}>
                  {scheme.icon}
                </div>
                <button className="text-gray-400 hover:text-farm-gold transition-colors">
                  <BookmarkPlus size={24} />
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                {scheme.tags.map((tag, i) => (
                   <span key={i} className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded">
                     {tag}
                   </span>
                ))}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{scheme.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{scheme.description}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-semibold uppercase">Benefit</span>
                  <span className="font-bold text-gray-800">{scheme.benefit}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-semibold uppercase">Eligibility</span>
                  <span className="text-sm font-medium text-gray-700">{scheme.eligibility}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-farm-green hover:bg-green-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Apply Now
                </button>
                <button className="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <ChevronRight size={20} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GovernmentSchemes;
