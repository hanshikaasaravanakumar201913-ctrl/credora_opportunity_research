import { DiscoveredEntityCandidate, SearchProvider } from './providerTypes.js';
import { logoProvider } from './logoProvider.js';

export class EntitySearchProvider implements SearchProvider {
  public name = 'MultiSourceEntitySearchProvider';

  public async searchEntities(query: string): Promise<DiscoveredEntityCandidate[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery || cleanQuery.length < 2) return [];

    const candidates: DiscoveredEntityCandidate[] = [];
    const seenNames = new Set<string>();

    // 1. Query Wikipedia Opensearch API (Returns multiple matching corporate/entity articles)
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQuery)}&limit=6&namespace=0&format=json`;
      const res = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'Credora-Intelligence/2.0 (contact@credora.io)' },
      });

      if (res.ok) {
        const [searchTerm, titles, descriptions, links] = await res.json() as [string, string[], string[], string[]];
        for (let i = 0; i < titles.length; i++) {
          const title = titles[i];
          const desc = descriptions[i] || '';
          const link = links[i] || '';

          // Filter out generic disambiguation pages or obviously irrelevant pages if possible
          if (/may refer to:|disambiguation/i.test(desc)) continue;

          // Check if article or description suggests a company, corporation, startup, software, organization, or brand
          const isOrg = /company|corporation|firm|enterprise|subsidiary|software|platform|provider|startup|manufacturer|retailer|agency|conglomerate|business/i.test(desc) ||
            /inc\.|ltd\.|technologies|solutions|corp\.|holdings/i.test(title);

          const lowerName = title.toLowerCase();
          if (!seenNames.has(lowerName)) {
            seenNames.add(lowerName);

            // Infer domain heuristic from title if simple
            const domainCandidate = this.guessDomainFromName(title);

            candidates.push({
              name: title,
              legalName: title,
              slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
              officialDomain: domainCandidate || undefined,
              officialWebsite: domainCandidate ? `https://${domainCandidate}` : undefined,
              logoUrl: domainCandidate ? logoProvider.resolveLogo(domainCandidate) || undefined : undefined,
              description: desc || `Public entity record located on Wikipedia.`,
              sourceCount: 1,
              primarySources: ['Wikipedia Public Knowledge Registry'],
              entityMatchScore: 80, // Will be fine-tuned by EntityResolutionService
              matchReasoning: 'Public knowledge entity match',
              domainFound: !!domainCandidate,
              publicRecordsFound: true,
            });
          }
        }
      }
    } catch (err) {
      console.warn('[EntitySearchProvider] Wikipedia search error:', err);
    }

    // 2. Query DuckDuckGo Instant Answer API for startup / company domain lookup
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(ddgUrl, {
        headers: { 'User-Agent': 'Credora-Intelligence/2.0 (contact@credora.io)' },
      });

      if (res.ok) {
        const data = await res.json() as any;
        if (data.Heading && data.AbstractText) {
          const lowerName = data.Heading.toLowerCase();
          if (!seenNames.has(lowerName)) {
            seenNames.add(lowerName);

            const domain = this.extractDomainFromUrl(data.AbstractURL);
            candidates.push({
              name: data.Heading,
              legalName: data.Heading,
              slug: data.Heading.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              officialDomain: domain || undefined,
              officialWebsite: data.AbstractURL || (domain ? `https://${domain}` : undefined),
              logoUrl: domain ? logoProvider.resolveLogo(domain) || undefined : undefined,
              description: data.AbstractText,
              sourceCount: 1,
              primarySources: ['DuckDuckGo Knowledge Index'],
              entityMatchScore: 85,
              matchReasoning: 'Knowledge graph entity match',
              domainFound: !!domain,
              publicRecordsFound: true,
            });
          }
        }
      }
    } catch (err) {
      console.warn('[EntitySearchProvider] DDG search error:', err);
    }

    return candidates;
  }

  private guessDomainFromName(name: string): string | null {
    const clean = name.toLowerCase()
      .replace(/\s+(corporation|company|technologies|technology|solutions|inc|ltd|pvt|llc|holdings|group|labs|services)/gi, '')
      .replace(/[^a-z0-9]/g, '');
    if (clean.length >= 2 && clean.length <= 25) {
      return `${clean}.com`;
    }
    return null;
  }

  private extractDomainFromUrl(urlStr?: string): string | null {
    if (!urlStr) return null;
    try {
      const parsed = new URL(urlStr);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }
}

export const entitySearchProvider = new EntitySearchProvider();
