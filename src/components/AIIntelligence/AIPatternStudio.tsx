import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Cpu,
  CheckCircle2,
  Zap,
  ArrowRight,
  FileText,
  Lock,
  Eye,
  Compass,
  Shield,
  Layers,
  Search,
  Scale,
  Copy,
  Check,
} from 'lucide-react';
import { CrimeCase, SubpoenaType } from '../../types';

interface AIPatternStudioProps {
  currentCase: CrimeCase;
  allCases?: CrimeCase[];
}

export const AIPatternStudio: React.FC<AIPatternStudioProps> = ({ currentCase, allCases = [] }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [activeSubpoenaTab, setActiveSubpoenaTab] = useState<SubpoenaType>('whatsapp_preservation');
  const [copiedSubpoena, setCopiedSubpoena] = useState<boolean>(false);

  const handleRunDeepScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 150);
  };

  // Generate Subpoena Text based on currentCase
  const getSubpoenaText = () => {
    switch (activeSubpoenaTab) {
      case 'whatsapp_preservation':
        return `18 U.S.C. § 2703(f) EMERGENCY PRESERVATION LETTER
TO: Meta Platforms, Inc. / WhatsApp Law Enforcement Operations
RE: EMERGENCY RECORD PRESERVATION - CASE REF ${currentCase.caseNumber}

Pursuant to 18 U.S.C. § 2703(f), you are hereby requested to preserve all stored communications, records, and metadata associated with the following accounts for 90 days pending formal subpoena issuance:

Target Accounts / Phone Lines:
${currentCase.suspects.map(s => `- ${s.nameAlias}: Phone ${s.phone} | Handle ${s.handle}`).join('\n')}

Scope of Preservation:
1. Complete user profile information, IP connection logs, subscriber details, and device identifiers.
2. Unencrypted message metadata, media attachments, call logs, and contact rosters.
3. Cryptographic hash records of all transmitted media.

Date: ${new Date().toISOString().slice(0, 10)}
Issuing Unit: Cyber Crime Division Forensic AI Investigator`;

      case 'coinbase_freeze':
        return `EMERGENCY ASSET FREEZE & SUBPOENA DEMAND
TO: Coinbase Global, Inc. Compliance & Legal Department
RE: IMMEDIATE STOLEN ASSET FREEZE - CASE REF ${currentCase.caseNumber}

This emergency directive requests the immediate freeze of all accounts and un-hosted wallets linked to stolen victim funds total $${currentCase.totalLossUSD.toLocaleString()} USD.

Target Suspect Wallets & Associated Hashes:
- Ethereum Wallet: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
- Transaction Reference: Vanguard Staking Node Deposit Tier 1

Legal Authority: Section 91 CrPC / Emergency Fraud Asset Tracing Directive
Action Required: Place 72-hour administrative hold on any outgoing withdrawals from identified recipient accounts.`;

      case 'bank_hold':
        return `BANKING MULE ACCOUNT PRESERVATION & HOLD REQUEST
TO: Financial Crimes Enforcement Network (FinCEN) / Partner Bank Compliance
RE: FRAUDULENT WIRE HOLD - CASE REF ${currentCase.caseNumber}

Investigative findings confirm multi-hop wire transfers originating from victim ${currentCase.victimName} (${currentCase.victimLocation}) into suspected money mule accounts.

Target Mule Bank Accounts:
- Chase / Citibank AC: 984102948 (Vanguard Escrow Holdings Ltd)
- Total Reported Fraud Volume: $${currentCase.totalLossUSD.toLocaleString()} USD

Requested Action: Freeze target account ledger, preserve IP login history, and provide account beneficiary KYC documents.`;
    }
  };

  const handleCopySubpoena = () => {
    navigator.clipboard.writeText(getSubpoenaText());
    setCopiedSubpoena(true);
    setTimeout(() => setCopiedSubpoena(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-amber-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI SCAM PATTERN & ANOMALY RECOGNITION STUDIO
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono">
                NEURAL DETECTOR ONLINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              AI detects psychological manipulation, urgency triggers, cross-case syndicate links, and subpoena generation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunDeepScan}
            disabled={isScanning}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-amber-600/30 border border-amber-400/40 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isScanning ? `SCANNING NEURAL NET (${scanProgress}%)` : 'RUN LIVE DEEP SCAN'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar if scanning */}
      {isScanning && (
        <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs text-amber-300 font-bold">
            <span>Analyzing Psychological Urgency Vectors & Cross-Case Wallet Matches...</span>
            <span>{scanProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 transition-all duration-150" style={{ width: `${scanProgress}%` }} />
          </div>
        </div>
      )}

      {/* Grid of AI Pattern Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentCase.aiAlerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0F172A] border border-amber-500/40 rounded-xl p-5 shadow-2xl space-y-4 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <span className="bg-red-950 border border-red-800 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {alert.severity} SEVERITY ALERT
                </span>
                <h3 className="text-sm font-bold text-white">{alert.title}</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                Cat: {alert.category}
              </span>
            </div>

            {/* Description */}
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-900">
              {alert.description}
            </div>

            {/* Modus Operandi Breakdown */}
            <div className="space-y-1.5 text-xs">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Suspect Modus Operandi (MO):</span>
              </span>
              <div className="bg-amber-950/20 border border-amber-900/40 p-2.5 rounded-lg text-amber-200 text-xs">
                {alert.modusOperandi}
              </div>
            </div>

            {/* Evidence References */}
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Linked Exhibits:</span>
              {alert.evidenceRefs.map((ref, i) => (
                <span key={i} className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  {ref}
                </span>
              ))}
            </div>

            {/* Actionable Recommendation */}
            <div className="bg-emerald-950/30 border border-emerald-800/60 p-3 rounded-lg text-xs space-y-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Actionable Recommendation:</span>
              </span>
              <p className="text-emerald-200 leading-relaxed">{alert.recommendation}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cross-Case Intelligence Linkage Matrix */}
      <div className="bg-[#0D121F] border border-cyan-900/60 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              CROSS-CASE INTELLIGENCE LINKAGE MATRIX
            </h3>
          </div>
          <span className="text-xs text-cyan-400">Syndicate Pattern Matching Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-400">Crypto Wallet Match Across Cases</span>
              <span className="bg-red-950 text-red-300 text-[10px] px-2 py-0.5 rounded font-bold border border-red-800">
                CRITICAL MATCH
              </span>
            </div>
            <div className="text-slate-300">
              Wallet <span className="text-cyan-300 font-mono font-bold">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span> is flagged in <strong>CASE-2026-9842</strong> and <strong>CASE-2026-1049</strong>.
            </div>
            <p className="text-slate-400 text-[11px]">
              Indicates organized cybercrime ring operating multi-tier Pig Butchering & Fake DEX Staking pools.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-400">Suspect Phone Line Recurrence</span>
              <span className="bg-amber-950 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-800">
                HIGH CORRELATION
              </span>
            </div>
            <div className="text-slate-300">
              Phone line <span className="text-cyan-300 font-mono font-bold">+1 (310) 555-0198</span> linked to handles <strong>@elena_vance_fx</strong> and <strong>@vanguard_desk_support</strong>.
            </div>
            <p className="text-slate-400 text-[11px]">
              Same VoIP phone range used in WhatsApp romance solicitations and fake escrow wire calls.
            </p>
          </div>
        </div>
      </div>

      {/* Law Enforcement Subpoena Directives Generator */}
      <div className="bg-[#090D16] border border-amber-900/60 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AUTOMATED LAW ENFORCEMENT SUBPOENA & ASSET FREEZE DIRECTIVES
            </h3>
          </div>

          <button
            onClick={handleCopySubpoena}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700"
          >
            {copiedSubpoena ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSubpoena ? 'COPIED TO CLIPBOARD' : 'COPY DIRECTIVE DRAFT'}</span>
          </button>
        </div>

        {/* Subpoena Type Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSubpoenaTab('whatsapp_preservation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubpoenaTab === 'whatsapp_preservation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            WhatsApp / Meta 18 U.S.C. § 2703(f)
          </button>
          <button
            onClick={() => setActiveSubpoenaTab('coinbase_freeze')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubpoenaTab === 'coinbase_freeze'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Coinbase Crypto Freeze Demand
          </button>
          <button
            onClick={() => setActiveSubpoenaTab('bank_hold')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubpoenaTab === 'bank_hold'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mule Bank Account Hold Notice
          </button>
        </div>

        {/* Subpoena Text Box */}
        <textarea
          readOnly
          value={getSubpoenaText()}
          rows={12}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none"
        />
      </div>
    </div>
  );
};
