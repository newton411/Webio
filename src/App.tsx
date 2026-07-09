import React, { useState } from 'react';
import { Radio, Sparkles, Workflow, Clock, Layers, ShieldCheck, Cpu, DollarSign, Terminal } from 'lucide-react';
import { DeliverablesTab } from './components/DeliverablesTab';
import { ScriptGeneratorTab } from './components/ScriptGeneratorTab';
import { PipelineAutomationTab } from './components/PipelineAutomationTab';
import { DaypartingMatrixTab } from './components/DaypartingMatrixTab';
import { LivePlayerTab } from './components/LivePlayerTab';
import { SvixWebhookTab } from './components/SvixWebhookTab';
import { AdvancedArchitectureTab } from './components/AdvancedArchitectureTab';
import { MonetizationImagingTab } from './components/MonetizationImagingTab';
import { ProductionOrchestrationTab } from './components/ProductionOrchestrationTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'deliverables' | 'generator' | 'pipeline' | 'dayparting' | 'player' | 'svix' | 'architecture' | 'monetization' | 'orchestrator'>('orchestrator');

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F4F4F4] font-sans antialiased flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0F0F0F] sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic font-serif">Neural Beat FM // 24.7 Autonomous</h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/5 p-1 rounded-sm border border-white/10">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'architecture'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('svix')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'svix'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Svix Webhooks</span>
          </button>

          <button
            onClick={() => setActiveTab('deliverables')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'deliverables'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Deliverables</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'generator'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'pipeline'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('dayparting')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'dayparting'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Dayparting</span>
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'player'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Player</span>
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'monetization'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetization & Ads</span>
          </button>

          <button
            onClick={() => setActiveTab('orchestrator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'orchestrator'
                ? 'bg-red-600 text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Orchestrator Code</span>
          </button>
        </nav>

        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-white/50 hidden lg:flex font-mono">
          <span className="flex items-center gap-1.5"><b className="text-white">BITRATE:</b> 320 KBPS</span>
          <span className="flex items-center gap-1.5"><b className="text-white">SERVER:</b> AZURACAST</span>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden overflow-x-auto bg-[#1A1A1A] p-2 border-b border-white/10 space-x-1">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Architecture
        </button>
        <button
          onClick={() => setActiveTab('svix')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'svix' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Svix
        </button>
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'deliverables' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Deliverables
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'generator' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Studio
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'pipeline' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Pipeline
        </button>
        <button
          onClick={() => setActiveTab('dayparting')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'dayparting' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Dayparting
        </button>
        <button
          onClick={() => setActiveTab('player')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'player' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Player
        </button>
        <button
          onClick={() => setActiveTab('monetization')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'monetization' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Monetization
        </button>
        <button
          onClick={() => setActiveTab('orchestrator')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase whitespace-nowrap ${
            activeTab === 'orchestrator' ? 'bg-red-600 text-black font-bold' : 'text-white/60'
          }`}
        >
          Orchestrator
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 overflow-y-auto">
        {activeTab === 'architecture' && <AdvancedArchitectureTab />}
        {activeTab === 'svix' && <SvixWebhookTab />}
        {activeTab === 'deliverables' && <DeliverablesTab />}
        {activeTab === 'generator' && <ScriptGeneratorTab />}
        {activeTab === 'pipeline' && <PipelineAutomationTab />}
        {activeTab === 'dayparting' && <DaypartingMatrixTab />}
        {activeTab === 'player' && <LivePlayerTab />}
        {activeTab === 'monetization' && <MonetizationImagingTab />}
        {activeTab === 'orchestrator' && <ProductionOrchestrationTab />}
      </main>

      {/* Footer */}
      <footer className="h-12 bg-red-600 flex items-center px-8 justify-between text-black font-bold text-[10px] uppercase tracking-[0.2em] font-mono z-10">
        <span>Neural Beat Autonomous Engine // Build v4.0.2</span>
        <span>Stream Active: Local Node 09-X</span>
      </footer>
    </div>
  );
}

