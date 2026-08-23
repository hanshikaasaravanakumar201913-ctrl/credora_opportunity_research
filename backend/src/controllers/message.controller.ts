import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { MessageAnalysisService } from '../services/messageAnalysis.service.js';
import { CredibilityService } from '../services/credibility.service.js';

export class MessageController {
  public static async analyzeMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string' || text.trim() === '') {
        res.status(400).json({ error: 'Message text is required.' });
        return;
      }
      const result = await MessageAnalysisService.analyzeAndSaveMessage(text, req.user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async getMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MessageAnalysisService.getMessageById(id);
      if (!result) {
        res.status(404).json({ error: 'Message analysis record not found.' });
        return;
      }
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export class CredibilityController {
  public static async analyzeCredibility(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId, opportunityId } = req.body;
      if (!companyId) {
        res.status(400).json({ error: 'companyId is required.' });
        return;
      }
      const result = await CredibilityService.evaluateCredibility(companyId, opportunityId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
