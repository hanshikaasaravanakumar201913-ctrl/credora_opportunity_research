import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Credora database with realistic career research data...');

  // Clean existing tables in correct order
  await prisma.savedReport.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.comparisonOpportunity.deleteMany();
  await prisma.comparison.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.researchReport.deleteMany();
  await prisma.credibilityAssessment.deleteMany();
  await prisma.source.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.opportunityMessage.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.company.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Student Users
  const userAlex = await prisma.user.create({
    data: {
      email: 'student@credora.io',
      name: 'Alex Chen',
      passwordHash,
      role: 'STUDENT',
      profile: {
        create: {
          education: 'B.Tech Computer Science & Engineering',
          degree: 'B.Tech',
          department: 'Computer Science',
          college: 'National Institute of Technology',
          graduationYear: 2026,
          skills: JSON.stringify(['Python', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'TypeScript']),
          interests: JSON.stringify(['Distributed Systems', 'Cloud Computing', 'Full-Stack Architecture']),
          careerGoal: 'Full-Stack Software Engineer at High-Growth Engineering Team',
          preferredRoles: JSON.stringify(['Software Engineering Intern', 'Backend Developer', 'Full-Stack Developer']),
          preferredIndustries: JSON.stringify(['Cloud Infrastructure', 'Enterprise SaaS', 'Fintech']),
          preferredLocations: JSON.stringify(['Bangalore', 'Hyderabad', 'Remote']),
          workMode: 'HYBRID',
          bio: 'Passionate computer science undergraduate focusing on scalable web architectures and robust backend services.',
          onboardingCompleted: true
        }
      },
      preferences: {
        create: {
          theme: 'DARK',
          minCredibilityScore: 70,
          riskWarningAlerts: true
        }
      }
    }
  });

  const userPriya = await prisma.user.create({
    data: {
      email: 'priya.sharma@college.edu',
      name: 'Priya Sharma',
      passwordHash,
      role: 'STUDENT',
      profile: {
        create: {
          education: 'M.Sc Data Science & AI',
          degree: 'M.Sc',
          department: 'Data Science',
          college: 'Indian Institute of Science',
          graduationYear: 2025,
          skills: JSON.stringify(['Python', 'PyTorch', 'SQL', 'Data Analysis', 'Machine Learning', 'Pandas', 'AWS']),
          interests: JSON.stringify(['Applied Machine Learning', 'NLP', 'Quantitative Analytics']),
          careerGoal: 'Applied Machine Learning Researcher',
          preferredRoles: JSON.stringify(['AI/ML Intern', 'Data Science Fellow', 'Quantitative Analyst']),
          preferredIndustries: JSON.stringify(['Artificial Intelligence', 'HealthTech', 'Fintech']),
          preferredLocations: JSON.stringify(['Bangalore', 'Pune', 'Remote']),
          workMode: 'REMOTE',
          bio: 'Graduate researcher in NLP and applied machine learning models.',
          onboardingCompleted: true
        }
      },
      preferences: {
        create: {
          theme: 'DARK',
          minCredibilityScore: 75,
          riskWarningAlerts: true
        }
      }
    }
  });

  // 2. Create Companies
  // Company 1: NeuralMatrix Cloud Labs (High Credibility - 94)
  const compNeural = await prisma.company.create({
    data: {
      name: 'NeuralMatrix Cloud Labs',
      slug: 'neuralmatrix-cloud-labs',
      officialWebsite: 'https://neuralmatrix.io',
      officialDomain: 'neuralmatrix.io',
      industry: 'Cloud Infrastructure & AI Platform',
      description: 'NeuralMatrix Cloud Labs develops high-throughput distributed inference engines and scalable cloud orchestration middleware for enterprise AI applications.',
      foundedYear: 2019,
      headquarters: 'Indiranagar, Bangalore, Karnataka, India',
      locations: JSON.stringify(['Bangalore', 'San Francisco', 'Remote']),
      companySize: '150-300 employees',
      registrationNumber: 'U72900KA2019PTC128490',
      registrationStatus: 'ACTIVE_COMPLIANT',
      businessType: 'Private Limited Company',
      publicPresence: 'Actively cited in major engineering publications; verified GitHub enterprise organization with 4,200+ stars.',
      productsServices: JSON.stringify(['Distributed GPU Cluster Orchestration', 'Real-Time Vector Ingestion Engine', 'Neural Gateway API']),
      socialProfiles: JSON.stringify({
        linkedin: 'https://linkedin.com/company/neuralmatrix-cloud-labs',
        github: 'https://github.com/neuralmatrix-labs',
        twitter: 'https://twitter.com/neuralmatrix'
      }),
      ratingGlassdoor: 4.6,
      ratingAmbitionBox: 4.5,
      sslStatus: 'VERIFIED',
      domainAgeYears: 7,
      credibilityScore: 94,
      isDemo: true
    }
  });

  // Company 2: Apex Fintech Technologies (High Credibility - 88)
  const compApex = await prisma.company.create({
    data: {
      name: 'Apex Fintech Technologies',
      slug: 'apex-fintech-technologies',
      officialWebsite: 'https://apexfintech.co.in',
      officialDomain: 'apexfintech.co.in',
      industry: 'Financial Technology & Payments',
      description: 'Apex Fintech provides core transactional APIs, automated KYC verification infrastructure, and compliance engines for leading South Asian banks.',
      foundedYear: 2017,
      headquarters: 'Hitec City, Hyderabad, Telangana, India',
      locations: JSON.stringify(['Hyderabad', 'Mumbai', 'Bangalore']),
      companySize: '500-1,000 employees',
      registrationNumber: 'U65999TG2017PTC099412',
      registrationStatus: 'ACTIVE_COMPLIANT',
      businessType: 'Private Limited Company',
      publicPresence: 'Licensed payment infrastructure provider accredited with national banking regulatory frameworks.',
      productsServices: JSON.stringify(['Unified Ledger API', 'KYC Verification Gateway', 'Real-Time Settlement Network']),
      socialProfiles: JSON.stringify({
        linkedin: 'https://linkedin.com/company/apex-fintech-technologies',
        github: 'https://github.com/apex-fintech'
      }),
      ratingGlassdoor: 4.3,
      ratingAmbitionBox: 4.2,
      sslStatus: 'VERIFIED',
      domainAgeYears: 9,
      credibilityScore: 88,
      isDemo: true
    }
  });

  // Company 3: Global Career Boosters India (Suspicious / High Risk - 28)
  const compScam = await prisma.company.create({
    data: {
      name: 'Global Career Boosters India',
      slug: 'global-career-boosters',
      officialWebsite: 'http://globalcareerboosters-jobs.in',
      officialDomain: 'globalcareerboosters-jobs.in',
      industry: 'Training & Placement Agency',
      description: 'Advertises direct corporate placement programs and guaranteed overseas internships across various generic disciplines.',
      foundedYear: 2024,
      headquarters: 'Sector 62, Noida, Uttar Pradesh, India',
      locations: JSON.stringify(['Noida']),
      companySize: 'Unspecified',
      registrationNumber: 'Unregistered / Entity Not Located in MCA Gazettes',
      registrationStatus: 'UNVERIFIED',
      businessType: 'Unincorporated Entity',
      publicPresence: 'Limited online visibility outside promotional broadcast messages and social media messaging groups.',
      productsServices: JSON.stringify(['Direct Placement Guarantee', 'Express Certificate Dispatch']),
      socialProfiles: JSON.stringify({}),
      ratingGlassdoor: null,
      ratingAmbitionBox: null,
      sslStatus: 'INVALID',
      domainAgeYears: 1,
      credibilityScore: 28,
      isDemo: true
    }
  });

  // Company 4: QuantumEdge Analytics (Moderate Credibility - 78)
  const compQuantum = await prisma.company.create({
    data: {
      name: 'QuantumEdge Analytics',
      slug: 'quantumedge-analytics',
      officialWebsite: 'https://quantumedge.ai',
      officialDomain: 'quantumedge.ai',
      industry: 'Data Science & Predictive Intelligence',
      description: 'QuantumEdge builds predictive supply-chain optimization dashboards and automated demand forecasting tools for e-commerce platforms.',
      foundedYear: 2021,
      headquarters: 'Baner, Pune, Maharashtra, India',
      locations: JSON.stringify(['Pune', 'Remote']),
      companySize: '50-100 employees',
      registrationNumber: 'U74999MH2021PTC358910',
      registrationStatus: 'ACTIVE_COMPLIANT',
      businessType: 'Private Limited Company',
      publicPresence: 'Seed-funded technology startup featured in regional tech journals.',
      productsServices: JSON.stringify(['Demand Forecasting Engine', 'Logistics Routing Optimizer']),
      socialProfiles: JSON.stringify({
        linkedin: 'https://linkedin.com/company/quantumedge-analytics',
        github: 'https://github.com/quantumedge'
      }),
      ratingGlassdoor: 4.1,
      ratingAmbitionBox: 3.9,
      sslStatus: 'VERIFIED',
      domainAgeYears: 5,
      credibilityScore: 78,
      isDemo: true
    }
  });

  // Company 5: Veritas Distributed Systems (High Credibility - 91)
  const compVeritas = await prisma.company.create({
    data: {
      name: 'Veritas Distributed Systems',
      slug: 'veritas-distributed-systems',
      officialWebsite: 'https://veritas-ds.org',
      officialDomain: 'veritas-ds.org',
      industry: 'Systems Architecture & Infrastructure',
      description: 'Open-source foundation and engineering group dedicated to high-availability consensus protocols, asynchronous messaging, and peer-to-peer storage.',
      foundedYear: 2020,
      headquarters: 'Koramangala, Bangalore, Karnataka, India',
      locations: JSON.stringify(['Bangalore', 'Berlin', 'Remote']),
      companySize: '80-150 engineers',
      registrationNumber: 'U72200KA2020PTC139044',
      registrationStatus: 'ACTIVE_COMPLIANT',
      businessType: 'Private Limited Company',
      publicPresence: 'Maintains open-source repositories with 12,000+ contributors across global developer communities.',
      productsServices: JSON.stringify(['Veritas Storage Daemon', 'Raft Consensus Framework', 'Telemetry Agent']),
      socialProfiles: JSON.stringify({
        linkedin: 'https://linkedin.com/company/veritas-ds',
        github: 'https://github.com/veritas-ds'
      }),
      ratingGlassdoor: 4.7,
      ratingAmbitionBox: 4.6,
      sslStatus: 'VERIFIED',
      domainAgeYears: 6,
      credibilityScore: 91,
      isDemo: true
    }
  });

  // 3. Create Public Sources for Companies
  await prisma.source.createMany({
    data: [
      {
        companyId: compNeural.id,
        sourceName: 'Ministry of Corporate Affairs (MCA) Portal',
        sourceType: 'REGISTRY',
        sourceUrl: 'https://www.mca.gov.in',
        attributeKey: 'Corporate Identification Number (CIN)',
        attributeValue: compNeural.registrationNumber!,
        confidenceLevel: 'HIGH',
        verificationStatus: 'VERIFIED'
      },
      {
        companyId: compNeural.id,
        sourceName: 'WHOIS & DNS Security Audit',
        sourceType: 'WHOIS',
        sourceUrl: 'https://neuralmatrix.io',
        attributeKey: 'SSL Authority & Domain Tenure',
        attributeValue: 'DigiCert High-Assurance TLS, 7 Years Longevity',
        confidenceLevel: 'HIGH',
        verificationStatus: 'VERIFIED'
      },
      {
        companyId: compApex.id,
        sourceName: 'Ministry of Corporate Affairs (MCA) Portal',
        sourceType: 'REGISTRY',
        sourceUrl: 'https://www.mca.gov.in',
        attributeKey: 'Corporate Identification Number (CIN)',
        attributeValue: compApex.registrationNumber!,
        confidenceLevel: 'HIGH',
        verificationStatus: 'VERIFIED'
      },
      {
        companyId: compScam.id,
        sourceName: 'Public Domain Registry Lookup',
        sourceType: 'WHOIS',
        sourceUrl: 'http://globalcareerboosters-jobs.in',
        attributeKey: 'Domain Registration History',
        attributeValue: 'Registered 3 weeks ago via privacy-redacted proxy',
        confidenceLevel: 'LOW',
        verificationStatus: 'NOT_VERIFIED'
      }
    ]
  });

  // 4. Create Verified Contacts
  await prisma.contact.createMany({
    data: [
      {
        companyId: compNeural.id,
        contactType: 'OFFICIAL_EMAIL',
        contactValue: 'talent@neuralmatrix.io',
        label: 'Engineering Talent Acquisition Team',
        sourceName: 'Official Careers Portal',
        sourceUrl: 'https://neuralmatrix.io/careers',
        verificationStatus: 'VERIFIED'
      },
      {
        companyId: compNeural.id,
        contactType: 'HEADQUARTERS_PHONE',
        contactValue: '+91 80 4912 8800',
        label: 'Bangalore Innovation Campus Reception',
        sourceName: 'Corporate Directory',
        verificationStatus: 'VERIFIED'
      },
      {
        companyId: compApex.id,
        contactType: 'OFFICIAL_EMAIL',
        contactValue: 'university-hiring@apexfintech.co.in',
        label: 'University Relations & Internships',
        sourceName: 'Official Website',
        verificationStatus: 'VERIFIED'
      },
      {
        companyId: compScam.id,
        contactType: 'OFFICIAL_EMAIL',
        contactValue: 'careerboosters.hr.recruitment@gmail.com',
        label: 'Unverified Public Webmail',
        sourceName: 'WhatsApp Forward Text',
        verificationStatus: 'NOT_VERIFIED'
      }
    ]
  });

  // 5. Create Opportunities
  const oppNeuralBackend = await prisma.opportunity.create({
    data: {
      companyId: compNeural.id,
      title: 'Cloud Infrastructure & Distributed Systems Intern',
      slug: 'neuralmatrix-cloud-infra-intern',
      opportunityType: 'INTERNSHIP',
      role: 'Backend Engineering Intern',
      description: 'Join the Core Infrastructure team to build high-throughput gRPC microservices, optimize Kubernetes node autoscale controllers, and construct real-time telemetry pipelines.',
      eligibility: 'Pre-final / Final Year B.Tech / M.Tech in CS/IT or related fields with solid data structures and networking fundamentals.',
      requiredSkills: JSON.stringify(['Python', 'Docker', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git']),
      preferredSkills: JSON.stringify(['Kubernetes', 'gRPC', 'Go', 'Prometheus']),
      duration: '6 Months (Full-Time during Semester Internship)',
      location: 'Bangalore / Hybrid (3 days office, 2 days remote)',
      workMode: 'HYBRID',
      stipend: '₹45,000 / month',
      salary: 'Pre-Placement Offer (PPO) range: ₹18 - 24 LPA',
      fee: 'None / ₹0 (Declared 100% Free Application)',
      hasUpfrontFee: false,
      deadline: '15 October 2026',
      applicationUrl: 'https://neuralmatrix.io/careers/infra-intern-2026',
      applicationMethod: 'Official Portal (Direct Resume + GitHub evaluation)',
      statusVerification: 'VERIFIED',
      careerRelevanceScore: 95,
      learningPotentialScore: 92,
      isDemo: true
    }
  });

  const oppApexFullstack = await prisma.opportunity.create({
    data: {
      companyId: compApex.id,
      title: 'Full-Stack Fintech Engineering Fellow',
      slug: 'apex-fintech-fullstack-fellow',
      opportunityType: 'INTERNSHIP',
      role: 'Full-Stack Developer Intern',
      description: 'Develop reactive financial dashboards in React/TypeScript and write tamper-evident ledger services in Node.js and PostgreSQL for enterprise treasury management.',
      eligibility: 'B.Tech/BE candidates graduating in 2025 or 2026 with demonstrated React and relational database experience.',
      requiredSkills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'SQL', 'Git']),
      preferredSkills: JSON.stringify(['Tailwind CSS', 'Redis', 'Jest']),
      duration: '6 Months',
      location: 'Hitec City, Hyderabad / Hybrid',
      workMode: 'HYBRID',
      stipend: '₹35,000 / month',
      salary: 'PPO range: ₹14 - 18 LPA',
      fee: 'None / ₹0',
      hasUpfrontFee: false,
      deadline: '30 September 2026',
      applicationUrl: 'https://apexfintech.co.in/jobs/fullstack-fellow',
      applicationMethod: 'Official Portal',
      statusVerification: 'VERIFIED',
      careerRelevanceScore: 90,
      learningPotentialScore: 88,
      isDemo: true
    }
  });

  const oppQuantumData = await prisma.opportunity.create({
    data: {
      companyId: compQuantum.id,
      title: 'Applied AI & Predictive Analytics Intern',
      slug: 'quantumedge-ai-analytics-intern',
      opportunityType: 'INTERNSHIP',
      role: 'Data Science & Machine Learning Intern',
      description: 'Build predictive time-series forecasting pipelines, perform exploratory feature engineering on multi-gigabyte transactional tables, and deploy containerized ML models.',
      eligibility: 'B.Tech/M.Sc/MS students with strong foundations in Python, Pandas, and machine learning libraries.',
      requiredSkills: JSON.stringify(['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'Pandas']),
      preferredSkills: JSON.stringify(['PyTorch', 'FastAPI', 'AWS']),
      duration: '3 to 6 Months',
      location: 'Remote',
      workMode: 'REMOTE',
      stipend: '₹30,000 / month',
      salary: 'PPO range: ₹12 - 16 LPA',
      fee: 'None / ₹0',
      hasUpfrontFee: false,
      deadline: '20 October 2026',
      applicationUrl: 'https://quantumedge.ai/careers/data-intern',
      applicationMethod: 'Official Portal / Email Resume',
      statusVerification: 'VERIFIED',
      careerRelevanceScore: 92,
      learningPotentialScore: 90,
      isDemo: true
    }
  });

  const oppVeritasSystems = await prisma.opportunity.create({
    data: {
      companyId: compVeritas.id,
      title: 'Distributed Systems & Open-Source Fellow',
      slug: 'veritas-distributed-systems-fellow',
      opportunityType: 'INTERNSHIP',
      role: 'Systems Research Fellow',
      description: 'Work directly alongside open-source maintainers on consensus algorithm verification, network partition simulations, and zero-allocation IO buffers.',
      eligibility: 'Enthusiastic undergraduate or postgraduate developers passionate about systems programming and open source.',
      requiredSkills: JSON.stringify(['Python', 'Docker', 'Git', 'Linux', 'C++']),
      preferredSkills: JSON.stringify(['Rust', 'Distributed Consensus', 'eBPF']),
      duration: '6 Months',
      location: 'Bangalore / Remote',
      workMode: 'HYBRID',
      stipend: '₹50,000 / month',
      salary: 'PPO range: ₹20 - 28 LPA',
      fee: 'None / ₹0',
      hasUpfrontFee: false,
      deadline: '10 November 2026',
      applicationUrl: 'https://veritas-ds.org/fellowship',
      applicationMethod: 'GitHub Pull Request & Technical Application',
      statusVerification: 'VERIFIED',
      careerRelevanceScore: 96,
      learningPotentialScore: 98,
      isDemo: true
    }
  });

  const oppScamInternship = await prisma.opportunity.create({
    data: {
      companyId: compScam.id,
      title: 'Executive Web & Python Developer Trainee',
      slug: 'global-career-boosters-python-trainee',
      opportunityType: 'TRAINING_PROGRAM',
      role: 'Python Trainee',
      description: 'Guaranteed selection for Python development internship with assured 100% placement upon payment of refundable documentation fee.',
      eligibility: 'Any college student, no prior technical evaluation required.',
      requiredSkills: JSON.stringify(['Python', 'HTML/CSS']),
      preferredSkills: JSON.stringify([]),
      duration: '1 Month',
      location: 'Work From Home',
      workMode: 'REMOTE',
      stipend: '₹20,000 / month (Claims)',
      salary: 'Guaranteed 8 LPA Placement (Unsubstantiated)',
      fee: '₹2,500 Security Deposit / Verification Fee',
      hasUpfrontFee: true,
      deadline: 'URGENT: Offer expires today',
      applicationUrl: 'https://tinyurl.com/fast-join-job2026',
      applicationMethod: 'WhatsApp Direct Form / UPI Payment',
      statusVerification: 'CONFLICTING',
      careerRelevanceScore: 25,
      learningPotentialScore: 20,
      isDemo: true
    }
  });

  // 6. Create Opportunity Messages
  await prisma.opportunityMessage.createMany({
    data: [
      {
        userId: userAlex.id,
        rawText: `🔥 URGENT HIRING FOR FRESHERS 2025/2026 BATCH 🔥\nCompany: Global Career Boosters India\nRole: Python & Full Stack Developer Trainee\nStipend: ₹20,000/mo (Guaranteed Placement 8 LPA)\nRegistration / Security Deposit Fee: ₹2,500 (Refundable upon first stipend)\nSelection: 100% Direct selection without interview.\nApply Immediately (Only 5 spots left): https://tinyurl.com/fast-join-job2026\nSend screenshot of payment to HR: careerboosters.hr.recruitment@gmail.com / WhatsApp +919876543210`,
        extractedCompany: 'Global Career Boosters India',
        extractedRole: 'Python & Full Stack Developer Trainee',
        extractedType: 'TRAINING_PROGRAM',
        extractedSalary: '8 LPA',
        extractedStipend: '₹20,000/mo',
        extractedFee: '₹2,500 Registration / Security Deposit',
        extractedDuration: '1 Month',
        extractedLocation: 'Remote',
        extractedDeadline: 'Urgent / Today',
        extractedRecruiter: 'HR Coordinator',
        extractedEmail: 'careerboosters.hr.recruitment@gmail.com',
        extractedPhone: '+919876543210',
        extractedUrls: JSON.stringify(['https://tinyurl.com/fast-join-job2026']),
        extractedSkills: JSON.stringify(['Python', 'Full Stack']),
        extractedEligibility: 'Freshers 2025/2026 Batch',
        riskLevel: 'HIGH_RISK',
        riskScore: 92,
        detectedIndicators: JSON.stringify([
          'Upfront monetary deposit requested (₹2,500)',
          'Personal webmail domain used (@gmail.com)',
          'Unconditional guarantee claims ("100% Direct Selection / Guaranteed Placement")',
          'High pressure urgency tactics ("Only 5 spots left")',
          'Shortened destination URL (tinyurl.com)'
        ]),
        riskReasoning: 'Critical warning indicators detected. The message explicitly demands an upfront refundable security deposit of ₹2,500 and uses a free Gmail account. Legitimate technology companies do not demand payments for employment.',
        positiveSignals: JSON.stringify([]),
        recommendations: JSON.stringify([
          'DO NOT transfer money or share bank OTPs/KYC documents.',
          'Never pay upfront fees for internships or job offers.',
          'Report this listing to campus placement authorities.'
        ]),
        isDemo: true
      },
      {
        userId: userAlex.id,
        rawText: `NeuralMatrix Cloud Labs is inviting applications for our 6-Month Cloud Infrastructure Internship (2026 Batch). Stipend: ₹45,000/month. Location: Bangalore (Hybrid). Required skills: Python, Docker, TypeScript, PostgreSQL. Apply directly at our official portal: https://neuralmatrix.io/careers/infra-intern-2026. Zero application fee.`,
        extractedCompany: 'NeuralMatrix Cloud Labs',
        extractedRole: 'Cloud Infrastructure Intern',
        extractedType: 'INTERNSHIP',
        extractedSalary: null,
        extractedStipend: '₹45,000/month',
        extractedFee: 'None / ₹0',
        extractedDuration: '6 Months',
        extractedLocation: 'Bangalore (Hybrid)',
        extractedDeadline: '15 October 2026',
        extractedRecruiter: 'Talent Acquisition Team',
        extractedEmail: 'talent@neuralmatrix.io',
        extractedPhone: null,
        extractedUrls: JSON.stringify(['https://neuralmatrix.io/careers/infra-intern-2026']),
        extractedSkills: JSON.stringify(['Python', 'Docker', 'TypeScript', 'PostgreSQL']),
        extractedEligibility: '2026 Batch',
        riskLevel: 'LOW_RISK',
        riskScore: 12,
        detectedIndicators: JSON.stringify([]),
        riskReasoning: 'Standard professional recruitment posting with verified enterprise domain links and zero financial demands.',
        positiveSignals: JSON.stringify([
          'Official enterprise domain email and portal',
          'Explicit zero application fee policy',
          'Clearly defined role responsibilities and duration'
        ]),
        recommendations: JSON.stringify([
          'Submit your resume and portfolio via the official neuralmatrix.io portal.'
        ]),
        isDemo: true
      }
    ]
  });

  console.log('✅ Credora database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
