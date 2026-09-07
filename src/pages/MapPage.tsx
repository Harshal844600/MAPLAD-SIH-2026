import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertTriangle, Eye, Compass, ShieldAlert } from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  RiskBadge,
  ClassicalSelect,
  VolumeHeader,
  ArchiveLabel,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { DEMO_STATES } from '../services/demo/syntheticData';
import { ProjectEntity } from '../types';

// Custom Classical SVG icon generator for Leaflet markers
const createCustomIcon = (riskScore: number, isSelected = false) => {
  const pinColor =
    riskScore >= 80 ? '#8B2635' : riskScore >= 60 ? '#C9A962' : riskScore >= 30 ? '#9C8B7A' : '#4A3F35';

  const strokeColor = isSelected ? '#E8DFD4' : '#1C1714';

  const svg = `
    <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17C0 29.8 17 42 17 42C17 42 34 29.8 34 17C34 7.6 26.4 0 17 0Z" fill="${pinColor}" stroke="${strokeColor}" stroke-width="2"/>
      <circle cx="17" cy="16" r="7" fill="#1C1714" stroke="#C9A962" stroke-width="1.5"/>
      <text x="17" y="19" font-family="Cinzel" font-weight="bold" font-size="8" fill="#E8DFD4" text-anchor="middle">${riskScore}</text>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-classical-marker',
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -40],
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
        title="GEOGRAPHIC INTELLIGENCE (GIS)"
        subtitle="Spatial distribution of MPLAD asset coordinates cross-referenced against PostGIS topological buffers."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <ClassicalSelect
                options={[{ value: 'ALL', label: 'All Jurisdictions' }, ...DEMO_STATES.map((s) => ({ value: s.id, label: s.name }))]}
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              />
            </div>
            <div className="w-40">
              <ClassicalSelect
                options={[
                  { value: 'ALL', label: 'All Risk Tiers' },
                  { value: 'CRITICAL', label: 'Critical Only' },
                  { value: 'HIGH', label: 'High Only' },
                  { value: 'MEDIUM', label: 'Medium Only' },
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
        <div className="lg:col-span-8 border border-[#4A3F35] rounded shadow-xl overflow-hidden h-[600px] relative bg-[#1C1714]">
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
              radius={25} // 25 meters proximity buffer
              pathOptions={{ color: '#8B2635', fillColor: '#8B2635', fillOpacity: 0.4, weight: 2, dashArray: '4 4' }}
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
                  <div className="p-1 font-['Crimson_Pro'] text-xs space-y-1 max-w-[200px] text-[#1C1714]">
                    <span className="font-['Cinzel'] font-bold text-[10px] bg-[#1C1714] text-[#C9A962] px-1.5 py-0.2 rounded">
                      #{proj.project_code}
                    </span>
                    <h5 className="font-['Cormorant_Garamond'] font-bold text-sm leading-snug text-[#1C1714]">
                      {proj.title}
                    </h5>
                    <p className="font-['Cinzel'] text-[11px] text-[#3D332B]">
                      Sanctioned: ₹{(proj.sanctioned_amount / 100000).toFixed(2)} L
                    </p>
                    <div className="pt-1">
                      <RiskBadge score={proj.risk_score} size="sm" />
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 p-3 bg-[#1C1714]/95 border border-[#4A3F35] rounded shadow-lg text-xs font-['Cinzel'] text-[#E8DFD4] space-y-1.5">
            <ArchiveLabel text="SPATIAL RISK LEGEND" />
            <div className="flex items-center gap-2 pt-1">
              <span className="w-3 h-3 rounded-full bg-[#8B2635] border border-[#E8DFD4]" />
              <span className="text-[11px]">CRITICAL RISK (80-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C9A962] border border-[#1C1714]" />
              <span className="text-[11px]">ELEVATED (60-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4A3F35] border border-[#9C8B7A]" />
              <span className="text-[11px]">COMPLIANT (0-29)</span>
            </div>
          </div>
        </div>

        {/* Selected Project Inspector Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {activeProject ? (
            <ClassicalCard
              className={`p-6 space-y-4 ${
                activeProject.risk_score >= 80 ? 'border-l-4 border-l-[#8B2635] bg-[#2A1D1A]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-['Cinzel'] font-bold text-xs px-2.5 py-0.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded">
                  #{activeProject.project_code}
                </span>
                <RiskBadge score={activeProject.risk_score} size="sm" />
              </div>

              <h3 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
                {activeProject.title}
              </h3>

              <div className="space-y-2 text-xs font-['Crimson_Pro'] text-[#E8DFD4] border-t border-[#4A3F35] pt-3">
                <p>
                  <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">LOCATION JURISDICTION: </strong>
                  {activeProject.location_name}, {activeProject.district_name}, {activeProject.state_name}
                </p>
                <p>
                  <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">GEODETIC COORDINATES: </strong>
                  <span className="font-['Cinzel'] text-[#C9A962]">
                    {activeProject.latitude.toFixed(5)}° N, {activeProject.longitude.toFixed(5)}° E
                  </span>
                </p>
                <p>
                  <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">AWARDED CONTRACTOR: </strong>
                  {activeProject.vendor_name || 'Direct Res'}
                </p>
                <p>
                  <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">SANCTIONED OUTLAY: </strong>
                  <span className="font-['Cinzel'] text-[#E8DFD4]">₹{activeProject.sanctioned_amount.toLocaleString('en-IN')}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-[#4A3F35]">
                <Link to={`/projects/${activeProject.project_code}`}>
                  <ClassicalButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={<Eye className="w-4 h-4" />}
                  >
                    EXAMINE FULL DOSSIER
                  </ClassicalButton>
                </Link>
              </div>
            </ClassicalCard>
          ) : (
            <ClassicalCard className="p-8 text-center space-y-3">
              <Compass className="w-10 h-10 text-[#C9A962] mx-auto opacity-75" />
              <h4 className="font-['Cormorant_Garamond'] font-bold text-lg text-[#E8DFD4]">
                Select Any Geodetic Marker
              </h4>
              <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro']">
                Click a marker on the topological map to inspect coordinates, contractor details, and anomaly layers.
              </p>
            </ClassicalCard>
          )}

          {/* Quick Flagged Proximity Alert */}
          <div className="p-4 bg-[#2A1D1A] border border-[#8B2635] rounded space-y-2 text-xs font-['Crimson_Pro'] text-[#E8DFD4]">
            <h5 className="font-['Cinzel'] font-bold text-xs text-[#8B2635] flex items-center gap-1.5 tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#8B2635]" />
              SPATIAL DUPLICATION DETECTED
            </h5>
            <p className="text-[#9C8B7A]">
              Phulpur Community Hall (<strong className="text-[#E8DFD4]">#MPLAD-10291</strong>) coordinates overlap a completed 2023 panchayat asset within an 8-meter radial threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

