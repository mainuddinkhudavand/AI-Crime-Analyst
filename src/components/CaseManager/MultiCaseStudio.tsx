import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Search,
  Plus,
  FolderOpen,
  DollarSign,
  ShieldAlert,
  Calendar,
  UserCheck,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import { CrimeCase } from '../../types';

interface MultiCaseStudioProps {
  cases: CrimeCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onOpenCreateCaseModal: () => void;
}

export const MultiCaseStudio: React.FC<MultiCaseStudioProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onOpenCreateCaseModal,
}) => {
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const totalLossAllCases = cases.reduce((acc, c) => acc + c.totalLossUSD, 0);
  const totalExhibitsAllCases = cases.reduce((acc, c) => acc + c.evidenceItems.length, 0);

  const filteredCases = cases.filter(c => {
    const text = `${c.title} ${c.caseNumber} ${c.victimName} ${c.scamCategory} ${c.summary}`.toLowerCase();
    return text.includes(globalSearch.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-purple-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              MULTI-CASE MANAGEMENT HUB & ANALYTICS MATRIX
              <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] px-2 py-0.5 rounded font-mono">
                {cases.length} ACTIVE CASES
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Comparative loss analytics, cross-case search engine, and active case management
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCreateCaseModal}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-purple-600/30 border border-purple-400/40 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW CASE</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400 uppercase">Total Reported Loss Across Cases</div>
          <div className="text-xl font-bold text-emerald-400">${totalLossAllCases.toLocaleString()} USD</div>
          <div className="text-[11px] text-slate-500">Aggregated Victim Stolen Capital</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400 uppercase">Total Ingested Evidence Exhibits</div>
          <div className="text-xl font-bold text-cyan-300">{totalExhibitsAllCases} SHA-256 Exhibits</div>
          <div className="text-[11px] text-slate-500">Chats, Emails, Transactions & Recordings</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400 uppercase">Organized Crime Categories</div>
          <div className="text-xl font-bold text-amber-300">4 Active Fraud Vectors</div>
          <div className="text-[11px] text-slate-500">Pig Butchering, Impersonation & Task Fraud</div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Global search across all cases, handles, victim names, and crypto wallets..."
          value={globalSearch}
          onChange={e => setGlobalSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-purple-500/60"
        />
      </div>

      {/* Case Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map(c => {
          const isSelected = selectedCaseId === c.id;

          return (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectCase(c.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all space-y-4 ${
                isSelected
                  ? 'bg-purple-950/30 border-purple-500/80 shadow-xl shadow-purple-950/40 ring-1 ring-purple-400'
                  : 'bg-[#090D16] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                    {c.caseNumber}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono leading-tight">{c.title}</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  {c.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1">
                <div><strong className="text-slate-400">Victim:</strong> {c.victimName} ({c.victimLocation})</div>
                <div><strong className="text-slate-400">Total Loss:</strong> <span className="text-emerald-400 font-bold">${c.totalLossUSD.toLocaleString()} USD</span></div>
                <div><strong className="text-slate-400">Category:</strong> <span className="text-amber-300">{c.scamCategory}</span></div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>{c.evidenceItems.length} Verified Exhibits</span>
                {isSelected ? (
                  <span className="text-purple-400 font-bold flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>ACTIVE CASE</span>
                  </span>
                ) : (
                  <span className="text-slate-500 hover:text-white">Click to Switch</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
