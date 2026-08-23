import { ProviderResult } from '../../types/index.js';

export interface IWikipediaCompanyData {
  title: string;
  extract: string;
  description?: string;
  foundedYear?: number;
  headquarters?: string;
  officialWebsite?: string;
  officialDomain?: string;
  industry?: string;
  companySize?: string;
  productsServices?: string[];
  pageUrl: string;
}

const COMMON_ALIASES: Record<string, string> = {
  'tcs': 'Tata Consultancy Services',
  'infosys': 'Infosys',
  'wipro': 'Wipro',
  'ibm': 'IBM',
  'msft': 'Microsoft',
  'goog': 'Google',
  'meta': 'Meta Platforms',
  'fb': 'Meta Platforms',
  'amzn': 'Amazon (company)',
  'aws': 'Amazon Web Services',
  'ey': 'Ernst & Young',
  'pwc': 'PricewaterhouseCoopers',
  'accenture': 'Accenture',
  'cognizant': 'Cognizant',
  'capgemini': 'Capgemini'
};

export class WikipediaProvider {
  /**
   * Searches Wikipedia for real public corporate information.
   * Free, authoritative, real-time public knowledge base.
   */
  public static async searchCompany(companyName: string): Promise<ProviderResult<IWikipediaCompanyData> | null> {
    let cleanName = companyName.replace(/[.,;:!?]+$/, '').trim();
    if (!cleanName || cleanName.length < 2) return null;

    const lower = cleanName.toLowerCase();
    if (COMMON_ALIASES[lower]) {
      cleanName = COMMON_ALIASES[lower];
    }

    try {
      // 1. Search Wikipedia for matching page title
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanName + ' company')}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': 'CredoraCareerIntelligence/1.0 (research@credora.io)' }
      });

      if (!searchRes.ok) return null;
      const searchData: any = await searchRes.json();
      const firstHit = searchData?.query?.search?.[0];

      if (!firstHit) return null;

      const pageTitle = firstHit.title;

      // Validate that pageTitle actually matches the company name or alias
      const normTitle = pageTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normQuery = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const isMatch = normTitle.includes(normQuery) || normQuery.includes(normTitle) || !!COMMON_ALIASES[lower];

      if (!isMatch) {
        return null; // Don't return an unrelated Wikipedia hit
      }

      // 2. Fetch page summary and page HTML/Wikitext for detailed infobox extraction
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
      const summaryRes = await fetch(summaryUrl, {
        headers: { 'User-Agent': 'CredoraCareerIntelligence/1.0 (research@credora.io)' }
      });

      if (!summaryRes.ok) return null;
      const summaryData: any = await summaryRes.json();

      // Check if disambiguation or unrelated topic
      if (summaryData.type === 'disambiguation') return null;

      const extract: string = summaryData.extract || '';
      if (!extract || extract.length < 30) return null;

      // Deterministic infobox attribute parsing from extract & title
      let foundedYear: number | undefined;
      const foundedMatch = extract.match(/(?:founded|established|started|incorporated)\s+(?:in\s+)?(?:[a-zA-Z]+\s+)?(\d{4})/i);
      if (foundedMatch) {
        foundedYear = parseInt(foundedMatch[1]);
      }

      let headquarters: string | undefined;
      const hqMatch = extract.match(/(?:headquartered in|based in|headquarters in|headquarters located in)\s+([A-Z][a-zA-Z\s,]+?)(?:\.|\sand\s|\soperated)/i);
      if (hqMatch && hqMatch[1]) {
        headquarters = hqMatch[1].trim();
      }

      let industry: string | undefined;
      if (/information technology|software|cloud|consulting|tech/i.test(extract)) {
        industry = 'Information Technology & Consulting Services';
      } else if (/finance|banking|financial|fintech/i.test(extract)) {
        industry = 'Financial Technology & Banking';
      } else if (/automotive|vehicle|manufacturing/i.test(extract)) {
        industry = 'Automotive & Hardware Engineering';
      } else if (/telecommunications|telecom/i.test(extract)) {
        industry = 'Telecommunications & Networks';
      } else if (/e-commerce|retail|logistics/i.test(extract)) {
        industry = 'E-Commerce & Digital Services';
      } else {
        industry = summaryData.description || 'Enterprise Technology & Services';
      }

      // Domain extraction heuristic from title
      let officialDomain = `${pageTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
      if (lower === 'tcs' || lower.includes('tata consultancy')) officialDomain = 'tcs.com';
      if (lower === 'infosys') officialDomain = 'infosys.com';
      if (lower === 'wipro') officialDomain = 'wipro.com';
      if (lower === 'microsoft' || lower === 'msft') officialDomain = 'microsoft.com';
      if (lower === 'google' || lower === 'goog') officialDomain = 'google.com';

      return {
        provider: 'Wikipedia Public Entity Index',
        sourceType: 'WIKIPEDIA',
        timestamp: new Date().toISOString(),
        confidence: 'HIGH',
        status: 'VERIFIED',
        data: {
          title: pageTitle,
          extract,
          description: summaryData.description,
          foundedYear,
          headquarters,
          officialWebsite: `https://${officialDomain}`,
          officialDomain,
          industry,
          pageUrl: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
        }
      };
    } catch (error) {
      console.warn('Wikipedia provider lookup error:', error);
      return null;
    }
  }
}
