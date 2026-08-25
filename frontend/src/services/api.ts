import { DiscoveredEntityCandidate } from '../types/index.js';

const API_BASE_URL = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('credora_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Network request failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    return res.json();
  }

  // AUTH
  public async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  public async register(email: string, password: string, name: string) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  public async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  // PROFILE
  public async getProfile() {
    return this.request<{ profile: any; preferences: any; user: any }>('/profile');
  }

  public async updateProfile(data: any) {
    return this.request<{ profile: any }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DISCOVERY & AUTOCOMPLETE PIPELINE
  public async autocomplete(q: string) {
    return this.request<{ query: string; exactMatch?: DiscoveredEntityCandidate; candidates: DiscoveredEntityCandidate[]; similarCompanies?: DiscoveredEntityCandidate[]; totalFound: number }>(
      `/companies/search/autocomplete?q=${encodeURIComponent(q)}`
    );
  }

  public async searchCandidates(q: string) {
    return this.request<{ query: string; exactMatch?: DiscoveredEntityCandidate; candidates: DiscoveredEntityCandidate[]; similarCompanies?: DiscoveredEntityCandidate[]; totalFound: number }>(
      `/companies/search/candidates?q=${encodeURIComponent(q)}`
    );
  }

  public async executeResearch(target: string) {
    return this.request<any>('/research/execute', {
      method: 'POST',
      body: JSON.stringify({ target })
    });
  }

  // UNIVERSAL RESEARCH SEARCH
  public async universalSearch(query: string) {
    return this.request<any>('/research', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  // COMPANY
  public async getCompany(idOrSlug: string) {
    return this.request<{ company: any }>(`/companies/${idOrSlug}`);
  }

  public async refreshCompany(id: string) {
    return this.request<any>(`/companies/${id}/refresh`, {
      method: 'POST'
    });
  }

  public async listCompanies() {
    return this.request<{ companies: any[] }>('/companies');
  }

  public async researchCompany(name: string, websiteUrl?: string) {
    return this.request<{ company: any }>('/companies/research', {
      method: 'POST',
      body: JSON.stringify({ name, websiteUrl })
    });
  }

  // OPPORTUNITY
  public async getOpportunity(idOrSlug: string) {
    return this.request<{ opportunity: any; match: any }>(`/opportunities/${idOrSlug}`);
  }

  public async listOpportunities(params?: { type?: string; workMode?: string; search?: string; limit?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ opportunities: any[] }>(`/opportunities${query ? `?${query}` : ''}`);
  }

  // MESSAGE ANALYSIS
  public async analyzeMessage(text: string) {
    return this.request<any>('/messages/analyze', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  public async getMessage(id: string) {
    return this.request<any>(`/messages/${id}`);
  }

  // CREDIBILITY
  public async analyzeCredibility(companyId: string, opportunityId?: string) {
    return this.request<any>('/credibility/analyze', {
      method: 'POST',
      body: JSON.stringify({ companyId, opportunityId })
    });
  }

  // COMPARISON
  public async compareOpportunities(opportunityIds: string[]) {
    return this.request<any>('/compare', {
      method: 'POST',
      body: JSON.stringify({ opportunityIds })
    });
  }

  // RECOMMENDATIONS
  public async getRecommendations() {
    return this.request<{ recommendations: any[] }>('/recommendations');
  }

  // RESEARCH REPORTS
  public async generateReport(companyId: string, opportunityId?: string) {
    return this.request<{ report: any }>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ companyId, opportunityId })
    });
  }

  public async getReport(id: string) {
    return this.request<{ report: any }>(`/reports/${id}`);
  }

  public async saveReport(id: string, notes?: string) {
    return this.request<any>(`/reports/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  public async listSavedReports() {
    return this.request<{ savedReports: any[] }>('/reports/saved');
  }

  public async deleteSavedReport(id: string) {
    return this.request<any>(`/reports/saved/${id}`, {
      method: 'DELETE'
    });
  }

  // SEARCH HISTORY
  public async getSearchHistory() {
    return this.request<{ history: any[] }>('/history');
  }

  // CONTACTS & EMAIL TEMPLATE
  public async getCompanyContacts(companyId: string) {
    return this.request<{ contacts: any[] }>(`/companies/${companyId}/contacts`);
  }

  public async getEmailTemplate(params: {
    companyName: string;
    opportunityTitle: string;
    studentName: string;
    recruiterName?: string;
  }) {
    return this.request<{ subject: string; body: string; recipientPlaceholder: string }>('/contacts/email-template', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
}

export const api = new ApiService();
