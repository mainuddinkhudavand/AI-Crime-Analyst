import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ShieldAlert,
  Search,
  Lock,
  Server,
  Zap,
  CheckCircle2,
  FileText,
  AlertCircle,
  Hash,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { CrimeCase, EvidenceItem, OSINTTarget } from '../../types';
import { generateSha256, extractEntities } from '../../utils/entityExtractor';

interface OSINTIntelligenceStudioProps {
  currentCase: CrimeCase;
  onIngestOSINTExhibit: (item: EvidenceItem) => void;
}

const MOCK_OSINT_TARGETS: OSINTTarget[] = [
  {
    id: 'osint-1',
    domainOrHandle: 'dex-vanguard-fx.top',
    targetType: 'DOMAIN',
    registrarOrHost: 'NameCheap Inc. / Tor Proxy Node Frankfurt',
    sslFingerprint: 'SHA256: 4a91c3029f8b4e721a95018b32e18d6e94f210a56218d612e094f09a12849b2c',
    creationDate: '2026-07-02 (Fresh Registration - High Risk)',
    privacyStatus: 'WhoisGuard Privacy Shield (Breached via Reverse DNS)',
    associatedThreatActors: ['Elena Vance', 'Vanguard Staking Node Operator'],
    riskScore: 98,
  },
  {
    id: 'osint-2',
    domainOrHandle: '@elena_vance_fx',
    targetType: 'TELEGRAM_CHANNEL',
    registrarOrHost: 'Telegram MTProto Protocol Session',
    sslFingerprint: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    creationDate: '2026-06-15',
    privacyStatus: 'VoIP Phone Line +1 (310) 555-0198',
    associatedThreatActors: ['@elena_vance_fx', '@vanguard_desk_support'],
    riskScore: 94,
  },
];

export const OSINTIntelligenceStudio: React.FC<OSINTIntelligenceStudioProps> = ({
  currentCase,
  onIngestOSINTExhibit,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<OSINTTarget>(MOCK_OSINT_TARGETS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isIngested, setIsIngested] = useState<boolean>(false);

  const handleIngestOSINT = () => {
    const rawText = `OSINT RECONNAISSANCE FORENSIC EXAMINER REPORT
============================================================
Case Ref: ${currentCase.caseNumber}
Target Analyzed: ${selectedTarget.domainOrHandle} (${selectedTarget.targetType})
Registrar / Host: ${selectedTarget.registrarOrHost}
Creation Date: ${selectedTarget.creationDate}
SSL Certificate Fingerprint: ${selectedTarget.sslFingerprint}
Privacy Status: ${selectedTarget.privacyStatus}

Associated Threat Actors: ${selectedTarget.associatedThreatActors.join(', ')}
Calculated OSINT Threat Score: ${selectedTarget.riskScore}/100 CRITICAL RISK`;

    const sha256 = generateSha256(rawText + currentCase.id + Date.now());

    const newExhibit: EvidenceItem = {
      id: `ev-osint-${Date.now()}`,
      exhibitNumber: `EX-OSINT-${Math.floor(100 + Math.random() * 900)}`,
      caseId: currentCase.id,
      title: `OSINT Reconnaissance Exhibit (${selectedTarget.domainOrHandle})`,
      type: 'screenshot',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      sha256Hash: sha256,
      sourceName: 'OSINT Domain & Dark Web Recon Studio v3.0',
      rawContent: rawText,
      entities: extractEntities(rawText),
      riskScore: selectedTarget.riskScore,
      flaggedKeywords: ['OSINT Reconnaissance', 'Fresh Domain Registration', 'WHOIS Privacy Breach'],
    };

    onIngestOSINTExhibit(newExhibit);
    setIsIngested(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-purple-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              OSINT DOMAIN RECONNAISSANCE & DARK WEB TRACKER STUDIO
              <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                INFRASTRUCTURE TRACING ONLINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              WHOIS reverse lookup, SSL certificate fingerprinting, Telegram channel scraper, and darkweb handles
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search OSINT domain or handle..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-purple-500 w-56"
          />
        </div>
      </div>

      {/* Main Grid: OSINT Target Cards & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OSINT Targets List */}
        <div className="bg-[#090D16] border border-purple-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>OSINT RECON TARGETS</span>
            </h3>
            <span className="text-xs text-purple-400 font-bold">{MOCK_OSINT_TARGETS.length} Targets</span>
          </div>

          <div className="space-y-3">
            {MOCK_OSINT_TARGETS.map(target => (
              <motion.div
                key={target.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedTarget(target);
                  setIsIngested(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedTarget.id === target.id
                    ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-lg shadow-purple-950/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{target.domainOrHandle}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                    {target.targetType}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 truncate">
                  Host: {target.registrarOrHost}
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">{target.creationDate}</span>
                  <span className="text-red-400 font-bold">Threat: {target.riskScore}/100</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Target Inspector */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-purple-900/60 rounded-xl p-6 shadow-2xl space-y-5 font-mono flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedTarget.domainOrHandle}</h3>
                  <span className="text-xs text-purple-400 font-bold uppercase">Target Category: {selectedTarget.targetType}</span>
                </div>
              </div>

              <span className="bg-red-950 text-red-300 border border-red-800 font-bold text-xs px-3 py-1 rounded">
                THREAT SCORE {selectedTarget.riskScore}/100
              </span>
            </div>

            {/* Infrastructure Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold uppercase block border-b border-slate-800 pb-1">REGISTRAR & HOSTING INFO</span>
                <div><strong className="text-slate-400">Registrar / Operator:</strong> {selectedTarget.registrarOrHost}</div>
                <div><strong className="text-slate-400">Registration Date:</strong> {selectedTarget.creationDate}</div>
                <div><strong className="text-slate-400">Privacy Status:</strong> {selectedTarget.privacyStatus}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase block border-b border-slate-800 pb-1">SSL & CRYPTOGRAPHIC FINGERPRINT</span>
                <div className="break-all font-mono text-[11px] text-slate-300">{selectedTarget.sslFingerprint}</div>
                <div className="pt-1 text-slate-400">
                  Associated Suspect Entities: <strong className="text-white">{selectedTarget.associatedThreatActors.join(', ')}</strong>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/30 border border-purple-800/60 p-4 rounded-xl text-xs text-purple-200 leading-relaxed">
              <span className="font-bold text-purple-400 block mb-1">AUTOMATED OSINT FINDINGS SYNTHESIS:</span>
              Fresh domain registration on <strong className="text-white">{selectedTarget.domainOrHandle}</strong> combined with WhoisGuard Privacy shielding matches known phishing deployment tactics for Pig Butchering liquidity pools.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleIngestOSINT}
              disabled={isIngested}
              className={`px-6 py-2.5 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all ${
                isIngested
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40 active:scale-95'
              }`}
            >
              {isIngested ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>OSINT EXHIBIT INGESTED INTO VAULT</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>INGEST OSINT FINDINGS INTO VAULT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
