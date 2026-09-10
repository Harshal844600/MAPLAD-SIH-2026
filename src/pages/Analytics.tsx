import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  ClassicalCard,
  DossierCard,
  VolumeHeader,
  ArchiveLabel,
  LiveStatusPill,
} from '../components/ui';
import { TrendingUp, Award, BarChart3, AlertOctagon } from 'lucide-react';

export const Analytics: React.FC = () => {
  const financialYearTrend = [
    { year: '2021-22', sanctioned: 180, utilized: 165 },
    { year: '2022-23', sanctioned: 240, utilized: 210 },
    { year: '2023-24', sanctioned: 310, utilized: 255 },
    { year: '2024-25', sanctioned: 380, utilized: 285 },
    { year: '2025-26', sanctioned: 420, utilized: 290 },
  ];

  const vendorConcentration = [
    { name: 'Apex Infra Ltd.', projects: 24, totalCr: 14.5, share: 32 },
    { name: 'Bharat Rural Works', projects: 18, totalCr: 8.2, share: 18 },
    { name: 'Surya Ganga Water', projects: 14, totalCr: 5.6, share: 12 },
    { name: 'Vikas Building Assoc', projects: 11, totalCr: 4.8, share: 10 },
    { name: 'Others (42 Vendors)', projects: 33, totalCr: 12.4, share: 28 },
  ];

  const stateRiskDistribution = [
    { state: 'Uttar Pradesh', avgRisk: 62, critical: 18 },
    { state: 'Bihar', avgRisk: 58, critical: 12 },
    { state: 'Maharashtra', avgRisk: 44, critical: 6 },
    { state: 'Rajasthan', avgRisk: 41, critical: 4 },
    { state: 'Madhya Pradesh', avgRisk: 46, critical: 5 },
    { state: 'Karnataka', avgRisk: 34, critical: 2 },
    { state: 'Tamil Nadu', avgRisk: 28, critical: 1 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME VI"
        title="National Implementation Analytics"
        subtitle="Multi-year expenditure trends, contractor market concentration (HHI), and geographic risk variance across India."
        action={
          <div className="flex items-center gap-3">
            <LiveStatusPill label="ANALYTICS ENGINE" />
            <span className="font-mono text-xs font-bold px-3 py-1.5 bg-white/5 light:bg-slate-200 text-[#c9b8a0] light:text-slate-800 border border-white/10 light:border-slate-300 rounded-xl tracking-wider">
              1,050 AGGREGATED WORKS
            </span>
          </div>
        }
      />

      {/* 2. MULTI-YEAR EXPENDITURE TREND CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ClassicalCard className="p-6 space-y-4 border-beam-card">
            <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
              <div>
                <ArchiveLabel text="HISTORICAL EXPENDITURE LEDGER" />
                <h3 className="text-xl font-bold font-serif text-white light:text-slate-900 mt-1">
                  Sanctioned vs Utilized Outlay (₹ Crore)
                </h3>
              </div>
              <TrendingUp className="w-5 h-5 text-[#c9b8a0]" />
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialYearTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#71717a" fontFamily="monospace" fontSize={11} />
                  <YAxis stroke="#71717a" fontFamily="monospace" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10,10,10,0.95)',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      fontFamily: 'sans-serif',
                      color: '#f4f4f5',
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="sanctioned" name="Sanctioned (₹ Cr)" fill="#c9b8a0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilized" name="Utilized (₹ Cr)" fill="#71717a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ClassicalCard>
        </div>

        {/* Top Vendor Concentration Index (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <ClassicalCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
              <div>
                <ArchiveLabel text="MARKET CONCENTRATION" />
                <h3 className="text-lg font-bold font-serif text-white light:text-slate-900 mt-1">
                  Contractor HHI Index
                </h3>
              </div>
              <Award className="w-5 h-5 text-[#c9b8a0]" />
            </div>

            <p className="text-xs text-zinc-400 light:text-slate-600 leading-relaxed">
              Top 4 vendors control 72% of all sanctioned project funds in high-density districts.
            </p>

            <div className="space-y-3 pt-2">
              {vendorConcentration.map((v, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-white light:text-slate-900 truncate max-w-[170px]">
                      {v.name}
                    </span>
                    <span className="text-[#c9b8a0] font-bold">₹{v.totalCr} Cr ({v.share}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 light:bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-amber-500' : 'bg-[#c9b8a0]'
                      }`}
                      style={{ width: `${v.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ClassicalCard>
        </div>
      </div>

      {/* 3. STATE JURISDICTION RISK BAR COMPARISON */}
      <ClassicalCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
          <div>
            <ArchiveLabel text="INTER-STATE COMPARATIVE FORENSICS" />
            <h3 className="text-xl font-bold font-serif text-white light:text-slate-900 mt-1">
              Mean Risk Index & Critical Flag Count by State
            </h3>
          </div>
          <AlertOctagon className="w-5 h-5 text-red-400" />
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateRiskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="state" stroke="#71717a" fontFamily="monospace" fontSize={11} />
              <YAxis stroke="#71717a" fontFamily="monospace" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  fontFamily: 'sans-serif',
                  color: '#f4f4f5',
                }}
              />
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="avgRisk" name="Avg Risk Index (0-100)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="critical" name="Critical Anomalies Count" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ClassicalCard>
    </div>
  );
};
