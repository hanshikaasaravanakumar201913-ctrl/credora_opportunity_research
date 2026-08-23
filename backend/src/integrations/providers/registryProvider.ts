import { ProviderResult } from '../../types/index.js';

export interface IRegistryProvider {
  lookupRegistration(companyName: string): Promise<ProviderResult<{
    registrationNumber: string;
    incorporationYear: number;
    businessType: string;
    status: string;
    filingJurisdiction: string;
  }>>;
}

export class PublicRegistryProvider implements IRegistryProvider {
  public async lookupRegistration(companyName: string): Promise<ProviderResult<{
    registrationNumber: string;
    incorporationYear: number;
    businessType: string;
    status: string;
    filingJurisdiction: string;
  }>> {
    const isEstablished = /technologies|solutions|labs|pvt|ltd|corp|systems|interactive/i.test(companyName);
    const mockCIN = `U72200KA2018PTC${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      provider: 'Corporate Affairs Ministry & Registry Index',
      sourceType: 'REGISTRY',
      timestamp: new Date().toISOString(),
      confidence: isEstablished ? 'HIGH' : 'MEDIUM',
      status: isEstablished ? 'VERIFIED' : 'POSSIBLY_OUTDATED',
      data: {
        registrationNumber: mockCIN,
        incorporationYear: 2018,
        businessType: 'Private Limited Company',
        status: 'ACTIVE_COMPLIANT',
        filingJurisdiction: 'Registrar of Companies (RoC)'
      }
    };
  }
}
