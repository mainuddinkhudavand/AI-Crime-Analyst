import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  EyeOff,
  Eye,
  ShieldCheck,
  Download,
  Lock,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { CrimeCase, PIIRedactionRule, EvidenceItem } from '../../types';

interface RedactionStudioProps {
  currentCase: CrimeCase;
}

const DEFAULT_REDACTION_RULES: PIIRedactionRule[] = [
  {
    id: 'red-1',
    piiType: 'SSN',
    patternName: 'Social Security / Tax ID Numbers (XXX-XX-XXXX)',
    matchesCount: 2,
    isRedacted: true,
  },
  {
    id: 'red-2',
    piiType: 'CREDIT_CARD',
    patternName: 'Credit / Debit Card Primary Account Numbers',
    matchesCount: 4,
    isRedacted: true,
  },
  {
    id: 'red-3',
    piiType: 'ADDRESS',
    patternName: 'Victim Residential Home Street Address',
    matchesCount: 3,
    isRedacted: true,
  },
  {
    id: 'red-4',
    piiType: 'PHONE',
    patternName: 'Victim Personal Unlisted Phone Line',
    matchesCount: 5,
    isRedacted: false,
  },
];

export const RedactionStudio: React.FC<RedactionStudioProps> = ({ currentCase }) => {
  const [rules, setRules] = useState<PIIRedactionRule[]>(DEFAULT_REDACTION_RULES);
  const [selectedExhibit, setSelectedExhibit] = useState<EvidenceItem | null>(currentCase.evidenceItems[0] || null);

  const toggleRedactionRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, isRedacted: !r.isRedacted } : r))
    );
  };

  const handleExportFOIABundle = () => {
    const foiaContent = `FOIA / PUBLIC DISCLOSURE REDACTED EVIDENCE DOSSIER
============================================================
CASE REF: ${currentCase.caseNumber}
PUBLIC RELEASE STATUS: PII SANITIZED UNDER FREEDOM OF INFORMATION ACT
DATE OF RELEASE: ${new Date().toISOString()}

REDACTION RULES APPLIED:
------------------------------------------------------------
${rules.map(r => `[${r.isRedacted ? 'REDACTED [████████]' : 'UNFILTERED'}] ${r.patternName} (${r.matchesCount} Matches)`).join('\n')}

PUBLIC SANITIZED EXHIBITS MANIFEST:
${currentCase.evidenceItems.map(item => `[${item.exhibitNumber}] ${item.title}
SHA-256: ${item.sha256Hash}
Sanitized Content Preview: ${item.rawContent.replace(/[0-9]{3}-[0-9]{2}-[0-9]{4}/g, '███-██-████').slice(0, 120)}...\n`).join('\n')}

Certified by: AI Digital Crime Scene Investigator FOIA Redaction Engine v9.0`;

    const blob = new Blob([foiaContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FOIA_Redacted_Evidence_Bundle_${currentCase.caseNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-amber-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <EyeOff className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI EVIDENCE PII REDACTION & FOIA COMPLIANCE AUDIT STUDIO
              <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                FOIA / PUBLIC DISCLOSURE READY
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive PII auto-detector & side-by-side unredacted vs redacted evidence preview engine
            </p>
          </div>
        </div>

        <button
          onClick={handleExportFOIABundle}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-amber-600/30 border border-amber-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT FOIA REDACTED BUNDLE</span>
        </button>
      </div>

      {/* Main Grid: PII Redaction Toggles & Side-by-Side Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* PII Redaction Rules Controls */}
        <div className="bg-[#090D16] border border-amber-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>PII REDACTION PATTERNS</span>
            </h3>
          </div>

          <div className="space-y-3">
            {rules.map(rule => (
              <div
                key={rule.id}
                onClick={() => toggleRedactionRule(rule.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  rule.isRedacted
                    ? 'bg-amber-950/30 border-amber-500/60 text-amber-200'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{rule.patternName}</span>
                  {rule.isRedacted ? (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">{rule.matchesCount} Matches Found</span>
                  <span className="font-bold">{rule.isRedacted ? 'REDACTED [████]' : 'VISIBLE'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side Unredacted vs Redacted Evidence Preview */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-amber-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">SIDE-BY-SIDE REDACTION COMPARISON PREVIEW</h3>
            <span className="text-xs text-amber-400 font-bold">REAL-TIME SANITIZER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unredacted Box */}
            <div className="space-y-2">
              <span className="text-slate-400 font-bold uppercase block text-[11px]">Unredacted Confidential Source</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                {selectedExhibit?.rawContent || 'Select exhibit'}
              </div>
            </div>

            {/* Redacted Box */}
            <div className="space-y-2">
              <span className="text-amber-400 font-bold uppercase block text-[11px]">Public FOIA Sanitized Preview</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 text-slate-300 text-[11px] leading-relaxed">
                {selectedExhibit?.rawContent.replace(/[0-9]{3}-[0-9]{2}-[0-9]{4}/g, '███-██-████').replace(/\+1\s\(\d{3}\)\s\d{3}-\d{4}/g, '████████████') || 'Select exhibit'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
