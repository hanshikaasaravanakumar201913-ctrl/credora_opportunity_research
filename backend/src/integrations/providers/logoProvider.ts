import { LogoProvider } from './providerTypes.js';

export class DomainLogoProvider implements LogoProvider {
  public name = 'DomainLogoProvider';

  public resolveLogo(domain?: string, companyName?: string): string | null {
    if (!domain) return null;

    // Clean the domain (e.g. remove http://, https://, www., paths)
    let cleanDomain = domain.toLowerCase().trim();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    if (!cleanDomain || !cleanDomain.includes('.')) {
      return null;
    }

    // Return the high-res favicon/logo URL based on the verified domain
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`;
  }

  public getInitials(name: string): string {
    if (!name) return 'CR';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}

export const logoProvider = new DomainLogoProvider();
