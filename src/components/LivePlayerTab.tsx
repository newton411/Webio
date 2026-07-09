import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, Volume2, Users, Activity, Signal, RadioTower, Sparkles } from 'lucide-react';

export function LivePlayerTab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Morning Brief: Sustainable Infrastructure & Capital Flow',
    host: 'AURA-1 (Autonomous Morning Host)',
    category: 'Financial Intelligence & Mindset',
    duration: '02:45'
  });
  const [listenerCount, setListenerCount] = useState(1428);

  useEffect(() => {
    const interval = setInterval(() => {
      setListenerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* On-Air Live Player Banner */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 lg:p-12 text-[#F4F4F4] shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-red-600/20 text-red-400 text-xs font-mono font-semibold tracking-wider border border-red-600/30">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>ON-AIR LIVE STREAM (AZURACAST MOUNT)</span>
            </div>

            <h1 className="text-4xl font-serif italic mb-4 leading-none">Neural Beat FM Autonomous Stream</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Broadcasting 24/7 self-growth, behavioral psychology, and financial intelligence powered by fully automated AI pipelines.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-white/70">
              <div className="flex items-center space-x-1.5 bg-[#1A1A1A] px-3.5 py-2 rounded-sm border border-white/10">
                <Users className="w-4 h-4 text-red-500" />
                <span>{listenerCount} Active Listeners</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#1A1A1A] px-3.5 py-2 rounded-sm border border-white/10">
                <Signal className="w-4 h-4 text-white/60" />
                <span>320kbps Stream</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#1A1A1A] px-3.5 py-2 rounded-sm border border-white/10">
                <Activity className="w-4 h-4 text-green-500" />
                <span>99.98% Uptime</span>
              </div>
            </div>
          </div>

          {/* Interactive Player Box */}
          <div className="w-full lg:w-96 bg-[#1A1A1A] border border-white/10 rounded-sm p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-sm bg-red-600 flex items-center justify-center text-black font-bold flex-shrink-0">
                <RadioTower className="w-6 h-6 animate-pulse" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Now Playing</span>
                <h3 className="font-semibold text-white text-sm truncate">{currentTrack.title}</h3>
                <p className="text-xs text-white/50 truncate">{currentTrack.host}</p>
              </div>
            </div>

            {/* Simulated Audio Waveform */}
            <div className="flex items-center justify-between h-10 bg-black/40 rounded-sm px-4 mb-5 border border-white/10">
              {[40, 70, 30, 90, 60, 45, 80, 50, 95, 65, 35, 75, 85, 55, 40, 70, 90, 60].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-white/30'}`}
                  style={{ height: isPlaying ? `${h}%` : '20%' }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full py-3 rounded-sm bg-red-600 hover:bg-red-700 text-black font-bold text-xs uppercase tracking-widest font-mono flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Station Stream' : 'Listen Live Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Playlist / Rotation Log */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Rotation Log</p>
            <h3 className="text-3xl font-serif italic">Recent Broadcast Rotation</h3>
          </div>
          <span className="text-xs font-mono text-white/50 uppercase">AutoDJ Rotation Active</span>
        </div>

        <div className="space-y-4">
          {[
            { time: '11:45 UTC', title: 'Macro Briefing: Inflation & Consumer Resilience', category: 'Financial Intelligence', duration: '03:15' },
            { time: '11:30 UTC', title: 'Deep Work Focus: Dopamine Regulation & Focus Loops', category: 'Productivity Science', duration: '04:00' },
            { time: '11:00 UTC', title: 'Station ID & Morning Mindfulness Anchor', category: 'Awareness', duration: '01:30' },
            { time: '10:45 UTC', title: 'Global Tech Index & Sustainable Energy Allocation', category: 'Financial Intelligence', duration: '03:45' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-5 rounded-sm border border-white/10 bg-[#1A1A1A]">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-white/40">{item.time}</span>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <span className="text-xs font-mono text-red-400 uppercase tracking-wider">{item.category}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-white/40">{item.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

