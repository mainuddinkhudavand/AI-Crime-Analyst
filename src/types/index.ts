export type EvidenceType = 'chat' | 'email' | 'screenshot' | 'transaction' | 'audio';

export type ActiveTabType =
  | 'vault'
  | 'timeline'
  | 'graph'
  | 'ai'
  | 'agent'
  | 'osint'
  | 'analytics'
  | 'taskforce'
  | 'rules'
  | 'prosecution'
  | 'deepfake'
  | 'threats'
  | 'seizure'
  | 'safety'
  | 'reenactment'
  | 'warrants'
  | 'redaction'
  | 'mlat'
  | 'defiaudit'
  | 'command'
  | 'radar'
  | 'tamper'
  | 'cases'
  | 'report';

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

export interface IPTelemetryNode {
  ip: string;
  country: string;
  city: string;
  isp: string;
  threatType: 'TOR_EXIT_NODE' | 'VPN_PROXY' | 'MALICIOUS_C2' | 'RESIDENTIAL_ISP';
  latitude: number;
  longitude: number;
  associatedExhibits: string[];
  riskScore: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  actionTrigger?: {
    type: 'NAVIGATE' | 'HIGHLIGHT_EXHIBIT' | 'GENERATE_SUBPOENA';
    target: string;
  };
}

export interface TaskforceAgency {
  id: string;
  agencyName: string;
  agencyAbbr: string;
  jurisdiction: string;
  contactOfficer: string;
  clearanceLevel: 'LAW_ENFORCEMENT_SENSITIVE' | 'TOP_SECRET_CYBER' | 'UNCLASSIFIED';
  activeDispatchesCount: number;
  status: 'ONLINE' | 'STANDBY';
}

export interface CustomThreatRule {
  id: string;
  ruleName: string;
  targetField: 'content' | 'amount' | 'email_header' | 'crypto_address';
  conditionType: 'CONTAINS' | 'GREATER_THAN' | 'HEADER_FAIL';
  triggerValue: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  isEnabled: boolean;
}

export interface LegalWarrantTemplate {
  id: string;
  providerName: string;
  statutoryAuthority: string;
  requiredTarget: string;
  scope: string;
  jurisdictionCourt: string;
}

export interface PIIRedactionRule {
  id: string;
  piiType: 'SSN' | 'CREDIT_CARD' | 'ADDRESS' | 'PHONE' | 'EMAIL';
  patternName: string;
  matchesCount: number;
  isRedacted: boolean;
}

export interface MLATRequestTemplate {
  id: string;
  targetCountry: string;
  treatyName: string;
  diplomaticChannel: string;
  extraditionStatus: string;
}

export interface SmartContractAuditResult {
  id: string;
  contractAddress: string;
  blockchain: string;
  contractName: string;
  vulnerabilityType: string;
  riskScore: number;
  isLiquidityDrained: boolean;
}

export interface GlobalThreatIncident {
  id: string;
  syndicateName: string;
  threatCategory: string;
  originCountry: string;
  activeWalletOrHandle: string;
  estimatedStolenCapitalUSD: number;
  threatLevel: 'CRITICAL' | 'HIGH';
  discoveredDate: string;
}

export interface AssetSeizureNode {
  id: string;
  assetType: 'CRYPTO_WALLET' | 'FIAT_BANK' | 'OFFSHORE_SHELL';
  identifier: string;
  institution: string;
  amountUSD: number;
  freezeStatus: 'FROZEN' | 'PENDING_WARRANT' | 'IN_TRANSIT';
  recoveryProbability: number;
}

export interface VictimSafetyCheckItem {
  id: string;
  category: 'CREDIT_FREEZE' | 'TOKEN_REVOCATION' | 'SIM_PROTECTION' | 'IC3_FILING';
  title: string;
  description: string;
  isCompleted: boolean;
  priority: 'URGENT' | 'HIGH' | 'RECOMMENDED';
}

export interface AgentPlaybookStep {
  id: string;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  logOutput: string;
  discoveredEntities?: ExtractedEntities;
}

export interface OSINTTarget {
  id: string;
  domainOrHandle: string;
  targetType: 'DOMAIN' | 'TELEGRAM_CHANNEL' | 'DARKWEB_FORUM';
  registrarOrHost: string;
  sslFingerprint: string;
  creationDate: string;
  privacyStatus: string;
  associatedThreatActors: string[];
  riskScore: number;
}

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
  ipNodes?: IPTelemetryNode[];
}
