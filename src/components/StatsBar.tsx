import React from 'react';
import { ShieldCheck, FileSpreadsheet, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { CrimeCase } from '../types';

interface StatsBarProps {
  currentCase: CrimeCase;
}

export const StatsBar: React.FC<StatsBarProps> = ({ currentCase }) => {
  const totalExhibits = currentCase.evidenceItems.length;
  const totalSuspects = currentCase.suspects.length;
  const criticalAlerts = currentCase.aiAlerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="bg-[#0D121F] border-b border-cyan-950/80 px-4 sm:px-6 py-3 font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Financial Loss */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-3">
          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-md text-red-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Stolen Loss</div>
            <div className="text-base font-bold text-red-400">
              ${currentCase.totalLossUSD.toLocaleString()} USD
            </div>
          </div>
        </div>

        {/* Total Evidence Items */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-cyan-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Ingested Exhibits</div>
            <div className="text-base font-bold text-cyan-300">
              {totalExhibits} Exhibits
            </div>
          </div>
        </div>

        {/* Chain of Custody Integrity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Chain of Custody</div>
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1">
              100% SHA-256
            </div>
          </div>
        </div>

        {/* Suspect Entities */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-md text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Suspect Entities</div>
            <div className="text-base font-bold text-indigo-300">
              {totalSuspects} Handles / Mules
            </div>
          </div>
        </div>

        {/* AI Scam Classification */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-lg p-2.5 flex items-center space-x-3 col-span-2 sm:col-span-1">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">AI Crime Category</div>
            <div className="text-xs font-bold text-amber-300 truncate max-w-[150px]">
              {currentCase.scamCategory}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
