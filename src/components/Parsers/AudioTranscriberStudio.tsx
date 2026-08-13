import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Play,
  Pause,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  FileText,
  Volume2,
  VolumeX,
  AlertTriangle,
  UserX,
  UserCheck,
  Hash,
  Upload,
} from 'lucide-react';
import { EvidenceItem } from '../../types';
import { generateSha256, extractEntities } from '../../utils/entityExtractor';

interface AudioTranscriberStudioProps {
  caseId: string;
  onIngest: (item: EvidenceItem) => void;
  onClose: () => void;
}

const MOCK_AUDIO_SAMPLES = [
  {
    title: 'Suspect Voice Note - Vanguard DEX ETH Staking Solicit',
    speaker1: 'Elena Vance (Suspect)',
    speaker2: 'Dr. Aris Thorne (Victim)',
    duration: '02:45',
    transcript: `[00:05] Elena Vance: Aris, listen to me carefully. The ETH liquidity pool on Vanguard DEX closes at 18:00 UTC. If you transfer the 10 ETH from your Coinbase vault right now to the smart contract address 0x71C7656EC7ab88b098defB751B7401B5f6d8976F, your 45% daily yield triggers automatically. Do not tell your bank advisor, they will try to block the arbitrage trade.
[01:12] Dr. Aris Thorne: Elena, $42,500 is almost my entire savings. Is there any risk?
[01:28] Elena Vance: None at all! My uncle is the node operator. Trust me, send it immediately or you lose your node tier reservation.`,
    rawAudioText: `Elena Vance: Aris, listen to me carefully. The ETH liquidity pool on Vanguard DEX closes at 18:00 UTC. If you transfer the 10 ETH from your Coinbase vault right now to the smart contract address 0x71C7656EC7ab88b098defB751B7401B5f6d8976F, your 45% daily yield triggers automatically. Do not tell your bank advisor, they will try to block the arbitrage trade. Dr. Aris Thorne: Elena, $42,500 is almost my entire savings. Is there any risk? Elena Vance: None at all! My uncle is the node operator. Trust me, send it immediately or you lose your node tier reservation.`,
    diarization: [
      { speaker: 'SUSPECT' as const, timestamp: '00:05', text: 'Aris, listen to me carefully. The ETH liquidity pool on Vanguard DEX closes at 18:00 UTC. If you transfer the 10 ETH from your Coinbase vault right now to smart contract 0x71C7656EC7ab88b098defB751B7401B5f6d8976F, your 45% daily yield triggers automatically.', riskScore: 96 },
      { speaker: 'VICTIM' as const, timestamp: '01:12', text: 'Elena, $42,500 is almost my entire savings. Is there any risk?', riskScore: 40 },
      { speaker: 'SUSPECT' as const, timestamp: '01:28', text: 'None at all! My uncle is the node operator. Trust me, send it immediately or you lose your node tier reservation.', riskScore: 98 },
    ],
    threatKeywords: ['ETH liquidity pool', '10 ETH', 'Coinbase vault', 'smart contract address', '45% daily yield', 'Do not tell your bank advisor', '$42,500'],
  },
  {
    title: 'WhatsApp Voicemail - Urgent Bank Wire Demand',
    speaker1: 'Wire Handler Fraudster',
    speaker2: 'Victim',
    duration: '01:15',
    transcript: `[00:02] Fraudster: This is Alex from Vanguard Escrow Security Desk. We noticed your wire transaction of $25,000 to Chase Bank AC 984102948 is stuck. Call back +1 (310) 555-0198 immediately to complete the verification before asset freeze.`,
    rawAudioText: `This is Alex from Vanguard Escrow Security Desk. We noticed your wire transaction of $25,000 to Chase Bank AC 984102948 is stuck. Call back +1 (310) 555-0198 immediately to complete the verification before asset freeze.`,
    diarization: [
      { speaker: 'SUSPECT' as const, timestamp: '00:02', text: 'This is Alex from Vanguard Escrow Security Desk. We noticed your wire transaction of $25,000 to Chase Bank AC 984102948 is stuck. Call back +1 (310) 555-0198 immediately to complete the verification before asset freeze.', riskScore: 94 },
    ],
    threatKeywords: ['Vanguard Escrow Security Desk', 'wire transaction of $25,000', 'Chase Bank AC 984102948', '+1 (310) 555-0198', 'asset freeze'],
  },
];

export const AudioTranscriberStudio: React.FC<AudioTranscriberStudioProps> = ({
  caseId,
  onIngest,
  onClose,
}) => {
  const [selectedSampleIdx, setSelectedSampleIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [customAudioName, setCustomAudioName] = useState<string>('');
  const [rawText, setRawText] = useState<string>(MOCK_AUDIO_SAMPLES[0].rawAudioText);
  const [exhibitTitle, setExhibitTitle] = useState<string>(MOCK_AUDIO_SAMPLES[0].title);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);

  const sample = MOCK_AUDIO_SAMPLES[selectedSampleIdx];

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIdx(idx);
    const s = MOCK_AUDIO_SAMPLES[idx];
    setExhibitTitle(s.title);
    setRawText(s.rawAudioText);
    setIsPlaying(false);
  };

  const handleIngestAudio = () => {
    setIsIngesting(true);
    setTimeout(() => {
      const extracted = extractEntities(rawText);
      const sha256 = generateSha256(rawText + caseId + Date.now());

      const newExhibit: EvidenceItem = {
        id: `ev-audio-${Date.now()}`,
        exhibitNumber: `EX-AUD-${Math.floor(100 + Math.random() * 900)}`,
        caseId,
        title: exhibitTitle || 'Forensic Voice Recording Exhibit',
        type: 'audio',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        sha256Hash: sha256,
        sourceName: customAudioName ? `Audio File (${customAudioName})` : 'Forensic Voice Call Recording (.mp3)',
        rawContent: rawText,
        entities: extracted,
        riskScore: 94,
        flaggedKeywords: sample.threatKeywords,
        metadata: {
          audioDuration: sample.duration,
          transcript: sample.transcript,
          diarizationSegments: sample.diarization,
        },
      };

      onIngest(newExhibit);
      setIsIngesting(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#090D16] border border-rose-900/60 rounded-xl p-5 shadow-2xl space-y-6 text-xs font-mono text-slate-200"
    >
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              FORENSIC VOICE RECORDING & AUDIO TRANSCRIBER
              <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] px-2 py-0.5 rounded font-mono">
                SPEAKER DIARIZATION ONLINE
              </span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Extract threat words, phone solicitations, and suspect speech diarization from audio calls
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          Close Studio
        </button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <label className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Select Pre-Loaded Intercept Audio recording:</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOCK_AUDIO_SAMPLES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSampleIdx === idx
                  ? 'bg-rose-950/30 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white text-xs truncate">{s.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>Duration: {s.duration}</span>
                <span className="text-rose-400 font-bold">{s.threatKeywords.length} Threat Vectors</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Waveform & Player Controls */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <div className="font-bold text-white">{sample.title}</div>
              <div className="text-[11px] text-slate-400">Duration: {sample.duration} | 44.1kHz Stereo PCM</div>
            </div>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="h-12 bg-slate-900/90 rounded-lg border border-slate-800 p-2 flex items-center justify-between gap-1 overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => {
            const heightPct = isPlaying
              ? Math.floor(20 + Math.sin(i + Date.now() * 0.01) * 35 + Math.random() * 45)
              : Math.floor(15 + (i % 5) * 12);
            return (
              <motion.div
                key={i}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.15 }}
                className={`w-1 rounded-full ${
                  i < 18 ? 'bg-rose-500' : i < 34 ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Speaker Diarization Breakdown */}
      <div className="space-y-3">
        <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <UserX className="w-4 h-4 text-rose-400" />
          <span>AI Speaker Diarization & Speech Breakdown:</span>
        </label>

        <div className="space-y-2">
          {sample.diarization.map((seg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                seg.speaker === 'SUSPECT'
                  ? 'bg-rose-950/20 border-rose-900/60 text-rose-200'
                  : 'bg-cyan-950/20 border-cyan-900/60 text-cyan-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  {seg.speaker === 'SUSPECT' ? (
                    <UserX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>{seg.speaker} SPEECH SEGMENT</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Timestamp: {seg.timestamp}</span>
              </div>
              <p className="leading-relaxed font-sans text-slate-200 pt-1">{seg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Threat Words */}
      <div className="space-y-2">
        <label className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Extracted Fraud & Coercion Keywords:</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {sample.threatKeywords.map((kw, i) => (
            <span
              key={i}
              className="bg-amber-950 text-amber-300 border border-amber-800 text-[11px] px-2.5 py-1 rounded font-bold"
            >
              ⚠️ {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleIngestAudio}
          disabled={isIngesting}
          className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono text-xs font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-rose-600/30 border border-rose-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          {isIngesting ? (
            <span>COMPUTING SHA-256 & INGESTING...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>INGEST VOICE RECORDING INTO VAULT</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
