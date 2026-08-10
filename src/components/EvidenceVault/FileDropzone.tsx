import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, FileCode } from 'lucide-react';
import { EvidenceItem, EvidenceType } from '../../types';
import { calculateSHA256, generateExhibitNumber } from '../../utils/cryptoUtils';
import { extractEntitiesFromText } from '../../utils/entityExtractor';

interface FileDropzoneProps {
  onIngestFiles: (items: EvidenceItem[]) => void;
  existingCount: number;
  caseId: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onIngestFiles,
  existingCount,
  caseId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFileList = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const newItems: EvidenceItem[] = [];
    let count = existingCount;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      count++;
      const textContent = await readFileAsText(file);

      // Determine evidence type based on file ext/mime
      let type: EvidenceType = 'chat';
      const fileNameLower = file.name.toLowerCase();
      if (fileNameLower.endsWith('.eml') || fileNameLower.includes('email') || fileNameLower.includes('mail')) {
        type = 'email';
      } else if (fileNameLower.includes('trans') || fileNameLower.includes('bank') || fileNameLower.includes('statement') || fileNameLower.includes('csv')) {
        type = 'transaction';
      } else if (fileNameLower.endsWith('.mp3') || fileNameLower.endsWith('.wav') || fileNameLower.endsWith('.m4a') || fileNameLower.includes('audio') || fileNameLower.includes('call')) {
        type = 'audio';
      } else if (fileNameLower.endsWith('.png') || fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg') || fileNameLower.includes('ocr') || fileNameLower.includes('screenshot')) {
        type = 'screenshot';
      }

      const hash = await calculateSHA256(textContent || file.name + file.size + file.lastModified);
      const extracted = extractEntitiesFromText(textContent);

      const exhibitItem: EvidenceItem = {
        id: `ev-file-${Date.now()}-${i}`,
        exhibitNumber: generateExhibitNumber(count - 1),
        caseId,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        type,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        sha256Hash: hash,
        sourceName: `Uploaded File (${file.name})`,
        rawContent: textContent || `Raw binary artifact file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        entities: extracted,
        riskScore: extracted.cryptoWallets.length > 0 || extracted.bankAccounts.length > 0 ? 95 : 80,
        flaggedKeywords: extracted.amounts.concat(extracted.handles),
        metadata: type === 'audio' ? {
          audioDuration: '00:30',
          transcript: textContent || 'Audio call recording file attached and indexed.',
        } : undefined,
      };

      newItems.push(exhibitItem);
    }

    onIngestFiles(newItems);
    setIsProcessing(false);
    setProcessedCount(newItems.length);
    setTimeout(() => setProcessedCount(null), 3000);
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve((e.target?.result as string) || '');
      };
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFileList(e.target.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer font-mono transition-all relative overflow-hidden ${
        isDragging
          ? 'border-cyan-400 bg-cyan-950/40 shadow-xl shadow-cyan-500/20 scale-[1.01]'
          : 'border-slate-800 hover:border-cyan-500/60 bg-[#0B0F19]/90 hover:bg-slate-900/80'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        accept=".txt,.json,.eml,.csv,.log,.png,.jpg,.jpeg,.mp3,.wav,.m4a"
      />

      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
          {isProcessing ? (
            <Sparkles className="w-6 h-6 animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6 text-cyan-400" />
          )}
        </div>

        {processedCount !== null ? (
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>INGESTED & HASHED {processedCount} EXHIBIT FILE(S) SUCCESSFUL!</span>
          </div>
        ) : isProcessing ? (
          <div className="text-xs font-bold text-cyan-300">
            COMPUTING SHA-256 HASHES & EXTRACTING ENTITIES...
          </div>
        ) : (
          <>
            <h3 className="text-xs font-bold text-slate-200">
              DRAG & DROP EVIDENCE FILES HERE, OR <span className="text-cyan-400 underline">BROWSE</span>
            </h3>
            <p className="text-[11px] text-slate-400 max-w-md">
              Supports WhatsApp/Telegram exported chats (.txt), Phishing emails (.eml), Bank CSV statements, Screenshots, and Audio calls.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
