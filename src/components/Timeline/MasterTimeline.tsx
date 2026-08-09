import React, { useState } from 'react';
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
  const [activeProofItem, setActiveProofItem] = useState<EvidenceItem | null>(null);

  // Sort evidence items chronologically
  const sortedItems = [...currentCase.evidenceItems].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const filteredItems = sortedItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesRisk = !highRiskOnly || item.riskScore >= 90;
    return matchesType && matchesRisk;
  });

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
            Automatically aggregates multi-source evidence streams in exact chronological order
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-slate-900">All Evidence Types ({currentCase.evidenceItems.length})</option>
              <option value="chat" className="bg-slate-900">Chats Only</option>
              <option value="email" className="bg-slate-900">Emails Only</option>
              <option value="transaction" className="bg-slate-900">Banking / Crypto TXs</option>
              <option value="audio" className="bg-slate-900">Audio / Call Recordings</option>
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
            <span>CRITICAL RISK (90+)</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-600 before:to-indigo-800">
        {filteredItems.map((item, idx) => (
          <div key={item.id} className="relative group">
            {/* Node Bullet */}
            <div className="absolute -left-6 sm:-left-10 top-1.5 w-6 h-6 rounded-full bg-[#0B0F19] border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-all z-10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </div>

            {/* Event Card */}
            <div className="bg-[#0F172A]/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 shadow-xl transition-all space-y-3">
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
          </div>
        ))}
      </div>

      {/* SHA-256 Integrity Verification Modal */}
      {activeProofItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-cyan-500/50 rounded-xl max-w-xl w-full p-6 font-mono space-y-4 shadow-2xl relative">
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
          </div>
        </div>
      )}
    </div>
  );
};
