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
} from 'recharts';
import {
  ClassicalCard,
  DossierCard,
  VolumeHeader,
  ArchiveLabel,
} from '../components/ui';

export const Analytics: React.FC = () => {
  const financialYearTrend = [
    { year: '2021-22', sanctioned: 180, utilized: 165 },
    { year: '2022-23', sanctioned: 240, utilized: 210 },
    { year: '2023-24', sanctioned: 310, utilized: 255 },
    { year: '2024-25', sanctioned: 380, utilized: 285 },
    { year: '2025-26', sanctioned: 420, utilized: 290 },
  ];

  const vendorConcentration = [
    { name: 'Apex Infra Ltd.', projects: 24, totalCr: 14.5, share: '32%' },
    { name: 'Bharat Rural Works', projects: 18, totalCr: 8.2, share: '18%' },
    { name: 'Surya Ganga Water', projects: 14, totalCr: 5.6, share: '12%' },
    { name: 'Vikas Building Assoc', projects: 11, totalCr: 4.8, share: '10%' },
    { name: 'Others (42 Vendors)', projects: 33, totalCr: 12.4, share: '28%' },
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
        title="NATIONAL MACRO IMPLEMENTATION ANALYTICS"
        subtitle="Multi-year expenditure trends, contractor market concentration, and geographic risk variance."
        action={
          <span className="font-['Cinzel'] text-xs font-bold px-3 py-1.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded tracking-widest">
            AGGREGATE DATASET (1,050 WORKS)
          </span>
        }
      />

      {/* 2. MULTI-YEAR EXPENDITURE TREND CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ClassicalCard className="p-6 space-y-4">
            <ArchiveLabel text="HISTORICAL EXPENDITURE LEDGER" />
            <h3 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
              Sanctioned vs Utilized Outlay (₹ Crore)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialYearTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3D332B" />
                  <XAxis dataKey="year" stroke="#9C8B7A" fontFamily="Cinzel" fontSize={11} />
                  <YAxis stroke="#9C8B7A" fontFamily="Cinzel" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1714',
                      borderColor: '#4A3F35',
                      borderWidth: 1,
                      fontFamily: 'Crimson Pro',
                      color: '#E8DFD4',
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Cinzel', fontSize: '11px', color: '#E8DFD4' }} />
                  <Bar dataKey="sanctioned" name="Sanctioned (₹ Cr)" fill="#C9A962" stroke="#4A3F35" />
                  <Bar dataKey="utilized" name="Utilized (₹ Cr)" fill="#3D332B" stroke="#4A3F35" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ClassicalCard>
        </div>

        {/* Top Vendor Concentration Index (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <ClassicalCard className="p-6 space-y-3">
            <ArchiveLabel text="MARKET CONCENTRATION" />
            <h3 className="text-lg font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
              Contractor Concentration (HHI)
            </h3>
            <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro']">
              Top 4 vendors control 72% of all sanctioned project funds in high-density districts.
            </p>

            <div className="space-y-2 pt-2 border-t border-[#4A3F35] text-xs font-['Crimson_Pro']">
              {vendorConcentration.map((v) => (
                <div key={v.name} className="flex items-center justify-between p-2.5 bg-[#1C1714] border border-[#4A3F35] rounded">
                  <div>
                    <span className="font-bold text-[#E8DFD4] block truncate max-w-[150px] font-['Cinzel'] text-[11px]">{v.name}</span>
                    <span className="text-[#9C8B7A] text-[11px]">{v.projects} Projects</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#C9A962] font-['Cinzel'] block">₹{v.totalCr} Cr</span>
                    <span className="text-[10px] text-[#9C8B7A]">Share: {v.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </ClassicalCard>
        </div>
      </div>

      {/* 3. STATE-WISE ANOMALY SCORE COMPARISON */}
      <ClassicalCard className="p-6 space-y-4">
        <ArchiveLabel text="INTER-STATE VARIANCE" />
        <h3 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
          State-Wise Average Risk & Critical Project Concentration
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateRiskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3D332B" />
              <XAxis dataKey="state" stroke="#9C8B7A" fontFamily="Cinzel" fontSize={11} />
              <YAxis stroke="#9C8B7A" fontFamily="Cinzel" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1714',
                  borderColor: '#4A3F35',
                  borderWidth: 1,
                  fontFamily: 'Crimson Pro',
                  color: '#E8DFD4',
                }}
              />
              <Legend wrapperStyle={{ fontFamily: 'Cinzel', fontSize: '11px', color: '#E8DFD4' }} />
              <Bar dataKey="avgRisk" name="Avg Risk Score (0-100)" fill="#C9A962" stroke="#4A3F35" />
              <Bar dataKey="critical" name="Critical Projects Count" fill="#8B2635" stroke="#4A3F35" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ClassicalCard>
    </div>
  );
};

