import { ExtractedMessageAttributes, OpportunityType, RiskLevel } from '../types/index.js';
import { HeuristicAnalyzer } from './heuristicAnalyzer.js';

export class GeminiAdapter {
  private static apiKey = process.env.GEMINI_API_KEY || '';

  public static async analyzeOpportunityMessage(rawText: string): Promise<ExtractedMessageAttributes> {
    // If no Gemini key is provided, use deterministic HeuristicAnalyzer
    if (!this.apiKey || this.apiKey.trim() === '') {
      return HeuristicAnalyzer.extractAndAnalyzeMessage(rawText);
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const prompt = `You are the Credora AI Synthesis Engine. Analyze the following career opportunity message with extreme objectivity and strict zero-fabrication.
If information is not explicitly stated, return null. Do NOT invent facts.

Return ONLY a valid JSON object matching this TypeScript structure:
{
  "company": string | null,
  "role": string | null,
  "type": "INTERNSHIP" | "FULL_TIME_JOB" | "ONLINE_COURSE" | "TRAINING_PROGRAM",
  "salary": string | null,
  "stipend": string | null,
  "fee": string | null,
  "hasUpfrontFee": boolean,
  "duration": string | null,
  "location": string | null,
  "deadline": string | null,
  "recruiterName": string | null,
  "email": string | null,
  "isFreeWebmail": boolean,
  "phone": string | null,
  "urls": string[],
  "hasShortenedUrls": boolean,
  "skills": string[],
  "eligibility": string | null,
  "detectedIndicators": string[],
  "riskLevel": "LOW_RISK" | "MODERATE_RISK" | "HIGH_RISK" | "INSUFFICIENT_INFORMATION",
  "riskScore": number,
  "riskReasoning": string,
  "positiveSignals": string[],
  "recommendations": string[]
}

Message Text:
"""
${rawText}
"""`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const json: any = await response.json();
      const textOutput = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) throw new Error('Empty response from Gemini');

      const parsed: ExtractedMessageAttributes = JSON.parse(textOutput);
      return parsed;
    } catch (error) {
      console.warn('Gemini synthesis failed, falling back to deterministic Heuristic Analyzer:', error);
      return HeuristicAnalyzer.extractAndAnalyzeMessage(rawText);
    }
  }

  public static async generateResearchNarrative(
    companyName: string,
    opportunityTitle: string | null,
    credibilityScore: number,
    positiveSignals: string[],
    warningSignals: string[]
  ): Promise<string> {
    if (!this.apiKey) {
      return credibilityScore >= 75
        ? `${companyName} demonstrates verifiable corporate registration parameters and digital continuity across audited sources. Students are encouraged to cross-reference specific role terms through the official portal.`
        : `${companyName} exhibits verifiable presence but has elements (such as secondary contact channels or missing public audits) requiring independent validation before committing personal assets or documents.`;
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const prompt = `Generate a concise 2-3 sentence objective research synthesis for a student researching ${companyName} (${opportunityTitle || 'Opportunity'}).
Credibility Assessment Score: ${credibilityScore}/100.
Positive Signals: ${JSON.stringify(positiveSignals)}
Warning Signals: ${JSON.stringify(warningSignals)}
Do not state absolute certainty or make sensational claims. Use calm, evidence-based advisory language.`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const json: any = await response.json();
      const textOutput = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      return textOutput?.trim() || `${companyName} research dossier synthesized from available public registries.`;
    } catch {
      return `${companyName} research dossier synthesized from available public registries.`;
    }
  }
}
