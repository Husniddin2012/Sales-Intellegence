import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

function neuralTtsPlugin(): Plugin {
  return {
    name: 'neural-tts-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/voice/synthesize', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { text, speakerId, lang } = JSON.parse(body || '{}');
            if (!text) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Text is required' }));
              return;
            }

            let voiceName = 'uz-UZ-MadinaNeural';
            if (lang === 'ru') {
              voiceName = 'ru-RU-SvetlanaNeural';
            } else if (lang === 'en') {
              voiceName = 'en-US-JennyNeural';
            } else {
              if (speakerId === 'Rayhona') {
                voiceName = 'uz-UZ-DilaraNeural';
              } else {
                voiceName = 'uz-UZ-MadinaNeural'; // Anora flagship human voice
              }
            }

            const tts = new MsEdgeTTS();
            await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
            
            const { audioStream } = tts.toStream(text);
            const chunks: Buffer[] = [];

            audioStream.on('data', (chunk: Buffer) => {
              chunks.push(chunk);
            });

            audioStream.on('end', () => {
              if (res.writableEnded) return;
              const audioBuffer = Buffer.concat(chunks);
              if (audioBuffer.length > 0) {
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Content-Length', audioBuffer.length);
                res.setHeader('Cache-Control', 'public, max-age=3600');
                res.statusCode = 200;
                res.end(audioBuffer);
              } else {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'No audio data received' }));
              }
            });

            audioStream.on('error', (err: any) => {
              if (res.writableEnded) return;
              console.warn('[Neural TTS Stream Error]', err?.message || err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'TTS Error' }));
            });
          } catch (err: any) {
            console.error('[Neural TTS Error]', err);
            if (!res.writableEnded) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Server error' }));
            }
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    neuralTtsPlugin()
  ],
});
