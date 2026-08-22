import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  FileText,
  Download,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Send,
  Flag,
} from 'lucide-react';
import { CrimeCase, MLATRequestTemplate } from '../../types';

interface MLATStudioProps {
  currentCase: CrimeCase;
}

const MLAT_TEMPLATES: MLATRequestTemplate[] = [
  {
    id: 'mlat-cambodia',
    targetCountry: 'Kingdom of Cambodia (Sihanoukville Special Zone)',
    treatyName: 'U.S.-Cambodia Mutual Legal Assistance Treaty & Letters Rogatory',
    diplomaticChannel: 'U.S. Department of Justice Office of International Affairs (OIA)',
    extraditionStatus: 'INTERPOL RED NOTICE SUBMITTED',
  },
  {
    id: 'mlat-uae',
    targetCountry: 'United Arab Emirates (Dubai Financial Centre)',
    treatyName: 'U.S.-UAE Bilateral Legal Assistance & Asset Seizure Treaty',
    diplomaticChannel: 'Ministry of Justice UAE / FBI Liaison Officer',
    extraditionStatus: 'EXTRADITION DIRECTIVE PENDING REVIEW',
  },
  {
    id: 'mlat-germany',
    targetCountry: 'Federal Republic of Germany (Frankfurt am Main)',
    treatyName: 'U.S.-Germany Treaty on Mutual Legal Assistance in Criminal Matters',
    diplomaticChannel: 'Bundeskriminalamt (BKA) / Eurojust Desk',
    extraditionStatus: 'SERVER HARD DRIVE SEIZURE EXECUTED',
  },
];

export const MLATStudio: React.FC<MLATStudioProps> = ({ currentCase }) => {
  const [selectedMlat, setSelectedMlat] = useState<MLATRequestTemplate>(MLAT_TEMPLATES[0]);

  const handleDownloadMLAT = () => {
    const suspectHandle = currentCase.suspects[0]?.handle || '@suspect_handler';
    const suspectPhone = currentCase.suspects[0]?.phone || '+1 (555) 019-9842';

    const mlatContent = `DIPLOMATIC REQUEST FOR MUTUAL LEGAL ASSISTANCE & EXTRADITION
============================================================
CASE REF: ${currentCase.caseNumber}
REPUBLIC / JURISDICTION: ${selectedMlat.targetCountry}
TREATY AUTHORITY: ${selectedMlat.treatyName}
DIPLOMATIC CHANNEL: ${selectedMlat.diplomaticChannel}
DATE OF DIPLOMATIC DEMAND: ${new Date().toISOString()}

FORMAL DIPLOMATIC DEMAND IN CRIMINAL MATTERS:
------------------------------------------------------------
The Government of the United States of America presents its compliments to the Central Authority of ${selectedMlat.targetCountry} and has the honor to request mutual assistance in criminal proceedings involving transnational cyber fraud, wire theft, and illicit money laundering.

TARGET TRANSNATIONAL OPERATOR:
Name / Handle: ${suspectHandle}
Known Telephony Line: ${suspectPhone}
Associated Fraud Vector: ${currentCase.scamCategory}
Verified Victim Stolen Capital: $${currentCase.totalLossUSD.toLocaleString()} USD

SPECIFIC REQUESTED JUDICIAL ACTIONS:
1. Immediate provisional arrest for extradition under INTERPOL Red Notice protocol.
2. Search and seizure of all C2 server hardware, Tor exit node proxy logs, and physical digital media located at suspect premises.
3. Restitution and asset freeze of connected fiat bank accounts and cryptocurrency exchange accounts.

Certified under Seal of the Department of Justice & International Affairs.`;

    const blob = new Blob([mlatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MLAT_Extradition_Directive_${selectedMlat.targetCountry.slice(0, 10).replace(/[^a-zA-Z]/g, '')}_${currentCase.caseNumber}.txt`;
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
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI AUTOMATED MLAT & INTERNATIONAL EXTRADITION DIRECTIVE STUDIO
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                INTERPOL RED NOTICE READY
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generates Mutual Legal Assistance Treaty (MLAT) requests and Letters Rogatory for foreign law enforcement
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadMLAT}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT FORMAL MLAT DIRECTIVE</span>
        </button>
      </div>

      {/* MLAT Templates List & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* MLAT Foreign Jurisdiction Cards */}
        <div className="bg-[#090D16] border border-blue-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flag className="w-4 h-4 text-blue-400" />
              <span>FOREIGN JURISDICTIONS (3)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {MLAT_TEMPLATES.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedMlat(template)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedMlat.id === template.id
                    ? 'bg-blue-950/40 border-blue-500 text-blue-200 shadow-lg shadow-blue-950'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{template.targetCountry}</span>
                  <CheckCircle2 className={`w-4 h-4 ${selectedMlat.id === template.id ? 'text-blue-400' : 'text-slate-600'}`} />
                </div>
                <div className="text-[11px] text-slate-400">{template.extraditionStatus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected MLAT Directive Document Preview */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-blue-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedMlat.targetCountry}</h3>
                <span className="text-xs text-blue-400 font-bold uppercase">{selectedMlat.treatyName}</span>
              </div>
            </div>

            <span className="bg-red-950 text-red-300 border border-red-800 text-xs px-3 py-1 rounded font-bold">
              {selectedMlat.extraditionStatus}
            </span>
          </div>

          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
            <div><strong className="text-slate-400">Diplomatic Channel:</strong> {selectedMlat.diplomaticChannel}</div>
            <div><strong className="text-slate-400">Suspect Targeted:</strong> {currentCase.suspects[0]?.handle || '@suspect_handler'} ({currentCase.suspects[0]?.phone || '+1 555 019 9842'})</div>
            <div><strong className="text-slate-400">Extradition Ground:</strong> Transnational Wire Fraud ($15,000 USD Victim Loss)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
