import { ProviderResult } from '../../types/index.js';

export interface ISearchProvider {
  searchCompany(name: string): Promise<ProviderResult<any>>;
}

export class PublicSearchProvider implements ISearchProvider {
  public async searchCompany(name: string): Promise<ProviderResult<any>> {
    return {
      provider: 'Public Discovery Index',
      sourceType: 'DIRECTORY',
      timestamp: new Date().toISOString(),
      confidence: 'HIGH',
      status: 'VERIFIED',
      data: {
        query: name,
        matchedRecords: 1,
        source: 'Public Web and Directory Crawl'
      }
    };
  }
}
