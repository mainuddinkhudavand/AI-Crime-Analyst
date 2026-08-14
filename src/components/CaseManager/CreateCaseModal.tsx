import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CrimeCase } from '../../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (newCase: CrimeCase) => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onCreateCase,
}) => {
  const [title, setTitle] = useState<string>('');
  const [victimName, setVictimName] = useState<string>('');
  const [victimContact, setVictimContact] = useState<string>('');
  const [victimLocation, setVictimLocation] = useState<string>('');
  const [totalLossUSD, setTotalLossUSD] = useState<number>(15000);
  const [scamCategory, setScamCategory] = useState<CrimeCase['scamCategory']>('Pig Butchering / Crypto Fraud');
  const [summary, setSummary] = useState<string>('');
  const [suspectHandle, setSuspectHandle] = useState<string>('@suspect_handler');
  const [suspectPhone, setSuspectPhone] = useState<string>('+1 (555) 019-9842');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !victimName) return;

    const newCaseId = `case-${Date.now()}`;
    const caseNum = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase: CrimeCase = {
      id: newCaseId,
      caseNumber: caseNum,
      title,
      incidentDate: `${new Date().toISOString().slice(0, 10)} to Present`,
      victimName,
      victimContact: victimContact || 'victim@investigation.org',
      victimLocation: victimLocation || 'New York, NY, USA',
      totalLossUSD: Number(totalLossUSD) || 10000,
      scamCategory,
      status: 'UNDER_INVESTIGATION',
      createdDate: new Date().toISOString().slice(0, 10),
      summary: summary || 'Newly initialized cyber crime case awaiting multi-source evidence exhibit ingestion.',
      suspects: [
        {
          nameAlias: 'Primary Identified Fraud Operator',
          handle: suspectHandle,
          phone: suspectPhone,
          role: 'Primary Fraud Handler / Solicit Operator',
        },
      ],
      evidenceItems: [],
      graphNodes: [
        { id: `n-victim-${Date.now()}`, label: victimName, type: 'victim', subtitle: victimLocation, riskLevel: 'low' },
        { id: `n-suspect-${Date.now()}`, label: suspectHandle, type: 'suspect', subtitle: 'Suspect Handle', riskLevel: 'critical' },
      ],
      graphEdges: [],
      aiAlerts: [
        {
          id: `alt-${Date.now()}`,
          title: 'Initial Case Telemetry Logged',
          severity: 'high',
          category: scamCategory,
          description: 'Case initialized in forensic vault. Ready for evidence ingestion.',
          evidenceRefs: ['EX-001'],
          modusOperandi: 'Direct social solicitation and remote wire demand.',
          recommendation: 'Ingest victim WhatsApp chat export and bank receipts into Evidence Vault.',
        },
      ],
      recommendedActions: [
        'Ingest raw chat logs and email headers.',
        'Trace suspect phone line and crypto wallet addresses.',
      ],
    };

    onCreateCase(newCase);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-[#0F172A] border border-cyan-500/50 rounded-xl max-w-xl w-full p-6 font-mono space-y-4 shadow-2xl relative text-xs"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">INITIALIZE NEW CRIME CASE</h3>
                <p className="text-slate-400 text-[11px]">Log new victim complaint dossier into forensic database</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-slate-200">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Operation Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operation Dark Web Task Scam"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Victim Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={victimName}
                    onChange={e => setVictimName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Victim Contact:</label>
                  <input
                    type="text"
                    placeholder="e.g. sarah.j@gmail.com"
                    value={victimContact}
                    onChange={e => setVictimContact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Financial Loss (USD):</label>
                  <input
                    type="number"
                    required
                    value={totalLossUSD}
                    onChange={e => setTotalLossUSD(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Scam Category:</label>
                  <select
                    value={scamCategory}
                    onChange={e => setScamCategory(e.target.value as CrimeCase['scamCategory'])}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Pig Butchering / Crypto Fraud">Pig Butchering / Crypto Fraud</option>
                    <option value="WhatsApp Impersonation Wire Fraud">WhatsApp Impersonation Wire Fraud</option>
                    <option value="Remote Job & Task Deposit Fraud">Remote Job & Task Deposit Fraud</option>
                    <option value="Phishing Scam">Phishing Scam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Executive Summary:</label>
                <textarea
                  rows={3}
                  placeholder="Describe the initial victim complaint..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>INITIALIZE CASE</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
