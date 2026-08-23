import { WikipediaProvider } from './providers/wikipediaProvider.js';
import { DNSDomainProvider } from './providers/dnsDomainProvider.js';
import { ProviderResult } from '../types/index.js';

export class ExternalDataAggregator {
  /**
   * Aggregates real public knowledge and network infrastructure evidence.
   * STRICT ZERO-FABRICATION: If an entity or domain is not found, returns null.
   */
  public static async gatherCompanyIntelligence(companyName: string, domainOrUrl?: string) {
    const cleanName = companyName.trim();
    if (!cleanName) return null;

    try {
      // 1. Query Wikipedia Entity Registry
      const wikiResult = await WikipediaProvider.searchCompany(cleanName);

      // Determine target domain to audit
      let targetDomain = domainOrUrl;
      if (!targetDomain && wikiResult?.data?.officialDomain) {
        targetDomain = wikiResult.data.officialDomain;
      }

      let dnsResult = targetDomain ? await DNSDomainProvider.auditDomain(targetDomain) : null;

      // If targetDomain wasn't provided or did not resolve, probe common enterprise domain extensions
      if (!dnsResult?.data?.hasActiveDNS) {
        const cleanBase = cleanName
          .toLowerCase()
          .replace(/\s+(corporation|company|technologies|technology|solutions|inc|ltd|pvt|llc|services|group|labs)/gi, '')
          .replace(/[^a-z0-9]/g, '');

        if (cleanBase.length >= 2) {
          const tlds = ['.com', '.co.in', '.in', '.io', '.tech', '.org', '.net', '.ai'];
          for (const tld of tlds) {
            const candidateDomain = `${cleanBase}${tld}`;
            const candidateDns = await DNSDomainProvider.auditDomain(candidateDomain);
            if (candidateDns?.data?.hasActiveDNS) {
              targetDomain = candidateDomain;
              dnsResult = candidateDns;
              break;
            }
          }
        }
      }

      return {
        wikipedia: wikiResult,
        dns: dnsResult,
        hasEvidence: !!wikiResult || !!(dnsResult?.data?.hasActiveDNS)
      };
    } catch (err) {
      console.error('Error in ExternalDataAggregator:', err);
      return null;
    }
  }
}
