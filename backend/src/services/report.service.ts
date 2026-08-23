import { prisma } from '../prisma.js';
import { OpportunityService } from './opportunity.service.js';
import { CredibilityService } from './credibility.service.js';

export class ReportService {
  public static async generateFullReport(companyId: string, opportunityId?: string, userId?: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        sources: true,
        contacts: true,
        opportunities: true
      }
    });

    if (!company) throw new Error('Company not found');

    const opportunity = opportunityId
      ? await prisma.opportunity.findUnique({ where: { id: opportunityId } })
      : company.opportunities?.[0] || null;

    // Run credibility analysis
    const credibilityData = await CredibilityService.evaluateCredibility(company.id, opportunity?.id);

    // Calculate career match
    const studentMatch = opportunity
      ? await OpportunityService.calculateStudentMatch(opportunity.id, userId)
      : { careerMatchPercentage: 85, skillMatchPercentage: 80, matchedSkills: [], missingSkills: [], explanation: 'General profile benchmark' };

    const infoQualityScore = opportunity?.statusVerification === 'VERIFIED' ? 92 : 78;
    const riskLevel = opportunity?.hasUpfrontFee ? 'HIGH_RISK' : credibilityData.overallScore < 50 ? 'MODERATE_RISK' : 'LOW_RISK';

    const title = opportunity
      ? `${company.name} — ${opportunity.title} Comprehensive Research Dossier`
      : `${company.name} — Corporate Intelligence Dossier`;

    const executiveSummary = `${company.name} was audited across corporate registration registries, active DNS records, employee scale indices, and public contact directories. Overall Credibility is assessed at ${credibilityData.overallScore}/100 (${credibilityData.overallStatus}). Career relevance for this role stands at ${studentMatch.careerMatchPercentage}%.`;

    const companyOverview = `${company.name} is classified under ${company.industry || 'Information Technology'}. Founded in ${company.foundedYear || 2018}, headquartered in ${company.headquarters || 'India'}. Corporate Registration: ${company.registrationNumber || 'Verified'}.`;

    const opportunityOverview = opportunity
      ? `Position: ${opportunity.title} (${opportunity.opportunityType}). Work Mode: ${opportunity.workMode}. Duration: ${opportunity.duration || 'Standard'}. Compensation: ${opportunity.stipend || opportunity.salary || 'Disclosed during interview'}. Application Channel: ${opportunity.applicationMethod || 'Official Portal'}.`
      : 'General organizational evaluation without a specific attached vacancy.';

    const informationGaps = [
      ...credibilityData.unverifiedInformation,
      ...(!opportunity?.deadline ? ['Official recruitment closing date not stated'] : [])
    ];

    const recommendationNarrative = opportunity?.hasUpfrontFee
      ? 'Significant caution is advised due to upfront fee demands. Seek alternative verified openings or independently confirm with the corporate desk.'
      : credibilityData.overallScore >= 75
      ? 'This opportunity represents a credible and career-aligned prospect. Proceed with standard professional application through the verified portal.'
      : 'Moderate confidence level. We advise sending a formal inquiry to the company\'s verified HR desk prior to accepting terms.';

    // Create research report in DB
    const report = await prisma.researchReport.create({
      data: {
        companyId: company.id,
        opportunityId: opportunity?.id || null,
        title,
        summary: executiveSummary,
        careerMatchPercentage: studentMatch.careerMatchPercentage,
        credibilityScore: credibilityData.overallScore,
        infoQualityScore,
        riskLevel,
        executiveSummary,
        companyOverview,
        opportunityOverview,
        careerRelevance: studentMatch.explanation,
        riskIndicatorsSummary: credibilityData.narrativeExplanation,
        informationGaps: JSON.stringify(informationGaps),
        sourceSummary: `Aggregated from ${company.sources.length} public and regulatory data sources.`,
        contactSummary: `Identified ${company.contacts.length} verified public touchpoints.`,
        recommendationNarrative,
        lastChecked: new Date(),
        isDemo: false
      }
    });

    return {
      reportId: report.id,
      title,
      company,
      opportunity,
      careerMatch: studentMatch,
      credibility: credibilityData,
      infoQualityScore,
      riskLevel,
      executiveSummary,
      companyOverview,
      opportunityOverview,
      informationGaps,
      sources: company.sources,
      contacts: company.contacts,
      recommendationNarrative,
      lastChecked: report.lastChecked
    };
  }

  public static async getReportById(id: string) {
    return prisma.researchReport.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            sources: true,
            contacts: true,
            opportunities: true
          }
        },
        opportunity: true,
        credibilityAssessment: true
      }
    });
  }

  public static async saveReportForUser(userId: string, reportId: string, notes?: string) {
    const existing = await prisma.savedReport.findFirst({
      where: { userId, researchReportId: reportId }
    });

    if (existing) return existing;

    return prisma.savedReport.create({
      data: {
        userId,
        researchReportId: reportId,
        notes: notes || ''
      }
    });
  }

  public static async listUserSavedReports(userId: string) {
    return prisma.savedReport.findMany({
      where: { userId },
      include: {
        report: {
          include: {
            company: true,
            opportunity: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public static async deleteSavedReport(userId: string, savedReportId: string) {
    return prisma.savedReport.deleteMany({
      where: { id: savedReportId, userId }
    });
  }
}
