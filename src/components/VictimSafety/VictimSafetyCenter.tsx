import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Lock,
  Smartphone,
  Key,
  FileText,
  UserCheck,
  Square,
  CheckSquare,
} from 'lucide-react';
import { CrimeCase, VictimSafetyCheckItem } from '../../types';

interface VictimSafetyCenterProps {
  currentCase: CrimeCase;
}

const DEFAULT_SAFETY_ITEMS: VictimSafetyCheckItem[] = [
  {
    id: 'safe-1',
    category: 'CREDIT_FREEZE',
    title: '1. Place Credit Freeze with Major Bureaus (Experian, TransUnion, Equifax)',
    description: 'Prevents suspect from opening fraudulent credit accounts using victim identity.',
    isCompleted: true,
    priority: 'URGENT',
  },
  {
    id: 'safe-2',
    category: 'TOKEN_REVOCATION',
    title: '2. Revoke OAuth Tokens & Terminate Active Google / WhatsApp Sessions',
    description: 'Disconnect all remote sessions logged into suspect devices.',
    isCompleted: false,
    priority: 'URGENT',
  },
  {
    id: 'safe-3',
    category: 'SIM_PROTECTION',
    title: '3. Enable SIM Swap Lock & Port Out PIN with Mobile Carrier',
    description: 'Blocks unauthorized phone line transfers used to intercept 2FA codes.',
    isCompleted: true,
    priority: 'HIGH',
  },
  {
    id: 'safe-4',
    category: 'IC3_FILING',
    title: '4. File Formal Complaint with FBI Internet Crime Complaint Center (IC3.gov)',
    description: 'Official federal law enforcement reporting for international wire fraud.',
    isCompleted: false,
    priority: 'RECOMMENDED',
  },
];

export const VictimSafetyCenter: React.FC<VictimSafetyCenterProps> = ({ currentCase }) => {
  const [items, setItems] = useState<VictimSafetyCheckItem[]>(DEFAULT_SAFETY_ITEMS);

  const toggleItem = (itemId: string) => {
    setItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i))
    );
  };

  const handleDownloadDossier = () => {
    const text = `VICTIM PROTECTION & REMEDIATION ACTION DOSSIER
============================================================
CASE REF: ${currentCase.caseNumber}
VICTIM NAME: ${currentCase.victimName} (${currentCase.victimLocation})
CONTACT EMAIL: ${currentCase.victimContact}
DATE ISSUED: ${new Date().toISOString()}

REMEDIATION SAFETY CHECKLIST STATUS:
------------------------------------------------------------
${items.map(i => `[${i.isCompleted ? 'COMPLETED' : 'PENDING'}] (${i.priority}) ${i.title}
Detail: ${i.description}\n`).join('\n')}

Issued by: AI Digital Crime Scene Investigator Victim Safety Directive Engine v8.0`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Victim_Safety_Dossier_${currentCase.caseNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-blue-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              CYBER THREAT VICTIM SAFETY & REMEDIATION DIRECTIVE CENTER
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                PROTECTION DIRECTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Tailored step-by-step security action plan for victim credit freezing, session revocation, and SIM swap lock
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadDossier}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD VICTIM SAFETY DOSSIER</span>
        </button>
      </div>

      {/* Safety Action Items List */}
      <div className="bg-[#090D16] border border-blue-900/40 rounded-xl p-6 shadow-2xl space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>REMEDIATION ACTION CHECKLIST</span>
          </h3>
          <span className="text-xs text-blue-400 font-bold">
            {items.filter(i => i.isCompleted).length}/{items.length} Completed
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                item.isCompleted
                  ? 'bg-blue-950/20 border-blue-500/60 text-blue-200'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {item.isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-blue-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <span className="font-bold text-white text-xs">{item.title}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  item.priority === 'URGENT'
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : item.priority === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-blue-950 text-blue-300 border-blue-800'
                }`}>
                  {item.priority}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-8">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
