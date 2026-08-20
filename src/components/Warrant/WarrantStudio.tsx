import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Gavel,
  Download,
  Building,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Shield,
  Send,
  Lock,
} from 'lucide-react';
import { CrimeCase, LegalWarrantTemplate } from '../../types';

interface WarrantStudioProps {
  currentCase: CrimeCase;
}

const PROVIDER_TEMPLATES: LegalWarrantTemplate[] = [
  {
    id: 'prov-meta',
    providerName: 'Meta Platforms Inc. / WhatsApp LLC',
    statutoryAuthority: '18 U.S.C. § 2703(a) Search Warrant & § 2703(f) Preservation',
    requiredTarget: 'Account Handle & Associated Phone Line',
    scope: 'Subscriber records, IP connection logs, unencrypted message backups, group memberships',
    jurisdictionCourt: 'U.S. District Court for the Northern District of California',
  },
  {
    id: 'prov-google',
    providerName: 'Google LLC / Gmail & Google Drive',
    statutoryAuthority: '18 U.S.C. § 2703(c)/2703(d) Court Order',
    requiredTarget: 'Target Gmail Address & OAuth Tokens',
    scope: 'Account creation IP, recovery emails, Drive document hashes, YouTube upload history',
    jurisdictionCourt: 'U.S. District Court for the Northern District of California',
  },
  {
    id: 'prov-coinbase',
    providerName: 'Coinbase Global Inc. / Law Enforcement Ops',
    statutoryAuthority: '18 U.S.C. § 981/982 Asset Freeze & Disclosure Order',
    requiredTarget: 'Ethereum Deposit Wallet & KYC Identity',
    scope: 'KYC identity documents, linked bank AC routing numbers, transaction ledger, IP login history',
    jurisdictionCourt: 'U.S. District Court for the District of Columbia',
  },
  {
    id: 'prov-binance',
    providerName: 'Binance Holdings Ltd / Global LEO Portal',
    statutoryAuthority: 'Transnational Subpoena & Emergency Freeze Request',
    requiredTarget: 'Deposit Address & Account UID',
    scope: 'UID registration IP, withdrawal destination wallets, P2P merchant trade logs',
    jurisdictionCourt: 'International Law Enforcement Direct Referral',
  },
];

export const WarrantStudio: React.FC<WarrantStudioProps> = ({ currentCase }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<LegalWarrantTemplate>(PROVIDER_TEMPLATES[0]);

  const handleDownloadWarrant = () => {
    const suspectHandle = currentCase.suspects[0]?.handle || '@suspect_handler';
    const suspectPhone = currentCase.suspects[0]?.phone || '+1 (555) 019-9842';

    const warrantContent = `UNITED STATES DISTRICT COURT
============================================================
IN THE MATTER OF THE SEARCH OF:
${selectedTemplate.requiredTarget}: ${suspectHandle} / ${suspectPhone}
CASE REFERENCE: ${currentCase.caseNumber}

FORMAL APPLICATION FOR SEARCH WARRANT UNDER ${selectedTemplate.statutoryAuthority.toUpperCase()}

AFFIDAVIT IN SUPPORT OF APPLICATION:
------------------------------------------------------------
1. AFFIANT: Lead Cybercrime Examiner, AI Digital Crime Scene Investigator Taskforce.
2. TARGET PROVIDER: ${selectedTemplate.providerName}
3. JURISDICTION: ${selectedTemplate.jurisdictionCourt}

4. PROBABLE CAUSE SUMMARY:
The target account ${suspectHandle} has been positively linked to multi-jurisdictional wire fraud operating under the scam classification of "${currentCase.scamCategory}".
Total verified victim losses stand at $${currentCase.totalLossUSD.toLocaleString()} USD (Victim: ${currentCase.victimName}).

5. SPECIFICALLY DEMANDED EVIDENCE SCOPE:
${selectedTemplate.scope}

6. EXPORTED FORENSIC EXHIBITS ATTACHED:
${currentCase.evidenceItems.map(item => `- Exhibit [${item.exhibitNumber}]: ${item.title} (SHA-256: ${item.sha256Hash.slice(0, 16)}...)`).join('\n')}

Issued and Certified under Seal of Law Enforcement Operations.`;

    const blob = new Blob([warrantContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Legal_Warrant_${selectedTemplate.providerName.replace(/[^a-zA-Z0-9]/g, '_')}_${currentCase.caseNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-cyan-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Gavel className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI AUTOMATED SUBPOENA & LEGAL SEARCH WARRANT GENERATOR STUDIO
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                18 U.S.C. § 2703 COURT COMPLIANT
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generates pre-formatted court warrants and 2703(d) orders for Meta, Google, Coinbase, Telegram, and Binance
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadWarrant}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-cyan-600/30 border border-cyan-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT COURT-READY SEARCH WARRANT</span>
        </button>
      </div>

      {/* Provider Selector Cards & Warrant Document Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Tech Providers List */}
        <div className="bg-[#090D16] border border-cyan-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>SERVICE PROVIDERS (4)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {PROVIDER_TEMPLATES.map(prov => (
              <div
                key={prov.id}
                onClick={() => setSelectedTemplate(prov)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedTemplate.id === prov.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-950'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{prov.providerName}</span>
                  <CheckCircle2 className={`w-4 h-4 ${selectedTemplate.id === prov.id ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
                <div className="text-[11px] text-slate-400">{prov.statutoryAuthority}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Provider Legal Warrant Inspector */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-cyan-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedTemplate.providerName}</h3>
                <span className="text-xs text-cyan-400 font-bold uppercase">{selectedTemplate.statutoryAuthority}</span>
              </div>
            </div>

            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3 py-1 rounded font-bold">
              COURT AFFIDAVIT READY
            </span>
          </div>

          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
            <div><strong className="text-slate-400">Target Identification:</strong> {selectedTemplate.requiredTarget} ({currentCase.suspects[0]?.handle || '@suspect_handler'})</div>
            <div><strong className="text-slate-400">Jurisdiction Court:</strong> {selectedTemplate.jurisdictionCourt}</div>
            <div><strong className="text-slate-400">Demanded Scope:</strong> {selectedTemplate.scope}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
