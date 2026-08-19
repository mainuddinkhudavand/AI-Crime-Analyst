import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CrimeCase } from '../../types';

interface IncidentReenactmentStudioProps {
  currentCase: CrimeCase;
}

export const IncidentReenactmentStudio: React.FC<IncidentReenactmentStudioProps> = ({ currentCase }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-indigo-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              MULTI-VECTOR TIMELINE COMPARE & INCIDENT RE-ENACTMENT STUDIO
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                SYNCHRONIZED MULTI-AXIS STREAM
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Synchronized comparative timeline matching victim chat timestamps, bank wire transfers, and IP logins
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={handleTogglePlay}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/30 border border-indigo-400/40 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? 'PAUSE RE-ENACTMENT' : 'PLAY INCIDENT RE-ENACTMENT'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Axis Synchronized Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Stream 1: Chat Communications */}
        <div className="bg-[#090D16] border border-indigo-900/40 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-indigo-400 font-bold">
            <span>STREAM 1: CHAT & SOCIAL SOLICITATION</span>
            <span className="text-[10px] text-slate-500">WHATSAPP / TELEGRAM</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">09:14:02 UTC</span>
              <p className="text-white font-bold">Suspect @elena_vance_fx sent wire demand instruction</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">09:15:10 UTC</span>
              <p className="text-white font-bold">Victim sent bank confirmation screenshot</p>
            </div>
          </div>
        </div>

        {/* Stream 2: Wire Transfers & Crypto Deposits */}
        <div className="bg-[#090D16] border border-indigo-900/40 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-emerald-400 font-bold">
            <span>STREAM 2: BANK WIRE & CRYPTO TRANSACTIONS</span>
            <span className="text-[10px] text-slate-500">JPM / BINANCE</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">09:14:45 UTC</span>
              <p className="text-emerald-400 font-bold">$15,000 USD Wire Dispatched to Chase AC-884102941</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">09:16:30 UTC</span>
              <p className="text-cyan-300 font-bold">10 ETH Transferred to Binance Deposit AC 0x71C7656...</p>
            </div>
          </div>
        </div>

        {/* Stream 3: IP Telemetry & Device Logins */}
        <div className="bg-[#090D16] border border-indigo-900/40 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-amber-400 font-bold">
            <span>STREAM 3: IP TELEMETRY & AUTH LOGS</span>
            <span className="text-[10px] text-slate-500">FRANKFURT TOR EXIT</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">09:14:00 UTC</span>
              <p className="text-amber-300 font-bold">IP 185.220.101.42 (Tor Exit Node) authenticated session</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">09:16:33 UTC</span>
              <p className="text-red-400 font-bold">ANOMALY: Account takeover action in 3 seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
