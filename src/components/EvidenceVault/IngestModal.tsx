import React, { useState } from 'react';
import { Upload, X, ShieldAlert, Sparkles, CheckCircle2, MessageSquare, Mail, CreditCard, Mic, FileImage } from 'lucide-react';
import { EvidenceItem, EvidenceType } from '../../types';
import { calculateSHA256, generateExhibitNumber } from '../../utils/cryptoUtils';
import { extractEntitiesFromText } from '../../utils/entityExtractor';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCount: number;
  caseId: string;
  onAddEvidence: (item: EvidenceItem) => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({
  isOpen,
  onClose,
  existingCount,
  caseId,
  onAddEvidence,
}) => {
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('chat');
  const [title, setTitle] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successHash, setSuccessHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rawContent) return;

    setIsProcessing(true);

    // Compute SHA-256 hash asynchronously
    const hash = await calculateSHA256(rawContent);
    const exhibitNumber = generateExhibitNumber(existingCount);
    const extractedEntities = extractEntitiesFromText(rawContent);

    // Determine risk score based on keywords
    let risk = 75;
    if (rawContent.toLowerCase().includes('urgent') || rawContent.toLowerCase().includes('transfer') || rawContent.toLowerCase().includes('crypto') || rawContent.toLowerCase().includes('freeze')) {
      risk = 95;
    }

    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      exhibitNumber,
      caseId,
      title,
      type: evidenceType,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      sha256Hash: hash,
      sourceName: sourceName || `${evidenceType.toUpperCase()} Source`,
      rawContent,
      entities: extractedEntities,
      riskScore: risk,
      flaggedKeywords: extractedEntities.amounts.concat(extractedEntities.handles),
      metadata: evidenceType === 'audio' ? {
        audioDuration: '00:45',
        transcript: rawContent,
      } : undefined,
    };

    setTimeout(() => {
      onAddEvidence(newItem);
      setIsProcessing(false);
      setSuccessHash(hash);
      setTimeout(() => {
        setSuccessHash(null);
        setTitle('');
        setRawContent('');
        setSourceName('');
        onClose();
      }, 1200);
    }, 600);
  };

  const handleQuickPastePreset = (preset: 'whatsapp' | 'email' | 'crypto') => {
    if (preset === 'whatsapp') {
      setEvidenceType('chat');
      setTitle('WhatsApp Demands & Urgent Wire Solicitation');
      setSourceName('WhatsApp Chat Export (+1 415 555-0999)');
      setRawContent(`[2026-08-09 14:10] Unknown Handler: Urgent! Send $2,500 via Zelle immediately to mule account Wells Fargo AC 9920192831 or your crypto yield account will be liquidated! Telegram handle @fast_payout_support.`);
    } else if (preset === 'email') {
      setEvidenceType('email');
      setTitle('Spoofed Bank Suspension Phishing Notice');
      setSourceName('MIME Email (.eml)');
      setRawContent(`From: "Security Alert" <alert@secure-bank-verify.xyz>\nTo: victim@domain.com\nSubject: IMMEDIATE ACTION REQUIRED: Account Suspended\nX-Originating-IP: 198.51.100.42\n\nYour account has been flagged. Verify your identity at https://secure-bank-verify.xyz/login within 1 hour.`);
    } else if (preset === 'crypto') {
      setEvidenceType('transaction');
      setTitle('Tether USDT Mule Deposit Hash');
      setSourceName('TronScan Blockchain Ledger');
      setRawContent(`TX HASH: 7a8f902194829102948192049182904192840192840192840192840192840192\nSender Wallet: TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE\nRecipient Mule Wallet: TRX71c8920194829102948192049182\nAmount: 5,000 USDT ($5,000 USD)`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-cyan-500/50 rounded-xl max-w-2xl w-full p-6 font-mono space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              DIGITAL EVIDENCE INGESTION ENGINE
              <span className="text-xs text-cyan-400 font-normal">[{generateExhibitNumber(existingCount)}]</span>
            </h2>
            <p className="text-xs text-slate-400">Generates instant SHA-256 cryptographic hash & extracts entities</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Quick Forensic Templates:</span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickPastePreset('whatsapp')}
              className="bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2.5 py-1 rounded hover:bg-emerald-900/60 flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>+ WhatsApp Chat</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPastePreset('email')}
              className="bg-blue-950/60 border border-blue-800/60 text-blue-300 px-2.5 py-1 rounded hover:bg-blue-900/60 flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              <span>+ Phishing Email</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPastePreset('crypto')}
              className="bg-amber-950/60 border border-amber-800/60 text-amber-300 px-2.5 py-1 rounded hover:bg-amber-900/60 flex items-center gap-1"
            >
              <CreditCard className="w-3 h-3" />
              <span>+ Crypto Transfer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Source Type Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Evidence Source Type</label>
            <div className="grid grid-cols-5 gap-2">
              {(['chat', 'email', 'screenshot', 'transaction', 'audio'] as EvidenceType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEvidenceType(t)}
                  className={`p-2 rounded-lg border text-center capitalize font-semibold flex flex-col items-center gap-1 transition-all ${
                    evidenceType === t
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t === 'chat' && <MessageSquare className="w-4 h-4" />}
                  {t === 'email' && <Mail className="w-4 h-4" />}
                  {t === 'screenshot' && <FileImage className="w-4 h-4" />}
                  {t === 'transaction' && <CreditCard className="w-4 h-4" />}
                  {t === 'audio' && <Mic className="w-4 h-4" />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Exhibit Title / Description</label>
            <input
              type="text"
              required
              placeholder="e.g., Telegram Chat Transcript with Scammer HR"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Source Name */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Source Name / Platform</label>
            <input
              type="text"
              placeholder="e.g., WhatsApp Chat Export (+1 415 555-0198)"
              value={sourceName}
              onChange={e => setSourceName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Raw Content / Text Input */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Raw Evidence Content / OCR Text / Header Log</label>
            <textarea
              required
              rows={5}
              placeholder="Paste raw messages, email headers, bank transfer hashes, or transcript..."
              value={rawContent}
              onChange={e => setRawContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
            ></textarea>
          </div>

          {/* Hashing Status Banner */}
          {successHash ? (
            <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-3 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>SHA-256 GENERATED & EXHIBIT INGESTED!</span>
              </span>
              <span className="text-[10px]">{successHash.slice(0, 16)}...</span>
            </div>
          ) : (
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>COMPUTING SHA-256...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>PROCESS & LOCK EVIDENCE</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
