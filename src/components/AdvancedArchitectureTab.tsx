import React, { useState } from 'react';
import { Workflow, Shield, Users, Mic, Radio, Copy, Check, Cpu, Server, Layers } from 'lucide-react';

export function AdvancedArchitectureTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const n8nWorkflowJson = `{
  "name": "AURA-24 Autonomous Ingestion & Scripting Pipeline",
  "nodes": [
    {
      "parameters": {
        "rule": { "interval": [{ "field": "hours", "hoursInterval": 1 }] }
      },
      "name": "Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "url": "https://www.ft.com/rss/home/uk",
        "options": {}
      },
      "name": "RSS Feed Ingest",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [{ "value1": "={{ $json.title }}", "operation": "contains", "value2": "market" }]
        }
      },
      "name": "Keyword Filter",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "prompt": "Summarize and rewrite into an empowering radio script: {{ $json.description }}"
      },
      "name": "Gemini 3.5 LLM Scriptwriter",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [850, 200]
    },
    {
      "parameters": {
        "url": "https://api.svix.com/api/v1/app/app_123/msg",
        "method": "POST",
        "bodyParametersJson": "{\\"eventType\\": \\"script.generated\\", \\"payload\\": {{ $json }}}"
      },
      "name": "Dispatch Svix Webhook",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [1050, 200]
    }
  ]
}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 text-[#F4F4F4] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">06. Enterprise Broadcast Systems</p>
          <h1 className="text-4xl font-serif italic mb-4 leading-none">Content Orchestration & Multi-Agent Architecture</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Comprehensive production blueprint covering n8n orchestration workflows, multi-agent editorial oversight (DJ vs. CEO), ElevenLabs Flash WebSockets, and AzuraCast Liquidsoap API integration.
          </p>
        </div>
      </div>

      {/* Section 1: n8n Orchestration */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">01. Workflow Engine</p>
            <h2 className="text-3xl font-serif italic">n8n Ingestion, Filtering & Webhook Dispatch</h2>
          </div>
          <button
            onClick={() => copyToClipboard(n8nWorkflowJson, 'n8n')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors border border-white/10"
          >
            {copiedSection === 'n8n' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'n8n' ? 'Copied' : 'Copy n8n JSON'}</span>
          </button>
        </div>

        <p className="text-xs text-white/70 leading-relaxed">
          The n8n workflow operates on a scheduled cron trigger (hourly or daily at 05:00 UTC), pulling RSS feeds from financial and psychology journals. Incoming articles pass through a keyword filter (`market`, `growth`, `awareness`, `inflation`), and qualifying items are transformed into broadcast scripts via Gemini before being signed and dispatched securely via Svix webhooks.
        </p>

        <div className="bg-black/40 border border-white/10 text-blue-300 rounded-sm p-6 font-mono text-xs leading-relaxed overflow-x-auto max-h-72">
          <pre>{n8nWorkflowJson}</pre>
        </div>
      </div>

      {/* Section 2: Multi-Agent Oversight Structure */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">02. Editorial Hierarchy</p>
          <h2 className="text-3xl font-serif italic">Multi-Agent Oversight Structure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-sm bg-red-600/20 text-red-400 border border-red-600/30 flex items-center justify-center font-mono font-bold text-xs">
                AI-1
              </div>
              <h3 className="font-semibold text-white text-base">DJ / Operations Agent</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Responsible for rapid content drafting. Ingests raw news feeds, applies radio pacing rules, introduces catchy station hooks, and formats prose for conversational TTS delivery.
            </p>
            <span className="text-[10px] font-mono text-red-400 uppercase">Speed & Creativity Focus</span>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-sm bg-blue-600/20 text-blue-300 border border-blue-600/30 flex items-center justify-center font-mono font-bold text-xs">
                AI-2
              </div>
              <h3 className="font-semibold text-white text-base">CEO / Oversight Agent</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Acts as the rigorous editorial gatekeeper. Reviews DJ drafts for factual accuracy, alignment with self-growth tone, emotional resonance, and prevents hallucination loops or redundant phrasing before approving for ElevenLabs TTS generation.
            </p>
            <span className="text-[10px] font-mono text-blue-300 uppercase">Alignment & Safety Gateway</span>
          </div>
        </div>
      </div>

      {/* Section 3: ElevenLabs WebSockets & Flash Models */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">03. Voice Synthesis Engine</p>
          <h2 className="text-3xl font-serif italic">ElevenLabs WebSockets & Flash Models</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">Multilingual v2 & Flash</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Utilize `eleven_flash_v2_5` for ultra-low latency (~75ms) streaming synthesis, perfect for live interactive or dynamic caller segments.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-sm text-white mb-2">Bidirectional WebSockets</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Open a persistent WebSocket connection to `/v1/text-to-speech/{voice_id}/stream-input` to stream text chunks and receive interleaved audio packets in real-time.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">Stability & Similarity</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Tune voice settings (`stability: 0.45`, `similarity_boost: 0.85`, `style: 0.20`) to achieve professional broadcast warmth without artifacts.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: AzuraCast Playout & Broadcasting */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">04. Playout & Automation</p>
          <h2 className="text-3xl font-serif italic">AzuraCast, Liquidsoap & Icecast Integration</h2>
        </div>

        <p className="text-xs text-white/70 leading-relaxed">
          To broadcast AI-generated content 24/7 alongside music rotations, the pipeline uploads rendered MP3 files via SFTP or the AzuraCast Media API into dedicated automated playlist directories (e.g., `/var/lib/azuracast/stations/aura/media/automated/`). Liquidsoap scripts inside AzuraCast automatically schedule these speech tracks between music blocks based on dayparting rules.
        </p>

        <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6 font-mono text-xs text-white/80 space-y-2">
          <p className="text-red-400 font-bold"># AzuraCast API Track Ingestion Example</p>
          <p>POST /api/station/aura/media</p>
          <p>Authorization: Bearer azuracast_api_key_...</p>
          <p>Payload: {"{ \"path\": \"automated/morning_brief.mp3\", \"playlist\": \"Hourly Briefings\" }"}</p>
        </div>
      </div>
    </div>
  );
}
