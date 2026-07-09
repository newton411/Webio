import React, { useState } from 'react';
import { Clock, Calendar, Shield, Zap, Volume2, Sliders, Filter } from 'lucide-react';
import { DaypartBlock } from '../types';

export function DaypartingMatrixTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const scheduleBlocks: DaypartBlock[] = [
    {
      hourRange: '05:00 - 08:00 UTC',
      slotName: 'Morning Momentum & Market Open',
      energyLevel: 'High',
      category: 'Financial Intelligence',
      hostPersona: 'AURA-1 (Upbeat & Authoritative)',
      description: 'High-tempo macro briefing, global index overview, and daily personal discipline prompt.'
    },
    {
      hourRange: '08:00 - 12:00 UTC',
      slotName: 'Deep Work & Cognitive Focus',
      energyLevel: 'Medium',
      category: 'Productivity & Science',
      hostPersona: 'AURA-2 (Analytical & Calm)',
      description: 'Binaural ambient soundscapes mixed with behavioral psychology and cognitive focus frameworks.'
    },
    {
      hourRange: '12:00 - 15:00 UTC',
      slotName: 'Midday Mindset & Resilience',
      energyLevel: 'Medium',
      category: 'Self-Growth',
      hostPersona: 'AURA-1 (Upbeat & Authoritative)',
      description: 'Midday reset briefing focusing on emotional regulation, leadership psychology, and stress resilience.'
    },
    {
      hourRange: '15:00 - 19:00 UTC',
      slotName: 'Afternoon Capital & Markets',
      energyLevel: 'High',
      category: 'Financial Intelligence',
      hostPersona: 'AURA-2 (Analytical & Calm)',
      description: 'Afternoon market movements, wealth accumulation principles, and long-term asset allocation strategy.'
    },
    {
      hourRange: '19:00 - 23:00 UTC',
      slotName: 'Evening Wind-Down & Reflection',
      energyLevel: 'Low',
      category: 'Awareness & Philosophy',
      hostPersona: 'AURA-3 (Soothing & Grounded)',
      description: 'Stoic philosophy readings, gratitude journaling prompts, and reflective acoustic soundscapes.'
    },
    {
      hourRange: '23:00 - 05:00 UTC',
      slotName: 'Night Autonomous Ambient Stream',
      energyLevel: 'Ambient',
      category: 'Sleep & Nervous System',
      hostPersona: 'AURA-3 (Soothing & Grounded)',
      description: 'Continuous ambient electronic soundscapes, theta wave frequencies, and quiet awareness meditations.'
    }
  ];

  const filteredBlocks = selectedCategory === 'All' 
    ? scheduleBlocks 
    : scheduleBlocks.filter(b => b.category === selectedCategory);

  const getEnergyBadge = (level: string) => {
    switch(level) {
      case 'High': return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'Medium': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      case 'Low': return 'bg-purple-600/20 text-purple-300 border-purple-600/30';
      case 'Ambient': return 'bg-white/10 text-white/70 border-white/20';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 text-[#F4F4F4] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">00. Programming Strategy</p>
          <h1 className="text-4xl font-serif italic mb-4 leading-none">24-Hour Dayparting Matrix</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Manage the linear programming schedule for your autonomous web radio station. Pacing content intensity across dayparts prevents listener fatigue while maintaining a cohesive balance of financial intelligence and self-growth.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0F0F0F] border border-white/10 rounded-sm p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-white/60">
          <Filter className="w-4 h-4 text-white/40" />
          <span>Filter by Category:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Financial Intelligence', 'Productivity & Science', 'Self-Growth', 'Awareness & Philosophy', 'Sleep & Nervous System'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors border ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-black border-red-600 font-bold' 
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlocks.map((block, idx) => (
          <div key={idx} className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm flex flex-col justify-between hover:border-white/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">{block.hourRange}</span>
                <span className={`px-2.5 py-0.5 rounded-sm text-[9px] font-mono uppercase border ${getEnergyBadge(block.energyLevel)}`}>
                  {block.energyLevel} Energy
                </span>
              </div>
              <h3 className="font-semibold text-white text-base mb-2">{block.slotName}</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6">{block.description}</p>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40 uppercase text-[10px]">Category</span>
                <span className="text-white/90 text-right">{block.category}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40 uppercase text-[10px]">Host</span>
                <span className="text-red-400 text-right">{block.hostPersona}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

