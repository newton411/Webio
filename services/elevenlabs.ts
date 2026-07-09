import WebSocket from 'ws';

export function streamAudio(text: string, voiceId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        // Use eleven_flash_v2_5 and enable auto_mode for chunking
        const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_flash_v2_5`;
        const ws = new WebSocket(wsUrl);
        const audioChunks: Buffer[] = [];

        ws.on('open', () => {
            // Send connection payload
            ws.send(JSON.stringify({
                text: " ",
                voice_settings: { stability: 0.5, similarity_boost: 0.8 },
                generation_config: { chunk_length_schedule: [50] },
                xi_api_key: process.env.ELEVENLABS_API_KEY,
                auto_mode: true // Auto-mode handles text generation triggers
            }));

            // Send actual text content
            ws.send(JSON.stringify({ text, try_trigger_generation: true }));
            ws.send(JSON.stringify({ text: "" })); // End of stream signal
        });

        ws.on('message', (data: WebSocket.Data) => {
            try {
                const response = JSON.parse(data.toString());
                if (response.audio) {
                    audioChunks.push(Buffer.from(response.audio, 'base64'));
                }
                if (response.isFinal) {
                    ws.close();
                    resolve(Buffer.concat(audioChunks));
                }
            } catch (err) {
                console.error("Error parsing ElevenLabs WebSocket message:", err);
            }
        });

        ws.on('error', (err) => {
            console.error("ElevenLabs WebSocket error:", err);
            reject(err);
        });
    });
}
