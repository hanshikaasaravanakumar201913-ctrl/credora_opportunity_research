import { prisma } from '../prisma.js';

export class OpportunityService {
  public static async getOpportunityById(idOrSlug: string) {
    return prisma.opportunity.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }]
      },
      include: {
        company: {
          include: {
            sources: true,
            contacts: true
          }
        },
        credibilityReports: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  }

  public static async listOpportunities(filters?: {
    type?: string;
    workMode?: string;
    search?: string;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.type) {
      where.opportunityType = filters.type;
    }
    if (filters?.workMode) {
      where.workMode = filters.workMode;
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { role: { contains: filters.search } },
        { company: { name: { contains: filters.search } } },
        { requiredSkills: { contains: filters.search } }
      ];
    }

    return prisma.opportunity.findMany({
      where,
      take: filters?.limit || 50,
      include: {
        company: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public static async calculateStudentMatch(opportunityId: string, userId?: string) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: { company: true }
    });

    if (!opp) throw new Error('Opportunity not found');

    if (!userId) {
      return {
        careerMatchPercentage: opp.careerRelevanceScore || 85,
        skillMatchPercentage: 80,
        matchedSkills: JSON.parse(opp.requiredSkills || '[]').slice(0, 3),
        missingSkills: JSON.parse(opp.requiredSkills || '[]').slice(3),
        explanation: 'Standard baseline match based on general engineering curriculum parameters.'
      };
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return {
        careerMatchPercentage: opp.careerRelevanceScore || 85,
        skillMatchPercentage: 80,
        matchedSkills: JSON.parse(opp.requiredSkills || '[]').slice(0, 3),
        missingSkills: [],
        explanation: 'Match calculated against standard undergraduate benchmark.'
      };
    }

    const candidateSkills: string[] = JSON.parse(profile.skills || '[]');
    const requiredSkills: string[] = JSON.parse(opp.requiredSkills || '[]');

    const matchedSkills = requiredSkills.filter(req =>
      candidateSkills.some(cand => cand.toLowerCase() === req.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(req =>
      !candidateSkills.some(cand => cand.toLowerCase() === req.toLowerCase())
    );

    const skillMatchPercentage = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 85;

    // Career fit calculation
    let careerMatch = Math.round((skillMatchPercentage * 0.6) + (opp.learningPotentialScore * 0.4));
    if (profile.workMode && profile.workMode !== 'ANY' && profile.workMode === opp.workMode) {
      careerMatch = Math.min(100, careerMatch + 5);
    }

    const explanation = matchedSkills.length > 0
      ? `Strong alignment with your declared skills in ${matchedSkills.join(', ')}. Matches your career focus towards ${profile.careerGoal || 'Software Engineering'}.`
      : `Opportunity offers substantial learning exposure in ${requiredSkills.slice(0, 3).join(', ')}, presenting a growth avenue for your profile.`;

    return {
      careerMatchPercentage: careerMatch,
      skillMatchPercentage,
      matchedSkills,
      missingSkills,
      explanation
    };
  }
}
