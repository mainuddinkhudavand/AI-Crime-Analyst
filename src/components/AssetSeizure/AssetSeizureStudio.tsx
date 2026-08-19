import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShieldAlert,
  Lock,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building,
  TrendingUp,
  Percent,
  FileText,
  Landmark,
} from 'lucide-react';
import { CrimeCase, AssetSeizureNode } from '../../types';

interface AssetSeizureStudioProps {
  currentCase: CrimeCase;
}

const MOCK_ASSETS: AssetSeizureNode[] = [
  {
    id: 'asset-1',
    assetType: 'CRYPTO_WALLET',
    identifier: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    institution: 'Binance Hot Wallet Custody (Deposit AC)',
    amountUSD: 35000,
    freezeStatus: 'FROZEN',
    recoveryProbability: 92,
  },
  {
    id: 'asset-2',
    assetType: 'FIAT_BANK',
    identifier: 'AC-884102941',
    institution: 'JPMorgan Chase Fraud Hold AC',
    amountUSD: 15000,
    freezeStatus: 'FROZEN',
    recoveryProbability: 96,
  },
  {
    id: 'asset-3',
    assetType: 'OFFSHORE_SHELL',
    identifier: 'CY-90412891',
    institution: 'Bank of Cyprus Offshore Wire Node',
    amountUSD: 45000,
    freezeStatus: 'PENDING_WARRANT',
    recoveryProbability: 45,
  },
];

export const AssetSeizureStudio: React.FC<AssetSeizureStudioProps> = ({ currentCase }) => {
  const [assets, setAssets] = useState<AssetSeizureNode[]>(MOCK_ASSETS);

  const totalStolenUSD = currentCase.totalLossUSD;
  const totalFrozenUSD = assets.filter(a => a.freezeStatus === 'FROZEN').reduce((acc, a) => acc + a.amountUSD, 0);
  const recoveryRate = Math.round((totalFrozenUSD / Math.max(totalStolenUSD, 1)) * 100);

  const handleDownloadWarrant = () => {
    const warrantText = `EMERGENCY ASSET SEIZURE & RESTITUTION WARRANT DIRECTIVE
============================================================
CASE REF: ${currentCase.caseNumber}
VICTIM: ${currentCase.victimName} (${currentCase.victimLocation})
TOTAL STOLEN CAPITAL: $${currentCase.totalLossUSD.toLocaleString()} USD
DATE OF ISSUANCE: ${new Date().toISOString()}

TARGETED ASSETS FOR RECOVERY:
------------------------------------------------------------
${assets.map(a => `[${a.assetType}] ${a.institution}
Identifier: ${a.identifier}
Amount Locked: $${a.amountUSD.toLocaleString()} USD
Freeze Status: ${a.freezeStatus}
Recovery Probability: ${a.recoveryProbability}%\n`).join('\n')}

Issued by: AI Digital Crime Scene Investigator Asset Recovery Engine v8.0`;

    const blob = new Blob([warrantText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Asset_Seizure_Warrant_${currentCase.caseNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-emerald-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Landmark className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI AUTOMATED ASSET SEIZURE & RESTITUTION CALCULATOR
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                RECOVERY RATE: {recoveryRate}%
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time capital tracking across fiat accounts, crypto exchanges, and offshore wire holds
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadWarrant}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/30 border border-emerald-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>GENERATE ASSET SEIZURE WARRANT</span>
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Victim Reported Loss</span>
          <div className="text-xl font-bold text-red-400">${totalStolenUSD.toLocaleString()} USD</div>
          <div className="text-[11px] text-slate-500">Total Victim Drain</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Total Frozen Capital</span>
          <div className="text-xl font-bold text-emerald-400">${totalFrozenUSD.toLocaleString()} USD</div>
          <div className="text-[11px] text-slate-500">Under Legal Hold</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Estimated Victim Restitution</span>
          <div className="text-xl font-bold text-cyan-300">{recoveryRate}% Recovery Rate</div>
          <div className="text-[11px] text-slate-500">FIPS & FinCEN Compliant</div>
        </div>
      </div>

      {/* Asset Nodes Manifest Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {assets.map(asset => (
          <div key={asset.id} className="bg-[#090D16] border border-emerald-900/40 rounded-xl p-5 shadow-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-bold">
                {asset.assetType}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                asset.freezeStatus === 'FROZEN'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {asset.freezeStatus}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs">{asset.institution}</h4>
              <p className="text-slate-400 text-[11px] break-all">{asset.identifier}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex justify-between items-center">
              <div>
                <span className="text-slate-500 text-[10px] block">Locked Amount</span>
                <span className="text-emerald-400 font-bold text-sm">${asset.amountUSD.toLocaleString()} USD</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] block">Recovery Score</span>
                <span className="text-cyan-300 font-bold">{asset.recoveryProbability}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
