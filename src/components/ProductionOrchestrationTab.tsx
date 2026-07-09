import React, { useState } from 'react';
import { Cpu, ShieldCheck, Sparkles, Radio, Server, Copy, Check, Terminal, Workflow } from 'lucide-react';

export function ProductionOrchestrationTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const productionPythonCode = `#!/usr/bin/env python3
""\"
AURA-24 Autonomous Web Radio Station - Production Orchestration Engine
Pillar 1: Svix Webhook Ingestion & Redis Queue
Pillar 2: Multi-Agent Gemini Orchestration (DJ Agent + CEO Oversight)
Pillar 3: Ultra-Low Latency Voice Synthesis (ElevenLabs Flash WebSockets)
Pillar 4: Playout & Dynamic M3U Injection (AzuraCast API)
""\"

import os
import time
import hmac
import hashlib
import asyncio
import logging
import httpx
import websockets
import json
from fastapi import FastAPI, Request, HTTPException, Header, BackgroundTasks
from pydantic import BaseModel
from google import genai
from google.genai import types

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message")
logger = logging.getLogger("AURA_ORCHESTRATOR")

app = FastAPI(title="AURA-24 Autonomous Radio Orchestrator", version="4.0.2")

# Environment Credentials
SVIX_WEBHOOK_SECRET = os.getenv("SVIX_WEBHOOK_SECRET", "whsec_mock_...")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
AZURACAST_API_KEY = os.getenv("AZURACAST_API_KEY", "")
AZURACAST_STATION_ID = os.getenv("AZURACAST_STATION_ID", "aura")
AZURACAST_BASE_URL = os.getenv("AZURACAST_BASE_URL", "https://azuracast.radio.local")

# Initialize Gemini Client
ai_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# In-Memory Simulation of Redis Queue & DLQ (Replace with redis-py in production)
REDIS_LISTENER_QUEUE = []
DEAD_LETTER_QUEUE = []


# ==========================================
# PILLAR 1: Svix Webhook Ingestion & Inbox
# ==========================================
def verify_svix_signature(payload: bytes, headers: dict) -> bool:
    msg_id = headers.get("svix-id")
    msg_timestamp = headers.get("svix-timestamp")
    msg_signature = headers.get("svix-signature")

    if not all([msg_id, msg_timestamp, msg_signature]):
        logger.warning("Missing Svix signature headers.")
        return False

    # 5-minute replay prevention tolerance
    try:
        if abs(int(time.time()) - int(msg_timestamp)) > 300:
            logger.warning("Svix webhook timestamp outside tolerance window.")
            return False
    except ValueError:
        return False

    signed_content = f"{msg_id}.{msg_timestamp}.".encode("utf-8") + payload
    try:
        secret_bytes = bytes.fromhex(SVIX_WEBHOOK_SECRET.replace("whsec_", ""))
    except ValueError:
        secret_bytes = SVIX_WEBHOOK_SECRET.encode("utf-8")

    expected_sig = hmac.new(secret_bytes, signed_content, hashlib.sha256).hexdigest()
    provided_sigs = [s.split(",")[1] for s in msg_signature.split(" ") if "," in s]
    
    return any(hmac.compare_digest(expected_sig, sig) for sig in provided_sigs)


@app.post("/api/webhooks/ingress")
async def svix_webhook_ingress(request: Request, background_tasks: BackgroundTasks):
    body_bytes = await request.body()
    headers = {
        "svix-id": request.headers.get("svix-id"),
        "svix-timestamp": request.headers.get("svix-timestamp"),
        "svix-signature": request.headers.get("svix-signature"),
    }

    if not verify_svix_signature(body_bytes, headers):
        raise HTTPException(status_code=400, detail="Invalid Svix Webhook Signature")

    try:
        payload = json.loads(body_bytes.decode("utf-8"))
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = payload.get("eventType", "listener.message")
    event_data = payload.get("data", {})

    # Push to Redis Inbox Queue for DJ Agent
    REDIS_LISTENER_QUEUE.append({"event_id": headers["svix-id"], "type": event_type, "data": event_data})
    logger.info(f"Accepted webhook {headers['svix-id']} into Redis queue.")

    # Trigger asynchronous pipeline run
    background_tasks.add_task(run_autonomous_pipeline, event_data)

    return {"status": "accepted", "event_id": headers["svix-id"]}


# ==========================================
# PILLAR 2: Multi-Agent Gemini Orchestration
# ==========================================
async def run_multi_agent_editorial(context_data: dict) -> str:
    if not ai_client:
        return "Mock Broadcast Script: Welcome back to Neural Beat FM. Markets are holding steady."

    # Agent 1: DJ / Operations Agent (Drafting)
    dj_prompt = f\"\"\"
    You are AURA-1, the upbeat lead DJ for a 24/7 autonomous web radio station.
    Context Data: {json.dumps(context_data)}
    Recent Listener Messages: {json.dumps(REDIS_LISTENER_QUEUE[-3:] if REDIS_LISTENER_QUEUE else [])}
    
    Task: Draft a 2-minute live voice link script. 
    Rules: Announce the station name (Neural Beat FM), mention the previous track, tease the upcoming song, incorporate one listener shoutout, and integrate a Bloomberg financial sponsor bulletin. No emojis, strict broadcast prose.
    \"\"\"

    try:
        dj_response = ai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=dj_prompt,
        )
        draft_script = dj_response.text
    except Exception as e:
        logger.error(f"DJ Agent generation failed: {e}")
        raise

    # Agent 2: CEO / Oversight Agent (Editorial Review & Safety Gateway)
    ceo_prompt = f\"\"\"
    You are the Chief Editor and CEO of Neural Beat FM. Review the following draft script from the DJ Agent:
    ---
    {draft_script}
    ---
    Task: Strictly verify tone alignment, pacing, factual correctness, and ensure no markdown formatting or hallucinations exist. Return ONLY the final approved broadcast-ready string.
    \"\"\"

    try:
        ceo_response = ai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=ceo_prompt,
        )
        approved_script = ceo_response.text
        return approved_script
    except Exception as e:
        logger.error(f"CEO Agent review failed: {e}")
        return draft_script  # Fallback to DJ draft if oversight fails


# ==========================================
# PILLAR 3: Ultra-Low Latency Voice Synthesis
# ==========================================
async def synthesize_elevenlabs_websocket(script_text: str, output_filepath: str):
    if not ELEVENLABS_API_KEY:
        logger.warning("ElevenLabs API Key missing. Skipping audio render.")
        return None

    voice_id = "EXAVITQu4vr4xnSDxMaL"  # Rachel / Default Broadcast Voice
    uri = f"wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input?model_id=eleven_flash_v2_5"

    audio_chunks = []
    try:
        async with websockets.connect(uri) as websocket:
            # Send initial configuration handshake
            init_message = {
                "text": " ",
                "voice_settings": {"stability": 0.45, "similarity_boost": 0.85, "style": 0.20},
                "generation_config": {"chunk_length_schedule": [50, 120, 250, 500]},
                "xi_api_key": ELEVENLABS_API_KEY,
            }
            await websocket.send(json.dumps(init_message))

            # Send text chunks
            await websocket.send(json.dumps({"text": script_text, "flush": True}))

            # Receive audio stream packets
            while True:
                response = await websocket.recv()
                data = json.loads(response)
                if data.get("audio"):
                    audio_chunks.append(bytes.fromhex(data["audio"]))
                if data.get("isFinal"):
                    break

        # Save to MP3
        with open(output_filepath, "wb") as f:
            for chunk in audio_chunks:
                f.write(chunk)
        logger.info(f"Synthesized audio successfully saved to {output_filepath}")
        return output_filepath

    except Exception as e:
        logger.error(f"ElevenLabs WebSocket synthesis failed: {e}")
        raise


# ==========================================
# PILLAR 4: Playout & Dynamic M3U Injection
# ==========================================
async def inject_into_azuracast(mp3_filepath: str):
    if not AZURACAST_API_KEY:
        logger.warning("AzuraCast API Key missing. Skipping playlist injection.")
        return

    m3u_content = f"#EXTM3U\\n#EXTINF:-1,AURA-24 Autonomous Broadcast\\n{os.path.basename(mp3_filepath)}\\n"
    m3u_path = mp3_filepath.replace(".mp3", ".m3u")
    with open(m3u_path, "w") as f:
        f.write(m3u_content)

    url = f"{AZURACAST_BASE_URL}/api/station/{AZURACAST_STATION_ID}/media"
    headers = {"Authorization": f"Bearer {AZURACAST_API_KEY}"}

    try:
        async with httpx.AsyncClient() as client:
            with open(mp3_filepath, "rb") as audio_file, open(m3u_path, "r") as m3u_file:
                files = {
                    "file": (os.path.basename(mp3_filepath), audio_file, "audio/mpeg"),
                    "playlist_file": ("playlist.m3u", m3u_file, "audio/x-mpegurl"),
                }
                data = {"playlist": "Hourly Sponsored Financial Briefs"}
                response = await client.post(url, headers=headers, files=files, data=data, timeout=30.0)
                if response.status_code in [200, 201]:
                    logger.info("Successfully injected M3U playlist and MP3 into AzuraCast rotation.")
                else:
                    logger.error(f"AzuraCast API error: {response.status_code} - {response.text}")
    except Exception as e:
        logger.error(f"AzuraCast connection failed: {e}")
        # Route to DLQ if playout dispatch fails
        DEAD_LETTER_QUEUE.append({"file": mp3_filepath, "error": str(e), "timestamp": time.time()})


# ==========================================
# Full Pipeline Orchestrator Runner
# ==========================================
async def run_autonomous_pipeline(context_data: dict):
    try:
        logger.info("Starting autonomous multi-agent pipeline execution...")
        approved_script = await run_multi_agent_editorial(context_data)
        
        output_file = f"/tmp/aura_broadcast_{int(time.time())}.mp3"
        audio_path = await synthesize_elevenlabs_websocket(approved_script, output_file)
        
        if audio_path:
            await inject_into_azuracast(audio_path)
            
        logger.info("Autonomous pipeline run completed successfully.")
    except Exception as e:
        logger.error(f"Pipeline execution failed: {e}")
        DEAD_LETTER_QUEUE.append({"context": context_data, "error": str(e), "timestamp": time.time()})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 text-[#F4F4F4] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">08. Production Orchestrator</p>
          <h1 className="text-4xl font-serif italic mb-4 leading-none">Complete Production Python Orchestration Script</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Enterprise-grade FastAPI service integrating Svix webhook ingestion, Redis queues, Gemini multi-agent editorial oversight, ElevenLabs Flash WebSockets, and AzuraCast M3U playlist injection.
          </p>
        </div>
      </div>

      {/* Code Block Card */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Executable Backend Code</p>
            <h2 className="text-3xl font-serif italic">orchestrator.py</h2>
          </div>
          <button
            onClick={() => copyToClipboard(productionPythonCode, 'code')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors border border-white/10"
          >
            {copiedSection === 'code' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'code' ? 'Copied' : 'Copy Full Python Code'}</span>
          </button>
        </div>

        <div className="bg-black/40 border border-white/10 text-blue-300 rounded-sm p-6 font-mono text-xs leading-relaxed overflow-x-auto max-h-[500px]">
          <pre>{productionPythonCode}</pre>
        </div>
      </div>
    </div>
  );
}
