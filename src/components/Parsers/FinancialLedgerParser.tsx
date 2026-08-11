import React, { useState } from 'react';
import { CreditCard, DollarSign, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { extractEntitiesFromText } from '../../utils/entityExtractor';

export interface ParsedFinancialTx {
  txId: string;
  sender: string;
  receiver: string;
  amountUSD: number;
  currency: string;
  gateway: string;
}

interface FinancialLedgerParserProps {
  onAddFinancialExhibit: (title: string, rawContent: string, transactions: ParsedFinancialTx[], totalUSD: number) => void;
}

export const FinancialLedgerParser: React.FC<FinancialLedgerParserProps> = ({ onAddFinancialExhibit }) => {
  const [rawFinancialInput, setRawFinancialInput] = useState<string>(
    `BANK & BLOCKCHAIN TRANSACTION LEDGER AUDIT:
1. TX HASH: 0xa91b72e90141940a28f810293021e8471928374829101928304910293049233e
From: 0x3910A98F19283019283019283019283019283019 (Victim Coinbase)
To: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F (Mule Deposit Vault)
Value: 12.5 ETH ($42,500 USD)

2. Zelle Ref: ZEL-992014819
Sender: Sarah Jenkins (Chase Checking)
Receiver: Devon Miller (Wells Fargo AC 4491029481)
Amount: $3,800 USD`
  );

  const [parsedTxs, setParsedTxs] = useState<ParsedFinancialTx[]>([]);
  const [totalLossCalculated, setTotalLossCalculated] = useState<number>(0);

  const handleParseFinancials = () => {
    if (!rawFinancialInput) return;

    const entities = extractEntitiesFromText(rawFinancialInput);
    const txs: ParsedFinancialTx[] = [];
    let sumUSD = 0;

    // Search amounts in raw content
    entities.amounts.forEach((amtStr, idx) => {
      const numeric = parseFloat(amtStr.replace(/[^0-9.]/g, ''));
      if (!isNaN(numeric) && numeric > 0) {
        sumUSD += numeric;
        txs.push({
          txId: `TX-PARSED-${idx + 1}`,
          sender: 'Victim Account',
          receiver: entities.bankAccounts[idx] || entities.cryptoWallets[idx] || 'Mule Escrow',
          amountUSD: numeric,
          currency: amtStr.includes('ETH') ? 'ETH' : amtStr.includes('BTC') ? 'BTC' : 'USD',
          gateway: amtStr.includes('ETH') || amtStr.includes('0x') ? 'Ethereum Network' : 'Bank Wire / Zelle',
        });
      }
    });

    setParsedTxs(txs);
    setTotalLossCalculated(sumUSD);
  };

  const handleIngestFinancials = () => {
    if (parsedTxs.length === 0) handleParseFinancials();
    onAddFinancialExhibit('Parsed Financial & Crypto Audit Ledger', rawFinancialInput, parsedTxs, totalLossCalculated);
    alert('Parsed Financial Transaction exhibit locked to vault!');
  };

  return (
    <div className="bg-[#0F172A] border border-amber-900/60 rounded-xl p-5 font-mono space-y-4 shadow-xl">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            FINANCIAL & CRYPTO LEDGER PARSER
            <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-2 py-0.5 rounded">
              CURRENCY CONVERTER
            </span>
          </h3>
          <p className="text-xs text-slate-400">Parses Bank CSVs, UPI payment references, and Crypto wallet TX hashes with loss totalizer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-slate-300 font-bold block">Raw Financial Statements / Hash Logs</label>
          <textarea
            rows={7}
            value={rawFinancialInput}
            onChange={e => setRawFinancialInput(e.target.value)}
            placeholder="Paste bank transfer statement text, Zelle reference IDs, or crypto hashes..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs leading-relaxed"
          ></textarea>

          <div className="flex space-x-2">
            <button
              onClick={handleParseFinancials}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>PARSE LEDGER</span>
            </button>

            {parsedTxs.length > 0 && (
              <button
                onClick={handleIngestFinancials}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>LOCK TO VAULT</span>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2">
          <label className="text-slate-300 font-bold block">Parsed Ledger Summary ({parsedTxs.length} Transactions)</label>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 max-h-[220px] overflow-y-auto">
            {parsedTxs.length > 0 ? (
              <>
                <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-lg flex items-center justify-between font-bold text-amber-300">
                  <span>TOTAL DISBURSED LOSS:</span>
                  <span className="text-red-400 text-sm">${totalLossCalculated.toLocaleString()} USD</span>
                </div>
                {parsedTxs.map((tx, i) => (
                  <div key={i} className="bg-slate-900/60 p-2 rounded border border-slate-800 text-[11px] flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">{tx.gateway}</div>
                      <div className="text-slate-400">To: {tx.receiver}</div>
                    </div>
                    <div className="font-bold text-red-400">${tx.amountUSD.toLocaleString()}</div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-slate-500 text-center py-8">
                Click "PARSE LEDGER" to extract transaction amounts and currency values.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
