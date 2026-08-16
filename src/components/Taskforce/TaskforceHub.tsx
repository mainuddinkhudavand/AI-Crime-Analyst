import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Send,
  Shield,
  CheckCircle2,
  Clock,
  Lock,
  UserCheck,
  Plus,
  AlertCircle,
  X,
  Radio,
  Share2,
} from 'lucide-react';
import { CrimeCase, TaskforceAgency } from '../../types';

interface TaskforceHubProps {
  currentCase: CrimeCase;
}

const MOCK_AGENCIES: TaskforceAgency[] = [
  {
    id: 'agency-fbi',
    agencyName: 'FBI Cyber Division - Major Cyber Crimes Unit',
    agencyAbbr: 'FBI-CYBER',
    jurisdiction: 'United States Federal Jurisdiction',
    contactOfficer: 'Special Agent Marcus Vance (Desk 4B)',
    clearanceLevel: 'TOP_SECRET_CYBER',
    activeDispatchesCount: 3,
    status: 'ONLINE',
  },
  {
    id: 'agency-interpol',
    agencyName: 'Interpol Financial Crime & Anti-Corruption Centre',
    agencyAbbr: 'INTERPOL-IFCAC',
    jurisdiction: 'International / Cross-Border Transnational',
    contactOfficer: 'Inspector General Helene Meyer (Lyon HQ)',
    clearanceLevel: 'LAW_ENFORCEMENT_SENSITIVE',
    activeDispatchesCount: 2,
    status: 'ONLINE',
  },
  {
    id: 'agency-europol',
    agencyName: 'Europol European Cybercrime Centre (EC3)',
    agencyAbbr: 'EUROPOL-EC3',
    jurisdiction: 'European Union Member States',
    contactOfficer: 'Chief Analyst Jan De Jong (The Hague)',
    clearanceLevel: 'LAW_ENFORCEMENT_SENSITIVE',
    activeDispatchesCount: 1,
    status: 'ONLINE',
  },
  {
    id: 'agency-fincen',
    agencyName: 'FinCEN Financial Crimes Enforcement Network',
    agencyAbbr: 'FINCEN-AML',
    jurisdiction: 'Bank Secrecy Act & Crypto Asset Freezes',
    contactOfficer: 'Compliance Auditor Sarah Lin (Washington DC)',
    clearanceLevel: 'TOP_SECRET_CYBER',
    activeDispatchesCount: 4,
    status: 'ONLINE',
  },
];

interface LeadDispatchRecord {
  id: string;
  agencyAbbr: string;
  dispatchType: string;
  title: string;
  timestamp: string;
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'UNDER_REVIEW';
  referenceNumber: string;
}

export const TaskforceHub: React.FC<TaskforceHubProps> = ({ currentCase }) => {
  const [dispatches, setDispatches] = useState<LeadDispatchRecord[]>([
    {
      id: 'disp-1',
      agencyAbbr: 'FBI-CYBER',
      dispatchType: 'Direct Subpoena Referral (18 U.S.C. § 2703f)',
      title: `Subpoena demand for suspect handle ${currentCase.suspects[0]?.handle || '@suspect_handler'}`,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString().slice(0, 16).replace('T', ' '),
      status: 'ACKNOWLEDGED',
      referenceNumber: 'FBI-LEAD-2026-9041',
    },
    {
      id: 'disp-2',
      agencyAbbr: 'FINCEN-AML',
      dispatchType: 'Crypto Asset Emergency Freeze Directive',
      title: 'Freeze notice for Ethereum Wallet 0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString().slice(0, 16).replace('T', ' '),
      status: 'DISPATCHED',
      referenceNumber: 'FINCEN-NOTICE-2026-3184',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAgency, setSelectedAgency] = useState<string>(MOCK_AGENCIES[0].agencyAbbr);
  const [dispatchType, setDispatchType] = useState<string>('Direct Lead Dispatch');
  const [leadTitle, setLeadTitle] = useState<string>(`Inter-Agency Assistance Request for ${currentCase.caseNumber}`);
  const [leadDetails, setLeadDetails] = useState<string>('');

  const handleSendLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: LeadDispatchRecord = {
      id: `disp-${Date.now()}`,
      agencyAbbr: selectedAgency,
      dispatchType,
      title: leadTitle,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'DISPATCHED',
      referenceNumber: `${selectedAgency}-LEAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setDispatches([newRecord, ...dispatches]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-blue-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Building2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              MULTI-AGENCY JOINT TASKFORCE & INTER-AGENCY DISPATCH HUB
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                MULTI-AGENCY SECURE NETWORK
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time collaboration across FBI Cyber Division, Interpol, Europol EC3, and FinCEN
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>DISPATCH INTER-AGENCY LEAD</span>
        </button>
      </div>

      {/* Taskforce Participating Agencies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {MOCK_AGENCIES.map(agency => (
          <div
            key={agency.id}
            className="bg-[#090D16] border border-blue-900/40 rounded-xl p-5 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-xs">{agency.agencyName}</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                {agency.agencyAbbr}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div><strong className="text-slate-400">Jurisdiction:</strong> {agency.jurisdiction}</div>
              <div><strong className="text-slate-400">Contact Officer:</strong> {agency.contactOfficer}</div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-[10px]">
              <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
                {agency.clearanceLevel.replace(/_/g, ' ')}
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                <span>LINK ACTIVE</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatched Inter-Agency Leads Audit Table */}
      <div className="bg-[#090D16] border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-white">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">DISPATCHED INTER-AGENCY LEADS AUDIT LOG</h3>
          </div>
          <span className="text-xs text-cyan-400 font-bold">{dispatches.length} Active Leads</span>
        </div>

        <div className="space-y-3 text-xs">
          {dispatches.map(item => (
            <div key={item.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-bold">
                    {item.agencyAbbr}
                  </span>
                  <span className="text-cyan-300 font-mono text-[11px]">{item.referenceNumber}</span>
                </div>
                <h4 className="text-white font-bold text-xs">{item.title}</h4>
                <p className="text-slate-400 text-[11px]">{item.dispatchType} • Dispatched at {item.timestamp}</p>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase flex items-center gap-1 ${
                item.status === 'ACKNOWLEDGED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{item.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Dispatch New Inter-Agency Lead */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-[#0F172A] border border-blue-500/50 rounded-xl max-w-lg w-full p-6 font-mono space-y-4 shadow-2xl relative text-xs"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">DISPATCH INTER-AGENCY LEAD</h3>
                  <p className="text-slate-400 text-[11px]">Send encrypted case intelligence to taskforce agency</p>
                </div>
              </div>

              <form onSubmit={handleSendLead} className="space-y-3 text-slate-200">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Target Taskforce Agency:</label>
                  <select
                    value={selectedAgency}
                    onChange={e => setSelectedAgency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                  >
                    {MOCK_AGENCIES.map(a => (
                      <option key={a.id} value={a.agencyAbbr}>
                        [{a.agencyAbbr}] {a.agencyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Lead Subject Title:</label>
                  <input
                    type="text"
                    required
                    value={leadTitle}
                    onChange={e => setLeadTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Dispatch Type:</label>
                  <select
                    value={dispatchType}
                    onChange={e => setDispatchType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Direct Subpoena Referral (18 U.S.C. § 2703f)">Direct Subpoena Referral (18 U.S.C. § 2703f)</option>
                    <option value="Crypto Asset Emergency Freeze Directive">Crypto Asset Emergency Freeze Directive</option>
                    <option value="Transnational Suspect Location Assistance">Transnational Suspect Location Assistance</option>
                    <option value="Bank Secrecy Act / SAR Inquiry">Bank Secrecy Act / SAR Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Encrypted Officer Notes:</label>
                  <textarea
                    rows={3}
                    placeholder="Enter confidential dispatch instructions or exhibit reference numbers..."
                    value={leadDetails}
                    onChange={e => setLeadDetails(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
                  >
                    <Send className="w-4 h-4" />
                    <span>DISPATCH LEAD NOW</span>
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
