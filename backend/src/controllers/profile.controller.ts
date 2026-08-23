import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { AuthService } from '../services/auth.service.js';
import { prisma } from '../prisma.js';

export class ProfileController {
  public static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          profile: true,
          preferences: true
        }
      });
      res.json({ profile: user?.profile, preferences: user?.preferences, user });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const updated = await AuthService.updateProfile(req.user.id, req.body);
      res.json({ profile: updated });
    } catch (err) {
      next(err);
    }
  }
}
