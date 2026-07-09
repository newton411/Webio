import React, { useState } from 'react';
import { Sparkles, Mic, Play, RefreshCw, Volume2, Radio, CheckCircle, Clock } from 'lucide-react';
import { BroadcastScript } from '../types';

export function ScriptGeneratorTab() {
  const [topic, setTopic] = useState('Global renewable energy investments and morning discipline');
  const [category, setCategory] = useState('Financial Intelligence & Mindset');
  const [duration, setDuration] = useState(2);
  const [tone, setTone] = useState('upbeat');
  const [voice, setVoice] = useState('Kore');
  const [loadingScript, setLoadingScript] = useState(false);
  const [loadingTts, setLoadingTts] = useState(false);
  const [currentScript, setCurrentScript] = useState<BroadcastScript | null>({
    id: 'script_demo_1',
    topic: 'Global renewable energy investments and morning discipline',
    category: 'Financial Intelligence & Mindset',
    script: 'Good morning, AURA-24 listeners. You are tuned into autonomous intelligence for self-growth and financial clarity. Today, clean energy markets surged by four percent, signaling a massive structural shift in global capital allocation. But beyond the ticker symbols, what does this mean for your daily routine? When capital moves toward sustainability, it mirrors personal growth: small, consistent allocations compound into massive transformation. Today is your day to allocate focus to what truly matters. Stay tuned for our deep dive into behavioral economics at the top of the hour.',
    createdAt: new Date().toLocaleTimeString(),
    durationMinutes: 2,
    hostTone: 'upbeat'
  });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingScript(true);
    setErrorMsg(null);
    setAudioUrl(null);

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category, durationMinutes: duration, hostTone: tone })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentScript({
          id: `script_${Date.now()}`,
          topic,
          category,
          script: data.script,
          createdAt: new Date().toLocaleTimeString(),
          durationMinutes: duration,
          hostTone: tone
        });
      } else {
        setErrorMsg(data.error || 'Failed to generate script');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoadingScript(false);
    }
  };

  const handleGenerateTts = async () => {
    if (!currentScript) return;
    setLoadingTts(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentScript.script, voiceName: voice })
      });
      const data = await res.json();
      if (data.success && data.audio) {
        const binaryString = atob(data.audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        setErrorMsg(data.error || 'Failed to generate TTS audio');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'TTS generation network error');
    } finally {
      setLoadingTts(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-6 py-8">
      {/* Control Panel (Left 5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
          <div className="mb-6 pb-4 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">01. Studio Controls</p>
            <h2 className="text-3xl font-serif italic">Morning Host Studio</h2>
          </div>

          <form onSubmit={handleGenerateScript} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Broadcast Topic / News Feed Prompt</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-red-600"
                placeholder="Enter financial market trend or self-growth topic..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                >
                  <option>Financial Intelligence & Mindset</option>
                  <option>Behavioral Psychology</option>
                  <option>Sustainable Growth</option>
                  <option>Macro Market Briefing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Host Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                >
                  <option value="upbeat">Upbeat & Empowering</option>
                  <option value="analytical">Calm & Analytical</option>
                  <option value="stoic">Grounded & Stoic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                >
                  <option value={1}>1 Minute</option>
                  <option value={2}>2 Minutes</option>
                  <option value={3}>3 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Voice Model</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                >
                  <option value="Kore">Kore (Authoritative)</option>
                  <option value="Puck">Puck (Dynamic)</option>
                  <option value="Fenrir">Fenrir (Deep)</option>
                  <option value="Zephyr">Zephyr (Soothing)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingScript}
              className="w-full mt-4 py-3 px-4 rounded-sm bg-red-600 hover:bg-red-700 text-black font-bold text-xs uppercase tracking-widest font-mono flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loadingScript ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loadingScript ? 'Synthesizing Script...' : 'Generate Broadcast Script'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-600 text-red-300 text-xs rounded-sm font-mono">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Script Preview & Audio Player (Right 7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">02. Output Feed</p>
                <h3 className="text-3xl font-serif italic">Live Script & Audio Preview</h3>
              </div>
              {currentScript && (
                <div className="flex items-center space-x-2 text-xs text-white/50 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentScript.createdAt}</span>
                </div>
              )}
            </div>

            {currentScript ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-sm bg-white/5 text-white/80 text-[10px] font-mono uppercase border border-white/10">
                    {currentScript.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-sm bg-white/5 text-white/80 text-[10px] font-mono uppercase border border-white/10">
                    {currentScript.durationMinutes} Min Segment
                  </span>
                  <span className="px-2.5 py-1 rounded-sm bg-white/5 text-white/80 text-[10px] font-mono uppercase border border-white/10">
                    Voice: {voice}
                  </span>
                </div>

                <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6 text-white/90 text-sm leading-relaxed font-sans max-h-80 overflow-y-auto">
                  {currentScript.script}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-white/30">
                <Mic className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-xs font-mono uppercase">Generate a script to review broadcast copy.</p>
              </div>
            )}
          </div>

          {currentScript && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleGenerateTts}
                  disabled={loadingTts}
                  className="w-full sm:w-auto px-5 py-3 rounded-sm bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 border border-white/10"
                >
                  {loadingTts ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  <span>{loadingTts ? 'Synthesizing Audio...' : 'Generate Voice Audio (TTS)'}</span>
                </button>

                {audioUrl && (
                  <div className="w-full sm:w-auto flex items-center space-x-3 bg-red-600/10 border border-red-600/30 px-4 py-2 rounded-sm">
                    <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <audio controls src={audioUrl} className="h-9 w-full sm:w-64" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

