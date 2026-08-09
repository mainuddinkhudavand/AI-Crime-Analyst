import React from 'react';
import { ShieldAlert, AlertTriangle, Sparkles, Cpu, CheckCircle2, Zap, ArrowRight, FileText, Lock, Eye, Compass, Shield } from 'lucide-react';
import { CrimeCase } from '../../types';

interface AIPatternStudioProps {
  currentCase: CrimeCase;
}

export const AIPatternStudio: React.FC<AIPatternStudioProps> = ({ currentCase }) => {
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
              AI detects psychological manipulation, urgency triggers, spoofed infrastructure, and money laundering patterns
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-slate-300">Scam Vector: <strong className="text-amber-300">{currentCase.scamCategory}</strong></span>
        </div>
      </div>

      {/* Grid of AI Pattern Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentCase.aiAlerts.map((alert, idx) => (
          <div
            key={alert.id}
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
          </div>
        ))}
      </div>

      {/* Suspect Profiling & Actionable Leads Card */}
      <div className="bg-[#0D121F] border border-cyan-900/60 rounded-xl p-6 shadow-2xl space-y-5 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">SUSPECT PROFILING & ACTIONABLE POLICE LEADS</h3>
          </div>
          <span className="text-xs text-cyan-400">Identified Suspect Entities: {currentCase.suspects.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCase.suspects.map((suspect, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 text-xs text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-red-400">{suspect.nameAlias}</span>
                <span className="bg-red-950 text-red-300 text-[10px] px-2 py-0.5 rounded border border-red-800 font-bold">
                  SUSPECT #{idx + 1}
                </span>
              </div>
              <div><strong className="text-slate-400">Handle / Alias:</strong> <span className="text-cyan-300">{suspect.handle}</span></div>
              <div><strong className="text-slate-400">Phone Number:</strong> <span className="text-slate-200">{suspect.phone}</span></div>
              <div><strong className="text-slate-400">Identified Role:</strong> <span className="text-amber-300">{suspect.role}</span></div>
            </div>
          ))}
        </div>

        {/* Recommended Actions Bullet Points */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Recommended Law Enforcement Directives</label>
          <div className="space-y-2">
            {currentCase.recommendedActions.map((action, i) => (
              <div key={i} className="flex items-start space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-200">
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
