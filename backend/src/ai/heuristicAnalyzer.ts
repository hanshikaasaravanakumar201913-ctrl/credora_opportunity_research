import { ExtractedMessageAttributes, OpportunityType, RiskLevel } from '../types/index.js';

export class HeuristicAnalyzer {
  public static extractAndAnalyzeMessage(rawText: string): ExtractedMessageAttributes {
    const text = rawText.trim();

    // 1. Company Extraction
    let company: string | null = null;
    const companyMatch = text.match(/(?:at|company|organization|from|hiring at|internship at|join)\s+([A-Z][A-Za-z0-9&.\s]{2,30}?)(?:\s+(?:is|has|invites|looking|we|for|private|ltd|pvt|\n|\.|,))/i);
    if (companyMatch && companyMatch[1]) {
      company = companyMatch[1].trim();
    } else {
      const headerMatch = text.match(/^([A-Z][A-Za-z0-9&.\s]{1,30}?)(?:\s+(?:is\s+)?(?:Hiring|Internship|Job|Recruitment|Drive|Careers|Vacancies|invites|is\s+looking))/i);
      if (headerMatch && headerMatch[1]) {
        company = headerMatch[1].trim();
      }
    }
    if (company) {
      company = company
        .replace(/\s+(?:hiring|internship|job|recruitment|drive|careers|vacancies)$/i, '')
        .replace(/[.,;:!?]+$/, '')
        .trim();
    }

    // 2. Role Extraction
    let role: string | null = null;
    const roleMatch = text.match(/(?:role|position|profile|hiring for|as an?|job title)\s*[:\-]?\s*([A-Za-z0-9\s/&+\-]{3,40}?)(?:\n|\.|,|;|stipend|salary|duration|eligibility)/i);
    if (roleMatch && roleMatch[1]) {
      role = roleMatch[1].trim();
    } else if (/software engineer|frontend developer|backend developer|data analyst|full stack|marketing intern|ui\/ux|ai\/ml intern|cybersecurity intern/i.test(text)) {
      const found = text.match(/(software engineer|frontend developer|backend developer|data analyst|full stack developer|marketing intern|ui\/ux designer|ai\/ml intern|cybersecurity intern)/i);
      if (found) role = found[0];
    }
    if (role) {
      role = role.replace(/[.,;:!?]+$/, '').trim();
    }

    // 3. Opportunity Type
    let type: OpportunityType = 'INTERNSHIP';
    if (/online course|certification program|masterclass|bootcamp|learning track/i.test(text)) {
      type = 'ONLINE_COURSE';
    } else if (/full[-\s]time|permanent|ctc\s*[:\-]|annual package|lpa/i.test(text) && !/internship/i.test(text)) {
      type = 'FULL_TIME_JOB';
    } else if (/training program|industrial training|workshop/i.test(text)) {
      type = 'TRAINING_PROGRAM';
    }

    // 4. Stipend & Salary
    let stipend: string | null = null;
    let salary: string | null = null;
    const stipendMatch = text.match(/(?:stipend|monthly pay|allowance)\s*[:\-]?\s*(₹?\$?[\d,kK\s\-–]+(?:\/(?:mo|month|pm))?)/i);
    if (stipendMatch) stipend = stipendMatch[1].trim();

    const salaryMatch = text.match(/(?:salary|ctc|package|compensation)\s*[:\-]?\s*(₹?\$?[\d,.\s\-–]+(?:LPA|lpa|k|K|per annum|\/year)?)/i);
    if (salaryMatch) salary = salaryMatch[1].trim();

    // 5. Upfront Fee / Payment / Security Deposit detection
    let fee: string | null = null;
    let hasUpfrontFee = false;
    const feeMatch = text.match(/(?:registration fee|security deposit|training fee|processing fee|certificate fee|pay\s*₹?\d+|refundable deposit)\s*[:\-]?\s*(₹?\$?[\d,]+[^\n.]*)/i);
    if (feeMatch) {
      fee = feeMatch[0].trim();
      hasUpfrontFee = true;
    } else if (/no fee|free of cost|100% free|zero fee|no hidden charges/i.test(text)) {
      fee = 'None / ₹0 (Declared Free)';
    }

    // 6. Duration
    let duration: string | null = null;
    const durMatch = text.match(/(?:duration|period|tenure)\s*[:\-]?\s*(\d+\s*(?:weeks?|months?|days?|years?)|immediate|full[-\s]time)/i);
    if (durMatch) duration = durMatch[1].trim();

    // 7. Location
    let location: string | null = null;
    const locMatch = text.match(/(?:location|work location|base)\s*[:\-]?\s*([A-Za-z\s,\/]+?)(?:\n|\.|;|$)/i);
    if (locMatch) {
      location = locMatch[1].trim();
    } else if (/work from home|remote/i.test(text)) {
      location = 'Remote / Work From Home';
    } else if (/hybrid/i.test(text)) {
      location = 'Hybrid';
    }

    // 8. Deadline
    let deadline: string | null = null;
    const deadMatch = text.match(/(?:deadline|last date|apply before|closing date)\s*[:\-]?\s*([A-Za-z0-9\s,\/\-]+?)(?:\n|\.|;|$)/i);
    if (deadMatch) deadline = deadMatch[1].trim();

    // 9. Recruiter Name, Email, Phone
    let recruiterName: string | null = null;
    const recMatch = text.match(/(?:recruiter|contact person|hr|posted by|regards|reach out to)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (recMatch) recruiterName = recMatch[1].trim();

    let email: string | null = null;
    let isFreeWebmail = false;
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      email = emailMatch[1].toLowerCase();
      if (/@(?:gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|rediffmail\.com)$/i.test(email)) {
        isFreeWebmail = true;
      }
    }

    let phone: string | null = null;
    const phoneMatch = text.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/);
    if (phoneMatch) phone = phoneMatch[0];

    // 10. URLs & Shorteners
    const urls: string[] = [];
    let hasShortenedUrls = false;
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      urls.push(match[1]);
      if (/bit\.ly|tinyurl\.com|t\.co|rb\.gy|is\.gd|cutt\.ly|forms\.gle/i.test(match[1])) {
        hasShortenedUrls = true;
      }
    }

    // 11. Skills & Eligibility
    const skills: string[] = [];
    const commonSkills = [
      'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
      'Java', 'C++', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker',
      'Data Analysis', 'Machine Learning', 'UI/UX', 'Tailwind', 'Git',
      'HTML/CSS', 'Excel', 'Content Writing', 'Digital Marketing'
    ];
    for (const sk of commonSkills) {
      const reg = new RegExp(`\\b${sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (reg.test(text)) {
        skills.push(sk);
      }
    }

    let eligibility: string | null = null;
    const eligMatch = text.match(/(?:eligibility|batch|qualification|education|who can apply)\s*[:\-]?\s*([^\n.]+)/i);
    if (eligMatch) eligibility = eligMatch[1].trim();

    // 12. Claims & Indicator Trigger Detection
    const detectedIndicators: string[] = [];
    const positiveSignals: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 10; // baseline low risk

    // Indicators evaluation
    if (hasUpfrontFee) {
      detectedIndicators.push(`Upfront monetary demand or deposit requested: "${fee}"`);
      riskScore += 45;
    }

    if (isFreeWebmail) {
      detectedIndicators.push(`Recruitment email uses a free public mailbox domain (${email}) rather than an enterprise domain.`);
      riskScore += 20;
    }

    if (hasShortenedUrls) {
      detectedIndicators.push('Opportunity contains shortened URLs or third-party generic forms masking destination.');
      riskScore += 15;
    }

    if (/guaranteed (?:job|placement|salary|selection)|100% placement assurance/i.test(text)) {
      detectedIndicators.push('Contains unconditional guarantee claims ("100% Placement / Guaranteed Job").');
      riskScore += 25;
    }

    if (/urgent|immediate joining|spots limited|first 10 candidates only|offer expires today|act now/i.test(text)) {
      detectedIndicators.push('High-pressure urgency language designed to rush applicant decisions without verification.');
      riskScore += 15;
    }

    if (/no interview|direct selection|no assessment required|selected based on resume only/i.test(text)) {
      detectedIndicators.push('Claims selection without formal evaluation or interview round.');
      riskScore += 20;
    }

    if (!company) {
      detectedIndicators.push('Company / employing organization name is omitted or ambiguous.');
      riskScore += 20;
    }

    // Positive Signals evaluation
    if (email && !isFreeWebmail) {
      positiveSignals.push(`Official enterprise domain email address identified: ${email}`);
      riskScore = Math.max(5, riskScore - 5);
      if (company && email.toLowerCase().includes(company.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
        positiveSignals.push(`Recruiter email domain directly matches company name.`);
      }
    }
    if (company && /ltd|pvt|technologies|solutions|corp|inc|systems|software|consulting|labs/i.test(company)) {
      positiveSignals.push(`Standard formal business naming convention identified: ${company}`);
    }
    if (skills.length >= 2) {
      positiveSignals.push(`Concrete skill requirements specified (${skills.slice(0, 3).join(', ')}).`);
    }
    if (fee && fee.includes('None')) {
      positiveSignals.push('Explicitly declares zero registration or security deposit charges.');
    }

    // Determine Risk Level
    let riskLevel: RiskLevel = 'LOW_RISK';
    if (text.length < 50 && !company && !email) {
      riskLevel = 'INSUFFICIENT_INFORMATION';
    } else if (hasUpfrontFee || riskScore >= 60) {
      riskLevel = 'HIGH_RISK';
    } else if (detectedIndicators.length > 0 && riskScore >= 35) {
      riskLevel = 'MODERATE_RISK';
    } else {
      // Clean opportunity with zero red flags
      riskLevel = 'LOW_RISK';
      riskScore = Math.min(riskScore, 10);
    }

    // Recommendations Generation
    if (hasUpfrontFee) {
      recommendations.push('NEVER pay upfront fees, registration deposits, or document release charges for internships or employment.');
    }
    if (isFreeWebmail) {
      recommendations.push('Verify recruiter identity through the company’s official LinkedIn talent team or official portal before sending personal records.');
    }
    if (company) {
      recommendations.push(`Search corporate registry records and official website for "${company}" to confirm active operations.`);
    }
    recommendations.push('Cross-reference application links with the organization’s dedicated careers portal.');

    // Reasoning narrative
    let riskReasoning = '';
    if (riskLevel === 'HIGH_RISK') {
      riskReasoning = `Several critical warning indicators were identified in the opportunity text. Most notably: ${detectedIndicators.slice(0, 2).join(' and ')}. Legitimate employers do not request upfront financial deposits for hiring. Extreme caution is strongly advised.`;
    } else if (riskLevel === 'MODERATE_RISK') {
      riskReasoning = `The message contains elements requiring independent verification. Specific warning markers noted: ${detectedIndicators.join(', ')}. Independently confirm through the official organization website before sharing sensitive documents.`;
    } else if (riskLevel === 'INSUFFICIENT_INFORMATION') {
      riskReasoning = 'The provided text contains minimal opportunity specifics. Company identity, compensation structure, and formal contact information could not be verified from the supplied text.';
    } else {
      riskReasoning = 'The opportunity description aligns with standard professional recruitment formats. No upfront fee demands or risk triggers were detected. Standard verification of job terms through the official portal is recommended.';
    }

    return {
      company,
      role,
      type,
      salary,
      stipend,
      fee,
      hasUpfrontFee,
      duration,
      location,
      deadline,
      recruiterName,
      email,
      isFreeWebmail,
      phone,
      urls,
      hasShortenedUrls,
      skills,
      eligibility,
      detectedIndicators,
      riskLevel,
      riskScore: Math.min(100, Math.max(5, riskScore)),
      riskReasoning,
      positiveSignals,
      recommendations
    };
  }
}
