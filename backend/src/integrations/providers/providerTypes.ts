export type SourceHierarchyType = 'PRIMARY' | 'SECONDARY' | 'USER_PROVIDED';
export type VerificationConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type EntityVerificationStatus = 'STRONGLY_SUPPORTED' | 'LIMITED_EVIDENCE' | 'UNVERIFIED' | 'CONFLICTING';

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

export interface EntityMatchSignal {
  nameSimilarity: 'HIGH' | 'MEDIUM' | 'LOW';
  domainRelevance: 'HIGH' | 'MEDIUM' | 'NONE';
  locationMatch: 'HIGH' | 'MEDIUM' | 'UNKNOWN';
  industryMatch: 'HIGH' | 'MEDIUM' | 'UNKNOWN';
  score: number;
  explanation: string;
}

export interface FactProvenance {
  attributeKey: string;
  attributeValue: string;
  sourceName: string;
  sourceType: SourceHierarchyType;
  sourceUrl?: string;
  confidence: VerificationConfidence;
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

export interface SearchProvider {
  name: string;
  searchEntities(query: string): Promise<DiscoveredEntityCandidate[]>;
}

export interface CompanyRegistryProvider {
  name: string;
  fetchEntityDetails(entityNameOrId: string, domainHint?: string): Promise<Partial<DiscoveredEntityCandidate> | null>;
}

export interface DomainProvider {
  name: string;
  auditDomain(domain: string): Promise<{
    isActive: boolean;
    hasTls: boolean;
    ipAddresses: string[];
    domainAgeYears?: number;
    nameservers?: string[];
  }>;
}

export interface LogoProvider {
  name: string;
  resolveLogo(domain?: string, companyName?: string): string | null;
}
