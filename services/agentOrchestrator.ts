// services/agentOrchestrator.ts
import { GoogleGenAI } from '@google/genai';

interface RadioContext {
    previousTrack: string;
    nextTrack: string;
    weather: string;
    sponsor: string;
}

export async function generateValidatedScript(context: RadioContext): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY missing. Returning fallback broadcast script.");
        return `Welcome back to Neural Beat FM. We just played ${context.previousTrack || 'an ambient synth anthem'}, and coming up next is ${context.nextTrack || 'deep house pulse'}. Current weather is ${context.weather || '72 degrees and clear'}. Brought to you by ${context.sponsor || 'our premier financial sponsors'}.`;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Step 1: The DJ Agent (AURA-1) generates the draft
    const djPrompt = `
        You are AURA-1, the autonomous lead DJ for an internet radio station. 
        Your job is to generate a short, engaging voice-break script to be read on-air. 
        
        Rules:
        1. Keep the tone upbeat, professional, and slightly futuristic.
        2. Acknowledge the track that just played.
        3. Tease the track coming up next.
        4. Seamlessly weave in the current weather and the mandatory sponsor read.
        5. Limit the script to exactly 3 to 4 sentences. 
        
        Input Data:
        - Previous Track: ${context.previousTrack || 'Nexus Wave - Cyber Drift'}
        - Next Track: ${context.nextTrack || 'Aether Pulse - Nova'}
        - Weather: ${context.weather || '68°F & Neon Skies'}
        - Sponsor Bulletin: ${context.sponsor || 'Bloomberg Markets Hourly Financial Brief'}
    `;

    try {
        const draftResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: djPrompt,
            config: {
                temperature: 0.7,
            }
        });

        const djDraft = draftResponse.text;
        
        if (!djDraft) {
            throw new Error("DJ Agent failed to generate a script.");
        }

        // Step 2: The CEO / Oversight Agent validates and sanitizes
        const ceoPrompt = `
            You are the Station Manager and Editorial Oversight AI. 
            Review the following drafted script and ensure it is perfectly formatted for a Text-to-Speech (TTS) engine.
            
            Strict Constraints:
            1. REMOVE all emojis. 
            2. REMOVE all Markdown formatting.
            3. REMOVE any stage directions (e.g., "AURA-1:" or "[Laughs]").
            4. Output ONLY the finalized, raw text to be spoken.
            
            Drafted Script:
            ${djDraft}
        `;

        const validationResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: ceoPrompt,
            config: {
                temperature: 0.1,
            }
        });

        const finalScript = validationResponse.text;

        if (!finalScript) {
             throw new Error("CEO Agent failed to validate the script.");
        }

        return finalScript.trim();
    } catch (error: any) {
        console.error("Multi-agent orchestration error:", error);
        return `Welcome back to Neural Beat FM. Playing ${context.previousTrack || 'ambient synth'}, up next is ${context.nextTrack || 'deep pulse'}. Stay tuned.`;
    }
}
