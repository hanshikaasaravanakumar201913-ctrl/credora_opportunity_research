import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ProfileController } from '../controllers/profile.controller.js';
import { ResearchController, CompanyController, OpportunityController } from '../controllers/research.controller.js';
import { MessageController, CredibilityController } from '../controllers/message.controller.js';
import {
  CompareController,
  RecommendationController,
  ReportController,
  HistoryController,
  ContactController
} from '../controllers/feature.controllers.js';
import { authenticateToken, optionalAuthenticate } from '../middleware/auth.middleware.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Credora Career Opportunity Intelligence Platform',
    version: '2.0.0',
    tagline: 'Research. Compare. Verify. Decide.',
    timestamp: new Date().toISOString()
  });
});

// AUTH
apiRouter.post('/auth/register', AuthController.register);
apiRouter.post('/auth/login', AuthController.login);
apiRouter.post('/auth/logout', AuthController.logout);
apiRouter.get('/auth/me', authenticateToken, AuthController.me);

// PROFILE
apiRouter.get('/profile', authenticateToken, ProfileController.getProfile);
apiRouter.put('/profile', authenticateToken, ProfileController.updateProfile);

// RESEARCH & DISCOVERY PIPELINE
apiRouter.get('/companies/search/autocomplete', optionalAuthenticate, ResearchController.autocomplete);
apiRouter.get('/companies/search/candidates', optionalAuthenticate, ResearchController.searchCandidates);
apiRouter.post('/research/execute', optionalAuthenticate, ResearchController.executeResearch);
apiRouter.post('/research', optionalAuthenticate, ResearchController.universalSearch);

// COMPANY
apiRouter.post('/companies/research', optionalAuthenticate, CompanyController.researchCompany);
apiRouter.post('/companies/:id/refresh', optionalAuthenticate, CompanyController.refreshCompany);
apiRouter.get('/companies', optionalAuthenticate, CompanyController.listCompanies);
apiRouter.get('/companies/:id', optionalAuthenticate, CompanyController.getCompany);

// OPPORTUNITY
apiRouter.get('/opportunities', optionalAuthenticate, OpportunityController.listOpportunities);
apiRouter.get('/opportunities/:id', optionalAuthenticate, OpportunityController.getOpportunity);

// MESSAGE ANALYSIS
apiRouter.post('/messages/analyze', optionalAuthenticate, MessageController.analyzeMessage);
apiRouter.get('/messages/:id', optionalAuthenticate, MessageController.getMessage);

// CREDIBILITY ANALYSIS
apiRouter.post('/credibility/analyze', optionalAuthenticate, CredibilityController.analyzeCredibility);

// COMPARISON MATRIX
apiRouter.post('/compare', optionalAuthenticate, CompareController.compare);

// RECOMMENDATIONS
apiRouter.get('/recommendations', authenticateToken, RecommendationController.getRecommendations);

// CONTACTS & SOURCE AUDIT
apiRouter.get('/companies/:id/contacts', optionalAuthenticate, ContactController.getContacts);
apiRouter.post('/contacts/email-template', optionalAuthenticate, ContactController.getEmailTemplate);

// RESEARCH REPORTS
apiRouter.post('/reports/generate', optionalAuthenticate, ReportController.generateReport);
apiRouter.get('/reports/saved', authenticateToken, ReportController.listSavedReports);
apiRouter.get('/reports/:id', optionalAuthenticate, ReportController.getReport);
apiRouter.post('/reports/:id/save', authenticateToken, ReportController.saveReport);
apiRouter.delete('/reports/saved/:id', authenticateToken, ReportController.deleteSavedReport);

// SEARCH HISTORY
apiRouter.get('/history', authenticateToken, HistoryController.getHistory);
