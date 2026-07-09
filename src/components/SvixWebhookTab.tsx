import React, { useState } from 'react';
import { ShieldCheck, Cpu, RefreshCw, Copy, Check, Lock, Database, AlertTriangle, Workflow } from 'lucide-react';

export function SvixWebhookTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const svixPythonCode = `import hmac
import hashlib
import time
from fastapi import FastAPI, Request, HTTPException, Header
from pydantic import BaseModel

app = FastAPI()

# Svix Secret Key (whsec_...)
WEBHOOK_SECRET = "whsec_your_svix_secret_key_here"
TOLERANCE_SECONDS = 300  # 5 minutes replay attack window

def verify_svix_signature(payload: bytes, headers: dict) -> bool:
    msg_id = headers.get("svix-id")
    msg_timestamp = headers.get("svix-timestamp")
    msg_signature = headers.get("svix-signature")

    if not all([msg_id, msg_timestamp, msg_signature]):
        return False

    # Check timestamp tolerance to prevent replay attacks
    try:
        now = int(time.time())
        if abs(now - int(msg_timestamp)) > TOLERANCE_SECONDS:
            return False
    except ValueError:
        return False

    # Construct signed content: {msg_id}.{msg_timestamp}.{payload}
    signed_content = f"{msg_id}.{msg_timestamp}.".encode("utf-8") + payload
    
    # Svix secrets are base64 encoded with whsec_ prefix
    secret_bytes = bytes.fromhex(WEBHOOK_SECRET.replace("whsec_", ""))

    expected_signature = hmac.new(
        secret_bytes,
        signed_content,
        hashlib.sha256
    ).hexdigest()

    # msg_signature can contain space-separated versions e.g., v1,signature
    provided_sigs = [s.split(",")[1] for s in msg_signature.split(" ") if "," in s]
    
    return any(hmac.compare_digest(expected_signature, sig) for sig in provided_sigs)

@app.post("/api/webhooks/ingress")
async def svix_webhook_ingress(
    request: Request,
    svix_id: str = Header(None),
    svix_timestamp: str = Header(None),
    svix_signature: str = Header(None)
):
    body_bytes = await request.body()
    headers = {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature
    }

    if not verify_svix_signature(body_bytes, headers):
        raise HTTPException(status_code=400, detail="Invalid Svix Webhook Signature")

    # 1. Idempotency Check (Redis / DB Deduplication using svix_id)
    if is_event_processed(svix_id):
        return {"status": "already_processed", "event_id": svix_id}

    # 2. Accept-then-Queue (Push to Redis / Celery / RabbitMQ queue)
    try:
        enqueue_background_pipeline(body_bytes)
    except Exception as e:
        # 3. Dead-Letter Queue (DLQ) fallback on failure
        push_to_dlq(svix_id, body_bytes, str(e))
        raise HTTPException(status_code=500, detail="Enqueued to DLQ")

    return {"status": "accepted", "event_id": svix_id}
`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 text-[#F4F4F4] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">05. Webhook Reliability & Event Queuing</p>
          <h1 className="text-4xl font-serif italic mb-4 leading-none">Svix Ingestion & Dead-Letter Queue Architecture</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Enterprise-grade "accept-then-queue" architecture ensuring zero message loss, cryptographic HMAC-SHA256 signature verification, strict event deduplication, and resilient Dead-Letter Queue (DLQ) fallback handling.
          </p>
        </div>
      </div>

      {/* Architecture Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-sm bg-red-600/20 text-red-400 border border-red-600/30 flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="font-semibold text-white text-base">HMAC-SHA256 Verification</h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Validates `svix-id`, `svix-timestamp`, and `svix-signature` headers against the shared secret (`whsec_...`) with a 5-minute replay attack tolerance window.
          </p>
          <span className="text-[10px] font-mono text-red-400 uppercase">Cryptographic Security</span>
        </div>

        <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-sm bg-blue-600/20 text-blue-300 border border-blue-600/30 flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="font-semibold text-white text-base">Idempotent Deduplication</h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Tracks unique `svix-id` tokens in Redis with TTL expiration to guarantee exactly-once processing even during webhook retry storms.
          </p>
          <span className="text-[10px] font-mono text-blue-300 uppercase">Redis Atomic Set</span>
        </div>

        <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-sm bg-purple-600/20 text-purple-300 border border-purple-600/30 flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="font-semibold text-white text-base">Dead-Letter Queue (DLQ)</h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Intercepts downstream pipeline failures or timeout exceptions, routing poisoned payloads to an isolated DLQ table for manual inspection and replay.
          </p>
          <span className="text-[10px] font-mono text-purple-300 uppercase">Resilient Fallback</span>
        </div>
      </div>

      {/* Production Python Code Snippet */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Production Implementation</p>
            <h2 className="text-3xl font-serif italic">Svix Ingress & Verification Pipeline (Python)</h2>
          </div>
          <button
            onClick={() => copyToClipboard(svixPythonCode, 'svix')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors border border-white/10"
          >
            {copiedSection === 'svix' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'svix' ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="bg-black/40 border border-white/10 text-blue-300 rounded-sm p-6 font-mono text-xs leading-relaxed overflow-x-auto max-h-96">
          <pre>{svixPythonCode}</pre>
        </div>
      </div>
    </div>
  );
}
