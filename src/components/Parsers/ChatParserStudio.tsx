import React, { useState } from 'react';
import { MessageSquare, UserCheck, ShieldAlert, Sparkles, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { extractEntitiesFromText } from '../../utils/entityExtractor';

export interface ParsedChatMessage {
  timestamp: string;
  sender: string;
  isSuspect: boolean;
  text: string;
  highRisk: boolean;
}

interface ChatParserStudioProps {
  onAddParsedChatExhibit: (title: string, rawContent: string, messages: ParsedChatMessage[]) => void;
}

export const ChatParserStudio: React.FC<ChatParserStudioProps> = ({ onAddParsedChatExhibit }) => {
  const [chatRawInput, setChatRawInput] = useState<string>(
    `[2026-08-11 10:15:20] Elena Vance: Hello Dr. Thorne! Have you checked our Vanguard DEX liquidity node today?
[2026-08-11 10:18:45] Dr. Aris Thorne: Yes, but my withdrawal button is disabled. It says account frozen.
[2026-08-11 10:20:10] Elena Vance: URGENT! You must transfer 5.5 ETH ($18,500) to unfreeze smart contract vault 0x71C7656EC7ab88b098defB751B7401B5f6d8976F before 18:00 UTC or funds auto-liquidate!`
  );
  const [parsedMessages, setParsedMessages] = useState<ParsedChatMessage[]>([]);
  const [exhibitTitle, setExhibitTitle] = useState<string>('Parsed WhatsApp Chat Logs - Urgent Demand');

  const handleParseChatLogs = () => {
    if (!chatRawInput) return;
    const lines = chatRawInput.split('\n');
    const messages: ParsedChatMessage[] = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      // Extract timestamp bracket [YYYY-MM-DD ...] or similar
      const timeMatch = line.match(/\[(.*?)\]/);
      const timestamp = timeMatch ? timeMatch[1] : new Date().toISOString().slice(0, 19);

      const contentAfterTime = timeMatch ? line.replace(timeMatch[0], '').trim() : line;
      const parts = contentAfterTime.split(':');

      let sender = 'Unknown Sender';
      let text = contentAfterTime;

      if (parts.length >= 2) {
        sender = parts[0].trim();
        text = parts.slice(1).join(':').trim();
      }

      const lower = text.toLowerCase();
      const highRisk =
        lower.includes('urgent') ||
        lower.includes('transfer') ||
        lower.includes('unfreeze') ||
        lower.includes('liquidate') ||
        lower.includes('0x') ||
        lower.includes('$') ||
        lower.includes('yield');

      const isSuspect = !sender.toLowerCase().includes('victim') && !sender.toLowerCase().includes('aris') && !sender.toLowerCase().includes('me');

      messages.push({
        timestamp,
        sender,
        isSuspect,
        text,
        highRisk,
      });
    });

    setParsedMessages(messages);
  };

  const handleIngestParsedExhibit = () => {
    if (parsedMessages.length === 0) handleParseChatLogs();
    onAddParsedChatExhibit(exhibitTitle, chatRawInput, parsedMessages);
    alert('Chat log parsed and ingested into Evidence Vault successfully!');
  };

  return (
    <div className="bg-[#0F172A] border border-emerald-900/60 rounded-xl p-5 font-mono space-y-4 shadow-xl">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            CHAT LOG PARSER STUDIO (WHATSAPP / TELEGRAM / SMS)
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded">
              AI DIALOGUE TAGGER
            </span>
          </h3>
          <p className="text-xs text-slate-400">Parses raw exports, tags sender roles, and flags coercion keywords</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Raw Text Input */}
        <div className="space-y-2">
          <label className="text-slate-300 font-bold block">Raw Chat Export Snippet</label>
          <textarea
            rows={7}
            value={chatRawInput}
            onChange={e => setChatRawInput(e.target.value)}
            placeholder="Paste exported WhatsApp or Telegram chat logs here..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs leading-relaxed"
          ></textarea>

          <div className="flex space-x-2">
            <button
              onClick={handleParseChatLogs}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>PARSE CHAT DIALOGUE</span>
            </button>

            {parsedMessages.length > 0 && (
              <button
                onClick={handleIngestParsedExhibit}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>LOCK TO VAULT</span>
              </button>
            )}
          </div>
        </div>

        {/* Parsed Dialogue Stream View */}
        <div className="space-y-2">
          <label className="text-slate-300 font-bold block">Parsed Telemetry Dialogue ({parsedMessages.length} Messages)</label>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-[220px] overflow-y-auto space-y-2">
            {parsedMessages.length > 0 ? (
              parsedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs leading-relaxed space-y-1 ${
                    msg.isSuspect
                      ? 'bg-red-950/30 border-red-900/50 text-red-200'
                      : 'bg-cyan-950/30 border-cyan-900/50 text-cyan-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="flex items-center gap-1">
                      {msg.isSuspect ? (
                        <ShieldAlert className="w-3 h-3 text-red-400" />
                      ) : (
                        <UserCheck className="w-3 h-3 text-cyan-400" />
                      )}
                      <span>{msg.sender}</span>
                      <span className="opacity-70 font-normal">({msg.isSuspect ? 'SUSPECT' : 'VICTIM'})</span>
                    </span>
                    <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="font-mono text-slate-100">{msg.text}</p>
                  {msg.highRisk && (
                    <span className="inline-block bg-red-950 text-red-400 border border-red-800 text-[9px] px-1.5 py-0.5 rounded font-bold">
                      COERCION / DEMAND FLAGGED
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-center py-8">
                Click "PARSE CHAT DIALOGUE" to extract structured messages and coercion flags.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
