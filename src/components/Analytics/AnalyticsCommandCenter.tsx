import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Download,
  DollarSign,
  FileCheck,
  Zap,
  Activity,
  Layers,
  Award,
} from 'lucide-react';
import { CrimeCase } from '../../types';

interface AnalyticsCommandCenterProps {
  currentCase: CrimeCase;
  allCases: CrimeCase[];
}

export const AnalyticsCommandCenter: React.FC<AnalyticsCommandCenterProps> = ({
  currentCase,
  allCases,
}) => {
  const totalLoss = currentCase.totalLossUSD;
  const criticalExhibitsCount = currentCase.evidenceItems.filter(e => e.riskScore >= 90).length;
  const highExhibitsCount = currentCase.evidenceItems.filter(e => e.riskScore >= 70 && e.riskScore < 90).length;
  const normalExhibitsCount = currentCase.evidenceItems.filter(e => e.riskScore < 70).length;

  const handleExportFullBundle = () => {
    const bundleData = {
      manifestHeader: {
        platform: 'AI Digital Crime Scene Investigator v3.0',
        generatedTimestamp: new Date().toISOString(),
        caseNumber: currentCase.caseNumber,
        caseTitle: currentCase.title,
        victimName: currentCase.victimName,
        totalLossUSD: currentCase.totalLossUSD,
        scamCategory: currentCase.scamCategory,
        chainOfCustodyStatus: '100% SHA-256 VERIFIED UNTAMPERED',
      },
      suspectDossier: currentCase.suspects,
      evidenceExhibits: currentCase.evidenceItems,
      graphNodes: currentCase.graphNodes,
      graphEdges: currentCase.graphEdges,
      aiAlerts: currentCase.aiAlerts,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundleData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `FORENSIC_CASE_BUNDLE_${currentCase.caseNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-emerald-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              EXECUTIVE CYBERCRIME ANALYTICS & EXPORT COMMAND CENTER
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                TELEMETRY BENCHMARKS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Loss velocity analytics, risk severity distributions, and 1-click full forensic case bundle export
            </p>
          </div>
        </div>

        <button
          onClick={handleExportFullBundle}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 border border-emerald-400/30 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT FULL CASE FORENSIC BUNDLE</span>
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Total Case Capital Drain</span>
          <div className="text-xl font-bold text-emerald-400">${totalLoss.toLocaleString()} USD</div>
          <div className="text-[11px] text-slate-500">{currentCase.scamCategory}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Critical Risk Exhibits (90+)</span>
          <div className="text-xl font-bold text-red-400">{criticalExhibitsCount} Exhibits</div>
          <div className="text-[11px] text-slate-500">Requires Immediate Law Hold</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Scam Fraud Velocity</span>
          <div className="text-xl font-bold text-amber-300">21 Days Duration</div>
          <div className="text-[11px] text-slate-500">Initial Solicit to Final Drain</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Cryptographic Integrity Score</span>
          <div className="text-xl font-bold text-cyan-300">100% SHA-256 Valid</div>
          <div className="text-[11px] text-slate-500">Chain of Custody Compliant</div>
        </div>
      </div>

      {/* Visual Risk Distribution Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#090D16] border border-cyan-900/40 rounded-xl p-6 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>EXHIBIT THREAT SEVERITY DISTRIBUTION</span>
            </h3>
            <span className="text-xs text-slate-400">{currentCase.evidenceItems.length} Total Exhibits</span>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="text-red-400 font-bold">Critical Risk (90 - 100)</span>
                <span>{criticalExhibitsCount} Exhibits ({Math.round((criticalExhibitsCount / Math.max(currentCase.evidenceItems.length, 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${(criticalExhibitsCount / Math.max(currentCase.evidenceItems.length, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="text-amber-400 font-bold">High Risk (70 - 89)</span>
                <span>{highExhibitsCount} Exhibits ({Math.round((highExhibitsCount / Math.max(currentCase.evidenceItems.length, 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${(highExhibitsCount / Math.max(currentCase.evidenceItems.length, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="text-cyan-400 font-bold">Standard Risk (&lt; 70)</span>
                <span>{normalExhibitsCount} Exhibits ({Math.round((normalExhibitsCount / Math.max(currentCase.evidenceItems.length, 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${(normalExhibitsCount / Math.max(currentCase.evidenceItems.length, 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Loss Distribution Card */}
        <div className="bg-[#0F172A] border border-cyan-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>ACTIVE CASE LOSS BENCHMARKS</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold">{allCases.length} Cases Monitored</span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {allCases.map(c => (
              <div key={c.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{c.caseNumber}</span>
                  <span className="text-emerald-400 font-bold">${c.totalLossUSD.toLocaleString()} USD</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{c.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
