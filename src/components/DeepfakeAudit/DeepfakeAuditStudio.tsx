import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Image,
  Scan,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Zap,
  Activity,
} from 'lucide-react';
import { CrimeCase, EvidenceItem } from '../../types';

interface DeepfakeAuditStudioProps {
  currentCase: CrimeCase;
}

export const DeepfakeAuditStudio: React.FC<DeepfakeAuditStudioProps> = ({ currentCase }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);

  const audioExhibits = currentCase.evidenceItems.filter(e => e.type === 'audio');
  const screenshotExhibits = currentCase.evidenceItems.filter(e => e.type === 'screenshot');

  const handleRunDeepfakeAudit = () => {
    setIsScanning(true);
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-teal-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <Scan className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI DEEPFAKE & SYNTHETIC MEDIA FORENSIC AUTHENTICATOR
              <span className="bg-teal-950 text-teal-300 border border-teal-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                VOICE CLONE & OCR MANIPULATION DETECTOR
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Scans audio files and screenshots for AI synthetic generation artifacts, voice frequency anomalies, and EXIF tampering
            </p>
          </div>
        </div>

        <button
          onClick={handleRunDeepfakeAudit}
          disabled={isScanning}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-teal-600/30 border border-teal-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          <RotateCcw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? `SCANNING MEDIA (${scanProgress}%)` : 'RUN SYNTHETIC MEDIA DEEP SCAN'}</span>
        </button>
      </div>

      {/* Deepfake Audio Voice Clone Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#090D16] border border-teal-900/40 rounded-xl p-6 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-teal-400">
              <Mic className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AUDIO VOICE CLONE & SPECTRUM ANALYSIS</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold">NATURAL HUMAN VOICE (99.4%)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Voice Clone Probability:</span>
                <span className="text-emerald-400 font-bold">0.6% (Authentic Voice Recording)</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: '0.6%' }} />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">Frequency Spectrum Anomalies:</strong> None Detected (300Hz - 3400Hz Human Telephony Band)</div>
              <div><strong className="text-slate-300">Phase Continuity Score:</strong> 99.8% Consistent</div>
            </div>
          </div>
        </div>

        {/* Screenshot Image Tamper Inspector Card */}
        <div className="bg-[#0F172A] border border-teal-900/60 rounded-xl p-6 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Image className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">SCREENSHOT PIXEL NOISE & EXIF INSPECTOR</h3>
            </div>
            <span className="text-xs text-cyan-400 font-bold">EXIF UNMODIFIED</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Photoshop / Pixel Manipulation Score:</span>
                <span className="text-emerald-400 font-bold">1.2% (Original Device Screenshot)</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: '1.2%' }} />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">EXIF Device Model:</strong> Apple iPhone 14 Pro (iOS 17.4)</div>
              <div><strong className="text-slate-300">Error Level Analysis (ELA):</strong> Uniform Compression Grid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
