import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  AlertTriangle,
  Eye,
  Compass,
  ShieldAlert,
  Layers,
  Search,
  Filter,
  Navigation,
  Activity,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  RiskBadge,
  ClassicalSelect,
  VolumeHeader,
  ArchiveLabel,
  LiveStatusPill,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { DEMO_STATES } from '../services/demo/syntheticData';
import { ProjectEntity } from '../types';

// Custom Luxury SVG icon generator for Leaflet markers
const createCustomIcon = (riskScore: number, isSelected = false) => {
  const pinColor =
    riskScore >= 80
      ? '#ef4444' // Semantic red
      : riskScore >= 60
      ? '#f59e0b' // Semantic amber
      : riskScore >= 30
      ? '#c9b8a0' // Neutral gold
      : '#10b981'; // Semantic emerald

  const strokeColor = isSelected ? '#ffffff' : '#0a0a0a';
  const glowFilter = isSelected ? 'drop-shadow(0 0 8px ' + pinColor + ')' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';

  const svg = `
    <svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: ${glowFilter};">
      <path d="M18 0C8.06 0 0 8.06 0 18C0 31.5 18 46 18 46C18 46 36 31.5 36 18C36 8.06 27.94 0 18 0Z" fill="${pinColor}" stroke="${strokeColor}" stroke-width="${isSelected ? '2.5' : '1.5'}"/>
      <circle cx="18" cy="18" r="8" fill="#0a0a0a" stroke="#c9b8a0" stroke-width="1.5"/>
      <text x="18" y="21" font-family="'JetBrains Mono', monospace" font-weight="800" font-size="8.5" fill="#f8f9fa" text-anchor="middle">${riskScore}</text>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -44],
  });
};

export const MapPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState('st-up');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [activeProject, setActiveProject] = useState<ProjectEntity | null>(null);

  const projects = appStore.getProjects({
    stateId: selectedState !== 'ALL' ? selectedState : undefined,
    riskLevel: selectedRisk !== 'ALL' ? selectedRisk : undefined,
    pageSize: 100,
  }).items;

  // Center on Prayagraj/UP by default
  const defaultCenter: [number, number] = [25.4358, 81.8463];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. VOLUME HEADER & FILTERS */}
      <VolumeHeader
        volume="VOLUME IV"
        title="Geographic Intelligence (GIS)"
        subtitle="Spatial distribution of MPLADS asset coordinates cross-referenced against PostGIS topological proximity buffers."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <LiveStatusPill label="POSTGIS ACTIVE" />
            <div className="w-48">
              <ClassicalSelect
                options={[
                  { value: 'ALL', label: 'All Jurisdictions' },
                  ...DEMO_STATES.map((s) => ({ value: s.id, label: s.name })),
                ]}
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              />
            </div>
            <div className="w-40">
              <ClassicalSelect
                options={[
                  { value: 'ALL', label: 'All Risk Tiers' },
                  { value: 'CRITICAL', label: 'Critical (80-100)' },
                  { value: 'HIGH', label: 'High (60-79)' },
                  { value: 'MEDIUM', label: 'Medium (30-59)' },
                  { value: 'LOW', label: 'Low (0-29)' },
                ]}
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
              />
            </div>
          </div>
        }
      />

      {/* 2. MAP CONTAINER & DETAIL OVERLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View (8 cols) */}
        <div className="lg:col-span-8 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-2xl shadow-2xl overflow-hidden h-[640px] relative bg-[#0a0a0a] glass-card">
          <MapContainer
            center={defaultCenter}
            zoom={8}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Overlap Buffer Highlight on Flagship Prayagraj site */}
            <Circle
              center={[25.5482, 81.9834]}
              radius={35} // 35 meters proximity buffer
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.35,
                weight: 2,
                dashArray: '6 6',
              }}
            />

            {projects.map((proj) => (
              <Marker
                key={proj.id}
                position={[proj.latitude, proj.longitude]}
                icon={createCustomIcon(proj.risk_score, activeProject?.id === proj.id)}
                eventHandlers={{
                  click: () => setActiveProject(proj),
                }}
              >
                <Popup>
                  <div className="p-2 text-xs space-y-1.5 max-w-[220px] text-slate-900 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] bg-slate-900 text-[#e8d5b7] px-1.5 py-0.5 rounded">
                        #{proj.project_code}
                      </span>
                      <RiskBadge score={proj.risk_score} size="sm" />
                    </div>
                    <h5 className="font-bold text-sm leading-snug text-slate-900">
                      {proj.title}
                    </h5>
                    <p className="font-mono text-[11px] text-slate-600">
                      Sanctioned: ₹{(proj.sanctioned_amount / 100000).toFixed(2)} Lakhs
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {proj.district_name}, {proj.state_name}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 p-3.5 bg-black/80 dark:bg-black/85 light:bg-white/95 backdrop-blur-md border border-white/10 dark:border-white/10 light:border-slate-300 rounded-xl shadow-xl text-xs space-y-2">
            <ArchiveLabel text="SPATIAL RISK SPECTRUM" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                <span className="text-[11px] font-mono text-zinc-300 light:text-slate-700">Critical (80+)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span className="text-[11px] font-mono text-zinc-300 light:text-slate-700">High (60-79)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c9b8a0]" />
                <span className="text-[11px] font-mono text-zinc-300 light:text-slate-700">Medium (30-59)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[11px] font-mono text-zinc-300 light:text-slate-700">Low (0-29)</span>
              </div>
            </div>
          </div>

          {/* Spatial Overlap Tag */}
          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-red-950/80 light:bg-red-50 border border-red-500/40 rounded-full flex items-center gap-2 text-xs text-red-300 light:text-red-700 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono font-medium">1 PostGIS Proximity Alert</span>
          </div>
        </div>

        {/* Selected Project Inspector Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {activeProject ? (
            <DossierCard
              className={`p-6 space-y-4 border-beam-card ${
                activeProject.risk_score >= 80 ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs px-2.5 py-1 bg-white/5 light:bg-slate-100 text-[#c9b8a0] light:text-slate-900 border border-white/10 light:border-slate-300 rounded-lg">
                  #{activeProject.project_code}
                </span>
                <RiskBadge score={activeProject.risk_score} size="sm" />
              </div>

              <h3 className="text-xl font-bold font-serif text-white light:text-slate-900 leading-snug">
                {activeProject.title}
              </h3>

              <div className="space-y-3 text-xs border-t border-white/10 light:border-slate-200 pt-3 text-zinc-300 light:text-slate-700">
                <div>
                  <span className="text-zinc-500 light:text-slate-500 font-mono text-[10px] uppercase tracking-wider block">
                    LOCATION JURISDICTION
                  </span>
                  <p className="font-medium text-white light:text-slate-900 mt-0.5">
                    {activeProject.location_name}, {activeProject.district_name}, {activeProject.state_name}
                  </p>
                </div>

                <div>
                  <span className="text-zinc-500 light:text-slate-500 font-mono text-[10px] uppercase tracking-wider block">
                    GEODETIC COORDINATES
                  </span>
                  <p className="font-mono text-[#c9b8a0] light:text-amber-700 font-medium mt-0.5">
                    {activeProject.latitude.toFixed(5)}° N, {activeProject.longitude.toFixed(5)}° E
                  </p>
                </div>

                <div>
                  <span className="text-zinc-500 light:text-slate-500 font-mono text-[10px] uppercase tracking-wider block">
                    AWARDED CONTRACTOR
                  </span>
                  <p className="font-medium text-white light:text-slate-900 mt-0.5">
                    {activeProject.vendor_name || 'Direct Execution'}
                  </p>
                </div>

                <div>
                  <span className="text-zinc-500 light:text-slate-500 font-mono text-[10px] uppercase tracking-wider block">
                    SANCTIONED OUTLAY
                  </span>
                  <p className="font-mono font-bold text-white light:text-slate-900 text-sm mt-0.5">
                    ₹{activeProject.sanctioned_amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 light:border-slate-200">
                <Link to={`/projects/${activeProject.project_code}`}>
                  <ClassicalButton
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    icon={<Eye className="w-4 h-4" />}
                  >
                    EXAMINE FULL DOSSIER
                  </ClassicalButton>
                </Link>
              </div>
            </DossierCard>
          ) : (
            <ClassicalCard className="p-8 text-center space-y-3">
              <Compass className="w-10 h-10 text-[#c9b8a0] mx-auto opacity-80 animate-spin-slow" />
              <h4 className="font-serif font-bold text-lg text-white light:text-slate-900">
                Select Any Geodetic Marker
              </h4>
              <p className="text-xs text-zinc-400 light:text-slate-600 leading-relaxed">
                Click a marker on the topological map to inspect coordinates, contractor details, and anomaly layers.
              </p>
            </ClassicalCard>
          )}

          {/* Quick Flagged Proximity Alert */}
          <div className="p-4 bg-red-950/40 light:bg-red-50/80 border border-red-500/30 rounded-xl space-y-2 text-xs text-red-200 light:text-red-900 glass-card">
            <h5 className="font-mono font-bold text-xs text-red-400 light:text-red-700 flex items-center gap-1.5 tracking-wider">
              <ShieldAlert className="w-4 h-4 text-red-400 light:text-red-600" />
              SPATIAL DUPLICATION DETECTED
            </h5>
            <p className="text-zinc-400 light:text-slate-600 leading-relaxed">
              Phulpur Community Hall (<strong className="text-white light:text-slate-900 font-mono">#MPLAD-10291</strong>) coordinates overlap a completed 2023 panchayat asset within an 8-meter radial threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
