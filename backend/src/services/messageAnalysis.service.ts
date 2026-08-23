import { prisma } from '../prisma.js';
import { GeminiAdapter } from '../ai/geminiAdapter.js';
import { WikipediaProvider } from '../integrations/providers/wikipediaProvider.js';

export class MessageAnalysisService {
  public static async analyzeAndSaveMessage(rawText: string, userId?: string) {
    // 1. Run heuristic / AI extraction
    const result = await GeminiAdapter.analyzeOpportunityMessage(rawText);

    // 2. Perform Live Cross-Verification against Verified Database & Domain Records
    if (result.company && result.company.length > 2) {
      const cleanCompany = result.company.replace(/[.,;:!?]+$/, '').trim();
      result.company = cleanCompany;

      try {
        // 2a. Check local DB first for existing company
        const dbCompany = await prisma.company.findFirst({
          where: {
            OR: [
              { name: { equals: cleanCompany } },
              { slug: { equals: cleanCompany.toLowerCase().replace(/[^a-z0-9]+/g, '-') } },
              { officialDomain: { contains: cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '') } }
            ]
          }
        });

        let officialDomain = dbCompany?.officialDomain?.toLowerCase();

        // 2b. If not in DB, check Wikipedia only if it is an authoritative matching entity
        if (!officialDomain) {
          const wiki = await WikipediaProvider.searchCompany(cleanCompany);
          if (wiki?.data) {
            const wikiTitleNorm = wiki.data.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            const queryNorm = cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (wikiTitleNorm.includes(queryNorm) || queryNorm.includes(wikiTitleNorm)) {
              officialDomain = wiki.data.officialDomain?.toLowerCase();
              if (!result.positiveSignals.some(s => s.includes('knowledge base'))) {
                result.positiveSignals.push(`Verified company entity record identified in public knowledge base (${wiki.data.title}).`);
              }
            }
          }
        }

        // 2c. Check recruiter email against company identity
        if (result.email) {
          const emailDomain = result.email.split('@')[1]?.toLowerCase();
          const compNorm = cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
          const emailDomainNorm = (emailDomain || '').replace(/[^a-z0-9]/g, '');

          if (emailDomain) {
            const isFreeWebmail = /gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|rediffmail\.com/i.test(emailDomain);

            if (!isFreeWebmail) {
              // If the email domain contains the company name, it is an authentic enterprise email
              if (compNorm.length >= 3 && (emailDomainNorm.includes(compNorm) || compNorm.includes(emailDomainNorm.replace(/\.[a-z]+$/, '')))) {
                if (!result.positiveSignals.some(s => s.includes(emailDomain))) {
                  result.positiveSignals.push(`Enterprise email domain directly matches organizational brand (${emailDomain}).`);
                }
                result.riskScore = Math.max(5, result.riskScore - 5);
              } else if (officialDomain) {
                const offNorm = officialDomain.replace(/[^a-z0-9]/g, '');
                // Flag mismatch only if official domain is known and strictly conflicting
                if (!emailDomainNorm.includes(offNorm) && !offNorm.includes(emailDomainNorm)) {
                  result.detectedIndicators.push(`Domain Mismatch: Official entity operates on "${officialDomain}", but communication references external domain "${emailDomain}".`);
                  result.riskScore = Math.min(100, result.riskScore + 20);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Domain cross-check error:', err);
      }
    }

    // 3. Re-evaluate Risk Level & Narrative based on verified indicators
    if (result.detectedIndicators.length > 0) {
      if (result.riskScore >= 60 || result.hasUpfrontFee) {
        result.riskLevel = 'HIGH_RISK';
        result.riskReasoning = `Several critical warning indicators were identified: ${result.detectedIndicators.slice(0, 2).join(' and ')}. Legitimate employers do not request upfront financial deposits for hiring. Extreme caution is strongly advised.`;
      } else if (result.riskScore >= 35) {
        result.riskLevel = 'MODERATE_RISK';
        result.riskReasoning = `The message contains elements requiring independent verification. Specific warning markers noted: ${result.detectedIndicators.join(', ')}. Independently confirm through the official organization website before sharing sensitive documents.`;
      } else {
        result.riskLevel = 'LOW_RISK';
        result.riskReasoning = 'The opportunity description aligns with standard professional recruitment formats. Standard verification of job terms through the official portal is recommended.';
      }
    } else {
      result.riskLevel = 'LOW_RISK';
      result.riskScore = Math.min(result.riskScore, 10);
      result.riskReasoning = 'The opportunity description aligns with standard professional recruitment formats. No upfront fee demands or risk triggers were detected. Standard verification of job terms through the official portal is recommended.';
    }

    // Save record to DB
    const saved = await prisma.opportunityMessage.create({
      data: {
        userId: userId || null,
        rawText,
        extractedCompany: result.company,
        extractedRole: result.role,
        extractedType: result.type,
        extractedSalary: result.salary,
        extractedStipend: result.stipend,
        extractedFee: result.fee,
        extractedDuration: result.duration,
        extractedLocation: result.location,
        extractedDeadline: result.deadline,
        extractedRecruiter: result.recruiterName,
        extractedEmail: result.email,
        extractedPhone: result.phone,
        extractedUrls: JSON.stringify(result.urls),
        extractedSkills: JSON.stringify(result.skills),
        extractedEligibility: result.eligibility,
        extractedClaims: JSON.stringify([]),
        riskLevel: result.riskLevel,
        riskScore: result.riskScore,
        detectedIndicators: JSON.stringify(result.detectedIndicators),
        riskReasoning: result.riskReasoning,
        positiveSignals: JSON.stringify(result.positiveSignals),
        recommendations: JSON.stringify(result.recommendations),
        isDemo: false
      }
    });

    return {
      ...result,
      id: saved.id,
      createdAt: saved.createdAt
    };
  }

  public static async getMessageById(id: string) {
    const record = await prisma.opportunityMessage.findUnique({
      where: { id }
    });

    if (!record) return null;

    return {
      ...record,
      urls: JSON.parse(record.extractedUrls || '[]'),
      skills: JSON.parse(record.extractedSkills || '[]'),
      detectedIndicators: JSON.parse(record.detectedIndicators || '[]'),
      positiveSignals: JSON.parse(record.positiveSignals || '[]'),
      recommendations: JSON.parse(record.recommendations || '[]')
    };
  }
}
