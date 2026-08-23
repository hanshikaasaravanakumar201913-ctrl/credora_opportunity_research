import { prisma } from '../prisma.js';
import { OpportunityService } from './opportunity.service.js';

export class RecommendationService {
  public static async getPersonalizedRecommendations(userId: string) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });

    const allOpportunities = await prisma.opportunity.findMany({
      include: {
        company: true
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    const studentSkills: string[] = profile?.skills ? JSON.parse(profile.skills) : ['Python', 'React', 'SQL'];
    const preferredRoles: string[] = profile?.preferredRoles ? JSON.parse(profile.preferredRoles) : [];

    const scored = await Promise.all(
      allOpportunities.map(async (opp) => {
        const matchData = await OpportunityService.calculateStudentMatch(opp.id, userId);
        const requiredSkills: string[] = JSON.parse(opp.requiredSkills || '[]');

        // Check role overlap
        const roleMatches = preferredRoles.some(role =>
          opp.title.toLowerCase().includes(role.toLowerCase()) ||
          (opp.role && opp.role.toLowerCase().includes(role.toLowerCase()))
        );

        let finalScore = matchData.careerMatchPercentage;
        if (roleMatches) finalScore = Math.min(100, finalScore + 10);
        if (opp.company.credibilityScore >= 80) finalScore = Math.min(100, finalScore + 5);
        if (opp.hasUpfrontFee) finalScore = Math.max(10, finalScore - 50);

        let matchCategory = 'HIGH_ALIGNMENT';
        if (finalScore < 60) matchCategory = 'EXPLORATORY';
        else if (finalScore < 80) matchCategory = 'MODERATE_ALIGNMENT';

        return {
          opportunity: {
            ...opp,
            companyName: opp.company.name,
            companyLogo: (opp.company as any).logoUrl || undefined,
            credibilityScore: opp.company.credibilityScore,
            riskLevel: opp.hasUpfrontFee ? 'HIGH_RISK' : (opp.company.credibilityScore || 80) < 50 ? 'MODERATE_RISK' : 'LOW_RISK'
          },
          matchPercentage: finalScore,
          matchReason: matchData.explanation,
          matchedSkills: matchData.matchedSkills,
          careerFitCategory: matchCategory
        };
      })
    );

    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return scored;
  }
}
