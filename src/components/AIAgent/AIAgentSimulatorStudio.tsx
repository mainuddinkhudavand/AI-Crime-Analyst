import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Cpu,
  Zap,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import { CrimeCase, EvidenceItem, AgentPlaybookStep } from '../../types';
import { generateSha256, extractEntities } from '../../utils/entityExtractor';

interface AIAgentSimulatorStudioProps {
  currentCase: CrimeCase;
  onIngestDiscoveredExhibit: (item: EvidenceItem) => void;
}

const INITIAL_PLAYBOOK_STEPS: AgentPlaybookStep[] = [
  {
    id: 'step-1',
    name: '1. Autonomous OSINT Domain & Reverse IP Recon',
    status: 'PENDING',
    logOutput: 'Initializing WHOIS reverse lookup for dex-vanguard-fx.top...\nResolved Originating IP: 185.220.101.42 (Tor Exit Node, Frankfurt DE).\nRegistrar Privacy Shield: Disabled. Owner email identified: admin@dex-vanguard-fx.top',
  },
  {
    id: 'step-2',
    name: '2. Telegram Cybercrime Channel & Alias Scraper',
    status: 'PENDING',
    logOutput: 'Connecting to Telegram MTProto API session...\nQuerying suspect handle @elena_vance_fx across 42 crypto illicit channels...\nMatch found in "VIP Crypto Arbitrage Signals": Handle @elena_vance_fx associated with phone +1 (310) 555-0198.',
  },
  {
    id: 'step-3',
    name: '3. On-Chain Ethereum Mixer Hop Tracing',
    status: 'PENDING',
    logOutput: 'Parsing transaction hash 0x8a91c3029f8b4e721a95018b32e18d6e94f210a56218d612e094f09a12849b2c...\nDeposit 10 ETH routed to Vault 0x71C7656EC7ab88b098defB751B7401B5f6d8976F.\nSub-hop 1: 5 ETH sent to Tornado Cash mixer pool.\nSub-hop 2: 5 ETH transferred to Binance Deposit Address 0x98412059a.',
  },
  {
    id: 'step-4',
    name: '4. Automated Subpoena & Legal Hold Directive Draft',
    status: 'PENDING',
    logOutput: 'Synthesizing exhibit metadata into formal legal directive...\nGenerated 18 U.S.C. § 2703(f) Preservation Demand for Meta / WhatsApp Law Enforcement Operations.\nGenerated Coinbase Emergency Asset Freeze Demand for 10 ETH.',
  },
];

export const AIAgentSimulatorStudio: React.FC<AIAgentSimulatorStudioProps> = ({
  currentCase,
  onIngestDiscoveredExhibit,
}) => {
  const [steps, setSteps] = useState<AgentPlaybookStep[]>(INITIAL_PLAYBOOK_STEPS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Autonomous AI Agent Initialized for ${currentCase.caseNumber}`,
    `[SYSTEM] Multi-stage cybercrime investigation playbook loaded (4 Steps). Click "RUN AUTONOMOUS PLAYBOOK" to begin.`,
  ]);
  const [isIngested, setIsIngested] = useState<boolean>(false);

  const handleRunPlaybook = () => {
    setIsRunning(true);
    setCurrentStepIdx(0);
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] >>> STARTING AUTONOMOUS INVESTIGATION PLAYBOOK...`,
    ]);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentStepIdx >= 0 && currentStepIdx < steps.length) {
      setSteps(prev =>
        prev.map((s, idx) => (idx === currentStepIdx ? { ...s, status: 'RUNNING' } : s))
      );

      const step = steps[currentStepIdx];
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Executing Stage: ${step.name}...`,
        ...step.logOutput.split('\n').map(l => `[LOG] ${l}`),
      ]);

      timer = setTimeout(() => {
        setSteps(prev =>
          prev.map((s, idx) => (idx === currentStepIdx ? { ...s, status: 'COMPLETED' } : s))
        );

        if (currentStepIdx + 1 < steps.length) {
          setCurrentStepIdx(prev => prev + 1);
        } else {
          setIsRunning(false);
          setTerminalLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] >>> AUTONOMOUS INVESTIGATION PLAYBOOK COMPLETED SUCCESSFULLY! All 4 stages verified.`,
          ]);
        }
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStepIdx]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIdx(-1);
    setSteps(INITIAL_PLAYBOOK_STEPS);
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] Autonomous AI Agent Reset for ${currentCase.caseNumber}`,
      `[SYSTEM] Playbook reset to initial state.`,
    ]);
  };

  const handleIngestAgentExhibit = () => {
    const rawContent = `AUTONOMOUS AI AGENT FORENSIC FINDINGS
==================================================
Case Ref: ${currentCase.caseNumber}
Agent Playbook: Multi-stage OSINT & Mixer Hop Tracing
Discovered Suspect IP: 185.220.101.42 (Tor Exit Node)
Discovered Wallet: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
Associated Handle: @elena_vance_fx (+1 310 555 0198)

Automated Findings Summary:
1. Reverse IP lookup confirmed Tor exit node infrastructure hosted in Frankfurt, Germany.
2. Cross-platform Telegram scraping matched handle @elena_vance_fx in illicit signal channels.
3. On-chain telemetry traced 10 ETH drain into mixer pool and Binance deposit AC 0x98412059a.`;

    const sha256 = generateSha256(rawContent + currentCase.id + Date.now());

    const newExhibit: EvidenceItem = {
      id: `ev-agent-${Date.now()}`,
      exhibitNumber: `EX-AGENT-${Math.floor(100 + Math.random() * 900)}`,
      caseId: currentCase.id,
      title: 'Autonomous AI Agent OSINT & Mixer Hop Audit Exhibit',
      type: 'chat',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      sha256Hash: sha256,
      sourceName: 'Autonomous AI Investigator Agent Engine v3.0',
      rawContent,
      entities: extractEntities(rawContent),
      riskScore: 98,
      flaggedKeywords: ['Autonomous AI Agent', 'Tor Exit Node', 'Mixer Hop', 'Binance Deposit'],
    };

    onIngestDiscoveredExhibit(newExhibit);
    setIsIngested(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-cyan-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Bot className="w-6 h-6 animate-pulse text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AUTONOMOUS AI INVESTIGATOR AGENT SIMULATOR STUDIO
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                AUTONOMOUS PLAYBOOK EXECUTION
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous multi-stage playbook running OSINT recon, WHOIS history, Telegram scraping, and mixer hop tracing
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
            title="Reset Agent Playbook"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunPlaybook}
            disabled={isRunning}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-cyan-600/30 border border-cyan-400/40 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'AGENT EXECUTING PLAYBOOK...' : 'RUN AUTONOMOUS PLAYBOOK'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Playbook Stages & Live Terminal Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playbook Stage Progress Cards */}
        <div className="bg-[#090D16] border border-cyan-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>PLAYBOOK STAGES (4)</span>
            </h3>
            <span className="text-xs text-cyan-400 font-bold">
              {steps.filter(s => s.status === 'COMPLETED').length}/4 Completed
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  s.status === 'RUNNING'
                    ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950'
                    : s.status === 'COMPLETED'
                    ? 'bg-slate-900/90 border-emerald-900/60 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{s.name}</span>
                  {s.status === 'RUNNING' && (
                    <span className="text-[10px] text-cyan-300 font-bold animate-pulse flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>EXECUTING</span>
                    </span>
                  )}
                  {s.status === 'COMPLETED' && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>DONE</span>
                    </span>
                  )}
                  {s.status === 'PENDING' && (
                    <span className="text-[10px] text-slate-500 font-mono">QUEUED</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action to Ingest Discovered Findings */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={handleIngestAgentExhibit}
              disabled={isIngested}
              className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                isIngested
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 border border-emerald-400/40'
              }`}
            >
              {isIngested ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>AGENT EXHIBIT INGESTED INTO VAULT</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>INGEST DISCOVERED FINDINGS INTO VAULT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Terminal Telemetry Output Log */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Terminal className="w-4 h-4 animate-pulse" />
              <h3 className="font-bold text-white">LIVE AGENT TERMINAL TELEMETRY STREAM</h3>
            </div>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded">
              BASH / OSINT SHELL
            </span>
          </div>

          {/* Terminal Box */}
          <div className="bg-[#05080F] border border-slate-900 rounded-lg p-4 h-[380px] overflow-y-auto space-y-1.5 font-mono text-[11px] text-emerald-400 selection:bg-emerald-900 selection:text-white">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={log.includes('>>>') ? 'text-cyan-300 font-bold' : log.includes('[LOG]') ? 'text-slate-300' : 'text-emerald-400'}>
                {log}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
            <span>Status: {isRunning ? 'Playbook Agent Active' : 'Idle'}</span>
            <span>Cryptographic Telemetry Signed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
