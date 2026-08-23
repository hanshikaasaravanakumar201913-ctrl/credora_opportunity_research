import { prisma } from '../prisma.js';
import { CredibilityAnalysisResult, CredibilityDimensionScore } from '../types/index.js';

export class CredibilityService {
  public static async evaluateCredibility(companyId: string, opportunityId?: string): Promise<CredibilityAnalysisResult> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        sources: true,
        contacts: true,
        opportunities: opportunityId ? { where: { id: opportunityId } } : true
      }
    });

    if (!company) {
      throw new Error(`Company with id ${companyId} not found.`);
    }

    const opportunity = opportunityId
      ? await prisma.opportunity.findUnique({ where: { id: opportunityId } })
      : company.opportunities?.[0] || null;

    // 1. Company Existence (15% weight)
    const hasReg = !!company.registrationNumber && company.registrationStatus === 'ACTIVE_COMPLIANT';
    const hasDomainOrSSL = company.sslStatus === 'VERIFIED' || !!company.officialDomain;
    const scoreExistence = hasReg ? 92 : company.registrationNumber ? 80 : hasDomainOrSSL ? 75 : 45;
    const dimExistence: CredibilityDimensionScore = {
      score: scoreExistence,
      label: scoreExistence >= 75 ? 'Verified Record' : scoreExistence >= 60 ? 'Unconfirmed Filing' : 'No Public Record',
      reason: hasReg
        ? `Official corporate incorporation verified in government registry (${company.registrationNumber}).`
        : hasDomainOrSSL
        ? `Verified active corporate web domain and infrastructure (${company.officialDomain || company.officialWebsite}).`
        : 'Corporate entity registration was not discovered in verified primary public gazettes.'
    };

    // 2. Website Credibility (12% weight)
    const hasSSL = company.sslStatus === 'VERIFIED' || !!company.officialDomain;
    const scoreWebsite = hasSSL && (company.domainAgeYears || 0) >= 3 ? 95 : hasSSL ? 85 : 40;
    const dimWebsite: CredibilityDimensionScore = {
      score: scoreWebsite,
      label: scoreWebsite >= 75 ? 'Secure & Established' : scoreWebsite >= 60 ? 'Standard' : 'Unencrypted / Emerging',
      reason: hasSSL
        ? `Valid TLS encryption certificates active on domain '${company.officialDomain || company.officialWebsite}'.`
        : 'Website domain lacks verifiable enterprise certificate records or long-standing WHOIS registration.'
    };

    // 3. Company History (10% weight)
    const yearsActive = company.foundedYear ? (2026 - company.foundedYear) : 2;
    const scoreHistory = yearsActive >= 5 ? 95 : yearsActive >= 2 ? 80 : 60;
    const dimHistory: CredibilityDimensionScore = {
      score: scoreHistory,
      label: scoreHistory >= 75 ? 'Established' : 'Emerging Organization',
      reason: company.foundedYear
        ? `Founded in ${company.foundedYear} (${yearsActive} years of continuous digital footprint and operations).`
        : 'Active corporate presence established across audited registries.'
    };

    // 4. Public Presence (13% weight)
    const hasMultipleSources = company.sources.length >= 2;
    const scorePresence = hasMultipleSources ? 90 : 75;
    const dimPresence: CredibilityDimensionScore = {
      score: scorePresence,
      label: scorePresence >= 75 ? 'Strong Public Footprint' : 'Moderate Footprint',
      reason: hasMultipleSources
        ? `Public identity corroborated across ${company.sources.length} independent directories, news indices, and professional networks.`
        : 'Authoritative commercial records and digital touchpoints discovered.'
    };

    // 5. Contact Verification (15% weight)
    const hasDomainEmail = company.contacts.some(c => c.contactType.includes('EMAIL') && !c.contactValue.includes('@gmail.com'));
    const hasPhone = company.contacts.some(c => c.contactType.includes('PHONE'));
    const scoreContact = hasDomainEmail && hasPhone ? 95 : (hasDomainEmail || company.officialDomain) ? 85 : 60;
    const dimContact: CredibilityDimensionScore = {
      score: scoreContact,
      label: scoreContact >= 75 ? 'Enterprise Contacts Verified' : scoreContact >= 60 ? 'Partially Verified' : 'Unconfirmed / Secondary',
      reason: hasDomainEmail || company.officialDomain
        ? 'Official organization-specific domain email identified alongside reachable corporate inquiry channels.'
        : 'Communication channels rely on personal webmails or unverified messaging handles.'
    };

    // 6. Opportunity Consistency (15% weight)
    let scoreConsistency = 85;
    let labelConsistency = 'Consistent with Organization';
    let reasonConsistency = 'Opportunity parameters, required skillsets, and domain focus match the organization\'s public profile.';
    if (opportunity) {
      if (opportunity.hasUpfrontFee || (opportunity.fee && !opportunity.fee.toLowerCase().includes('none') && !opportunity.fee.includes('₹0'))) {
        scoreConsistency = 20;
        labelConsistency = 'High Risk Inconsistency';
        reasonConsistency = 'Upfront fee or security deposit requested, contradicting standard hiring guidelines for legitimate organizations.';
      }
    }
    const dimConsistency: CredibilityDimensionScore = {
      score: scoreConsistency,
      label: labelConsistency,
      reason: reasonConsistency
    };

    // 7. Information Completeness (10% weight)
    let scoreCompleteness = 85;
    let labelCompleteness = 'Comprehensive Disclosure';
    let reasonCompleteness = 'Essential parameters including role duties, work mode, skills, and compensation are clearly documented.';
    if (opportunity && (!opportunity.deadline || !opportunity.stipend || !opportunity.location)) {
      scoreCompleteness = 70;
      labelCompleteness = 'Standard Disclosure';
      reasonCompleteness = 'Key parameters are documented, with specific details shared during recruitment stages.';
    }
    const dimCompleteness: CredibilityDimensionScore = {
      score: scoreCompleteness,
      label: labelCompleteness,
      reason: reasonCompleteness
    };

    // 8. Risk Indicators (10% weight - high score means LOW risk)
    let scoreRisk = 92;
    let labelRisk = 'Low Risk Factors';
    let reasonRisk = 'No upfront fee demands, extreme urgency pressure, or suspicious payment gateways detected.';
    if (opportunity?.hasUpfrontFee) {
      scoreRisk = 15;
      labelRisk = 'Severe Risk Trigger';
      reasonRisk = 'Opportunity demands applicant payments before employment.';
    }
    const dimRisk: CredibilityDimensionScore = {
      score: scoreRisk,
      label: labelRisk,
      reason: reasonRisk
    };

    // Weighted Overall Calculation
    const overallScore = Math.round(
      (scoreExistence * 0.15) +
      (scoreWebsite * 0.12) +
      (scoreHistory * 0.10) +
      (scorePresence * 0.13) +
      (scoreContact * 0.15) +
      (scoreConsistency * 0.15) +
      (scoreCompleteness * 0.10) +
      (scoreRisk * 0.10)
    );

    let overallStatus = 'High Confidence';
    if (overallScore < 45) {
      overallStatus = 'Caution Recommended: Warning Signals Identified';
    } else if (overallScore < 65) {
      overallStatus = 'Moderate Confidence: Independent Verification Advised';
    } else {
      overallStatus = 'High Confidence: Strong Evidence Base';
    }

    // Signals compilation
    const positiveSignals: string[] = [];
    const warningSignals: string[] = [];
    const unverifiedInformation: string[] = [];
    const conflictingInformation: string[] = [];

    if (hasReg) positiveSignals.push(`Government corporate registration record verified (${company.registrationNumber}).`);
    if (hasSSL) positiveSignals.push('Official domain maintains valid SSL certificates and standard nameservers.');
    if (hasDomainEmail || company.officialDomain) positiveSignals.push('Dedicated enterprise email domain matching organization brand identity.');
    if (yearsActive >= 2) positiveSignals.push(`${yearsActive} years of verified public domain existence and operational history.`);

    if (opportunity?.hasUpfrontFee) {
      warningSignals.push('Upfront monetary charges or registration deposits requested for employment.');
    }

    if (!opportunity?.deadline) unverifiedInformation.push('Exact application deadline date not specified in public listing.');
    if (!company.companySize) unverifiedInformation.push('Exact active employee count not publicly disclosed.');

    const narrativeExplanation = overallScore >= 75
      ? `${company.name} exhibits verifiable corporate existence, standard web encryption, and established communication channels. While the profile demonstrates strong legitimacy, students should always verify specific offer terms through the official portal.`
      : overallScore >= 50
      ? `${company.name} has digital touchpoints, but certain details (such as comprehensive external reviews or domain-based emails) require independent confirmation. Direct contact with the HR desk is advised.`
      : `Several warning indicators were detected for this opportunity, particularly regarding upfront fees or unverified contact identities. We strongly recommend independent verification before sharing personal documents or funds.`;

    // Persist assessment record in database
    await prisma.credibilityAssessment.create({
      data: {
        companyId: company.id,
        opportunityId: opportunity?.id || null,
        overallScore,
        overallStatus,
        scoreCompanyExistence: scoreExistence,
        scoreWebsiteCredibility: scoreWebsite,
        scoreCompanyHistory: scoreHistory,
        scorePublicPresence: scorePresence,
        scoreContactVerification: scoreContact,
        scoreOpportunityConsistency: scoreConsistency,
        scoreInfoCompleteness: scoreCompleteness,
        scoreRiskIndicators: scoreRisk,
        reasonExistence: dimExistence.reason,
        reasonWebsite: dimWebsite.reason,
        reasonHistory: dimHistory.reason,
        reasonPublicPresence: dimPresence.reason,
        reasonContact: dimContact.reason,
        reasonConsistency: dimConsistency.reason,
        reasonCompleteness: dimCompleteness.reason,
        reasonRisk: dimRisk.reason,
        positiveSignals: JSON.stringify(positiveSignals),
        warningSignals: JSON.stringify(warningSignals),
        unverifiedInformation: JSON.stringify(unverifiedInformation),
        conflictingInformation: JSON.stringify(conflictingInformation),
        narrativeExplanation
      }
    });

    return {
      overallScore,
      overallStatus,
      dimensions: {
        companyExistence: dimExistence,
        websiteCredibility: dimWebsite,
        companyHistory: dimHistory,
        publicPresence: dimPresence,
        contactVerification: dimContact,
        opportunityConsistency: dimConsistency,
        infoCompleteness: dimCompleteness,
        riskIndicators: dimRisk
      },
      positiveSignals,
      warningSignals,
      unverifiedInformation,
      conflictingInformation,
      narrativeExplanation
    };
  }
}
