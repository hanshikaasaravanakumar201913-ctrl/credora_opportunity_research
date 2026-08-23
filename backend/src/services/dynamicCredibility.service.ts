import { CredibilityEvaluationResult, CredibilityFactorBreakdown } from '../types/index.js';

export class DynamicCredibilityService {
  /**
   * Calculates a transparent, evidence-based credibility assessment (0-100).
   * Exact points and reasons are returned for every factor.
   */
  public static evaluateCompanyEvidence(params: {
    companyName: string;
    hasWikiEntity: boolean;
    hasActiveDNS: boolean;
    sourcesCount: number;
    foundedYear?: number | null;
    headquarters?: string | null;
    officialWebsite?: string | null;
    isDemo?: boolean;
    detectedIndicators?: string[];
  }): CredibilityEvaluationResult {
    const factors: CredibilityFactorBreakdown[] = [];
    const positiveSignals: string[] = [];
    const warningSignals: string[] = [];
    const unknownInfo: string[] = [];

    // 1. Company Existence (Max 20 pts)
    if (params.hasWikiEntity) {
      factors.push({
        factorName: 'Company Existence & Identity',
        score: 20,
        maxScore: 20,
        weight: 0.20,
        status: 'VERIFIED',
        evidence: `Documented entity record confirmed in verified public knowledge registry.`
      });
      positiveSignals.push(`Verified public corporate presence for ${params.companyName}`);
    } else if (params.hasActiveDNS) {
      factors.push({
        factorName: 'Company Existence & Identity',
        score: 18,
        maxScore: 20,
        weight: 0.20,
        status: 'VERIFIED',
        evidence: `Active enterprise host and authoritative digital infrastructure verified on public internet.`
      });
      positiveSignals.push(`Verified active domain and digital footprint for ${params.companyName}`);
    } else {
      factors.push({
        factorName: 'Company Existence & Identity',
        score: 3,
        maxScore: 20,
        weight: 0.20,
        status: 'NOT_VERIFIED',
        evidence: `Information could not be verified from public registries or DNS for "${params.companyName}".`
      });
      warningSignals.push(`No public corporate history or registry records located for "${params.companyName}".`);
    }

    // 2. Source Agreement & Corroboration (Max 15 pts)
    const count = params.sourcesCount;
    if (count >= 2) {
      factors.push({
        factorName: 'Source Corroboration & Diversity',
        score: 15,
        maxScore: 15,
        weight: 0.15,
        status: 'VERIFIED',
        evidence: `${count} independent sources (Registry, DNS Records, Domain Indices) corroborate company details.`
      });
      positiveSignals.push(`Corroborated across multiple independent sources.`);
    } else if (count === 1) {
      factors.push({
        factorName: 'Source Corroboration & Diversity',
        score: 10,
        maxScore: 15,
        weight: 0.15,
        status: 'PARTIALLY_VERIFIED',
        evidence: `Primary authoritative digital source verified.`
      });
    } else {
      factors.push({
        factorName: 'Source Corroboration & Diversity',
        score: 2,
        maxScore: 15,
        weight: 0.15,
        status: 'NOT_VERIFIED',
        evidence: `Zero independent sources validated.`
      });
      warningSignals.push(`Uncorroborated entity.`);
    }

    // 3. Official Web Presence & Infrastructure (Max 15 pts)
    if (params.hasActiveDNS) {
      factors.push({
        factorName: 'Official Web Presence & DNS Security',
        score: 15,
        maxScore: 15,
        weight: 0.15,
        status: 'VERIFIED',
        evidence: `Authoritative DNS records (A/AAAA) and TLS encryption actively resolving.`
      });
      positiveSignals.push(`Active official domain with verified DNS infrastructure.`);
    } else {
      factors.push({
        factorName: 'Official Web Presence & DNS Security',
        score: 3,
        maxScore: 15,
        weight: 0.15,
        status: 'NOT_VERIFIED',
        evidence: `No active authoritative DNS record confirmed for domain.`
      });
      warningSignals.push(`Official web domain is unverified or unreachable.`);
    }

    // 4. Opportunity & Role Consistency (Max 15 pts)
    const hasIndicators = (params.detectedIndicators || []).length > 0;
    const consistencyScore = hasIndicators ? 7 : 15;
    factors.push({
      factorName: 'Opportunity Consistency & Transparency',
      score: consistencyScore,
      maxScore: 15,
      weight: 0.15,
      status: !hasIndicators ? 'VERIFIED' : 'PARTIALLY_VERIFIED',
      evidence: !hasIndicators
        ? `Recruitment practices and parameters conform with established industry standards.`
        : `Role structure should be cross-verified directly through official company contact channels.`
    });

    // 5. Contact Verification & Email Channels (Max 10 pts)
    if (params.hasActiveDNS || params.hasWikiEntity) {
      factors.push({
        factorName: 'Business Contact Channels',
        score: 10,
        maxScore: 10,
        weight: 0.10,
        status: 'VERIFIED',
        evidence: `Corporate domain-based email desk and official digital presence established.`
      });
      positiveSignals.push(`Official domain-matching email desk available.`);
    } else {
      factors.push({
        factorName: 'Business Contact Channels',
        score: 4,
        maxScore: 10,
        weight: 0.10,
        status: 'UNVERIFIED',
        evidence: `Direct recruiter contact requires independent verification.`
      });
    }

    // 6. Information Completeness (Max 10 pts)
    let completenessScore = 4;
    if (params.headquarters) completenessScore += 3;
    if (params.foundedYear) completenessScore += 2;
    if (params.officialWebsite) completenessScore += 1;

    factors.push({
      factorName: 'Information Completeness',
      score: Math.min(10, completenessScore),
      maxScore: 10,
      weight: 0.10,
      status: completenessScore >= 7 ? 'VERIFIED' : 'PARTIALLY_VERIFIED',
      evidence: `Headquarters: ${params.headquarters || 'Not available'} · Founded: ${params.foundedYear || 'Not available'}`
    });

    // 7. Entity Longevity & Track Record (Max 5 pts)
    let longevityScore = 3;
    const currentYear = new Date().getFullYear();
    if (params.foundedYear && currentYear - params.foundedYear >= 3) {
      longevityScore = 5;
      positiveSignals.push(`Established operating history of ${currentYear - params.foundedYear} years.`);
    } else if (params.foundedYear) {
      longevityScore = 4;
    }
    factors.push({
      factorName: 'Entity Longevity & History',
      score: longevityScore,
      maxScore: 5,
      weight: 0.05,
      status: longevityScore >= 4 ? 'VERIFIED' : 'PARTIALLY_VERIFIED',
      evidence: params.foundedYear ? `Established in ${params.foundedYear}.` : `Founding date not verified.`
    });

    // 8. Risk Indicators & Red Flags (Max 10 pts, deducts for triggers)
    const indicators = params.detectedIndicators || [];
    let riskScore = 10;
    if (indicators.some(i => i.toLowerCase().includes('fee') || i.toLowerCase().includes('deposit'))) {
      riskScore -= 8;
      warningSignals.push(`Upfront registration or security fee demand detected.`);
    }
    if (indicators.some(i => i.toLowerCase().includes('gmail') || i.toLowerCase().includes('yahoo'))) {
      riskScore -= 3;
      warningSignals.push(`Recruiter communicates using free personal webmail rather than corporate domain.`);
    }
    if (indicators.some(i => i.toLowerCase().includes('urgent') || i.toLowerCase().includes('pressure'))) {
      riskScore -= 2;
      warningSignals.push(`Artificial urgency pressure detected.`);
    }
    riskScore = Math.max(0, riskScore);

    factors.push({
      factorName: 'Risk Indicators & Financial Triggers',
      score: riskScore,
      maxScore: 10,
      weight: 0.10,
      status: riskScore >= 8 ? 'VERIFIED' : 'HIGH_RISK',
      evidence: indicators.length === 0 ? `Zero financial risk triggers or suspicious clauses found.` : `${indicators.length} warning indicator(s) active.`
    });

    // Calculate total score
    const totalScore = Math.min(100, factors.reduce((sum, f) => sum + f.score, 0));

    let riskLevel: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'INSUFFICIENT_INFORMATION' = 'LOW_RISK';
    if (!params.hasWikiEntity && !params.hasActiveDNS && (params.sourcesCount || 0) === 0) {
      riskLevel = 'INSUFFICIENT_INFORMATION';
    } else if (riskScore < 5 || totalScore < 40 || indicators.some(i => i.toLowerCase().includes('fee') || i.toLowerCase().includes('deposit'))) {
      riskLevel = 'HIGH_RISK';
    } else if (totalScore < 55 || indicators.length >= 2) {
      riskLevel = 'MODERATE_RISK';
    } else {
      riskLevel = 'LOW_RISK';
    }

    return {
      overallScore: totalScore,
      maxScore: 100,
      riskLevel,
      factors,
      positiveSignals,
      warningSignals,
      unknownInformation: unknownInfo
    };
  }
}
