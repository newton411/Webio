import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

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
