import { prisma } from '../prisma.js';
import { OpportunityService } from './opportunity.service.js';
import { RiskLevel } from '../types/index.js';

export class ComparisonService {
  public static async compareOpportunities(opportunityIds: string[], userId?: string) {
    if (!opportunityIds || opportunityIds.length < 2) {
      throw new Error('At least 2 opportunities are required for comparison.');
    }

    if (opportunityIds.length > 5) {
      throw new Error('You can compare a maximum of 5 opportunities at once.');
    }

    const opportunities = await prisma.opportunity.findMany({
      where: {
        id: { in: opportunityIds }
      },
      include: {
        company: {
          include: {
            sources: true
          }
        },
        credibilityReports: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (opportunities.length < 2) {
      throw new Error('Could not find enough matching opportunities.');
    }

    // Evaluate each opportunity
    const evaluatedList = await Promise.all(
      opportunities.map(async (opp) => {
        const match = await OpportunityService.calculateStudentMatch(opp.id, userId);
        const credScore = opp.company.credibilityScore || 75;
        const learningScore = opp.learningPotentialScore || 80;
        const skillScore = match.skillMatchPercentage;
        const careerFitScore = match.careerMatchPercentage;

        // Risk Index mapping
        let riskIndex: RiskLevel = 'LOW_RISK';
        if (opp.hasUpfrontFee) {
          riskIndex = 'HIGH_RISK';
        } else if (credScore < 50) {
          riskIndex = 'MODERATE_RISK';
        }

        // Weighted Suitability Calculation (0-100)
        // Career Fit: 35%, Skill Match: 25%, Credibility: 25%, Learning: 15%
        let suitability = Math.round(
          (careerFitScore * 0.35) +
          (skillScore * 0.25) +
          (credScore * 0.25) +
          (learningScore * 0.15)
        );

        if (riskIndex === 'HIGH_RISK') {
          suitability = Math.max(10, suitability - 40);
        }

        // Pros and Cons extraction
        const pros: string[] = [];
        const cons: string[] = [];

        if (credScore >= 80) pros.push('High organization credibility & public verification');
        if (skillScore >= 75) pros.push(`Strong overlap with your skills (${match.matchedSkills.slice(0, 2).join(', ')})`);
        if (opp.stipend && !opp.stipend.includes('Unpaid')) pros.push(`Competitive compensation: ${opp.stipend}`);
        if (learningScore >= 85) pros.push('Exceptional hands-on learning and project autonomy');

        if (opp.hasUpfrontFee) cons.push('Demands upfront fees / registration payment');
        if (credScore < 60) cons.push('Limited external public records or short operational tenure');
        if (match.missingSkills.length > 0) cons.push(`Requires additional preparation in ${match.missingSkills.slice(0, 2).join(', ')}`);
        if (!opp.stipend) cons.push('Compensation terms not explicitly published');

        return {
          opportunity: opp,
          suitabilityScore: suitability,
          careerFitScore,
          skillMatchScore: skillScore,
          credibilityScore: credScore,
          learningScore,
          riskIndex,
          infoQualityScore: opp.statusVerification === 'VERIFIED' ? 95 : 75,
          pros,
          cons,
          fitExplanation: match.explanation
        };
      })
    );

    // Rank from highest suitability to lowest
    evaluatedList.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    const ranked = evaluatedList.map((item, idx) => ({
      ...item,
      ranking: idx + 1
    }));

    const topMatch = ranked[0];

    // Generate explainable recommendation narrative
    const recommendationWhy = `${topMatch.opportunity.title} at ${topMatch.opportunity.company.name} emerges as your strongest match (${topMatch.suitabilityScore}% overall suitability). It balances strong career alignment (${topMatch.careerFitScore}%), high organizational credibility (${topMatch.credibilityScore}/100), and robust skill compatibility without presenting upfront financial risk.`;

    // Persist comparison if user is authenticated
    let comparisonRecordId: string | null = null;
    if (userId) {
      const savedComparison = await prisma.comparison.create({
        data: {
          userId,
          title: `Comparison: ${opportunities.map(o => o.company.name).slice(0, 2).join(' vs ')}${opportunities.length > 2 ? ` +${opportunities.length - 2} more` : ''}`,
          topRecommendationId: topMatch.opportunity.id,
          recommendationWhy,
          weightedMetrics: JSON.stringify({
            careerFitWeight: 35,
            skillMatchWeight: 25,
            credibilityWeight: 25,
            learningWeight: 15
          }),
          opportunities: {
            create: ranked.map(r => ({
              opportunityId: r.opportunity.id,
              suitabilityScore: r.suitabilityScore,
              careerFitScore: r.careerFitScore,
              skillMatchScore: r.skillMatchScore,
              credibilityScore: r.credibilityScore,
              learningScore: r.learningScore,
              riskIndex: r.riskIndex,
              infoQualityScore: r.infoQualityScore,
              pros: JSON.stringify(r.pros),
              cons: JSON.stringify(r.cons),
              fitExplanation: r.fitExplanation,
              ranking: r.ranking
            }))
          }
        }
      });
      comparisonRecordId = savedComparison.id;
    }

    return {
      comparisonId: comparisonRecordId,
      topRecommendation: topMatch,
      recommendationWhy,
      items: ranked
    };
  }
}
