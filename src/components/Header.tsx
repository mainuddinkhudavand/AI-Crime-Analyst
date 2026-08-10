import React, { useRef } from 'react';
import {
  ShieldAlert,
  FileCheck,
  Upload,
  Eye,
  EyeOff,
  Search,
  Lock,
  Terminal,
  Download,
  FolderOpen,
  Sparkles,
  ShieldCheck,
  HardDriveDownload,
  HardDriveUpload,
} from 'lucide-react';
import { CrimeCase } from '../types';

interface HeaderProps {
  cases: CrimeCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  piiRedacted: boolean;
  onTogglePii: () => void;
  activeTab: 'vault' | 'timeline' | 'graph' | 'ai' | 'report';
  onSelectTab: (tab: 'vault' | 'timeline' | 'graph' | 'ai' | 'report') => void;
  onOpenUploadModal: () => void;
  onOpenAuditModal: () => void;
  onExportVaultJSON: () => void;
  onImportVaultJSON: (jsonString: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  piiRedacted,
  onTogglePii,
  activeTab,
  onSelectTab,
  onOpenUploadModal,
  onOpenAuditModal,
  onExportVaultJSON,
  onImportVaultJSON,
}) => {
  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportVaultJSON(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-cyan-900/40 shadow-2xl">
      {/* Hidden file input for vault import */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Top Telemetry Bar */}
      <div className="bg-[#060911] border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-cyan-400 font-semibold tracking-wider">
            <Terminal className="w-3.5 h-3.5 animate-pulse" />
            <span>AI DIGITAL CRIME SCENE INVESTIGATOR v2.6</span>
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <button
            onClick={onOpenAuditModal}
            className="hidden sm:flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
            title="Open Chain of Custody SHA-256 Audit Log"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CHAIN OF CUSTODY: <strong className="underline">SHA-256 VERIFIED</strong></span>
          </button>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="flex items-center space-x-1 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded text-[11px] text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1"></span>
            SYSTEM TELEMETRY ONLINE
          </span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Case Picker */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-red-500 w-3.5 h-3.5 rounded-full border-2 border-[#0B0F19] flex items-center justify-center"></span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                CRIME SCENE INVESTIGATOR
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                  POLICE-READY
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">Digital Evidence Analysis & Forensic Engine</p>
            </div>
          </div>

          {/* Case Selector Dropdown */}
          <div className="relative ml-2">
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-cyan-800/60 rounded-lg px-3 py-1.5 text-xs text-cyan-200">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <select
                value={selectedCaseId}
                onChange={e => onSelectCase(e.target.value)}
                className="bg-transparent text-slate-100 font-mono text-xs focus:outline-none cursor-pointer pr-2"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200 font-mono">
                    [{c.caseNumber}] {c.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          {/* Backup Export / Import */}
          <button
            onClick={onExportVaultJSON}
            className="flex items-center space-x-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
            title="Export Evidence Vault Backup (JSON)"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">EXPORT BACKUP</span>
          </button>

          <button
            onClick={() => importInputRef.current?.click()}
            className="flex items-center space-x-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
            title="Import Evidence Vault Backup (JSON)"
          >
            <HardDriveUpload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">IMPORT BACKUP</span>
          </button>

          {/* PII Redaction Toggle */}
          <button
            onClick={onTogglePii}
            className={`flex items-center space-x-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              piiRedacted
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
            title="Privacy First Mode: Redacts victim address, personal SSN, and card numbers"
          >
            {piiRedacted ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>PII REDACTED</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>PII VISIBLE</span>
              </>
            )}
          </button>

          {/* Ingest Evidence Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>INGEST EVIDENCE</span>
          </button>

          {/* Export Report CTA */}
          <button
            onClick={() => onSelectTab('report')}
            className="flex items-center space-x-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">POLICE REPORT</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#0B0F19] border-t border-slate-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto no-scrollbar text-xs font-mono">
          <button
            onClick={() => onSelectTab('vault')}
            className={`px-4 py-2.5 border-b-2 font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'vault'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>1. EVIDENCE VAULT ({currentCase.evidenceItems.length})</span>
          </button>

          <button
            onClick={() => onSelectTab('timeline')}
            className={`px-4 py-2.5 border-b-2 font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>2. CHRONOLOGICAL TIMELINE</span>
          </button>

          <button
            onClick={() => onSelectTab('graph')}
            className={`px-4 py-2.5 border-b-2 font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'graph'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Search className="w-4 h-4 text-indigo-400" />
            <span>3. ENTITY LINKAGE GRAPH</span>
          </button>

          <button
            onClick={() => onSelectTab('ai')}
            className={`px-4 py-2.5 border-b-2 font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>4. AI SCAM PATTERN STUDIO</span>
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className={`px-4 py-2.5 border-b-2 font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>5. POLICE-READY DOSSIER</span>
          </button>
        </div>
      </div>
    </header>
  );
};
