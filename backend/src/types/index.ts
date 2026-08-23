export type Role = 'STUDENT' | 'ADMIN';
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE' | 'ANY';
export type OpportunityType = 'INTERNSHIP' | 'FULL_TIME_JOB' | 'ONLINE_COURSE' | 'TRAINING_PROGRAM';
export type SearchInputType = 'COMPANY_NAME' | 'WEBSITE_URL' | 'OPPORTUNITY_URL' | 'MESSAGE_TEXT';
export type RiskLevel = 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'INSUFFICIENT_INFORMATION';
export type VerificationStatus = 'VERIFIED' | 'POSSIBLY_OUTDATED' | 'INCOMPLETE' | 'CONFLICTING' | 'NOT_VERIFIED';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: UserPayload;
}

export interface ExtractedMessageAttributes {
  company: string | null;
  role: string | null;
  type: OpportunityType;
  salary: string | null;
  stipend: string | null;
  fee: string | null;
  hasUpfrontFee: boolean;
  duration: string | null;
  location: string | null;
  deadline: string | null;
  recruiterName: string | null;
  email: string | null;
  isFreeWebmail: boolean;
  phone: string | null;
  urls: string[];
  hasShortenedUrls: boolean;
  skills: string[];
  eligibility: string | null;
  detectedIndicators: string[];
  riskLevel: RiskLevel;
  riskScore: number;
  riskReasoning: string;
  positiveSignals: string[];
  recommendations: string[];
}

export interface CredibilityFactorBreakdown {
  factorName: string;
  score: number;
  maxScore: number;
  weight: number;
  status: VerificationStatus | 'HIGH_RISK' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED';
  evidence: string;
}

export interface CredibilityEvaluationResult {
  overallScore: number;
  maxScore: number;
  riskLevel: RiskLevel;
  factors: CredibilityFactorBreakdown[];
  positiveSignals: string[];
  warningSignals: string[];
  unknownInformation: string[];
}

export interface CredibilityDimensionScore {
  score: number;
  label: string;
  reason: string;
}

export interface CredibilityAnalysisResult {
  overallScore: number;
  overallStatus: string;
  dimensions: {
    companyExistence: CredibilityDimensionScore;
    websiteCredibility: CredibilityDimensionScore;
    companyHistory: CredibilityDimensionScore;
    publicPresence: CredibilityDimensionScore;
    contactVerification: CredibilityDimensionScore;
    opportunityConsistency: CredibilityDimensionScore;
    infoCompleteness: CredibilityDimensionScore;
    riskIndicators: CredibilityDimensionScore;
  };
  positiveSignals: string[];
  warningSignals: string[];
  unverifiedInformation: string[];
  conflictingInformation: string[];
  narrativeExplanation: string;
}

export interface ComparisonCandidate {
  opportunityId: string;
  suitabilityScore: number;
  careerFitScore: number;
  skillMatchScore: number;
  credibilityScore: number;
  learningScore: number;
  riskIndex: RiskLevel;
  infoQualityScore: number;
  pros: string[];
  cons: string[];
  fitExplanation: string;
}

export interface ProviderResult<T> {
  provider: string;
  sourceType: string;
  timestamp: string;
  confidence: ConfidenceLevel;
  data: T | null;
  status: VerificationStatus;
  notes?: string;
}
