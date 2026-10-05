import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query/client';
import { AuthProvider } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';

import { LandingPage } from '@/routes/LandingPage';
import { CompaniesPage } from '@/routes/CompaniesPage';
import { CompanyDetailPage } from '@/routes/CompanyDetailPage';
import { ExperiencesPage } from '@/routes/ExperiencesPage';
import { ResourcesPage } from '@/routes/ResourcesPage';
import { WorkspaceView } from '@/features/workspace/WorkspaceView';
import { ContributePage } from '@/routes/ContributePage';
import { ModerationDashboard } from '@/features/moderation/ModerationDashboard';
import { LoginPage } from '@/routes/LoginPage';
import { RegisterPage } from '@/routes/RegisterPage';
import { NotFoundPage } from '@/routes/NotFoundPage';

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="companies/:slug" element={<CompanyDetailPage />} />
              <Route path="experiences" element={<ExperiencesPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="workspace" element={<WorkspaceView />} />
              <Route path="contribute" element={<ContributePage />} />
              <Route path="moderation" element={<ModerationDashboard />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
