import React, { useState } from 'react';
import { Workflow, Play, CheckCircle, RefreshCw, Server, ArrowRight, Rss, HardDrive, BellRing } from 'lucide-react';
import { PipelineStep } from '../types';

export function PipelineAutomationTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [feedUrl, setFeedUrl] = useState('https://www.ft.com/rss/home/uk');
  const [executionResult, setExecutionResult] = useState<{ executionId: string; steps: PipelineStep[] } | null>({
    executionId: 'exec_sample_94821',
    steps: [
      { id: 1, name: 'RSS Ingest & Normalization', status: 'completed', details: 'Parsed 14 items from Financial Times RSS feed' },
      { id: 2, name: 'LLM Script Rewriting', status: 'completed', details: 'Generated 2-minute empowering morning brief script via Gemini 3.5' },
      { id: 3, name: 'ElevenLabs / Gemini TTS Render', status: 'completed', details: 'Rendered 128kbps MP3 audio file with Voice ID (Kore)' },
      { id: 4, name: 'AzuraCast Cloud Storage Dispatch', status: 'completed', details: 'Dispatched to sftp://azuracast-storage/media/automated/morning_brief.mp3' }
    ]
  });

  const handleRunPipeline = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl })
      });
      const data = await res.json();
      if (data.success) {
        setExecutionResult({
          executionId: data.executionId,
          steps: data.steps
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Overview Card */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 text-[#F4F4F4] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">00. Webhook & Automation Engine</p>
          <h1 className="text-4xl font-serif italic mb-4 leading-none">n8n and Make.com Pipeline Simulator</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Test and trigger your automated morning broadcast pipeline. In production, this pipeline runs on a scheduled cron trigger every morning at 05:00 UTC, ingesting live feeds, synthesizing scripts and voice files, and pushing directly to your AzuraCast streaming server.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pipeline Trigger Configuration (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">01. Trigger Setup</p>
              <h2 className="text-3xl font-serif italic">Pipeline Controls</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Target RSS Feed URL</label>
                <div className="flex items-center space-x-2">
                  <Rss className="w-4 h-4 text-white/40 flex-shrink-0 ml-1" />
                  <input
                    type="url"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Webhook Endpoint (n8n / Make)</label>
                <input
                  type="text"
                  readOnly
                  value="https://webhook.station.aura24.io/v1/trigger-morning-brief"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2.5 text-xs text-white/60 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Storage Target</label>
                <div className="flex items-center space-x-2 text-xs text-white/70 bg-[#1A1A1A] border border-white/10 p-3 rounded-sm font-mono overflow-x-auto">
                  <HardDrive className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>sftp://azuracast.radio.local/media/automated/</span>
                </div>
              </div>

              <button
                onClick={handleRunPipeline}
                disabled={isRunning}
                className="w-full mt-4 py-3 px-4 rounded-sm bg-red-600 hover:bg-red-700 text-black font-bold text-xs uppercase tracking-widest font-mono flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Running Pipeline Simulation...' : 'Trigger Automated Pipeline Run'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Execution Monitor (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">02. Execution Log</p>
                <h3 className="text-3xl font-serif italic">Execution Status Monitor</h3>
              </div>
              {executionResult && (
                <span className="px-3 py-1 rounded-sm bg-white/5 text-white/80 text-xs font-mono border border-white/10 uppercase">
                  ID: {executionResult.executionId}
                </span>
              )}
            </div>

            {executionResult ? (
              <div className="space-y-4">
                {executionResult.steps.map((step) => (
                  <div key={step.id} className="flex items-start space-x-4 p-5 rounded-sm border border-white/10 bg-[#1A1A1A]">
                    <div className="w-8 h-8 rounded-sm bg-red-600/20 text-red-400 border border-red-600/30 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                      0{step.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white text-sm">{step.name}</h4>
                        <span className="flex items-center space-x-1 text-xs text-green-500 font-mono uppercase">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{step.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-white/30">
                <Workflow className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-xs font-mono uppercase">Trigger the pipeline above to view live execution logs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

