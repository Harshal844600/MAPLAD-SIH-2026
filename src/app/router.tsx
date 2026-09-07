import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RoleGuard } from '../components/layout/RoleGuard';
import { LandingPage } from '../pages/LandingPage';
import { Dashboard } from '../pages/Dashboard';
import { Projects } from '../pages/Projects';
import { ProjectDetails } from '../pages/ProjectDetails';
import { RiskIntelligence } from '../pages/RiskIntelligence';
import { MapPage } from '../pages/MapPage';
import { Investigations } from '../pages/Investigations';
import { InvestigationDetails } from '../pages/InvestigationDetails';
import { SentinelAIPage } from '../pages/SentinelAIPage';
import { DocumentOCR } from '../pages/DocumentOCR';
import { Analytics } from '../pages/Analytics';
import { Reports } from '../pages/Reports';
import { Administration } from '../pages/Administration';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'projects/:projectId',
        element: <ProjectDetails />,
      },
      {
        path: 'risk',
        element: (
          <RoleGuard permission="VIEW_RISK_INTELLIGENCE">
            <RiskIntelligence />
          </RoleGuard>
        ),
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'investigations',
        element: (
          <RoleGuard permission="VIEW_INVESTIGATIONS">
            <Investigations />
          </RoleGuard>
        ),
      },
      {
        path: 'investigations/:investigationId',
        element: (
          <RoleGuard permission="VIEW_INVESTIGATIONS">
            <InvestigationDetails />
          </RoleGuard>
        ),
      },
      {
        path: 'sentinel-ai',
        element: (
          <RoleGuard permission="VIEW_AI_COPILOT">
            <SentinelAIPage />
          </RoleGuard>
        ),
      },
      {
        path: 'documents',
        element: (
          <RoleGuard permission="VIEW_DOCUMENTS_OCR">
            <DocumentOCR />
          </RoleGuard>
        ),
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'reports',
        element: (
          <RoleGuard permission="EXPORT_REPORTS">
            <Reports />
          </RoleGuard>
        ),
      },
      {
        path: 'admin',
        element: (
          <RoleGuard permission="MANAGE_ADMIN_SETTINGS">
            <Administration />
          </RoleGuard>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
