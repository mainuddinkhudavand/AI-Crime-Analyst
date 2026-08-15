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
  Globe,
  Bot,
  Layers,
  Award,
  Cpu,
  Compass,
  BarChart2,
} from 'lucide-react';
import { CrimeCase, ActiveTabType } from '../types';

interface HeaderProps {
  cases: CrimeCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  piiRedacted: boolean;
  onTogglePii: () => void;
  activeTab: ActiveTabType;
  onSelectTab: (tab: ActiveTabType) => void;
  onOpenUploadModal: () => void;
  onOpenAuditModal: () => void;
  onExportVaultJSON: () => void;
  onImportVaultJSON: (jsonString: string) => void;
  onOpenCopilot: () => void;
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
  onOpenCopilot,
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
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-cyan-900/40 shadow-2xl font-mono">
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
            <span>AI DIGITAL CRIME SCENE INVESTIGATOR v5.0 FLAGSHIP</span>
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
            FLAGSHIP ENGINE ONLINE
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
                  DAY 5 FINAL
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">Autonomous Forensics & Investigation Suite</p>
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
                    [{c.caseNumber}] {c.title.slice(0, 26)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end flex-wrap gap-y-2">
          {/* AI Copilot Trigger */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-500/20 border border-indigo-400/30 transition-all active:scale-95"
            title="Open AI Forensic Copilot Assistant Drawer"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span>AI COPILOT</span>
          </button>

          {/* Backup Export / Import */}
          <button
            onClick={onExportVaultJSON}
            className="flex items-center space-x-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
            title="Export Evidence Vault Backup (JSON)"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">EXPORT</span>
          </button>

          <button
            onClick={() => importInputRef.current?.click()}
            className="flex items-center space-x-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
            title="Import Evidence Vault Backup (JSON)"
          >
            <HardDriveUpload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">IMPORT</span>
          </button>

          {/* PII Redaction Toggle */}
          <button
            onClick={onTogglePii}
            className={`flex items-center space-x-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              piiRedacted
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            {piiRedacted ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span>PII MASKED</span>
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
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>INGEST</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#0B0F19] border-t border-slate-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto no-scrollbar text-xs font-mono">
          <button
            onClick={() => onSelectTab('vault')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'vault'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>VAULT ({currentCase.evidenceItems.length})</span>
          </button>

          <button
            onClick={() => onSelectTab('timeline')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TIMELINE</span>
          </button>

          <button
            onClick={() => onSelectTab('graph')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'graph'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>ENTITY GRAPH</span>
          </button>

          <button
            onClick={() => onSelectTab('ai')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>AI SCAM STUDIO</span>
          </button>

          <button
            onClick={() => onSelectTab('agent')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'agent'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AGENT SIMULATOR</span>
          </button>

          <button
            onClick={() => onSelectTab('osint')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'osint'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>OSINT RECON</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ANALYTICS HUB</span>
          </button>

          <button
            onClick={() => onSelectTab('radar')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'radar'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>GEO IP RADAR</span>
          </button>

          <button
            onClick={() => onSelectTab('tamper')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'tamper'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>TAMPER AUDIT</span>
          </button>

          <button
            onClick={() => onSelectTab('cases')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'cases'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>MULTI-CASE HUB</span>
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className={`px-3 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>POLICE REPORT</span>
          </button>
        </div>
      </div>
    </header>
  );
};
