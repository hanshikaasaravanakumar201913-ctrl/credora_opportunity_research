import { prisma } from '../prisma.js';
import { SearchInputType } from '../types/index.js';
import { CompanyService } from './company.service.js';
import { MessageAnalysisService } from './messageAnalysis.service.js';

export class SearchService {
  public static detectInputType(query: string): SearchInputType {
    const text = query.trim();

    // Check if long message or forward
    if (text.length > 80 || /congratulations|selected for|registration fee|security deposit|stipend\s*of|whatsapp|telegram|interview\s*scheduled|pay\s*₹/i.test(text)) {
      return 'MESSAGE_TEXT';
    }

    // Check if URL
    if (/^https?:\/\/[^\s]+|www\.[^\s]+/i.test(text)) {
      if (/\/jobs?\/|\/careers?\/|\/internship\/|\/apply\/|\/opportunities\//i.test(text)) {
        return 'OPPORTUNITY_URL';
      }
      return 'WEBSITE_URL';
    }

    return 'COMPANY_NAME';
  }

  public static async executeUniversalSearch(query: string, userId?: string) {
    const inputType = this.detectInputType(query);
    const cleanQuery = query.trim();

    // Record search history if user is authenticated
    let historyId: string | null = null;
    if (userId) {
      const history = await prisma.searchHistory.create({
        data: {
          userId,
          searchQuery: cleanQuery.slice(0, 150),
          inputType,
          targetType: inputType === 'MESSAGE_TEXT' ? 'MESSAGE' : 'COMPANY'
        }
      });
      historyId = history.id;
    }

    if (inputType === 'MESSAGE_TEXT') {
      const analysis = await MessageAnalysisService.analyzeAndSaveMessage(cleanQuery, userId);
      return {
        inputType,
        targetType: 'MESSAGE',
        resultId: analysis.id,
        redirectUrl: `/analyze-message?id=${analysis.id}`,
        data: analysis
      };
    }

    if (inputType === 'WEBSITE_URL' || inputType === 'COMPANY_NAME') {
      let companyName = cleanQuery;
      let websiteUrl: string | undefined = undefined;

      if (inputType === 'WEBSITE_URL') {
        websiteUrl = cleanQuery.startsWith('http') ? cleanQuery : `https://${cleanQuery}`;
        const domain = cleanQuery.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
        companyName = domain.split('.')[0];
        companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
      }

      const company = await CompanyService.researchCompany(companyName, websiteUrl);

      return {
        inputType,
        targetType: 'COMPANY',
        resultId: company?.id,
        redirectUrl: `/company/${company?.slug || company?.id}`,
        data: company
      };
    }

    // Default to search opportunities and companies
    const company = await CompanyService.researchCompany(cleanQuery);
    return {
      inputType,
      targetType: 'COMPANY',
      resultId: company?.id,
      redirectUrl: `/company/${company?.slug || company?.id}`,
      data: company
    };
  }

  public static async getUserSearchHistory(userId: string) {
    return prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
