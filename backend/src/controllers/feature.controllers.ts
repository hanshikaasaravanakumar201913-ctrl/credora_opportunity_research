import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { ComparisonService } from '../services/comparison.service.js';
import { RecommendationService } from '../services/recommendation.service.js';
import { ReportService } from '../services/report.service.js';
import { SearchService } from '../services/search.service.js';
import { ContactService } from '../services/contact.service.js';

export class CompareController {
  public static async compare(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { opportunityIds } = req.body;
      if (!opportunityIds || !Array.isArray(opportunityIds) || opportunityIds.length < 2) {
        res.status(400).json({ error: 'Please provide an array of 2 to 5 opportunity IDs to compare.' });
        return;
      }
      const result = await ComparisonService.compareOpportunities(opportunityIds, req.user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export class RecommendationController {
  public static async getRecommendations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const recommendations = await RecommendationService.getPersonalizedRecommendations(req.user.id);
      res.json({ recommendations });
    } catch (err) {
      next(err);
    }
  }
}

export class ReportController {
  public static async generateReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId, opportunityId } = req.body;
      if (!companyId) {
        res.status(400).json({ error: 'companyId is required.' });
        return;
      }
      const report = await ReportService.generateFullReport(companyId, opportunityId, req.user?.id);
      res.json({ report });
    } catch (err) {
      next(err);
    }
  }

  public static async getReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const report = await ReportService.getReportById(id);
      if (!report) {
        res.status(404).json({ error: 'Research report not found.' });
        return;
      }
      res.json({ report });
    } catch (err) {
      next(err);
    }
  }

  public static async saveReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const { notes } = req.body;
      const saved = await ReportService.saveReportForUser(req.user.id, id, notes);
      res.json({ saved });
    } catch (err) {
      next(err);
    }
  }

  public static async listSavedReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const savedReports = await ReportService.listUserSavedReports(req.user.id);
      res.json({ savedReports });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteSavedReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      await ReportService.deleteSavedReport(req.user.id, id);
      res.json({ message: 'Saved report deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
}

export class HistoryController {
  public static async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const history = await SearchService.getUserSearchHistory(req.user.id);
      res.json({ history });
    } catch (err) {
      next(err);
    }
  }
}

export class ContactController {
  public static async getContacts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const contacts = await ContactService.getCompanyContacts(id);
      res.json({ contacts });
    } catch (err) {
      next(err);
    }
  }

  public static async getEmailTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyName, opportunityTitle, studentName, recruiterName } = req.body;
      const template = ContactService.generateVerificationEmailTemplate(
        companyName || 'Organization',
        opportunityTitle || 'Career Opportunity',
        studentName || req.user?.email || 'Candidate',
        recruiterName
      );
      res.json(template);
    } catch (err) {
      next(err);
    }
  }
}
