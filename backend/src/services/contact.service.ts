import { prisma } from '../prisma.js';

export class ContactService {
  public static async getCompanyContacts(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { contacts: true }
    });

    if (!company) throw new Error('Company not found');

    return company.contacts;
  }

  public static generateVerificationEmailTemplate(
    companyName: string,
    opportunityTitle: string,
    studentName: string,
    recruiterName?: string
  ) {
    const subject = `Inquiry regarding ${opportunityTitle} Opportunity — Candidate Verification`;
    const body = `Dear ${recruiterName || 'Talent Acquisition Team / HR Desk'} at ${companyName},

I hope this message finds you well.

My name is ${studentName}, and I am an aspiring candidate interested in career opportunities with ${companyName}. I recently came across a listing / communication for the position of "${opportunityTitle}" associated with your organization.

To ensure authenticity and adhere to standard professional diligence, I am writing to independently confirm:
1. Whether this opportunity is currently open and authorized by ${companyName}.
2. The official portal, email address, or application channel through which candidate applications are formally accepted.

Thank you very much for your time, guidance, and support.

Warm regards,
${studentName}
Credora Research Platform Verification Inquirer`;

    return {
      subject,
      body,
      recipientPlaceholder: `careers@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
    };
  }
}
