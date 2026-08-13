import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  ShieldAlert,
  DollarSign,
  Phone,
  Mail,
  CreditCard,
  Lock,
  ArrowRight,
  UserCheck,
  AlertOctagon,
  Info,
  Plus,
  Zap,
  Download,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CrimeCase, GraphNode, GraphEdge } from '../../types';

interface EntityGraphProps {
  currentCase: CrimeCase;
}

export const EntityGraph: React.FC<EntityGraphProps> = ({ currentCase }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterNodeType, setFilterNodeType] = useState<string>('all');
  const [isTracingTrail, setIsTracingTrail] = useState<boolean>(false);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState<boolean>(false);

  // Custom nodes added during runtime
  const [customNodes, setCustomNodes] = useState<GraphNode[]>([]);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newType, setNewType] = useState<GraphNode['type']>('suspect');
  const [newRisk, setNewRisk] = useState<GraphNode['riskLevel']>('critical');

  const allNodes = [...currentCase.graphNodes, ...customNodes];

  const nodes = allNodes.filter(n => {
    return filterNodeType === 'all' || n.type === filterNodeType;
  });

  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel) return;
    const node: GraphNode = {
      id: `custom-n-${Date.now()}`,
      label: newLabel,
      subtitle: newSubtitle || 'Manually Logged Suspect Entity',
      type: newType,
      riskLevel: newRisk,
    };
    setCustomNodes(prev => [...prev, node]);
    setNewLabel('');
    setNewSubtitle('');
    setIsAddNodeModalOpen(false);
  };

  const getNodeColor = (type: GraphNode['type'], isHighlighted: boolean) => {
    if (isHighlighted) {
      return 'border-amber-400 bg-amber-950 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-105 ring-2 ring-amber-400';
    }
    switch (type) {
      case 'victim':
        return 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-cyan-500/20';
      case 'suspect':
        return 'border-red-500 bg-red-950/90 text-red-200 shadow-red-500/30';
      case 'bank':
        return 'border-amber-400 bg-amber-950/90 text-amber-200 shadow-amber-500/20';
      case 'crypto':
        return 'border-emerald-400 bg-emerald-950/90 text-emerald-200 shadow-emerald-500/20';
      case 'domain':
        return 'border-purple-400 bg-purple-950/90 text-purple-200 shadow-purple-500/20';
      case 'phone':
        return 'border-blue-400 bg-blue-950/90 text-blue-200 shadow-blue-500/20';
      default:
        return 'border-slate-600 bg-slate-900 text-slate-200';
    }
  };

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'victim':
        return <UserCheck className="w-4 h-4 text-cyan-400" />;
      case 'suspect':
        return <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />;
      case 'bank':
        return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'crypto':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'domain':
        return <Lock className="w-4 h-4 text-purple-400" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-400" />;
      default:
        return <Network className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Top Banner & Control */}
      <div className="bg-[#0F172A]/90 border border-cyan-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            <span>ENTITY RELATIONSHIP & FINANCIAL FLOW GRAPH</span>
          </h2>
          <p className="text-xs text-slate-400">
            Interactive visual network topology mapping suspect handles, mule accounts, and money trails
          </p>
        </div>

        {/* Node Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => setIsTracingTrail(!isTracingTrail)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              isTracingTrail
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTracingTrail ? 'MONEY TRAIL TRACED' : 'TRACE FINANCIAL TRAIL'}</span>
          </button>

          <button
            onClick={() => setIsAddNodeModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD ENTITY NODE</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Filter:</span>
            <select
              value={filterNodeType}
              onChange={e => setFilterNodeType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-mono"
            >
              <option value="all">All Entities ({allNodes.length})</option>
              <option value="victim">Victims Only</option>
              <option value="suspect">Suspect Handles</option>
              <option value="bank">Mule Bank ACs</option>
              <option value="crypto">Crypto Wallets</option>
              <option value="domain">Phishing Domains</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspector Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Diagram View */}
        <div className="lg:col-span-2 bg-[#090D16] border border-cyan-900/40 rounded-xl p-6 shadow-2xl relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          {/* Background grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          {/* Interactive Legend */}
          <div className="relative z-10 flex flex-wrap gap-3 text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 backdrop-blur-sm self-start">
            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Victim Node
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Suspect Entity
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Mule Bank AC
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Crypto Wallet
            </span>
            <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Phishing Domain
            </span>
          </div>

          {/* Traced Money Flow Banner */}
          {isTracingTrail && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 my-2 bg-amber-950/30 border border-amber-500/50 p-3 rounded-lg text-xs text-amber-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                <span><strong>TRACED MONEY TRAIL:</strong> Victim ($\$42,500\text{ USD}$) $\rightarrow$ Vanguard Phishing Portal $\rightarrow$ Mule Bank AC $\rightarrow$ ETH Mixer Vault</span>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40">
                100% LAUNDERED
              </span>
            </motion.div>
          )}

          {/* Nodes Grid Layout Simulation */}
          <div className="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nodes.map(node => {
              const isTrailHighlighted = isTracingTrail && (node.type === 'bank' || node.type === 'crypto' || node.type === 'victim');

              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border shadow-lg cursor-pointer transition-all ${getNodeColor(
                    node.type,
                    isTrailHighlighted
                  )} ${selectedNode?.id === node.id ? 'ring-2 ring-cyan-400 shadow-cyan-500/40' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                        {getNodeIcon(node.type)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-mono tracking-tight">{node.label}</h4>
                        {node.subtitle && <p className="text-[10px] opacity-80 font-mono mt-0.5">{node.subtitle}</p>}
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/50 border border-white/10">
                      {node.type}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Flow Edges Summary list */}
          <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs text-slate-300">
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] block">LINKED EVIDENCE FLOWS & WIRE TRAIL:</span>
            <div className="space-y-1">
              {currentCase.graphEdges.map(edge => {
                const srcNode = allNodes.find(n => n.id === edge.source);
                const tgtNode = allNodes.find(n => n.id === edge.target);
                return (
                  <div key={edge.id} className="flex items-center justify-between text-[11px] bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                    <div className="flex items-center space-x-1.5 text-slate-200">
                      <span className="font-semibold text-cyan-300">{srcNode?.label || edge.source}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-amber-300">{tgtNode?.label || edge.target}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">{edge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Detail Drawer / Inspector */}
        <div className="bg-[#0F172A] border border-cyan-900/60 rounded-xl p-5 shadow-2xl flex flex-col justify-between space-y-4 font-mono">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedNode.label}</h3>
                  <span className="text-xs text-cyan-400 uppercase font-semibold">Entity Type: {selectedNode.type}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Entity Telemetry</label>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-slate-300">
                  <div><strong className="text-slate-400">Node Identifier:</strong> {selectedNode.id}</div>
                  <div><strong className="text-slate-400">Description:</strong> {selectedNode.subtitle || 'Active Entity'}</div>
                  <div>
                    <strong className="text-slate-400">Risk Assessment:</strong>{' '}
                    <span className={`font-bold uppercase ${selectedNode.riskLevel === 'critical' ? 'text-red-400' : 'text-cyan-300'}`}>
                      {selectedNode.riskLevel || 'High'} Risk Level
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Edges for this node */}
              <div className="space-y-2 text-xs">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Connected Transfer Links</label>
                <div className="space-y-1.5">
                  {currentCase.graphEdges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => (
                      <div key={e.id} className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] space-y-1">
                        <div className="text-cyan-300 font-semibold">{e.label}</div>
                        {e.amount && <div className="text-emerald-400 font-bold">Transaction Value: {e.amount}</div>}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-3 p-6 text-slate-400">
              <Info className="w-10 h-10 text-cyan-500/50" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">Select Any Entity Node</h4>
                <p className="text-xs text-slate-500 mt-1">Click on any node in the network graph to inspect its connected financial transactions & evidence trail.</p>
              </div>
            </div>
          )}

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <span className="text-cyan-400 font-bold block mb-1">AUTOMATED FORENSIC GRAPH ANALYSIS:</span>
            Graph nodes update dynamically whenever new digital evidence exhibits are ingested into the case vault.
          </div>
        </div>
      </div>

      {/* Add Custom Node Modal */}
      <AnimatePresence>
        {isAddNodeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0F172A] border border-indigo-500/50 rounded-xl max-w-md w-full p-6 font-mono space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddNodeModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2.5 text-white">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">MANUALLY LOG NEW ENTITY NODE</h3>
              </div>

              <form onSubmit={handleAddCustomNode} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Entity Label / Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wallet 0x8a9... or Suspect Phone Line"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Subtitle / Note:</label>
                  <input
                    type="text"
                    placeholder="e.g. Identified Escrow Mule Account"
                    value={newSubtitle}
                    onChange={e => setNewSubtitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Entity Type:</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as GraphNode['type'])}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                    >
                      <option value="suspect">Suspect Entity</option>
                      <option value="crypto">Crypto Wallet</option>
                      <option value="bank">Mule Bank AC</option>
                      <option value="phone">Phone Line</option>
                      <option value="domain">Phishing Domain</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Risk Level:</label>
                    <select
                      value={newRisk}
                      onChange={e => setNewRisk(e.target.value as GraphNode['riskLevel'])}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddNodeModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                  >
                    Add Entity to Graph
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
