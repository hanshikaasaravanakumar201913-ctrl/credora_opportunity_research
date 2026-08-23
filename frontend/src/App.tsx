import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { ThemeProvider } from './contexts/ThemeContext.js';

// Layouts
import { PublicLayout } from './layouts/PublicLayout.js';
import { DashboardLayout } from './layouts/DashboardLayout.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ResearchHubPage } from './pages/ResearchHubPage.js';
import { SearchResultsPage } from './pages/SearchResultsPage.js';
import { CompanyDossierPage } from './pages/CompanyDossierPage.js';
import { OpportunityPage } from './pages/OpportunityPage.js';
import { MessageAnalyzerPage } from './pages/MessageAnalyzerPage.js';
import { ComparisonMatrixPage } from './pages/ComparisonMatrixPage.js';
import { RecommendationsPage } from './pages/RecommendationsPage.js';
import { ResearchReportPage } from './pages/ResearchReportPage.js';
import { SavedReportsPage } from './pages/SavedReportsPage.js';
import { SearchHistoryPage } from './pages/SearchHistoryPage.js';
import { ProfileOnboardingPage } from './pages/ProfileOnboardingPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.js';

// Route guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-[#4EA36C] font-mono text-xs">
        Loading Credora Intelligence...
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Dashboard / Workspace Layout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/research" element={<ResearchHubPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/company/:id" element={<CompanyDossierPage />} />
              <Route path="/opportunity/:id" element={<OpportunityPage />} />
              <Route path="/analyze-message" element={<MessageAnalyzerPage />} />
              <Route path="/compare" element={<ComparisonMatrixPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/report/:id" element={<ResearchReportPage />} />
              <Route path="/saved-reports" element={<SavedReportsPage />} />
              <Route path="/history" element={<SearchHistoryPage />} />
              <Route path="/profile" element={<ProfileOnboardingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
