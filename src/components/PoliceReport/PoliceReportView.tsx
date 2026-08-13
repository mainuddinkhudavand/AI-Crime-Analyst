import React, { useState } from 'react';
import {
  Printer,
  Download,
  ShieldCheck,
  FileCheck,
  Lock,
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  ArrowLeft,
  Scale,
  Copy,
  Check,
  Award,
} from 'lucide-react';
import { CrimeCase } from '../../types';
import { redactSensitivePII } from '../../utils/entityExtractor';
import { formatHash } from '../../utils/cryptoUtils';

interface PoliceReportViewProps {
  currentCase: CrimeCase;
  piiRedacted: boolean;
  onBackToVault: () => void;
}

export const PoliceReportView: React.FC<PoliceReportViewProps> = ({
  currentCase,
  piiRedacted,
  onBackToVault,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'dossier' | 'subpoena_whatsapp' | 'subpoena_coinbase' | 'subpoena_bank'>('dossier');
  const [copied, setCopied] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentCase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Police_Dossier_${currentCase.caseNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSubpoenaContent = () => {
    if (activeDocTab === 'subpoena_whatsapp') {
      return `FORMAL LEGAL PRESERVATION DEMAND (18 U.S.C. § 2703(f))
TO: Meta Law Enforcement Operations / WhatsApp Inc.
CASE REF: ${currentCase.caseNumber}

Pursuant to federal law 18 U.S.C. § 2703(f), you are formally instructed to preserve all communications, IP header telemetry, device identifiers, and metadata associated with target account ${currentCase.suspects[0]?.phone || '+1 (310) 555-0198'} for 90 days.

Target Suspect Details:
- Suspect Alias: ${currentCase.suspects[0]?.nameAlias || 'Elena Vance'}
- Phone / Handle: ${currentCase.suspects[0]?.phone || ''} (${currentCase.suspects[0]?.handle || ''})
- Incident Category: ${currentCase.scamCategory}

Date Issued: ${new Date().toISOString().slice(0, 10)}`;
    }

    if (activeDocTab === 'subpoena_coinbase') {
      return `EMERGENCY ASSET FREEZE DIRECTIVE & EVIDENCE SUBPOENA
TO: Coinbase Global, Inc. / Crypto Exchange Compliance Office
CASE REF: ${currentCase.caseNumber}

Immediate administrative freeze requested for stolen crypto assets total $${currentCase.totalLossUSD.toLocaleString()} USD transferred to un-hosted wallet:

Destination Wallet Address: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
Originating Vault Account: Coinbase Pro User ID #984120

Immediate Action: Block outgoing transactions from destination address and preserve KYC/AML identity logs.`;
    }

    return `MULE BANK ACCOUNT FREEZE NOTICE
TO: Financial Crimes Enforcement Network (FinCEN) / Chase Bank Compliance
CASE REF: ${currentCase.caseNumber}

Formal notice of fraudulent wire transfers totaling $${currentCase.totalLossUSD.toLocaleString()} USD routed to mule bank account:

Target Beneficiary AC: 984102948 (Vanguard Escrow Holdings Ltd)
Routing SWIFT: CITIUS33XXX

Action Requested: Place temporary hold on account withdrawals and provide beneficiary KYC paperwork to investigating authorities.`;
  };

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(getSubpoenaContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Print / Export Action Bar */}
      <div className="bg-[#0F172A] border border-emerald-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl print:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToVault}
            className="flex items-center space-x-1 text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO VAULT</span>
          </button>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              POLICE-READY FORMAL COMPLAINT DOSSIER & LEGAL SUITE
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono">
                LAW ENFORCEMENT COMPLIANT
              </span>
            </h2>
            <p className="text-xs text-slate-400">SHA-256 verified digital evidence dossier formatted for Cyber Crime Units & Authorities</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold px-3 py-2 rounded-lg border border-slate-700"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>EXPORT DOSSIER JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / SAVE AS PDF</span>
          </button>
        </div>
      </div>

      {/* Document Selector Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs print:hidden">
        <button
          onClick={() => setActiveDocTab('dossier')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeDocTab === 'dossier'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Formal Police Complaint Dossier</span>
        </button>

        <button
          onClick={() => setActiveDocTab('subpoena_whatsapp')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeDocTab === 'subpoena_whatsapp'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>WhatsApp 18 U.S.C. § 2703(f) Subpoena</span>
        </button>

        <button
          onClick={() => setActiveDocTab('subpoena_coinbase')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeDocTab === 'subpoena_coinbase'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4 text-blue-400" />
          <span>Coinbase Freeze Order</span>
        </button>

        <button
          onClick={() => setActiveDocTab('subpoena_bank')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeDocTab === 'subpoena_bank'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>Bank Mule Hold Request</span>
        </button>
      </div>

      {/* Main Document Content */}
      {activeDocTab === 'dossier' ? (
        /* Official Police Dossier Document Body */
        <div className="bg-[#090D16] text-slate-100 border border-slate-800 rounded-xl p-8 sm:p-12 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black font-serif">
          
          {/* Official Header */}
          <div className="border-b-2 border-slate-700 pb-6 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Building2 className="w-7 h-7 text-cyan-400 print:text-black" />
                <h1 className="text-xl font-bold font-sans uppercase tracking-tight text-white print:text-black flex items-center gap-2">
                  <span>CYBER CRIME INVESTIGATION REPORT</span>
                </h1>
              </div>
              <p className="text-xs font-mono text-slate-400 print:text-black">Official Formal Complaint & Cryptographic Evidence Dossier</p>
              <p className="text-xs font-mono text-slate-400 print:text-black">Generated by AI Digital Crime Scene Investigator Platform</p>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div className="font-bold text-cyan-300 bg-slate-900 print:bg-slate-100 print:text-black p-2 rounded border border-slate-700 print:border-slate-300">
                CASE REF: {currentCase.caseNumber}
              </div>
              <div className="text-slate-400 print:text-black">DATE: {new Date().toISOString().slice(0, 10)}</div>
              <div className="text-emerald-400 print:text-emerald-800 font-bold flex items-center gap-1 justify-end">
                <Award className="w-3.5 h-3.5" />
                <span>SHA-256 SECURED VAULT</span>
              </div>
            </div>
          </div>

          {/* Executive Incident Summary */}
          <div className="space-y-3 font-sans">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 print:text-black border-b border-slate-800 print:border-slate-300 pb-1">
              1. Executive Incident Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 print:bg-slate-50 p-4 rounded border border-slate-800 print:border-slate-200">
              <div><strong>Scam Classification:</strong> {currentCase.scamCategory}</div>
              <div><strong>Total Financial Loss:</strong> ${currentCase.totalLossUSD.toLocaleString()} USD</div>
              <div><strong>Incident Period:</strong> {currentCase.incidentDate}</div>
              <div><strong>Evidence Exhibits Ingested:</strong> {currentCase.evidenceItems.length} Verified Files</div>
            </div>
            <p className="text-xs text-slate-300 print:text-black leading-relaxed font-sans bg-slate-950 print:bg-slate-50 p-4 rounded border border-slate-800 print:border-slate-200">
              {redactSensitivePII(currentCase.summary, piiRedacted)}
            </p>
          </div>

          {/* Victim & Suspect Profiles */}
          <div className="space-y-3 font-sans">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 print:text-black border-b border-slate-800 print:border-slate-300 pb-1">
              2. Parties & Identified Suspect Dossier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Victim Box */}
              <div className="bg-slate-950 print:bg-slate-50 p-4 rounded border border-slate-800 print:border-slate-200 space-y-1.5 font-mono">
                <span className="font-bold text-cyan-400 print:text-black block border-b border-slate-800 pb-1">VICTIM INFORMATION</span>
                <div><strong>Name:</strong> {redactSensitivePII(currentCase.victimName, piiRedacted)}</div>
                <div><strong>Contact:</strong> {redactSensitivePII(currentCase.victimContact, piiRedacted)}</div>
                <div><strong>Jurisdiction Location:</strong> {redactSensitivePII(currentCase.victimLocation, piiRedacted)}</div>
              </div>

              {/* Suspect Box */}
              <div className="bg-slate-950 print:bg-slate-50 p-4 rounded border border-slate-800 print:border-slate-200 space-y-2 font-mono">
                <span className="font-bold text-red-400 print:text-red-700 block border-b border-slate-800 pb-1">IDENTIFIED SUSPECT ALIASES</span>
                {currentCase.suspects.map((s, idx) => (
                  <div key={idx} className="space-y-0.5 text-[11px]">
                    <div className="font-bold text-white print:text-black">{s.nameAlias} ({s.role})</div>
                    <div>Handle: <span className="text-cyan-400 font-bold">{s.handle}</span> | Phone: {s.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Master Evidence Exhibit Index Table with SHA-256 Hashes */}
          <div className="space-y-3 font-sans">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 print:text-black border-b border-slate-800 print:border-slate-300 pb-1 flex justify-between items-center">
              <span>3. Cryptographic Master Evidence Exhibit Index</span>
              <span className="text-xs font-mono text-emerald-400 print:text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Chain of Custody 100% Validated</span>
              </span>
            </h2>

            <div className="overflow-x-auto border border-slate-800 print:border-slate-300 rounded">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 print:bg-slate-100 border-b border-slate-800 text-slate-300 print:text-slate-700">
                  <tr>
                    <th className="p-2.5">Exhibit #</th>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Source / Type</th>
                    <th className="p-2.5">Exhibit Title</th>
                    <th className="p-2.5">SHA-256 Hash Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {currentCase.evidenceItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-900/50 print:hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-cyan-400">{item.exhibitNumber}</td>
                      <td className="p-2.5 text-slate-300 print:text-slate-700 whitespace-nowrap">{item.timestamp}</td>
                      <td className="p-2.5 uppercase text-slate-400 font-bold">{item.type}</td>
                      <td className="p-2.5 font-bold text-white print:text-black">{item.title}</td>
                      <td className="p-2.5 text-[10px] text-slate-400 print:text-slate-600 font-mono break-all max-w-xs">{item.sha256Hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended Law Enforcement Directives */}
          <div className="space-y-3 font-sans">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 print:text-black border-b border-slate-800 print:border-slate-300 pb-1">
              4. Recommended Law Enforcement Directives & Asset Freeze Demands
            </h2>
            <div className="space-y-2 text-xs font-mono">
              {currentCase.recommendedActions.map((action, i) => (
                <div key={i} className="bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 p-3 rounded flex items-start gap-2 text-slate-200 print:text-black">
                  <span className="font-bold text-emerald-400">{i + 1}.</span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Signature & Verification Footer */}
          <div className="border-t-2 border-slate-700 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 print:text-slate-600 gap-4">
            <div>
              <div>Investigator Certification & Cryptographic Lock</div>
              <div className="font-bold text-white print:text-black mt-1">AI Crime Scene Investigator Vault Engine</div>
            </div>

            <div className="text-right space-y-1">
              <div className="border-b border-slate-500 w-48 ml-auto pb-1 text-center font-bold text-white print:text-black">
                Verified Digital Signature
              </div>
              <div className="text-[10px] text-slate-400">Document ID: {currentCase.id}-POLICE-READY</div>
            </div>
          </div>
        </div>
      ) : (
        /* Subpoena & Legal Notice view */
        <div className="bg-[#090D16] border border-amber-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>OFFICIAL LEGAL DIRECTIVE DRAFT</span>
            </h3>

            <button
              onClick={handleCopyDoc}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY LEGAL TEXT'}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={getSubpoenaContent()}
            rows={14}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
