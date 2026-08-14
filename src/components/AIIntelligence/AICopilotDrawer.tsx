import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Search,
  Scale,
  FileText,
  HelpCircle,
  Terminal,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { CrimeCase, CopilotMessage, ActiveTabType } from '../../types';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: CrimeCase;
  onNavigateTab: (tab: ActiveTabType) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentCase,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'AI',
      text: `Hello Investigator. I am your AI Digital Forensics Copilot. I have indexed ${currentCase.evidenceItems.length} exhibits for ${currentCase.caseNumber} ("${currentCase.title}"). How can I assist your investigation?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Generate AI Forensic Response
    setTimeout(() => {
      let aiText = '';
      let trigger: CopilotMessage['actionTrigger'] | undefined = undefined;

      const qLower = query.toLowerCase();

      if (qLower.includes('summarize') || qLower.includes('loss') || qLower.includes('overview')) {
        aiText = `📁 **Case Overview (${currentCase.caseNumber})**:
- **Victim:** ${currentCase.victimName} (${currentCase.victimLocation})
- **Total Financial Loss:** $${currentCase.totalLossUSD.toLocaleString()} USD
- **Scam Category:** ${currentCase.scamCategory}
- **Primary Suspect:** ${currentCase.suspects[0]?.nameAlias || 'Elena Vance'} (${currentCase.suspects[0]?.handle || '@elena_vance_fx'})
- **Key Fraud Vector:** Multi-hop Ethereum mixer transfers and WhatsApp romance solicitations.`;
        trigger = { type: 'NAVIGATE', target: 'vault' };
      } else if (qLower.includes('wallet') || qLower.includes('crypto') || qLower.includes('ethereum') || qLower.includes('mixer')) {
        aiText = `🔑 **Crypto Ledger & Wallet Analysis**:
Identified 1 High-Risk Un-hosted Ethereum Wallet:
- Address: \`0x71C7656EC7ab88b098defB751B7401B5f6d8976F\`
- Total Volume Laundering: 10 ETH ($42,500 USD)
- Originating Platform: Coinbase Pro Vault
- Recommended Action: Issue emergency freeze notice to Coinbase Compliance.`;
        trigger = { type: 'NAVIGATE', target: 'graph' };
      } else if (qLower.includes('subpoena') || qLower.includes('legal') || qLower.includes('whatsapp')) {
        aiText = `📜 **Automated Legal Subpoena Generation**:
I have generated a draft for **WhatsApp / Meta 18 U.S.C. § 2703(f) Emergency Preservation Demand** targeting phone line \`${currentCase.suspects[0]?.phone || '+1 (310) 555-0198'}\`. Click below to navigate to the Legal Directives Suite.`;
        trigger = { type: 'NAVIGATE', target: 'ai' };
      } else if (qLower.includes('timeline') || qLower.includes('chronology') || qLower.includes('play')) {
        aiText = `⏱️ **Chronological Master Timeline Analysis**:
Evidence spans from ${currentCase.incidentDate}. Exhibits are sorted with 100% SHA-256 chain of custody lock. You can play back the crime step-by-step in the Master Timeline view.`;
        trigger = { type: 'NAVIGATE', target: 'timeline' };
      } else {
        aiText = `🤖 **AI Forensic Analysis**:
Based on case exhibits for ${currentCase.caseNumber}:
- Suspect entities: ${currentCase.suspects.map(s => s.nameAlias).join(', ')}
- High risk exhibits: ${currentCase.evidenceItems.filter(e => e.riskScore >= 90).length} exhibits with 90+ threat severity score.
- Recommended directive: Request immediate IP connection log preservation from WhatsApp & Coinbase.`;
      }

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTrigger: trigger,
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-full max-w-md bg-[#090D16] border-l border-cyan-900/60 h-full flex flex-col justify-between shadow-2xl font-mono"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-[#0F172A] border-b border-cyan-900/50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    FORENSIC AI COPILOT
                    <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-1.5 py-0.2 rounded">
                      ONLINE
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Case: {currentCase.caseNumber}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Preset Prompts */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex space-x-2 overflow-x-auto text-[11px]">
              <button
                onClick={() => handleSendMessage('Summarize case financial loss & top suspects')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-900/60 rounded whitespace-nowrap"
              >
                🔍 Loss & Suspect Summary
              </button>
              <button
                onClick={() => handleSendMessage('Detect hidden Ethereum wallet mixers')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-900/60 rounded whitespace-nowrap"
              >
                ⚡ Crypto Wallet Tracing
              </button>
              <button
                onClick={() => handleSendMessage('Draft WhatsApp 18 U.S.C. § 2703(f) Subpoena')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-900/60 rounded whitespace-nowrap"
              >
                📜 Draft Subpoena
              </button>
            </div>

            {/* Message Log */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-1.5 ${
                    msg.sender === 'USER' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <span>{msg.sender === 'USER' ? 'Investigator' : 'AI Copilot'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'USER'
                        ? 'bg-cyan-950/60 border-cyan-800 text-cyan-100 rounded-tr-none'
                        : 'bg-slate-900 border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                    }`}
                  >
                    {msg.text}

                    {/* Interactive Action Button if returned */}
                    {msg.actionTrigger && (
                      <button
                        onClick={() => {
                          onNavigateTab(msg.actionTrigger!.target as ActiveTabType);
                          onClose();
                        }}
                        className="mt-3 w-full py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[11px] rounded flex items-center justify-center space-x-1 shadow"
                      >
                        <span>OPEN {msg.actionTrigger.target.toUpperCase()} VIEW</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask AI Copilot for forensic insights..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              />

              <button
                onClick={() => handleSendMessage()}
                className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md shadow-cyan-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
