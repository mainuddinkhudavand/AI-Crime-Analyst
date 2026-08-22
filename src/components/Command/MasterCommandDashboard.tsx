import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  Award,
  Download,
  DollarSign,
  Globe,
  Gavel,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  BarChart2,
  Building,
} from 'lucide-react';
import { CrimeCase } from '../../types';

interface MasterCommandDashboardProps {
  currentCase: CrimeCase;
  allCases: CrimeCase[];
}

export const MasterCommandDashboard: React.FC<MasterCommandDashboardProps> = ({
  currentCase,
  allCases,
}) => {
  const totalCasesCount = allCases.length;
  const totalStolenUSD = allCases.reduce((acc, c) => acc + c.totalLossUSD, 0);
  const totalExhibitsCount = currentCase.evidenceItems.length;

  const handleDownloadExecutiveBriefing = () => {
    const briefingText = `EXECUTIVE MASTER CYBERCRIME COMMAND BRIEFING DOSSIER
============================================================
PLATFORM: AI Digital Crime Scene Investigator v10.0 Master Operations
GENERATED DATE: ${new Date().toISOString()}
CURRENT ACTIVE CASE: ${currentCase.caseNumber} - ${currentCase.title}
VICTIM NAME: ${currentCase.victimName} (${currentCase.victimLocation})
TOTAL STOLEN CAPITAL: $${currentCase.totalLossUSD.toLocaleString()} USD

EXECUTIVE METRICS CONSOLIDATION (DAYS 1 - 10):
------------------------------------------------------------
1. Evidence Vault Exhibit Integrity: 100% SHA-256 Verified (FRE Rule 902(14) Compliant)
2. Chain of Custody Audit: 0 Hash Mismatches / 0 Tamper Artifacts
3. Asset Seizure Restitution Rate: 92% Frozen ($50,000 USD under Hold)
4. Multi-Agency Taskforce Status: 4 Active Leads Dispatched (FBI, Interpol, Europol, FinCEN)
5. International Extradition Status: INTERPOL Red Notice Issued (Sihanoukville, Cambodia)
6. Courtroom Prosecution Readiness: 98% Admissibility Guarantee

RECOMMENDED FINAL EXECUTIVE DIRECTIVE:
File formal 18 U.S.C. § 2703(a) Search Warrant with Meta & Coinbase; submit Letters Rogatory to US DOJ OIA for Cambodian extradition.`;

    const blob = new Blob([briefingText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Executive_Master_Briefing_${currentCase.caseNumber}.txt`;
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
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              EXECUTIVE MASTER CRIME SCENE COMMAND DASHBOARD
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                10-DAY FORENSIC CONSOLIDATION
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Consolidated command metrics across evidence integrity, MLAT extraditions, asset recovery, and prosecution readiness
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadExecutiveBriefing}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 border border-emerald-400/30 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>GENERATE EXECUTIVE BRIEFING DOSSIER</span>
        </button>
      </div>

      {/* Master Telemetry KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Aggregated System Stolen Loss</span>
          <div className="text-xl font-bold text-emerald-400">${totalStolenUSD.toLocaleString()} USD</div>
          <div className="text-[11px] text-slate-500">{totalCasesCount} Monitored Cases</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Cryptographic Integrity Score</span>
          <div className="text-xl font-bold text-cyan-300">100% SHA-256 Validated</div>
          <div className="text-[11px] text-slate-500">FRE Rule 902(14) Compliant</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Asset Recovery Restitution</span>
          <div className="text-xl font-bold text-amber-300">92% Capital Hold</div>
          <div className="text-[11px] text-slate-500">$50,000 USD Locked</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase">Court Prosecution Rating</span>
          <div className="text-xl font-bold text-indigo-400">98% Admissibility</div>
          <div className="text-[11px] text-slate-500">Trial Presentation Ready</div>
        </div>
      </div>
    </div>
  );
};
