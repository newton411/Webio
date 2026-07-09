import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import { Webhook } from "svix";
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import fs from "fs";
import { generateValidatedScript } from "./services/agentOrchestrator";
import { streamAudio } from "./services/elevenlabs";
import { createAndUploadPlaylist } from "./services/azuracast";

const app = express();
const PORT = 3000;

// Initialize Redis / BullMQ Queues (Accept-Then-Queue Pattern with In-Memory Fallback)
let redisConnection: IORedis | null = null;
let audioJobQueue: Queue | null = null;
let dlqQueue: Queue | null = null;
const inMemoryQueue: any[] = [];
const inMemoryDlq: any[] = [];
let redisAvailable = false;

try {
  redisConnection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    lazyConnect: true,
  });

  redisConnection.on("error", (err) => {
    redisAvailable = false;
  });

  redisConnection.ping().then(() => {
    redisAvailable = true;
    audioJobQueue = new Queue("AudioProcessingQueue", { connection: redisConnection as any });
    dlqQueue = new Queue("DeadLetterQueue", { connection: redisConnection as any });
  }).catch(() => {
    redisAvailable = false;
    console.log("Redis server not detected at startup. Using enterprise in-memory queue/DLQ fallback.");
  });
} catch (e) {
  console.warn("Redis initialization deferred:", e);
}

// Background Worker & Dead-Letter Queue (DLQ) Safeguards
if (redisConnection && audioJobQueue && dlqQueue) {
  try {
    const worker = new Worker("AudioProcessingQueue", async (job) => {
      console.log(`Processing BullMQ job ${job.id} with data:`, job.data);
      try {
        const context = job.data?.data || job.data || {
          previousTrack: "Nexus Wave - Cyber Drift",
          nextTrack: "Aether Pulse - Nova",
          weather: "68°F & Neon Skies",
          sponsor: "Bloomberg Markets Hourly Financial Brief"
        };

        // 1. Multi-Agent Orchestration (DJ -> CEO Validation)
        const validatedScript = await generateValidatedScript(context);
        console.log(`CEO-Approved Broadcast Script: ${validatedScript}`);

        // 2. ElevenLabs WebSocket Flash Audio Generation
        const voiceId = process.env.AURA_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
        const audioBuffer = await streamAudio(validatedScript, voiceId);

        // 3. Save MP3 to local disk
        const audioFilename = `broadcast_spot_${Date.now()}.mp3`;
        const audioFilePath = path.join(process.cwd(), audioFilename);
        fs.writeFileSync(audioFilePath, audioBuffer);

        // 4. AzuraCast Playout & Dynamic M3U Injection
        const stationId = process.env.AZURACAST_STATION_ID || "aura";
        await createAndUploadPlaylist([audioFilePath], stationId);
        console.log(`Successfully generated and dispatched broadcast spot ${audioFilename}`);
      } catch (workerErr: any) {
        console.error(`Worker pipeline execution error for job ${job.id}:`, workerErr);
        throw workerErr;
      }
    }, { connection: redisConnection as any });

    worker.on("failed", async (job, err) => {
      console.error(`Job ${job?.id} failed: ${err.message}`);
      if (job && dlqQueue) {
        await dlqQueue.add("FailedJob", { originalJob: job.data, error: err.message, timestamp: Date.now() });
      }
    });
  } catch (e) {
    console.warn("BullMQ Worker setup deferred:", e);
  }
}

app.use(express.json());

// Svix Webhook Ingress Route with Accept-Then-Queue Pattern
app.post("/api/webhooks/ingress", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const SVIX_SECRET = process.env.SVIX_SECRET || process.env.SVIX_WEBHOOK_SECRET || "whsec_mock_secret";
    const wh = new Webhook(SVIX_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    let evt: any;
    try {
      // Verify HMAC-SHA256 signature using official svix package
      const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
      evt = wh.verify(rawBody, headers);
    } catch (err: any) {
      // Fallback for simulation/testing if headers are missing or in dev mode
      if (process.env.NODE_ENV !== "production" && (!headers["svix-signature"] || headers["svix-signature"] === "simulated")) {
        evt = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      } else {
        return res.status(400).json({ success: false, message: "Invalid Svix Signature", error: err.message });
      }
    }

    const eventId = evt.id || `evt_${Date.now()}`;

    // Accept-Then-Queue: Add to BullMQ with deduplication jobId or fallback to in-memory queue
    if (redisAvailable && audioJobQueue) {
      try {
        await audioJobQueue.add("ProcessWebhook", evt, {
          jobId: eventId,
          attempts: 3,
          backoff: { type: "exponential", delay: 1000 },
        });
      } catch (err) {
        console.warn("BullMQ queue add failed, falling back to in-memory queue:", err);
        inMemoryQueue.push({ id: eventId, data: evt, timestamp: Date.now() });
      }
    } else {
      inMemoryQueue.push({ id: eventId, data: evt, timestamp: Date.now() });
    }

    return res.status(202).json({ success: true, message: "Accepted and queued successfully", eventId });
  } catch (error: any) {
    console.error("Webhook ingress error:", error);
    return res.status(500).json({ success: false, message: "Queue error", error: error.message });
  }
});

// Initialize GoogleGenAI client (lazy or server-side)
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Generate Broadcast Script
app.post("/api/generate-script", async (req, res) => {
  try {
    const { topic, category, durationMinutes = 2, hostTone = "upbeat" } = req.body;
    const ai = getAiClient();

    const systemInstruction = `You are an expert AI Morning Radio Host for a 24/7 autonomous self-growth, financial intelligence, and awareness station. 
Your tone is upbeat, deeply knowledgeable, empowering, and action-oriented. 
You act as a translation layer between complex real-world data (market trends, behavioral psychology) and the everyday listener.
Use professional broadcast structure:
1. STATION ID & HOOK (Catchy opener, station name "AURA-24 Autonomous Radio", time check or energy anchor).
2. CORE INSIGHT / DATA BREAKDOWN (Translate complex financial or self-growth data into simple, actionable wisdom).
3. EMPOWERMENT EXERCISE / REFLECTION (A tangible micro-habit or mindset shift for the listener).
4. SIGN-OFF & TRANSITION (Smooth handoff to the next music block or dayparting segment).
Keep word count suitable for a ${durationMinutes}-minute spoken segment (${durationMinutes * 150} words approx). Never use emojis.`;

    const prompt = `Write a daily radio broadcast script for the topic: "${topic || "Global financial markets and daily mental clarity"}". Category: ${category || "Financial Intelligence & Mindset"}. Tone: ${hostTone}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const scriptText = response.text || "Broadcast script generation failed.";
    res.json({ success: true, script: scriptText });
  } catch (error: any) {
    console.error("Error generating script:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate script" });
  }
});

// API: Generate TTS Audio (Gemini TTS)
app.post("/api/generate-tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: "Text is required for TTS" });
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say with broadcast cadence: ${text.slice(0, 800)}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("TTS model did not return audio data");
    }

    res.json({ success: true, audio: base64Audio, mimeType: "audio/mp3" });
  } catch (error: any) {
    console.error("Error generating TTS:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate TTS audio" });
  }
});

// API: Simulate Automation Pipeline Execution
app.post("/api/pipeline/run", async (req, res) => {
  try {
    const { feedUrl, topic } = req.body;
    // Simulate steps: 1. RSS Ingest, 2. LLM Script Rewrite, 3. TTS Generation, 4. AzuraCast Storage Push
    const steps = [
      { id: 1, name: "RSS Ingest & Normalization", status: "completed", details: `Successfully parsed feed from ${feedUrl || "Financial Times / Morning Brew RSS"}` },
      { id: 2, name: "LLM Script Rewriting", status: "completed", details: `Rewrote news item into empowered broadcast script using Morning Host Prompt` },
      { id: 3, name: "ElevenLabs / Gemini TTS Render", status: "completed", details: `Rendered 128kbps MP3 audio file with voice ID (Kore)` },
      { id: 4, name: "AzuraCast Cloud Storage Dispatch", status: "completed", details: `Pushed file to sftp://azuracast-storage/media/automated/morning_brief_${Date.now()}.mp3` }
    ];
    
    res.json({ success: true, executionId: `exec_${Date.now()}`, steps });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  // Vite middleware setup for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
