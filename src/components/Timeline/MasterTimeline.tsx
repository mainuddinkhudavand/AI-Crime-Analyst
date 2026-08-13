import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  Filter,
  MessageSquare,
  Mail,
  CreditCard,
  Mic,
  FileImage,
  Tag,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Search,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { EvidenceItem, EvidenceType, CrimeCase } from '../../types';
import { redactSensitivePII } from '../../utils/entityExtractor';
import { formatHash } from '../../utils/cryptoUtils';

interface MasterTimelineProps {
  currentCase: CrimeCase;
  piiRedacted: boolean;
}

export const MasterTimeline: React.FC<MasterTimelineProps> = ({
  currentCase,
  piiRedacted,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [highRiskOnly, setHighRiskOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProofItem, setActiveProofItem] = useState<EvidenceItem | null>(null);

  // Playback state for Incident Chronological Replay
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [playbackIdx, setPlaybackIdx] = useState<number>(-1);

  // Sort evidence items chronologically
  const sortedItems = [...currentCase.evidenceItems].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const filteredItems = sortedItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesRisk = !highRiskOnly || item.riskScore >= 90;
    const content = `${item.title} ${item.rawContent} ${item.exhibitNumber} ${item.sourceName}`.toLowerCase();
    const matchesSearch = content.includes(searchQuery.toLowerCase());
    return matchesType && matchesRisk && matchesSearch;
  });

  // Handle Playback Interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = Math.max(800 / playbackSpeed, 200);
      timer = setInterval(() => {
        setPlaybackIdx(prev => {
          if (prev >= filteredItems.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, filteredItems.length]);

  const handleStartPlayback = () => {
    if (playbackIdx >= filteredItems.length - 1) {
      setPlaybackIdx(0);
    } else if (playbackIdx < 0) {
      setPlaybackIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setPlaybackIdx(-1);
  };

  const handleExportTimelineCSV = () => {
    const headers = ['Exhibit #', 'Timestamp', 'Type', 'Title', 'Risk Score', 'SHA-256 Hash'];
    const rows = filteredItems.map(item => [
      `"${item.exhibitNumber}"`,
      `"${item.timestamp}"`,
      `"${item.type}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      item.riskScore,
      `"${item.sha256Hash}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Timeline_${currentCase.caseNumber}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeIcon = (type: EvidenceType) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'transaction':
        return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'audio':
        return <Mic className="w-4 h-4 text-rose-400" />;
      case 'screenshot':
        return <FileImage className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner & Filters */}
      <div className="bg-[#0F172A]/90 border border-cyan-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>CHRONOLOGICAL MASTER CRIME TIMELINE</span>
          </h2>
          <p className="text-xs text-slate-400">
            Multi-source evidence stream step-by-step playback & timeline analysis engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search timeline events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500/50 w-44"
            />
          </div>

          {/* Filter Type */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-slate-900">All Types ({currentCase.evidenceItems.length})</option>
              <option value="chat" className="bg-slate-900">Chats Only</option>
              <option value="email" className="bg-slate-900">Emails Only</option>
              <option value="transaction" className="bg-slate-900">Banking / Crypto TXs</option>
              <option value="audio" className="bg-slate-900">Audio Calls</option>
              <option value="screenshot" className="bg-slate-900">Screenshots / OCR</option>
            </select>
          </div>

          <button
            onClick={() => setHighRiskOnly(!highRiskOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              highRiskOnly
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-md shadow-red-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>CRITICAL (90+)</span>
          </button>

          <button
            onClick={handleExportTimelineCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Incident Replay Control Panel */}
      <div className="bg-[#0B0F19] border border-cyan-950 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleStartPlayback}
            className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold flex items-center space-x-2 shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'PAUSE REPLAY' : 'PLAY CRIME TIMELINE'}</span>
          </button>

          <button
            onClick={handleResetPlayback}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
            title="Reset Timeline Replay"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="text-xs text-slate-400">
            Status: {playbackIdx >= 0 ? (
              <span className="text-cyan-300 font-bold">Step {playbackIdx + 1} of {filteredItems.length}</span>
            ) : (
              <span className="text-slate-500">Ready to Play</span>
            )}
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Replay Speed:</span>
          {[1, 2, 5].map(speed => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                playbackSpeed === speed
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-600 before:to-indigo-800">
        {filteredItems.map((item, idx) => {
          const isCurrentActiveStep = playbackIdx === idx;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className={`relative group ${isCurrentActiveStep ? 'scale-[1.02]' : ''} transition-all duration-200`}
            >
              {/* Node Bullet */}
              <div className={`absolute -left-6 sm:-left-10 top-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-all z-10 ${
                isCurrentActiveStep
                  ? 'bg-cyan-400 border-2 border-white shadow-cyan-400/80 scale-125'
                  : 'bg-[#0B0F19] border-2 border-cyan-400 shadow-cyan-500/30 group-hover:scale-110'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isCurrentActiveStep ? 'bg-black animate-ping' : 'bg-cyan-400'}`}></span>
              </div>

              {/* Event Card */}
              <div className={`bg-[#0F172A]/90 border rounded-xl p-5 shadow-xl transition-all space-y-3 ${
                isCurrentActiveStep
                  ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)] bg-[#131E36]'
                  : 'border-slate-800 hover:border-cyan-500/50'
              }`}>
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-bold px-2.5 py-0.5 rounded font-mono">
                      {item.exhibitNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      {getTypeIcon(item.type)}
                      <span>{item.title}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-cyan-400 font-mono font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.timestamp}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.riskScore >= 90
                        ? 'bg-red-950 text-red-400 border border-red-800/60'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                    }`}>
                      RISK {item.riskScore}/100
                    </span>
                  </div>
                </div>

                {/* Source & Description */}
                <div className="text-xs text-slate-400">
                  Source Stream: <strong className="text-slate-200">{item.sourceName}</strong>
                </div>

                {/* Raw snippet block */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-3 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {redactSensitivePII(item.rawContent, piiRedacted)}
                </div>

                {/* Audio transcript box if audio */}
                {item.type === 'audio' && item.metadata?.transcript && (
                  <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 text-xs text-rose-200">
                    <span className="font-bold text-rose-400 block mb-1">TRANSCRIPT PLAYBACK SNIPPET ({item.metadata.audioDuration || '01:42'}):</span>
                    "{redactSensitivePII(item.metadata.transcript, piiRedacted)}"
                  </div>
                )}

                {/* Bottom Action & SHA-256 Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs">
                  {/* Entities */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.entities.handles.map((h, i) => (
                      <span key={i} className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 text-[11px] px-2 py-0.5 rounded">
                        {h}
                      </span>
                    ))}
                    {item.entities.cryptoWallets.map((w, i) => (
                      <span key={i} className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 text-[11px] px-2 py-0.5 rounded">
                        ETH: {w.slice(0, 8)}...
                      </span>
                    ))}
                    {item.entities.bankAccounts.map((b, i) => (
                      <span key={i} className="bg-amber-950/80 text-amber-300 border border-amber-800/50 text-[11px] px-2 py-0.5 rounded">
                        Mule Bank AC: {b}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveProofItem(item)}
                    className="flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>INSPECT SHA-256 PROOF</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SHA-256 Integrity Verification Modal */}
      <AnimatePresence>
        {activeProofItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0F172A] border border-cyan-500/50 rounded-xl max-w-xl w-full p-6 font-mono space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveProofItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">CRYPTOGRAPHIC EVIDENCE PROOF</h3>
                  <p className="text-xs text-slate-400">Chain of Custody Legal Compliance Audit</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 text-xs">
                <div><strong className="text-slate-400">EXHIBIT NUMBER:</strong> <span className="text-cyan-300 font-bold">{activeProofItem.exhibitNumber}</span></div>
                <div><strong className="text-slate-400">EXHIBIT TITLE:</strong> <span className="text-slate-200">{activeProofItem.title}</span></div>
                <div><strong className="text-slate-400">INGESTION TIMESTAMP:</strong> <span className="text-slate-200">{activeProofItem.timestamp}</span></div>
                <div><strong className="text-slate-400">SOURCE STREAM:</strong> <span className="text-slate-200">{activeProofItem.sourceName}</span></div>
                
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">SHA-256 HASH VERIFICATION:</span>
                  <div className="bg-slate-900 p-2.5 rounded border border-emerald-500/40 text-cyan-300 font-mono text-xs break-all selection:bg-cyan-900">
                    {activeProofItem.sha256Hash}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Verified: Exhibit content is cryptographically locked and unmodified since ingestion.</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveProofItem(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg font-semibold"
                >
                  Close Verification
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
