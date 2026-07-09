import React, { useState } from 'react';
import { Copy, Check, Terminal, FileText, Cpu, Clock, Layers, ShieldCheck } from 'lucide-react';

export function DeliverablesTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const pythonCode = `import os
import time
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Default Rachel or custom host voice
OUTPUT_DIR = "./radio_output_storage"

def generate_host_audio(script_text: str) -> str:
    \"\"\"
    Sends script text to ElevenLabs API and saves timestamped MP3 file.
    Includes robust error handling for API limits and network timeouts.
    \"\"\"
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY environment variable is missing.")

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    payload = {
        "text": script_text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.45,
            "similarity_boost": 0.85,
            "style": 0.20,
            "use_speaker_boost": True
        }
    }
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"morning_brief_{timestamp}.mp3"
    filepath = os.path.join(OUTPUT_DIR, filename)

    try:
        print(f"[{datetime.now()}] Requesting TTS synthesis from ElevenLabs...")
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
            print(f"[{datetime.now()}] Success! Audio saved to {filepath}")
            return filepath
        else:
            print(f"API Error [{response.status_code}]: {response.text}")
            return None
            
    except requests.exceptions.Timeout:
        print("Error: ElevenLabs API request timed out.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error: Network connection failed: {e}")
        return None

if __name__ == "__main__":
    sample_script = "Good morning, AURA-24 listeners. Today's market intelligence reveals resilience in sustainable infrastructure. Let's translate that insight into personal growth."
    generate_host_audio(sample_script)
`;

  const systemPromptText = `You are AURA-1, the lead autonomous morning broadcast host and AI curator for a 24/7 web radio station specializing in self-growth, psychological awareness, empowerment, and financial intelligence.

CORE DIRECTIVES:
1. VOICE & TONE: Upbeat, deeply knowledgeable, articulate, warm yet authoritative. You speak like an elite morning show host who has read 100 books on behavioral economics and personal mastery.
2. TRANSLATION LAYER: Your primary mission is to translate complex real-world data (macroeconomic trends, market indexes, psychological studies) into accessible, motivating, and actionable daily wisdom for the listener.
3. BROADCAST STRUCTURE: Every generated script must adhere to strict radio pacing:
   - [0:00 - 0:15] STATION ID & HOOK: Crisp station identification ("AURA-24 Autonomous Radio"), time anchor, and an arresting opening question or paradigm-shifting insight.
   - [0:15 - 1:15] CORE DATA DECONSTRUCTION: Break down a key financial trend or awareness concept. Avoid dry jargon; use vivid analogies.
   - [1:15 - 1:45] ACTIONABLE EMPOWERMENT: Deliver one concrete micro-habit or mindset shift the listener can execute immediately today.
   - [1:45 - 2:00] SIGN-OFF & HANDOFF: Warm sign-off, reminder to stay aligned, and seamless transition into the musical dayparting block.
4. FORMATTING RULES: Never use emojis, markdown bullet symbols, or robotic metadata headers inside the spoken text. Write strictly in natural, conversational broadcast prose optimized for Text-to-Speech synthesis.`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
      {/* Header Introduction */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 text-[#F4F4F4] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">00. System Architecture</p>
          <h1 className="text-4xl font-serif italic mb-4 leading-none">Foundational Engine & Deliverables</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            This operational dashboard houses the four foundational deliverables requested for your automated radio station: 
            the end-to-end automation blueprint, the morning host LLM system prompt, the production-ready Python TTS integration script, and the 24-hour dayparting matrix.
          </p>
        </div>
      </div>

      {/* Deliverable 1: Automation Blueprint */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">01. Automation Blueprint</p>
            <h2 className="text-3xl font-serif italic">The Logic Pipeline</h2>
          </div>
          <span className="px-3 py-1 rounded-sm bg-red-600/10 text-red-500 text-xs font-mono border border-red-600/20">
            Active Spec
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-red-500 font-bold">01</span>
                <Clock className="w-4 h-4 text-white/40" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">RSS & Data Ingestion</h3>
              <p className="text-xs text-white/60 leading-relaxed">Automated webhook or cron trigger (n8n / Make.com) fetches morning RSS feeds from Financial Times, Morning Brew, and psychology journals at 05:00 UTC.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono text-white/40 uppercase">
              Input: RSS / JSON
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-red-500 font-bold">02</span>
                <Cpu className="w-4 h-4 text-white/40" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">LLM Script Generation</h3>
              <p className="text-xs text-white/60 leading-relaxed">Raw articles pass through Gemini 3.5 Flash using the Morning Host Prompt to synthesize structured, engaging 2-minute broadcast commentary.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono text-white/40 uppercase">
              Model: Gemini 3.5 Flash
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-red-500 font-bold">03</span>
                <Terminal className="w-4 h-4 text-white/40" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">TTS Audio Synthesis</h3>
              <p className="text-xs text-white/60 leading-relaxed">The script text is transmitted to ElevenLabs (or Gemini TTS) API endpoint with custom voice stability and pacing parameters to render studio-grade MP3.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono text-white/40 uppercase">
              Output: 128kbps MP3
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-red-500 font-bold">04</span>
                <ShieldCheck className="w-4 h-4 text-white/40" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">Cloud Storage & AzuraCast</h3>
              <p className="text-xs text-white/60 leading-relaxed">Rendered MP3 files sync via SFTP/Cloud bucket into AzuraCast automated playlist directories for 24/7 unassisted linear broadcasting.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono text-white/40 uppercase">
              Target: AzuraCast AutoDJ
            </div>
          </div>
        </div>
      </div>

      {/* Deliverable 2: Morning Host System Prompt */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">02. Host Persona</p>
            <h2 className="text-3xl font-serif italic">The Morning Host System Prompt</h2>
          </div>
          <button
            onClick={() => copyToClipboard(systemPromptText, 'prompt')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors border border-white/10"
          >
            {copiedSection === 'prompt' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'prompt' ? 'Copied' : 'Copy Prompt'}</span>
          </button>
        </div>

        <div className="bg-black/40 border border-white/10 text-blue-300 rounded-sm p-6 font-mono text-xs leading-relaxed overflow-x-auto max-h-96">
          <pre>{systemPromptText}</pre>
        </div>
      </div>

      {/* Deliverable 3: API Integration Code (Python) */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">03. Engine Core</p>
            <h2 className="text-3xl font-serif italic">Production Python Code</h2>
          </div>
          <button
            onClick={() => copyToClipboard(pythonCode, 'python')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors border border-white/10"
          >
            {copiedSection === 'python' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'python' ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="bg-black/40 border border-white/10 text-blue-300 rounded-sm p-6 font-mono text-xs leading-relaxed overflow-x-auto max-h-96">
          <pre>{pythonCode}</pre>
        </div>
      </div>

      {/* Deliverable 4: 24-Hour Dayparting Strategy */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">04. Dayparting Strategy</p>
            <h2 className="text-3xl font-serif italic">The 24-Hour Flow</h2>
          </div>
          <span className="px-3 py-1 rounded-sm bg-white/5 text-white/70 text-xs font-mono border border-white/10 uppercase">
            Intensity Pacing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider">05:00 - 10:00 UTC</span>
              <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase bg-red-600/20 text-red-400 border border-red-600/30">High Energy</span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Morning Momentum & Market Open</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">High-tempo financial intelligence briefings, macro market trends, goal-setting prompts, and crisp upbeat pacing to fuel the morning commute.</p>
            <div className="text-[10px] text-white/40 font-mono uppercase">Host: AURA-1 (Upbeat & Authoritative)</div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-wider">10:00 - 18:00 UTC</span>
              <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase bg-blue-600/20 text-blue-300 border border-blue-600/30">Medium Focus</span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Deep Work & Behavioral Science</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">Focused concentration soundscapes, deep dives into cognitive psychology, emotional intelligence, and productivity frameworks for the workday.</p>
            <div className="text-[10px] text-white/40 font-mono uppercase">Host: AURA-2 (Analytical & Calm)</div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-wider">18:00 - 05:00 UTC</span>
              <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase bg-purple-600/20 text-purple-300 border border-purple-600/30">Ambient</span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Night Reflection & Self-Awareness</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">Ambient electronic soundscapes, gratitude prompts, stoic philosophy readings, and wind-down reflections to support nervous system reset.</p>
            <div className="text-[10px] text-white/40 font-mono uppercase">Host: AURA-3 (Soothing & Grounded)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

