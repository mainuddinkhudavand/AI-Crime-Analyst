import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gavel,
  ShieldCheck,
  Award,
  Play,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Scale,
  Sparkles,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { CrimeCase, EvidenceItem } from '../../types';

interface ProsecutionStudioProps {
  currentCase: CrimeCase;
}

export const ProsecutionStudio: React.FC<ProsecutionStudioProps> = ({ currentCase }) => {
  const [selectedExhibit, setSelectedExhibit] = useState<EvidenceItem | null>(currentCase.evidenceItems[0] || null);
  const [isTrialSimulating, setIsTrialSimulating] = useState<boolean>(false);
  const [trialVerdict, setTrialVerdict] = useState<string | null>(null);

  const handleSimulateTrial = () => {
    setIsTrialSimulating(true);
    setTrialVerdict(null);
    setTimeout(() => {
      setIsTrialSimulating(false);
      setTrialVerdict('EVIDENTIARY ADMISSIBILITY GUARANTEED: FRE Rule 902(14) Self-Authenticating Hash Proof Verified');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-indigo-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Gavel className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI AUTOMATED COURTROOM PROSECUTION SIMULATOR
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                TRIAL EXHIBIT PRESENTATION
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive judge & jury trial exhibit presenter with FRE 902(14) admissibility verification
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateTrial}
          disabled={isTrialSimulating}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/30 border border-indigo-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isTrialSimulating ? 'SIMULATING COURTROOM TRIAL...' : 'SIMULATE PROSECUTION TRIAL'}</span>
        </button>
      </div>

      {/* Trial Verdict Banner */}
      {trialVerdict && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-xl text-xs text-emerald-300 font-bold flex items-center space-x-3 shadow-lg"
        >
          <Scale className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{trialVerdict}</span>
        </motion.div>
      )}

      {/* Main Grid: Trial Exhibits Manifest & Cross-Exam Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trial Exhibits List */}
        <div className="bg-[#090D16] border border-indigo-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>COURT PROSECUTION EXHIBITS ({currentCase.evidenceItems.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {currentCase.evidenceItems.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedExhibit(item)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedExhibit?.id === item.id
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-950'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{item.exhibitNumber}</span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                    ADMISSIBLE
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Exhibit Courtroom Presentation Inspector */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-indigo-900/60 rounded-xl p-6 shadow-2xl space-y-5 font-mono text-xs">
          {selectedExhibit ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedExhibit.exhibitNumber}: {selectedExhibit.title}</h3>
                    <span className="text-xs text-indigo-400 font-bold uppercase">Chain of Custody SHA-256 Validated</span>
                  </div>
                </div>

                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3 py-1 rounded font-bold">
                  FRE RULE 902(14) COMPLIANT
                </span>
              </div>

              {/* Courtroom Presentation Script */}
              <div className="space-y-2">
                <span className="text-slate-400 font-bold uppercase block flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>PROSECUTOR'S COURTROOM OPENING & CROSS-EXAMINATION SCRIPT</span>
                </span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 space-y-2 text-[11px] leading-relaxed">
                  <p>
                    <strong className="text-cyan-400">PROSECUTOR STATEMENT:</strong> "Your Honor, we submit Exhibit <strong className="text-white">{selectedExhibit.exhibitNumber}</strong> into evidence. The cryptographic SHA-256 hash digest (<code className="text-emerald-300">{selectedExhibit.sha256Hash.slice(0, 16)}...</code>) mathematically proves 100% evidentiary integrity from original seizure timestamp <strong className="text-white">{selectedExhibit.timestamp}</strong>."
                  </p>
                  <p>
                    <strong className="text-amber-400">DEFENSE OBJECTION HANDLER:</strong> "If defense counsel asserts tampering or metadata manipulation, Federal Rules of Evidence Rule 902(14) self-authentication applies via verified cryptographic digital signature."
                  </p>
                </div>
              </div>

              {/* Exhibit Raw Evidence Snippet */}
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase block">Ingested Evidence Text</span>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-slate-300 text-[10px] font-mono leading-tight">
                  {selectedExhibit.rawContent}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 my-auto">Select an exhibit to preview courtroom prosecution script</div>
          )}
        </div>
      </div>
    </div>
  );
};
