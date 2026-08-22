import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  ShieldAlert,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  FileCheck,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';
import { CrimeCase, SmartContractAuditResult } from '../../types';

interface SmartContractAuditStudioProps {
  currentCase: CrimeCase;
}

const MOCK_CONTRACT_AUDITS: SmartContractAuditResult[] = [
  {
    id: 'audit-1',
    contractAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    blockchain: 'Ethereum Mainnet (ERC-20 Drainer)',
    contractName: 'VanguardLiquidityVault.sol',
    vulnerabilityType: 'Malicious Unlimited Token Approval & Emergency Drain Function',
    riskScore: 98,
    isLiquidityDrained: true,
  },
  {
    id: 'audit-2',
    contractAddress: '0x98412059a12849b2c4a91c3029f8b4e721a95018',
    blockchain: 'Arbitrum One (L2 Pool Hub)',
    contractName: 'YieldFarmStakingProxy.sol',
    vulnerabilityType: 'Reentrancy Vault Drainer & Unchecked Call',
    riskScore: 94,
    isLiquidityDrained: true,
  },
];

export const SmartContractAuditStudio: React.FC<SmartContractAuditStudioProps> = ({ currentCase }) => {
  const [selectedAudit, setSelectedAudit] = useState<SmartContractAuditResult>(MOCK_CONTRACT_AUDITS[0]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  const handleReScanContracts = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-cyan-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Code className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI CRYPTOGRAPHIC SMART CONTRACT & DEFI DRAIN FORENSIC AUDITOR
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                BYTECODE & APPROVAL DECOMPILER
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Scans malicious Ethereum/Solana smart contracts, reentrancy exploits, and token approval drainers
            </p>
          </div>
        </div>

        <button
          onClick={handleReScanContracts}
          disabled={isAuditing}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-cyan-600/30 border border-cyan-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <RotateCcw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'DECOMPILING BYTECODE...' : 'RE-AUDIT DEFI SMART CONTRACTS'}</span>
        </button>
      </div>

      {/* Main Grid: Contracts List & Decompiled Bytecode Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Smart Contracts List */}
        <div className="bg-[#090D16] border border-cyan-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>SUSPECT SMART CONTRACTS (2)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {MOCK_CONTRACT_AUDITS.map(contract => (
              <div
                key={contract.id}
                onClick={() => setSelectedAudit(contract)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedAudit.id === contract.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-950'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{contract.contractName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                    RISK {contract.riskScore}/100
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{contract.blockchain}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Contract Decompiled Bytecode & Vulnerability Inspector */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-cyan-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">{selectedAudit.contractName}</h3>
              <span className="text-xs text-cyan-400 font-mono break-all">{selectedAudit.contractAddress}</span>
            </div>
            <span className="bg-red-950 text-red-300 border border-red-800 text-xs px-3 py-1 rounded font-bold uppercase">
              {selectedAudit.vulnerabilityType.slice(0, 32)}...
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-slate-400 font-bold uppercase block text-[11px]">Decompiled EVM Function Call Graph</span>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] leading-relaxed space-y-1">
              <div>[0x00] PUSH1 0x80 PUSH1 0x40 MSTORE</div>
              <div>[0x05] CALLVALUE DUP1 ISZERO PUSH2 0x0010 JUMPI</div>
              <div>[LOG] Function <strong className="text-white font-bold">permitAndDrain(address victim, uint256 amount)</strong> executed</div>
              <div>[LOG] Unlimited ERC-20 Allowance granted to Suspect Wallet 0x71C765...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
