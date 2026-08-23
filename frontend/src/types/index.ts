export type Role = 'STUDENT' | 'ADMIN';
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE' | 'ANY';
export type OpportunityType = 'INTERNSHIP' | 'FULL_TIME_JOB' | 'ONLINE_COURSE' | 'TRAINING_PROGRAM';
export type SearchInputType = 'COMPANY_NAME' | 'WEBSITE_URL' | 'OPPORTUNITY_URL' | 'MESSAGE_TEXT';
export type RiskLevel = 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'INSUFFICIENT_INFORMATION';
export type VerificationStatus = 'VERIFIED' | 'POSSIBLY_OUTDATED' | 'INCOMPLETE' | 'CONFLICTING' | 'NOT_VERIFIED';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ThemeMode = 'DARK' | 'LIGHT';
export type SourceHierarchyType = 'PRIMARY' | 'SECONDARY' | 'USER_PROVIDED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  profile?: CandidateProfile;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  education?: string;
  degree?: string;
  department?: string;
  college?: string;
  graduationYear?: number;
  skills: string; // JSON string array
  interests: string; // JSON string array
  careerGoal?: string;
  preferredRoles: string; // JSON string array
  preferredIndustries: string; // JSON string array
  preferredLocations: string; // JSON string array
  workMode: WorkMode;
  bio?: string;
  onboardingCompleted: boolean;
}

export interface DiscoveredEntityCandidate {
  id?: string;
  name: string;
  legalName?: string;
  slug: string;
  officialDomain?: string;
  officialWebsite?: string;
  logoUrl?: string;
  industry?: string;
  headquarters?: string;
  country?: string;
  foundedYear?: number;
  description?: string;
  sourceCount: number;
  primarySources: string[];
  entityMatchScore: number; // 0 - 100% (likelihood this is the intended entity)
  matchReasoning: string;
  domainFound: boolean;
  publicRecordsFound: boolean;
  isExistingRecord?: boolean;
}

export interface FactProvenance {
  attributeKey: string;
  attributeValue: string;
  sourceName: string;
  sourceType: SourceHierarchyType;
  sourceUrl?: string;
  confidence: ConfidenceLevel;
  lastChecked: string;
  status: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'CONFLICTING' | 'UNVERIFIED';
  notes?: string;
}

export interface ConflictRecord {
  attributeKey: string;
  description: string;
  sourceA: {
    sourceName: string;
    value: string;
    sourceType: SourceHierarchyType;
    url?: string;
  };
  sourceB: {
    sourceName: string;
    value: string;
    sourceType: SourceHierarchyType;
    url?: string;
  };
}

export interface ResearchCoverageResult {
  coveragePercentage: number; // e.g. 82%
  totalSourcesChecked: number;
  supportingSources: number;
  conflictingSources: number;
  unavailableSources: number;
  explanation: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  officialWebsite?: string;
  officialDomain?: string;
  logoUrl?: string;
  industry?: string;
  description?: string;
  foundedYear?: number;
  headquarters?: string;
  locations?: string; // JSON
  companySize?: string;
  registrationNumber?: string;
  registrationStatus?: string;
  businessType?: string;
  publicPresence?: string;
  productsServices?: string; // JSON
  socialProfiles?: string; // JSON
  ratingGlassdoor?: number;
  ratingAmbitionBox?: number;
  sslStatus?: string;
  domainAgeYears?: number;
  credibilityScore: number;
  isDemo?: boolean;
  opportunities?: Opportunity[];
  sources?: Source[];
  contacts?: Contact[];
}

export interface Opportunity {
  id: string;
  companyId: string;
  company?: Company;
  title: string;
  slug: string;
  opportunityType: OpportunityType;
  role?: string;
  description?: string;
  eligibility?: string;
  requiredSkills: string; // JSON
  preferredSkills?: string; // JSON
  duration?: string;
  location?: string;
  workMode: string;
  stipend?: string;
  salary?: string;
  fee?: string;
  hasUpfrontFee: boolean;
  deadline?: string;
  applicationUrl?: string;
  applicationMethod?: string;
  statusVerification: string;
  careerRelevanceScore: number;
  learningPotentialScore: number;
}

export interface Source {
  id: string;
  companyId: string;
  sourceName: string;
  sourceType: string;
  sourceUrl?: string;
  attributeKey: string;
  attributeValue: string;
  confidenceLevel: string;
  verificationStatus: string;
  lastCheckedDate: string;
}

export interface Contact {
  id: string;
  companyId: string;
  contactType: string;
  contactValue: string;
  label?: string;
  sourceName?: string;
  verificationStatus: string;
}

export interface ExtractedMessageAttributes {
  id?: string;
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

export interface CredibilityEvaluationResult {
  overallScore: number;
  maxScore: number;
  riskLevel: RiskLevel;
  factors: CredibilityFactorBreakdown[];
  positiveSignals: string[];
  warningSignals: string[];
  unknownInformation: string[];
}

export interface ComparisonCandidate {
  opportunity: Opportunity;
  ranking?: number;
  suitabilityScore: number;
  careerFitScore: number;
  skillMatchScore: number;
  credibilityScore: number;
  learningScore: number;
  riskIndex: RiskLevel;
  infoQualityScore: number;
  pros: string[] | string;
  cons: string[] | string;
  fitExplanation: string;
}
