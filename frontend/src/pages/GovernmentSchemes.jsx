import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, FileText, CheckCircle2, BookmarkPlus, Filter, ChevronRight, ShieldCheck, Banknote, HelpCircle } from 'lucide-react';

const SCHEMES_DB = [
  {
    name: "PM-KISAN",
    description: "₹6,000/year direct financial support clearance.",
    eligibility: "All registered security class 1 agents (Small/Marginal)",
    benefit: "₹6,000 ANNUALLY (3 CYCLES)",
    category: "Income Support",
    tags: ["CENTRAL", "DIRECT TRANSFER"],
    icon: <Banknote className="flicker" color="#FF6600" size={28} />,
    color: "#FF6600"
  },
  {
    name: "FASAL BIMA YOJANA (PMFBY)",
    description: "Asset protection protocol against anomalous weather events.",
    eligibility: "Agents with registered biological assets",
    benefit: "FULL ASSET COVERAGE",
    category: "Insurance",
    tags: ["CENTRAL", "SHIELD PROTOCOL"],
    icon: <ShieldCheck className="flicker" color="#00FFFF" size={28} />,
    color: "#00FFFF"
  },
  {
    name: "TN DROUGHT RELIEF",
    description: "Emergency support funds for critical zone operatives.",
    eligibility: "Operatives in classified drought zones",
    benefit: "₹5,000 PER UNIT COMPENSATED",
    category: "Drought Relief",
    tags: ["STATE", "EMERGENCY"],
    icon: <HelpCircle className="flicker" color="#FF0033" size={28} />,
    color: "#FF0033"
  }
];

const GovernmentSchemes = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');

  return (
    <div className="min-h-screen hex-bg p-4 lg:p-8" style={{ background: '#0A0A0F', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #1A0500 0%, transparent 100%)',
          borderBottom: '1px solid #FF660066',
          padding: '24px 32px', position: 'relative', overflow: 'hidden',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16
        }}>
          <div>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF660088', fontSize: 11, letterSpacing: 3, margin: '0 0 4px' }}>
              // CLEARANCE REQUIRED
            </p>
            <h1 className="text-3xl font-bold uppercase glitch-text" style={{ fontFamily: "'Orbitron', sans-serif", color: '#FF6600', letterSpacing: 3, textShadow: '0 0 20px #FF660066', margin: 0 }}>
              FEDERAL DIRECTIVES
            </h1>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#E8E8E8', fontSize: 12, marginTop: 8, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ background: '#FF003322', color: '#FF0033', padding: '2px 8px', border: '1px solid #FF0033', fontSize: 10, letterSpacing: 2 }}>RESTRICTED</span>
              ARCHIVE OF SUBSIDIES AND SHIELD PROGRAMS
            </p>
          </div>
          <button 
            className="nge-hover font-bold"
            style={{ 
              background: '#FFD70022', border: '1px solid #FFD700', color: '#FFD700',
              padding: '12px 24px', fontFamily: "'Orbitron', sans-serif", letterSpacing: 2, fontSize: 12, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
              boxShadow: '0 0 10px #FFD70022', borderRadius: 2
            }}
          >
             <CheckCircle2 size={18} /> VERIFY CLEARANCE
          </button>
        </div>

        {/* Search & Filter */}
        <div className="nge-card" data-label="// INDEX QUERY" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: 16, borderLeft: '4px solid #00FFFF' }}>
          <div className="relative flex-1" style={{ minWidth: 280 }}>
            <Search size={18} className="absolute left-3 top-3 text-[#00FFFF88]" />
            <input 
              type="text" 
              placeholder="SEARCH DIRECTIVES..." 
              className="w-full pl-10 pr-4 py-2 bg-[#0D0D1A] border outline-none transition-all duration-300"
              style={{
                borderColor: '#00FFFF44', color: '#00FFFF', fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, fontSize: 13, borderRadius: 2
              }}
              onFocus={e => { e.target.style.borderColor = '#00FFFF'; e.target.style.boxShadow = '0 0 15px #00FFFF33'; }}
              onBlur={e => { e.target.style.borderColor = '#00FFFF44'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {['All', 'Insurance', 'Income Support', 'Drought Relief', 'Subsidies'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className="whitespace-nowrap px-4 py-2 font-bold transition-all duration-300 uppercase"
                style={{
                  background: filter === f ? '#00FFFF22' : '#0D0D1A',
                  color: filter === f ? '#00FFFF' : '#666680',
                  border: `1px solid ${filter === f ? '#00FFFF' : '#00FFFF44'}`,
                  borderRadius: 2, letterSpacing: 1, fontSize: 11
                }}
              >
                {filter === f ? `[ ${f} ]` : f}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {SCHEMES_DB.filter(s => filter === 'All' || s.category === filter).map((scheme, idx) => (
            <div key={idx} className="nge-card flex flex-col group overflow-hidden" data-label={`// CLASS-${idx + 1} DIRECTIVE`} style={{ padding: 0, borderTopColor: scheme.color }}>
              <div style={{ padding: '24px', background: '#0D0D1A', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                <div className="flex justify-between items-start mb-6">
                  <div style={{ background: `${scheme.color}11`, border: `1px solid ${scheme.color}`, padding: '12px', borderRadius: 2, boxShadow: `0 0 10px ${scheme.color}22` }}>
                    {scheme.icon}
                  </div>
                  <button className="text-[#666680] hover:text-[#FF6600] transition-colors duration-300">
                    <BookmarkPlus size={24} />
                  </button>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                  {scheme.tags.map((tag, i) => (
                     <span key={i} style={{ 
                       background: '#0A0A0F', border: `1px solid ${scheme.color}66`, color: scheme.color, 
                       fontSize: 9, padding: '4px 8px', fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, fontWeight: 700 
                     }}>
                       [{tag}]
                     </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 leading-tight uppercase" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: 1 }}>{scheme.name}</h3>
                <p className="text-[#E8E8E8] text-sm mb-6" style={{ fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.6 }}>{scheme.description}</p>
                
                <div className="mt-auto pt-6 border-t space-y-4" style={{ borderColor: `${scheme.color}33`, fontFamily: "'Share Tech Mono', monospace" }}>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#666680] font-bold uppercase tracking-[2px] mb-1">GRANT AMOUNT</span>
                    <span className="text-[13px] font-bold" style={{ color: scheme.color }}>{scheme.benefit}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#666680] font-bold uppercase tracking-[2px] mb-1">REQUIREMENTS</span>
                    <span className="text-[13px] font-medium text-[#00FFFF]">{scheme.eligibility.toUpperCase()}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button className="flex-1 font-bold py-3 uppercase transition-all duration-300 flex justify-center items-center group-hover:shadow-[0_0_15px_rgba(255,102,0,0.3)]"
                    style={{ background: '#FF660022', border: '1px solid #FF6600', color: '#FF6600', fontFamily: "'Orbitron', sans-serif", letterSpacing: 2, fontSize: 11, borderRadius: 2 }}>
                    REQUEST AUTHORIZATION
                  </button>
                  <button className="px-4 py-3 bg-[#0A0A0F] text-[#FF6600] border border-[#FF660044] hover:bg-[#FF660011] transition-colors duration-300 flex items-center justify-center" style={{ borderRadius: 2 }}>
                    <ChevronRight size={18} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GovernmentSchemes;
