import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { ResearchPipelineService } from '../services/researchPipeline.service.js';
import { CompanyService } from '../services/company.service.js';
import { OpportunityService } from '../services/opportunity.service.js';

export class ResearchController {
  /**
   * Universal search: Discovers candidate matches or executes message analysis
   */
  public static async universalSearch(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || query.trim() === '') {
        res.status(400).json({ error: 'Search query is required.' });
        return;
      }

      // Execute live entity research or candidate discovery
      const result = await ResearchPipelineService.researchEntity(query, req.user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fast debounced autocomplete for live typing in search bars
   */
  public static async autocomplete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      if (!q || q.trim().length < 2) {
        res.json({ candidates: [] });
        return;
      }
      const discovery = await ResearchPipelineService.discoverCandidates(q, req.user?.id);
      res.json({
        query: discovery.query,
        candidates: discovery.candidates.slice(0, 6),
        totalFound: discovery.totalFound
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Full multi-source company discovery returning candidate entity cards
   */
  public static async searchCandidates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || (req.body.query as string) || '';
      if (!q || q.trim() === '') {
        res.status(400).json({ error: 'Query parameter q is required.' });
        return;
      }
      const discovery = await ResearchPipelineService.discoverCandidates(q, req.user?.id);
      res.json(discovery);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deep research execution for a selected entity
   */
  public static async executeResearch(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { target } = req.body;
      if (!target || typeof target !== 'string' || target.trim() === '') {
        res.status(400).json({ error: 'Target company name or slug is required.' });
        return;
      }
      const result = await ResearchPipelineService.researchEntity(target, req.user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export class CompanyController {
  public static async getCompany(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      let company: any = await CompanyService.getCompanyById(id);

      // If not in database, attempt live multi-source research to resolve entity
      if (!company) {
        const liveResult = await ResearchPipelineService.researchEntity(id, req.user?.id);
        if (liveResult.isFound && liveResult.company) {
          company = liveResult.company;
        }
      }

      if (!company) {
        res.status(404).json({
          error: 'Company not found',
          message: 'Information could not be verified from the sources checked.'
        });
        return;
      }
      res.json({ company });
    } catch (err) {
      next(err);
    }
  }

  public static async researchCompany(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Company name is required.' });
        return;
      }
      const result = await ResearchPipelineService.researchEntity(name, req.user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async refreshCompany(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ResearchPipelineService.researchEntity(id, req.user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async listCompanies(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await CompanyService.listCompanies();
      res.json({ companies });
    } catch (err) {
      next(err);
    }
  }
}

export class OpportunityController {
  public static async getOpportunity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const opportunity = await OpportunityService.getOpportunityById(id);
      if (!opportunity) {
        res.status(404).json({ error: 'Opportunity not found' });
        return;
      }
      const match = await OpportunityService.calculateStudentMatch(opportunity.id, req.user?.id);
      res.json({ opportunity, match });
    } catch (err) {
      next(err);
    }
  }

  public static async listOpportunities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, workMode, search } = req.query;
      const opportunities = await OpportunityService.listOpportunities({
        type: type as string,
        workMode: workMode as string,
        search: search as string
      });
      res.json({ opportunities });
    } catch (err) {
      next(err);
    }
  }
}
