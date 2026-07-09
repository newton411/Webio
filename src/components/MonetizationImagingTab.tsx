import React, { useState } from 'react';
import { DollarSign, Radio, Music, MessageSquare, Video, Code, ShieldCheck, Play, Check, Copy, Sparkles, Send } from 'lucide-react';

export function MonetizationImagingTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [inboxMessages, setInboxMessages] = useState([
    { id: '1', channel: 'WhatsApp', sender: '+1 (555) 382-9100', text: 'Love the macro breakdown on inflation! Can you cover European energy bonds next?', time: '2m ago', status: 'Queued for DJ Prompt' },
    { id: '2', channel: 'SMS', sender: '+1 (555) 491-2244', text: 'Shoutout from London! Keep the focus loops coming.', time: '14m ago', status: 'Broadcasted' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now().toString(),
      channel: 'Web Widget',
      sender: 'Live Listener',
      text: newMessage,
      time: 'Just now',
      status: 'Queued for DJ Prompt'
    };
    setInboxMessages([msg, ...inboxMessages]);
    setNewMessage('');
  };

  const azuraPlaylistSnippet = `# AzuraCast API Dynamic Playlist M3U Injection
curl -X POST "https://azuracast.radio.local/api/station/aura/media" \\
  -H "Authorization: Bearer azuracast_api_key_..." \\
  -F "file=@sponsor_spot_bloomberg.mp3" \\
  -F "playlist=Hourly Sponsored Financial Briefs"`;

  const embedWidgetSnippet = `<!-- Neural Beat FM Embeddable AzuraCast Widget -->
<iframe 
  src="https://ais-dev-rflmmqmfe3vjccesn5ivbh-405490701004.europe-west1.run.app/embed/player" 
  width="100%" 
  height="180px" 
  frameborder="0" 
  allow="autoplay"
  title="Neural Beat FM Live Player">
</iframe>`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* Header */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 text-[#F4F4F4] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">07. Monetization, Imaging & Distribution</p>
          <h1 className="text-4xl font-serif italic mb-4 leading-none">Dynamic Ads, Suno Imaging & Unified Inbox</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Enterprise monetization pipelines, zero-royalty AI station imaging, log-aware voice linking, multi-channel listener inbox aggregation, and embeddable affiliate widgets.
          </p>
        </div>
      </div>

      {/* Section 1: Dynamic Monetization & AI Advertising */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">01. Monetization Engine</p>
            <h2 className="text-3xl font-serif italic">Automated Ads, Financial Segments & API Injection</h2>
          </div>
          <button
            onClick={() => copyToClipboard(azuraPlaylistSnippet, 'azura')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors border border-white/10"
          >
            {copiedSection === 'azura' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'azura' ? 'Copied' : 'Copy AzuraCast cURL'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">Voice Studio Ad Spots</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Mixes ElevenLabs voice-overs with background cinematic music and SFX to synthesize ready-to-air commercial sponsored spots automatically.
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">Bloomberg & Reuters Feeds</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              n8n ingests financial RSS feeds, summarizing top stories into premium "Markets Briefing" sponsor slots commanding high CPM rates.
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">AzuraCast API Injection</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Pushes rendered MP3 spots directly into AzuraCast playlist queues via multipart POST requests for seamless scheduled playback.
            </p>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 text-blue-300 rounded-sm p-6 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{azuraPlaylistSnippet}</pre>
        </div>
      </div>

      {/* Section 2: Advanced Station Imaging & AI Audio Tools */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">02. Station Imaging</p>
          <h2 className="text-3xl font-serif italic">Zero-Royalty AI Sweepers & Log-Aware Linking</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">Suno AI Sweepers</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Generate custom station IDs and drop-ins in station key/BPM. Avoids ASCAP/BMI licensing fees for purely AI-generated audio assets.
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">Log-Aware Voice Linking</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              DJ agent reads playlist metadata tags to announce current time, station name, previous track, and upcoming song natively.
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-white/10 rounded-sm p-6">
            <h3 className="font-semibold text-white text-sm mb-2">Aiir Audio Weather & News</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Automates local weather and traffic bullet point synthesis, delivered via the trusted station voice persona.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Listener Engagement & Multi-Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Unified Listener Inbox (7 cols) */}
        <div className="lg:col-span-7 bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">03. Listener Engagement</p>
              <h3 className="text-2xl font-serif italic">Unified Studio Inbox</h3>
            </div>
            <span className="text-xs font-mono text-red-400 uppercase">Webhook Feed Active</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {inboxMessages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-sm border border-white/10 bg-[#1A1A1A] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-red-400 font-bold uppercase">{msg.channel} • {msg.sender}</span>
                  <span className="text-white/40">{msg.time}</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-green-400 uppercase">{msg.status}</span>
                  <button className="text-[10px] font-mono text-white/60 hover:text-white uppercase">Inject into DJ Prompt</button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Simulate incoming listener message / request..."
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-sm p-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-black font-bold text-xs uppercase font-mono rounded-sm flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>
          </form>
        </div>

        {/* Embeddable Widgets & Video (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F0F0F] border border-white/10 rounded-sm p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">04. Syndication</p>
            <h3 className="text-2xl font-serif italic">Embeddable Widgets & Video</h3>
          </div>

          <p className="text-xs text-white/60 leading-relaxed">
            Generate custom iframe embed codes for affiliate sites or partner networks, and pair ElevenLabs audio with Flashloop AI video generators for automated social syndication.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-white/70">Affiliate Embed Code</label>
                <button
                  onClick={() => copyToClipboard(embedWidgetSnippet, 'widget')}
                  className="text-[10px] font-mono text-red-400 uppercase hover:underline flex items-center gap-1"
                >
                  {copiedSection === 'widget' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'widget' ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={embedWidgetSnippet}
                rows={4}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-3 text-[11px] font-mono text-white/70"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
