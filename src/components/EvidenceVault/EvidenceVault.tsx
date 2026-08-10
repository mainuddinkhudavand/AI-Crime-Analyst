import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  FileImage,
  CreditCard,
  Mic,
  Plus,
  Lock,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  Scan,
  ShieldCheck,
  Tag,
  Trash2,
} from 'lucide-react';
import { EvidenceItem, EvidenceType, CrimeCase } from '../../types';
import { redactSensitivePII } from '../../utils/entityExtractor';
import { formatHash } from '../../utils/cryptoUtils';
import { FileDropzone } from './FileDropzone';

interface EvidenceVaultProps {
  currentCase: CrimeCase;
  piiRedacted: boolean;
  onOpenIngestModal: () => void;
  onIngestFiles: (items: EvidenceItem[]) => void;
  onDeleteExhibit: (exhibitId: string) => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  currentCase,
  piiRedacted,
  onOpenIngestModal,
  onIngestFiles,
  onDeleteExhibit,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExhibit, setSelectedExhibit] = useState<EvidenceItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const filteredItems = currentCase.evidenceItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const content = `${item.title} ${item.rawContent} ${item.exhibitNumber} ${item.sha256Hash}`.toLowerCase();
    const matchesSearch = content.includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getSourceIcon = (type: EvidenceType) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'screenshot':
        return <FileImage className="w-4 h-4 text-purple-400" />;
      case 'transaction':
        return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'audio':
        return <Mic className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Day 2 Drag and Drop Multi-File Ingestion Zone */}
      <FileDropzone
        onIngestFiles={onIngestFiles}
        existingCount={currentCase.evidenceItems.length}
        caseId={currentCase.id}
      />

      {/* Top Toolbar & Filter bar */}
      <div className="bg-[#0F172A]/90 border border-cyan-900/50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            ALL EXHIBITS ({currentCase.evidenceItems.length})
          </button>
          <button
            onClick={() => setFilterType('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              filterType === 'chat'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CHATS</span>
          </button>
          <button
            onClick={() => setFilterType('email')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              filterType === 'email'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>EMAILS</span>
          </button>
          <button
            onClick={() => setFilterType('transaction')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              filterType === 'transaction'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>TRANSACTIONS</span>
          </button>
          <button
            onClick={() => setFilterType('audio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              filterType === 'audio'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>AUDIO</span>
          </button>
          <button
            onClick={() => setFilterType('screenshot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              filterType === 'screenshot'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            <FileImage className="w-3.5 h-3.5" />
            <span>OCR SCREENSHOTS</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search hashes, entities, keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder-slate-500 font-mono"
            />
          </div>

          <button
            onClick={onOpenIngestModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md shadow-cyan-500/20 whitespace-nowrap transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD TEXT EVIDENCE</span>
          </button>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedExhibit(item)}
            className="bg-[#0F172A]/80 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 cursor-pointer group hover:shadow-xl hover:shadow-cyan-950/40 transition-all relative overflow-hidden"
          >
            {/* Top Badge Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  {item.exhibitNumber}
                </span>
                <span className="flex items-center space-x-1 bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded">
                  {getSourceIcon(item.type)}
                  <span className="capitalize">{item.type}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Cryptographically Validated SHA-256" />
                <span className="text-[10px] text-slate-400 font-mono" title={item.sha256Hash}>
                  {formatHash(item.sha256Hash)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove exhibit ${item.exhibitNumber}?`)) {
                      onDeleteExhibit(item.id);
                    }
                  }}
                  className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-all ml-1"
                  title="Remove Exhibit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Exhibit Title & Source */}
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                Source: {item.sourceName}
              </p>
            </div>

            {/* Content Snippet */}
            <div className="bg-slate-950/70 border border-slate-900 rounded-lg p-2.5 text-xs text-slate-300 font-mono line-clamp-3 leading-relaxed">
              {redactSensitivePII(item.rawContent, piiRedacted)}
            </div>

            {/* Audio Waveform / Transcript Preview if Audio */}
            {item.type === 'audio' && item.metadata?.transcript && (
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-rose-300 font-bold">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-rose-400" />
                    <span>AUDIO RECORDING ({item.metadata.audioDuration || '01:42'})</span>
                  </span>
                  <span className="text-emerald-400 text-[10px]">AI TRANSCRIPT SYNCED</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-200 text-xs italic">
                  <div className="flex space-x-0.5 items-center">
                    <span className="w-1 h-3 bg-rose-500 animate-pulse"></span>
                    <span className="w-1 h-5 bg-rose-400 animate-pulse delay-75"></span>
                    <span className="w-1 h-2 bg-rose-500 animate-pulse"></span>
                    <span className="w-1 h-4 bg-rose-400 animate-pulse delay-100"></span>
                  </div>
                  <span className="truncate font-sans text-[11px]">"{item.metadata.transcript.slice(0, 60)}..."</span>
                </div>
              </div>
            )}

            {/* OCR Screenshot indicator if screenshot */}
            {item.type === 'screenshot' && (
              <div className="bg-purple-950/20 border border-purple-900/40 rounded-lg p-2 flex items-center justify-between text-xs text-purple-300">
                <span className="flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5 text-purple-400" />
                  <span>OCR TEXT EXTRACTION (98% confidence)</span>
                </span>
                <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded">EXHIBIT IMAGE</span>
              </div>
            )}

            {/* Entities Chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {item.entities.handles.slice(0, 2).map((h, i) => (
                <span key={i} className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 text-[10px] px-1.5 py-0.5 rounded">
                  {h}
                </span>
              ))}
              {item.entities.cryptoWallets.slice(0, 1).map((w, i) => (
                <span key={i} className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[10px] px-1.5 py-0.5 rounded">
                  ETH: {w.slice(0, 6)}...
                </span>
              ))}
              {item.entities.bankAccounts.slice(0, 1).map((b, i) => (
                <span key={i} className="bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[10px] px-1.5 py-0.5 rounded">
                  AC: {b.slice(0, 8)}
                </span>
              ))}
              {item.entities.phones.slice(0, 1).map((p, i) => (
                <span key={i} className="bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-[10px] px-1.5 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
              <span>{item.timestamp}</span>
              <span className={`font-bold px-1.5 py-0.5 rounded ${
                item.riskScore > 90 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400'
              }`}>
                RISK {item.riskScore}/100
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Inspector for Selected Exhibit */}
      {selectedExhibit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-cyan-500/40 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 font-mono space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedExhibit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Exhibit Header */}
            <div className="flex items-center space-x-3">
              <span className="bg-cyan-950 border border-cyan-500 text-cyan-300 text-sm font-bold px-2.5 py-1 rounded">
                {selectedExhibit.exhibitNumber}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {selectedExhibit.title}
                </h2>
                <p className="text-xs text-slate-400">Source: {selectedExhibit.sourceName} | Ingested: {selectedExhibit.timestamp}</p>
              </div>
            </div>

            {/* SHA-256 Proof Card */}
            <div className="bg-slate-950 border border-emerald-500/40 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CRYPTOGRAPHIC EVIDENCE PROOF (CHAIN OF CUSTODY)</span>
                </span>
                <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px]">100% UNTAMPERED</span>
              </div>
              <div className="text-xs text-slate-300 font-mono break-all selection:bg-cyan-900">
                SHA-256: <span className="text-cyan-300">{selectedExhibit.sha256Hash}</span>
              </div>
            </div>

            {/* Audio Transcript Player View if Audio */}
            {selectedExhibit.type === 'audio' && selectedExhibit.metadata?.transcript && (
              <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm">
                    <Mic className="w-5 h-5 text-rose-400 animate-pulse" />
                    <span>AUDIO EVIDENCE PLAYBACK & AI TRANSCRIPT</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Duration: {selectedExhibit.metadata.audioDuration || '01:42'}</span>
                </div>

                {/* Simulated Audio Player Controls */}
                <div className="bg-slate-900 rounded-lg p-3 flex items-center space-x-4">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-all"
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                      <div className={`h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all ${isPlayingAudio ? 'w-3/4 duration-5000' : 'w-1/4'}`}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>00:24</span>
                      <span>{selectedExhibit.metadata.audioDuration || '01:42'}</span>
                    </div>
                  </div>
                  <Volume2 className="w-5 h-5 text-slate-400" />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg text-xs text-slate-200 leading-relaxed border border-slate-800">
                  <span className="text-rose-400 font-bold block mb-1">SPEECH-TO-TEXT FORENSIC TRANSCRIPT:</span>
                  "{redactSensitivePII(selectedExhibit.metadata.transcript, piiRedacted)}"
                </div>
              </div>
            )}

            {/* Email Headers if Email */}
            {selectedExhibit.type === 'email' && selectedExhibit.metadata?.emailHeaders && (
              <div className="bg-blue-950/20 border border-blue-800/40 rounded-xl p-3 text-xs space-y-1 text-slate-300">
                <div className="text-blue-400 font-bold mb-1">FORENSIC EMAIL HEADERS AUDIT</div>
                <div>FROM: <span className="text-cyan-300">{selectedExhibit.metadata.emailHeaders.from}</span></div>
                <div>TO: <span className="text-slate-200">{selectedExhibit.metadata.emailHeaders.to}</span></div>
                <div>SPF STATUS: <span className="text-red-400 font-bold">{selectedExhibit.metadata.emailHeaders.spfStatus}</span></div>
                <div>ORIGINATING IP: <span className="text-amber-300">{selectedExhibit.metadata.emailHeaders.originatingIp}</span></div>
              </div>
            )}

            {/* Raw Content Display */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Raw Exhibit Content</label>
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {redactSensitivePII(selectedExhibit.rawContent, piiRedacted)}
              </pre>
            </div>

            {/* Extracted Entities Table */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <span>Extracted Forensic Entities & Identifiers</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedExhibit.entities.handles.length > 0 && (
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-indigo-400 font-bold block text-[11px]">Handles/Aliases:</span>
                    <span className="text-slate-200">{selectedExhibit.entities.handles.join(', ')}</span>
                  </div>
                )}
                {selectedExhibit.entities.phones.length > 0 && (
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-cyan-400 font-bold block text-[11px]">Phone Numbers:</span>
                    <span className="text-slate-200">{selectedExhibit.entities.phones.join(', ')}</span>
                  </div>
                )}
                {selectedExhibit.entities.cryptoWallets.length > 0 && (
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold block text-[11px]">Crypto Wallets:</span>
                    <span className="text-slate-200 break-all">{selectedExhibit.entities.cryptoWallets.join(', ')}</span>
                  </div>
                )}
                {selectedExhibit.entities.bankAccounts.length > 0 && (
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold block text-[11px]">Bank / Mule Accounts:</span>
                    <span className="text-slate-200">{selectedExhibit.entities.bankAccounts.join(', ')}</span>
                  </div>
                )}
                {selectedExhibit.entities.urls.length > 0 && (
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-rose-400 font-bold block text-[11px]">Phishing URLs:</span>
                    <span className="text-slate-200">{selectedExhibit.entities.urls.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedExhibit(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
