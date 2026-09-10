// ==============================================================================
// MPLAD SENTINEL — APPLICATION ROUTER & RBAC ROUTE CLEARANCE
// ==============================================================================

import React, { lazy, Suspense } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RoleGuard } from '../components/layout/RoleGuard';

// Code-split Lazy Loaded Pages
const LandingPage = lazy(() => import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const Dashboard = lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Projects = lazy(() => import('../pages/Projects').then((m) => ({ default: m.Projects })));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails').then((m) => ({ default: m.ProjectDetails })));
const RiskIntelligence = lazy(() => import('../pages/RiskIntelligence').then((m) => ({ default: m.RiskIntelligence })));
const MapPage = lazy(() => import('../pages/MapPage').then((m) => ({ default: m.MapPage })));
const Investigations = lazy(() => import('../pages/Investigations').then((m) => ({ default: m.Investigations })));
const InvestigationDetails = lazy(() => import('../pages/InvestigationDetails').then((m) => ({ default: m.InvestigationDetails })));
const SentinelAIPage = lazy(() => import('../pages/SentinelAIPage').then((m) => ({ default: m.SentinelAIPage })));
const DocumentOCR = lazy(() => import('../pages/DocumentOCR').then((m) => ({ default: m.DocumentOCR })));
const Analytics = lazy(() => import('../pages/Analytics').then((m) => ({ default: m.Analytics })));
const Reports = lazy(() => import('../pages/Reports').then((m) => ({ default: m.Reports })));
const PermissionsPage = lazy(() => import('../pages/PermissionsPage').then((m) => ({ default: m.PermissionsPage })));
const Administration = lazy(() => import('../pages/Administration').then((m) => ({ default: m.Administration })));

// Sleek Suspense Loading Fallback
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-[#c9b8a0]/20" />
      <div className="absolute inset-0 rounded-full border-2 border-[#c9b8a0] border-t-transparent animate-spin" />
    </div>
    <span className="text-xs font-mono text-[#c9b8a0] light:text-amber-800 tracking-widest uppercase animate-pulse">
      Loading Telemetry Subsystem...
    </span>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
      },
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'dashboard',
        element: (
          <RoleGuard permission="dashboard.view">
            {withSuspense(Dashboard)}
          </RoleGuard>
        ),
      },
      {
        path: 'projects',
        element: (
          <RoleGuard permission="projects.view">
            {withSuspense(Projects)}
          </RoleGuard>
        ),
      },
      {
        path: 'projects/:projectId',
        element: (
          <RoleGuard permission="projects.view">
            {withSuspense(ProjectDetails)}
          </RoleGuard>
        ),
      },
      {
        path: 'risk',
        element: (
          <RoleGuard permission="risk.view">
            {withSuspense(RiskIntelligence)}
          </RoleGuard>
        ),
      },
      {
        path: 'map',
        element: (
          <RoleGuard permission="geo.view">
            {withSuspense(MapPage)}
          </RoleGuard>
        ),
      },
      {
        path: 'investigations',
        element: (
          <RoleGuard permission="anomaly.view">
            {withSuspense(Investigations)}
          </RoleGuard>
        ),
      },
      {
        path: 'investigations/:investigationId',
        element: (
          <RoleGuard permission="anomaly.view">
            {withSuspense(InvestigationDetails)}
          </RoleGuard>
        ),
      },
      {
        path: 'sentinel-ai',
        element: (
          <RoleGuard permission="ai.view">
            {withSuspense(SentinelAIPage)}
          </RoleGuard>
        ),
      },
      {
        path: 'documents',
        element: (
          <RoleGuard permission="documents.ocr">
            {withSuspense(DocumentOCR)}
          </RoleGuard>
        ),
      },
      {
        path: 'analytics',
        element: (
          <RoleGuard permission="analytics.view">
            {withSuspense(Analytics)}
          </RoleGuard>
        ),
      },
      {
        path: 'reports',
        element: (
          <RoleGuard permission="reports.view">
            {withSuspense(Reports)}
          </RoleGuard>
        ),
      },
      {
        path: 'permissions',
        element: (
          <RoleGuard permission="dashboard.view">
            {withSuspense(PermissionsPage)}
          </RoleGuard>
        ),
      },
      {
        path: 'admin',
        element: (
          <RoleGuard permission="settings.manage">
            {withSuspense(Administration)}
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
