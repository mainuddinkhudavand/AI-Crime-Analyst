import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Radio,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  RefreshCw,
  Check,
} from 'lucide-react';
import { CrimeCase, EvidenceItem, GlobalThreatIncident } from '../../types';
import { generateSha256, extractEntities } from '../../utils/entityExtractor';

interface GlobalThreatFeedProps {
  currentCase: CrimeCase;
  onIngestThreatExhibit: (item: EvidenceItem) => void;
}

const MOCK_GLOBAL_INCIDENTS: GlobalThreatIncident[] = [
  {
    id: 'inc-1',
    syndicateName: 'Golden Triad Pig Butchering Syndicate #44',
    threatCategory: 'Pig Butchering / Crypto Arbitrage Scam',
    originCountry: 'Sihanoukville, Cambodia',
    activeWalletOrHandle: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    estimatedStolenCapitalUSD: 14200000,
    threatLevel: 'CRITICAL',
    discoveredDate: '2026-08-17 (LIVE INTERPOL FEED)',
  },
  {
    id: 'inc-2',
    syndicateName: 'Vanguard VIP Signal Task Syndicate',
    threatCategory: 'Telegram Task & Remote Deposit Fraud',
    originCountry: 'Dubai, UAE',
    activeWalletOrHandle: '@elena_vance_fx (+1 310 555 0198)',
    estimatedStolenCapitalUSD: 4800000,
    threatLevel: 'HIGH',
    discoveredDate: '2026-08-16 (LIVE FBI CYBER FEED)',
  },
];

export const GlobalThreatFeed: React.FC<GlobalThreatFeedProps> = ({
  currentCase,
  onIngestThreatExhibit,
}) => {
  const [incidents] = useState<GlobalThreatIncident[]>(MOCK_GLOBAL_INCIDENTS);
  const [ingestedIds, setIngestedIds] = useState<string[]>([]);

  const handleIngestIncident = (inc: GlobalThreatIncident) => {
    const rawContent = `GLOBAL CYBERCRIME THREAT INTELLIGENCE DISPATCH
============================================================
Case Ref: ${currentCase.caseNumber}
Syndicate Name: ${inc.syndicateName}
Threat Category: ${inc.threatCategory}
Origin Location: ${inc.originCountry}
Active Wallet / Handle: ${inc.activeWalletOrHandle}
Estimated Stolen Capital: $${inc.estimatedStolenCapitalUSD.toLocaleString()} USD
Threat Classification: ${inc.threatLevel}
Source: INTERPOL / FBI Global Cybercrime Matrix`;

    const sha256 = generateSha256(rawContent + currentCase.id + Date.now());

    const newExhibit: EvidenceItem = {
      id: `ev-global-${Date.now()}`,
      exhibitNumber: `EX-GLOBAL-${Math.floor(100 + Math.random() * 900)}`,
      caseId: currentCase.id,
      title: `Global Threat Intel Exhibit (${inc.syndicateName})`,
      type: 'chat',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      sha256Hash: sha256,
      sourceName: 'Global Cybercrime Threat Intelligence Feed v7.0',
      rawContent,
      entities: extractEntities(rawContent),
      riskScore: 96,
      flaggedKeywords: ['Global Threat Syndicate', 'Pig Butchering', 'Interpol Dispatch'],
    };

    onIngestThreatExhibit(newExhibit);
    setIngestedIds(prev => [...prev, inc.id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-cyan-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              GLOBAL THREAT ACTOR INTELLIGENCE FEED & CYBERCRIME MATRIX
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                REAL-TIME THREAT RADAR
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live intelligence feeds from Interpol, FBI Cyber Division, and Darkweb Telegram scraping nodes
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>GLOBAL THREAT MATRIX SYNCED</span>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {incidents.map(inc => {
          const isIngested = ingestedIds.includes(inc.id);

          return (
            <motion.div
              key={inc.id}
              whileHover={{ scale: 1.01 }}
              className="bg-[#090D16] border border-cyan-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white leading-tight">{inc.syndicateName}</span>
                  <span className="bg-red-950 text-red-300 border border-red-800 font-bold text-[10px] px-2 py-0.5 rounded">
                    {inc.threatLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1">
                  <div><strong className="text-slate-400">Threat Category:</strong> {inc.threatCategory}</div>
                  <div><strong className="text-slate-400">Origin Base:</strong> {inc.originCountry}</div>
                  <div><strong className="text-slate-400">Active Wallet / Handle:</strong> <span className="text-cyan-300 font-bold">{inc.activeWalletOrHandle}</span></div>
                  <div><strong className="text-slate-400">Stolen Capital:</strong> <span className="text-emerald-400 font-bold">${inc.estimatedStolenCapitalUSD.toLocaleString()} USD</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-[10px] text-slate-500">{inc.discoveredDate}</span>
                <button
                  onClick={() => handleIngestIncident(inc)}
                  disabled={isIngested}
                  className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all ${
                    isIngested
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40 active:scale-95'
                  }`}
                >
                  {isIngested ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>THREAT INTEL INGESTED</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>INGEST INTO CASE VAULT</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
