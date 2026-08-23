import { DiscoveredEntityCandidate, EntityMatchSignal } from '../integrations/providers/providerTypes.js';

export class EntityResolutionService {
  private static readonly COMMON_ALIASES: Record<string, string> = {
    'tcs': 'Tata Consultancy Services',
    'ibm': 'International Business Machines',
    'msft': 'Microsoft Corporation',
    'microsoft': 'Microsoft Corporation',
    'google': 'Google LLC',
    'infy': 'Infosys Limited',
    'infosys': 'Infosys Limited',
    'wipro': 'Wipro Limited',
    'meta': 'Meta Platforms',
    'fb': 'Meta Platforms',
    'facebook': 'Meta Platforms',
    'apple': 'Apple Inc.',
    'amazon': 'Amazon.com, Inc.',
    'aws': 'Amazon Web Services',
    'netflix': 'Netflix, Inc.',
    'accenture': 'Accenture plc',
    'cognizant': 'Cognizant Technology Solutions',
    'capgemini': 'Capgemini SE',
    'ey': 'Ernst & Young',
    'pwc': 'PricewaterhouseCoopers',
    'deloitte': 'Deloitte Touche Tohmatsu',
    'kpmg': 'KPMG International',
    'hcl': 'HCLTech',
    'hcltech': 'HCLTech',
    'oracle': 'Oracle Corporation',
    'salesforce': 'Salesforce, Inc.',
    'uber': 'Uber Technologies',
    'airbnb': 'Airbnb, Inc.',
    'stripe': 'Stripe, Inc.',
    'openai': 'OpenAI'
  };

  /**
   * Normalizes a query string by removing corporate noise suffixes
   */
  public static normalizeQuery(query: string): string {
    return query.trim().toLowerCase()
      .replace(/\s+(pvt\.?|private|ltd\.?|limited|inc\.?|incorporated|corp\.?|corporation|llc|co\.?|technologies|solutions|services|group|holdings)$/gi, '')
      .trim();
  }

  /**
   * Evaluates and scores an entity candidate against the user query
   */
  public static evaluateCandidateMatch(query: string, candidate: Partial<DiscoveredEntityCandidate>): EntityMatchSignal {
    const rawQuery = query.trim().toLowerCase();
    const cleanQuery = this.normalizeQuery(rawQuery);
    const candidateName = (candidate.name || '').toLowerCase();
    const cleanCandidateName = this.normalizeQuery(candidateName);
    const candidateLegalName = (candidate.legalName || '').toLowerCase();
    const candidateDomain = (candidate.officialDomain || '').toLowerCase();

    // 1. Alias Match Check
    const targetAlias = this.COMMON_ALIASES[rawQuery] || this.COMMON_ALIASES[cleanQuery];
    if (targetAlias && candidateName.includes(targetAlias.toLowerCase())) {
      return {
        nameSimilarity: 'HIGH',
        domainRelevance: candidateDomain ? 'HIGH' : 'MEDIUM',
        locationMatch: candidate.headquarters ? 'HIGH' : 'UNKNOWN',
        industryMatch: candidate.industry ? 'HIGH' : 'UNKNOWN',
        score: 99,
        explanation: 'Direct corporate abbreviation & alias match'
      };
    }

    // 2. Name Similarity Calculation
    let nameSimScore = 0;
    let nameSimLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

    if (candidateName === rawQuery || cleanCandidateName === cleanQuery) {
      nameSimScore = 60;
      nameSimLevel = 'HIGH';
    } else if (candidateName.startsWith(rawQuery) || candidateName.startsWith(cleanQuery)) {
      nameSimScore = 55;
      nameSimLevel = 'HIGH';
    } else if (candidateName.includes(cleanQuery) || cleanCandidateName.includes(cleanQuery)) {
      nameSimScore = 45;
      nameSimLevel = 'HIGH';
    } else if (candidateLegalName.includes(cleanQuery)) {
      nameSimScore = 40;
      nameSimLevel = 'MEDIUM';
    } else {
      const sim = this.calculateStringSimilarity(cleanQuery, cleanCandidateName);
      nameSimScore = Math.round(sim * 50);
      nameSimLevel = sim >= 0.7 ? 'HIGH' : sim >= 0.4 ? 'MEDIUM' : 'LOW';
    }

    // 3. Domain Relevance Calculation (0 - 25 pts)
    let domainScore = 0;
    let domainLevel: 'HIGH' | 'MEDIUM' | 'NONE' = 'NONE';
    if (candidateDomain) {
      const cleanDom = candidateDomain.replace(/\.[a-z]+$/, '');
      if (cleanDom === cleanQuery || cleanDom.includes(cleanQuery)) {
        domainScore = 25;
        domainLevel = 'HIGH';
      } else {
        domainScore = 15;
        domainLevel = 'MEDIUM';
      }
    }

    // 4. Location & Industry Signal (0 - 15 pts)
    let extraScore = 0;
    let locLevel: 'HIGH' | 'MEDIUM' | 'UNKNOWN' = 'UNKNOWN';
    let indLevel: 'HIGH' | 'MEDIUM' | 'UNKNOWN' = 'UNKNOWN';

    if (candidate.headquarters) {
      extraScore += 8;
      locLevel = 'HIGH';
    }
    if (candidate.industry) {
      extraScore += 7;
      indLevel = 'HIGH';
    }

    const totalScore = Math.min(100, Math.max(10, nameSimScore + domainScore + extraScore));

    const explanation = `Name similarity: ${nameSimLevel} · Domain relevance: ${domainLevel} · Location match: ${locLevel}`;

    return {
      nameSimilarity: nameSimLevel,
      domainRelevance: domainLevel,
      locationMatch: locLevel,
      industryMatch: indLevel,
      score: totalScore,
      explanation
    };
  }

  /**
   * Jaro-Winkler / Levenshtein similarity metric (0 to 1)
   */
  private static calculateStringSimilarity(s1: string, s2: string): number {
    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longerLength - editDistance) / longerLength;
  }

  private static levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}
