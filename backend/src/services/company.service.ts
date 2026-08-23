import { prisma } from '../prisma.js';
import { ResearchPipelineService } from './researchPipeline.service.js';

export class CompanyService {
  public static async getCompanyById(idOrSlug: string) {
    const company = await prisma.company.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }]
      },
      include: {
        opportunities: true,
        contacts: true,
        sources: true,
        credibilityReports: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return company;
  }

  public static async researchCompany(name: string, websiteUrl?: string) {
    const cleanName = name.trim();
    const result = await ResearchPipelineService.executeResearch(cleanName);
    return result.company;
  }

  public static async listCompanies() {
    return prisma.company.findMany({
      include: {
        opportunities: true,
        sources: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }
}
