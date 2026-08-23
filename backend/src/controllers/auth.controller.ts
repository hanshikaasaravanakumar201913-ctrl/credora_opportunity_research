import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, password, and name are required.' });
        return;
      }
      const result = await AuthService.register(email, password, name);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = await AuthService.getCurrentUser(req.user.id);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {
    res.json({ message: 'Logged out successfully.' });
  }
}
