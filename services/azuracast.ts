import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createAndUploadPlaylist(audioFiles: string[], stationId: string) {
    // 1. M3U Playlist Compilation
    const m3uContent = audioFiles.join('\n');
    const m3uPath = path.join(__dirname, `temp_playlist_${Date.now()}.m3u`);
    fs.writeFileSync(m3uPath, m3uContent);

    // 2. Multipart POST Dispatch to AzuraCast
    const form = new FormData();
    form.append('playlist_file', fs.createReadStream(m3uPath));

    const baseUrl = process.env.AZURACAST_BASE_URL || 'https://your-azuracast-instance.com';

    try {
        const response = await axios.post(
            `${baseUrl}/api/station/${stationId}/playlists/import`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${process.env.AZURACAST_API_KEY}`
                }
            }
        );
        console.log('Successfully injected playlist to AzuraCast:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Failed to dispatch M3U to AzuraCast', error.message || error);
        throw error;
    } finally {
        // Cleanup temp file
        if (fs.existsSync(m3uPath)) {
            fs.unlinkSync(m3uPath);
        }
    }
}
