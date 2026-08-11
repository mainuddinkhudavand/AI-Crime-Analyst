import React, { useState } from 'react';
import { Mail, ShieldAlert, CheckCircle2, Globe, AlertTriangle, Sparkles, Terminal } from 'lucide-react';

export interface ParsedEmailAudit {
  from: string;
  to: string;
  subject: string;
  spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL';
  dkimStatus: 'PASS' | 'FAIL';
  originatingIp: string;
  phishingUrls: string[];
  isSpoofed: boolean;
}

interface EmailHeaderAnalyzerProps {
  onAddEmailExhibit: (title: string, rawMime: string, audit: ParsedEmailAudit) => void;
}

export const EmailHeaderAnalyzer: React.FC<EmailHeaderAnalyzerProps> = ({ onAddEmailExhibit }) => {
  const [rawEmailInput, setRawEmailInput] = useState<string>(
    `From: "Vanguard Compliance" <vip-stake@dex-vanguard-fx.top>
To: aris.thorne@medinst.org
Subject: URGENT: VIP Staking Pool Closing - 10 ETH Allocation
X-Originating-IP: 185.220.101.42
Authentication-Results: spf=fail (sender IP 185.220.101.42) dkim=fail

Dear Investor, Your VIP node allocation is reserved until 18:00 UTC. Transfer 10 ETH to smart contract deposit vault: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F`
  );

  const [emailAudit, setEmailAudit] = useState<ParsedEmailAudit | null>(null);

  const handleAnalyzeEmail = () => {
    if (!rawEmailInput) return;

    const fromMatch = rawEmailInput.match(/From:\s*(.*)/i);
    const toMatch = rawEmailInput.match(/To:\s*(.*)/i);
    const subjectMatch = rawEmailInput.match(/Subject:\s*(.*)/i);
    const ipMatch = rawEmailInput.match(/X-Originating-IP:\s*([0-9.]+)/i) || rawEmailInput.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
    const urlMatches = rawEmailInput.match(/https?:\/\/[^\s/$.?#].[^\s]*/gi) || [];

    const from = fromMatch ? fromMatch[1].trim() : 'Unknown Sender';
    const to = toMatch ? toMatch[1].trim() : 'Unknown Recipient';
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Phishing Solicit';
    const originatingIp = ipMatch ? ipMatch[1] : '185.220.101.42';

    const spfFail = rawEmailInput.toLowerCase().includes('spf=fail') || rawEmailInput.toLowerCase().includes('spf fail');
    const dkimFail = rawEmailInput.toLowerCase().includes('dkim=fail') || rawEmailInput.toLowerCase().includes('dkim fail');

    const audit: ParsedEmailAudit = {
      from,
      to,
      subject,
      spfStatus: spfFail ? 'FAIL' : 'PASS',
      dkimStatus: dkimFail ? 'FAIL' : 'PASS',
      originatingIp,
      phishingUrls: Array.from(new Set(urlMatches)),
      isSpoofed: spfFail || dkimFail,
    };

    setEmailAudit(audit);
  };

  const handleIngestEmail = () => {
    if (!emailAudit) handleAnalyzeEmail();
    if (emailAudit) {
      onAddEmailExhibit(`Phishing Email: ${emailAudit.subject}`, rawEmailInput, emailAudit);
      alert('Phishing Email Header exhibit locked to vault!');
    }
  };

  return (
    <div className="bg-[#0F172A] border border-blue-900/60 rounded-xl p-5 font-mono space-y-4 shadow-xl">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            MIME EMAIL HEADER FORENSIC ANALYZER
            <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] px-2 py-0.5 rounded">
              SPF / DKIM INSPECTOR
            </span>
          </h3>
          <p className="text-xs text-slate-400">Inspects raw email headers, SPF/DKIM flags, originating IPs, and spoofed domains</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Raw Header Input */}
        <div className="space-y-2">
          <label className="text-slate-300 font-bold block">Raw MIME Email / Header Input</label>
          <textarea
            rows={7}
            value={rawEmailInput}
            onChange={e => setRawEmailInput(e.target.value)}
            placeholder="Paste raw email MIME content or headers..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs leading-relaxed"
          ></textarea>

          <div className="flex space-x-2">
            <button
              onClick={handleAnalyzeEmail}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>ANALYZE HEADERS</span>
            </button>

            {emailAudit && (
              <button
                onClick={handleIngestEmail}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>LOCK TO VAULT</span>
              </button>
            )}
          </div>
        </div>

        {/* Audit Results View */}
        <div className="space-y-2">
          <label className="text-slate-300 font-bold block">Forensic Header Telemetry Result</label>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 max-h-[220px] overflow-y-auto">
            {emailAudit ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Header Origin:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${emailAudit.isSpoofed ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-300'}`}>
                    {emailAudit.isSpoofed ? 'SPOOFED DOMAIN ORIGIN' : 'AUTHENTICATED'}
                  </span>
                </div>
                <div><strong className="text-slate-400">From:</strong> <span className="text-cyan-300">{emailAudit.from}</span></div>
                <div><strong className="text-slate-400">To:</strong> <span className="text-slate-200">{emailAudit.to}</span></div>
                <div><strong className="text-slate-400">Subject:</strong> <span className="text-slate-100">{emailAudit.subject}</span></div>
                <div><strong className="text-slate-400">Originating IP:</strong> <span className="text-amber-300">{emailAudit.originatingIp}</span></div>
                <div className="flex space-x-3 pt-1">
                  <span>SPF: <strong className={emailAudit.spfStatus === 'FAIL' ? 'text-red-400' : 'text-emerald-400'}>{emailAudit.spfStatus}</strong></span>
                  <span>DKIM: <strong className={emailAudit.dkimStatus === 'FAIL' ? 'text-red-400' : 'text-emerald-400'}>{emailAudit.dkimStatus}</strong></span>
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-center py-8">
                Click "ANALYZE HEADERS" to parse SPF/DKIM flags and originating IP address.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
