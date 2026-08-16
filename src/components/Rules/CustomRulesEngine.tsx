import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Play,
  Plus,
  CheckCircle2,
  AlertOctagon,
  RotateCcw,
  Zap,
  ShieldAlert,
  FileCheck,
  Check,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { CrimeCase, CustomThreatRule, EvidenceItem } from '../../types';

interface CustomRulesEngineProps {
  currentCase: CrimeCase;
}

const DEFAULT_RULES: CustomThreatRule[] = [
  {
    id: 'rule-1',
    ruleName: 'Flag Ethereum Mixer Drain (> 5 ETH)',
    targetField: 'amount',
    conditionType: 'GREATER_THAN',
    triggerValue: '5.0',
    severity: 'CRITICAL',
    isEnabled: true,
  },
  {
    id: 'rule-2',
    ruleName: 'Detect Coercion Keywords ("wire urgent", "gift card")',
    targetField: 'content',
    conditionType: 'CONTAINS',
    triggerValue: 'wire urgent',
    severity: 'HIGH',
    isEnabled: true,
  },
  {
    id: 'rule-3',
    ruleName: 'Detect SPF / DKIM Authentication Failures',
    targetField: 'email_header',
    conditionType: 'HEADER_FAIL',
    triggerValue: 'FAIL',
    severity: 'CRITICAL',
    isEnabled: true,
  },
];

export const CustomRulesEngine: React.FC<CustomRulesEngineProps> = ({ currentCase }) => {
  const [rules, setRules] = useState<CustomThreatRule[]>(DEFAULT_RULES);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [matchedExhibitsCount, setMatchedExhibitsCount] = useState<number>(currentCase.evidenceItems.length);
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newTargetField, setNewTargetField] = useState<CustomThreatRule['targetField']>('content');
  const [newTriggerValue, setNewTriggerValue] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<CustomThreatRule['severity']>('HIGH');

  const handleToggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleAddCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newTriggerValue) return;

    const newRule: CustomThreatRule = {
      id: `rule-${Date.now()}`,
      ruleName: newRuleName,
      targetField: newTargetField,
      conditionType: newTargetField === 'amount' ? 'GREATER_THAN' : newTargetField === 'email_header' ? 'HEADER_FAIL' : 'CONTAINS',
      triggerValue: newTriggerValue,
      severity: newSeverity,
      isEnabled: true,
    };

    setRules([...rules, newRule]);
    setNewRuleName('');
    setNewTriggerValue('');
  };

  const handleReScanRules = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setMatchedExhibitsCount(currentCase.evidenceItems.length);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-amber-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sliders className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AUTOMATED FORENSIC THREAT RULES & PATTERN SCORING ENGINE
              <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                {rules.filter(r => r.isEnabled).length} ACTIVE RULES
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Create custom detection triggers for crypto thresholds, coercion text, and email header anomalies
            </p>
          </div>
        </div>

        <button
          onClick={handleReScanRules}
          disabled={isScanning}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-amber-600/30 border border-amber-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <RotateCcw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'RE-EVALUATING RULES...' : 'RE-SCAN CASE EVIDENCE'}</span>
        </button>
      </div>

      {/* Main Grid: Custom Rules Manager & Live Match Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Rules List */}
        <div className="bg-[#090D16] border border-amber-900/40 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>CUSTOM DETECTION RULES</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">{rules.length} Rules</span>
          </div>

          <div className="space-y-3 text-xs">
            {rules.map(rule => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  rule.isEnabled
                    ? 'bg-amber-950/20 border-amber-500/60 text-amber-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{rule.ruleName}</span>
                  <button onClick={() => handleToggleRule(rule.id)} className="text-amber-400">
                    {rule.isEnabled ? (
                      <ToggleRight className="w-6 h-6 text-amber-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-900 font-mono">
                  Trigger: <strong className="text-amber-300">{rule.targetField}</strong> {rule.conditionType} "<strong className="text-white">{rule.triggerValue}</strong>"
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
                    SEVERITY: {rule.severity}
                  </span>
                  <span className="text-slate-500">{rule.isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Rule Form */}
          <form onSubmit={handleAddCustomRule} className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-white block">ADD NEW CUSTOM RULE</span>
            <input
              type="text"
              placeholder="Rule Name (e.g. Flag Gift Cards)"
              value={newRuleName}
              onChange={e => setNewRuleName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newTargetField}
                onChange={e => setNewTargetField(e.target.value as CustomThreatRule['targetField'])}
                className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none"
              >
                <option value="content">Text Content</option>
                <option value="amount">Transaction Amount</option>
                <option value="email_header">Email Header</option>
                <option value="crypto_address">Crypto Address</option>
              </select>
              <input
                type="text"
                placeholder="Trigger Value"
                value={newTriggerValue}
                onChange={e => setNewTriggerValue(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>ADD RULE</span>
            </button>
          </form>
        </div>

        {/* Live Rule Matches Inspector */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-amber-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">EVIDENCE RULE MATCH TELEMETRY</h3>
            </div>
            <span className="text-xs text-amber-400 font-bold">{matchedExhibitsCount} Exhibits Flagged</span>
          </div>

          <div className="space-y-3">
            {currentCase.evidenceItems.map(item => (
              <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-bold">
                      {item.exhibitNumber}
                    </span>
                    <span className="font-bold text-white">{item.title}</span>
                  </div>
                  <span className="text-red-400 font-bold bg-red-950/80 px-2 py-0.5 rounded border border-red-800 text-[10px]">
                    RISK SCORE {item.riskScore}/100
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 truncate">
                  {item.rawContent.slice(0, 140)}...
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-amber-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Matched Rule: Coercion Pattern & Crypto Threshold Triggered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
