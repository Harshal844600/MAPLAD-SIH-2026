import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
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
        element: <RiskIntelligence />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'investigations',
        element: <Investigations />,
      },
      {
        path: 'investigations/:investigationId',
        element: <InvestigationDetails />,
      },
      {
        path: 'sentinel-ai',
        element: <SentinelAIPage />,
      },
      {
        path: 'documents',
        element: <DocumentOCR />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'admin',
        element: <Administration />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
