import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileImage,
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Hash,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';
import { EvidenceItem } from '../../types';
import { generateSha256, extractEntities } from '../../utils/entityExtractor';

interface ScreenshotOCRStudioProps {
  caseId: string;
  onIngest: (item: EvidenceItem) => void;
  onClose: () => void;
}

const MOCK_OCR_SAMPLES = [
  {
    title: 'Coinbase ETH Deposit Vault Transaction Screenshot',
    confidence: 98.6,
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=60',
    rawText: `COINBASE PRO TRANSACTION RECEIPT
Date: 2026-07-28 16:42:10 UTC
Status: COMPLETED
Asset: ETH (Ethereum)
Amount Transferred: 10.0000 ETH ($42,500.00 USD)
Network Fee: 0.0042 ETH
Destination Wallet: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
Tx Hash: 0x8a91c3029f8b4e721a95018b32e18d6e94f210a56218d612e094f09a12849b2c
Memo/Tag: Vanguard Staking Node Tier 1
Support Contact: vip-stake@dex-vanguard-fx.top`,
    boxes: [
      { text: '10.0000 ETH ($42,500.00 USD)', type: 'amount' },
      { text: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', type: 'wallet' },
      { text: '0x8a91c3029f8b4e721a95018b32e18d6e94f210a56218d612e094f09a12849b2c', type: 'hash' },
      { text: 'vip-stake@dex-vanguard-fx.top', type: 'email' },
    ],
  },
  {
    title: 'Chase Mobile Wire Transfer Confirmation Screenshot',
    confidence: 96.2,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=60',
    rawText: `CHASE BANK WIRE TRANSFER CONFIRMATION
Confirmation #: W-98412059
Sender: Dr. Aris Thorne
Recipient Bank: Citibank N.A.
Recipient AC Name: Vanguard Escrow Holdings Ltd
Account Number: 984102948
Routing / SWIFT: CITIUS33XXX
Amount: $25,000.00 USD
Date: July 20, 2026
Instruction: Investment Deposit Ref @elena_vance_fx`,
    boxes: [
      { text: '$25,000.00 USD', type: 'amount' },
      { text: 'Account Number: 984102948', type: 'bank' },
      { text: 'Ref @elena_vance_fx', type: 'handle' },
    ],
  },
];

export const ScreenshotOCRStudio: React.FC<ScreenshotOCRStudioProps> = ({
  caseId,
  onIngest,
  onClose,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [rawText, setRawText] = useState<string>(MOCK_OCR_SAMPLES[0].rawText);
  const [exhibitTitle, setExhibitTitle] = useState<string>(MOCK_OCR_SAMPLES[0].title);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);

  const sample = MOCK_OCR_SAMPLES[selectedIdx];

  const handleSelectSample = (idx: number) => {
    setSelectedIdx(idx);
    setIsScanning(true);
    setScanProgress(0);

    let curr = 0;
    const interval = setInterval(() => {
      curr += 25;
      setScanProgress(curr);
      if (curr >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setRawText(MOCK_OCR_SAMPLES[idx].rawText);
        setExhibitTitle(MOCK_OCR_SAMPLES[idx].title);
      }
    }, 150);
  };

  const handleIngestScreenshot = () => {
    setIsIngesting(true);
    setTimeout(() => {
      const extracted = extractEntities(rawText);
      const sha256 = generateSha256(rawText + caseId + Date.now());

      const newExhibit: EvidenceItem = {
        id: `ev-ocr-${Date.now()}`,
        exhibitNumber: `EX-OCR-${Math.floor(100 + Math.random() * 900)}`,
        caseId,
        title: exhibitTitle || 'Forensic Screenshot OCR Exhibit',
        type: 'screenshot',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        sha256Hash: sha256,
        sourceName: 'Forensic PNG Image Screenshot (.png)',
        rawContent: rawText,
        entities: extracted,
        riskScore: 92,
        flaggedKeywords: ['OCR Text Extracted', 'Transaction Receipt', 'Wallet Address'],
        metadata: {
          ocrConfidence: sample.confidence,
          imageUrl: sample.imageUrl,
        },
      };

      onIngest(newExhibit);
      setIsIngesting(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#090D16] border border-purple-900/60 rounded-xl p-5 shadow-2xl space-y-6 text-xs font-mono text-slate-200"
    >
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
            <Scan className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              SCREENSHOT & DOCUMENT FORENSIC OCR EXTRACTOR
              <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] px-2 py-0.5 rounded font-mono">
                NEURAL VISION ENGINE
              </span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Extract un-selectable screenshot text, wallet addresses, and bank receipts with bounding-box OCR
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          Close Studio
        </button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <label className="text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Select Pre-Loaded Evidence Screenshot:</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOCK_OCR_SAMPLES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedIdx === idx
                  ? 'bg-purple-950/30 border-purple-500 text-purple-200 shadow-lg shadow-purple-950/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white text-xs truncate">{s.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>OCR Accuracy: {s.confidence}%</span>
                <span className="text-purple-400 font-bold">{s.boxes.length} Extracted Entities</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scanner Visualizer & Image Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Image with Scanning Laser Effect */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-purple-400" />
              <span>Screenshot Preview & Bounding Box Layer</span>
            </span>
            <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] px-2 py-0.5 rounded font-bold">
              Confidence: {sample.confidence}%
            </span>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
            <img
              src={sample.imageUrl}
              alt="Screenshot Preview"
              className="w-full h-full object-cover opacity-80"
            />

            {/* Scanning Laser Beam */}
            {isScanning && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute left-0 right-0 h-1 bg-purple-400 shadow-[0_0_15px_#c084fc] z-20 pointer-events-none"
              />
            )}

            {/* Bounding Box Highlights */}
            {!isScanning && (
              <div className="absolute inset-0 p-4 flex flex-col justify-around pointer-events-none">
                {sample.boxes.map((box, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-purple-400/80 bg-purple-500/20 rounded px-2 py-1 text-[10px] text-white font-mono shadow-lg backdrop-blur-xs self-start"
                  >
                    🔍 {box.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress bar during scan */}
          {isScanning && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-purple-300 font-bold">
                <span>Running Tesseract OCR Neural Scan...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-150"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: OCR Text Result & Entities */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-purple-400 font-bold uppercase tracking-wider block">
              Extracted OCR Text Content:
            </label>
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              rows={8}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-500/60 leading-relaxed resize-none"
            />
          </div>

          {/* Key Bounding Box Entities Badge List */}
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[11px] font-bold">Identified Optical Text Entities:</span>
            <div className="flex flex-wrap gap-1.5">
              {sample.boxes.map((b, i) => (
                <span
                  key={i}
                  className="bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] px-2 py-0.5 rounded font-mono"
                >
                  {b.type.toUpperCase()}: {b.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ingest Action Button */}
      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleIngestScreenshot}
          disabled={isIngesting || isScanning}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-purple-600/30 border border-purple-400/40 flex items-center space-x-2 transition-all active:scale-95"
        >
          {isIngesting ? (
            <span>COMPUTING SHA-256 & INGESTING...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>INGEST OCR SCREENSHOT EXHIBIT INTO VAULT</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
