import { ExtractedEntities } from '../types';

/**
 * AI Entity Extractor for Digital Forensics
 * Uses regex & pattern recognition to parse chats, emails, banking logs, and text.
 */
export function extractEntitiesFromText(text: string): ExtractedEntities {
  if (!text) {
    return {
      phones: [],
      emails: [],
      bankAccounts: [],
      cryptoWallets: [],
      ipAddresses: [],
      amounts: [],
      handles: [],
      urls: [],
    };
  }

  // Regex patterns for forensic indicators
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{10,13}/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const cryptoRegex = /\b(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59}|[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93})\b/g;
  const bankRegex = /\b(AC:\s*\d{8,16}|\b\d{9,16}\b|[a-zA-Z0-9._-]+@[a-zA-Z]{3,}\b)/g;
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const amountRegex = /(\$|\$|₹|€|£|USDT|ETH|BTC)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|\d+(\.\d+)?)/gi;
  const handleRegex = /@([a-zA-Z0-9_]{3,24})/g;
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

  const rawPhones = text.match(phoneRegex) || [];
  const rawEmails = text.match(emailRegex) || [];
  const rawCrypto = text.match(cryptoRegex) || [];
  const rawBank = text.match(bankRegex) || [];
  const rawIp = text.match(ipRegex) || [];
  const rawAmounts = text.match(amountRegex) || [];
  const rawHandles = text.match(handleRegex) || [];
  const rawUrls = text.match(urlRegex) || [];

  // Clean and deduplicate
  const phones = Array.from(new Set(rawPhones.map(p => p.trim())));
  const emails = Array.from(new Set(rawEmails.map(e => e.toLowerCase())));
  const cryptoWallets = Array.from(new Set(rawCrypto));
  const ipAddresses = Array.from(new Set(rawIp));
  const amounts = Array.from(new Set(rawAmounts));
  const handles = Array.from(new Set(rawHandles));
  const urls = Array.from(new Set(rawUrls));

  // Refine bank accounts to avoid matching generic numbers or phone numbers
  const bankAccounts = Array.from(
    new Set(
      rawBank.filter(b => {
        const isPhone = phones.some(p => p.includes(b));
        const isIp = ipAddresses.some(ip => ip.includes(b));
        return !isPhone && !isIp && b.length >= 8;
      })
    )
  );

  return {
    phones,
    emails,
    bankAccounts,
    cryptoWallets,
    ipAddresses,
    amounts,
    handles,
    urls,
  };
}

export function redactSensitivePII(text: string, active: boolean): string {
  if (!active || !text) return text;
  // Mask SSN / Aadhar / Personal credit cards / victim emails while keeping suspect handles visible
  let redacted = text;
  // Redact personal email addresses if tagged as victim
  redacted = redacted.replace(/\b([a-zA-Z0-9._%+-]{1,3})[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, '$1***@$2');
  // Redact 16-digit credit card numbers
  redacted = redacted.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '••••-••••-••••-████');
  // Redact SSN/ID numbers
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '███-██-████');
  return redacted;
}
