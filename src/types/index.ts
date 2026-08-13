export type EvidenceType = 'chat' | 'email' | 'screenshot' | 'transaction' | 'audio';

export interface ExtractedEntities {
  phones: string[];
  emails: string[];
  bankAccounts: string[];
  cryptoWallets: string[];
  ipAddresses: string[];
  amounts: string[];
  handles: string[];
  urls: string[];
}

export interface AudioDiarizationSegment {
  speaker: 'SUSPECT' | 'VICTIM' | 'VOICE_BOT' | 'UNKNOWN';
  timestamp: string;
  text: string;
  riskScore: number;
}

export interface OCRBoundingBox {
  id: string;
  text: string;
  confidence: number;
  type: 'wallet' | 'amount' | 'phone' | 'url' | 'text';
}

export interface EvidenceItem {
  id: string;
  exhibitNumber: string;
  caseId: string;
  title: string;
  type: EvidenceType;
  timestamp: string;
  sha256Hash: string;
  sourceName: string;
  rawContent: string;
  entities: ExtractedEntities;
  riskScore: number; // 1 to 100
  flaggedKeywords: string[];
  metadata?: {
    audioDuration?: string;
    audioUrl?: string;
    transcript?: string;
    diarizationSegments?: AudioDiarizationSegment[];
    ocrConfidence?: number;
    ocrBoxes?: OCRBoundingBox[];
    imageUrl?: string;
    emailHeaders?: {
      from: string;
      to: string;
      subject: string;
      spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL';
      dkimStatus: 'PASS' | 'FAIL';
      originatingIp: string;
    };
    transactionDetails?: {
      sender: string;
      receiver: string;
      paymentGateway: string;
      referenceId: string;
      currency: string;
      numericAmount: number;
    };
  };
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'victim' | 'suspect' | 'phone' | 'email' | 'bank' | 'crypto' | 'domain' | 'ip';
  subtitle?: string;
  riskLevel?: 'high' | 'critical' | 'medium' | 'low';
  details?: Record<string, string>;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type?: 'transfer' | 'communication' | 'hosted_on' | 'linked_to';
  amount?: string;
}

export interface AIPatternAlert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  category: string;
  description: string;
  evidenceRefs: string[]; // Exhibit numbers
  modusOperandi: string;
  recommendation: string;
}

export interface CrossCaseLinkage {
  id: string;
  entityValue: string;
  entityType: 'crypto' | 'phone' | 'email' | 'domain' | 'bank';
  matchedCaseIds: string[];
  matchedCaseTitles: string[];
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
}

export type SubpoenaType = 'whatsapp_preservation' | 'coinbase_freeze' | 'bank_hold' | 'isp_subscriber';

export interface CrimeCase {
  id: string;
  caseNumber: string;
  title: string;
  incidentDate: string;
  victimName: string;
  victimContact: string;
  victimLocation: string;
  totalLossUSD: number;
  scamCategory: 'Pig Butchering / Crypto Fraud' | 'WhatsApp Impersonation Wire Fraud' | 'Remote Job & Task Deposit Fraud' | 'Phishing Scam';
  status: 'UNDER_INVESTIGATION' | 'REPORT_GENERATED' | 'SUBMITTED_TO_AUTHORITIES';
  createdDate: string;
  summary: string;
  suspects: {
    nameAlias: string;
    handle: string;
    phone: string;
    role: string;
  }[];
  evidenceItems: EvidenceItem[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  aiAlerts: AIPatternAlert[];
  recommendedActions: string[];
  crossCaseMatches?: CrossCaseLinkage[];
}
