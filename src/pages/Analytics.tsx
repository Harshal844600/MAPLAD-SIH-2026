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
import { appStore } from '../services/store/appStore';

export const Analytics: React.FC = () => {
  const projects = appStore.getAllProjects();
  const vendors = appStore.getVendors();

  // 1. Multi-Year Financial Trend dynamically computed from store projects
  const financialYearTrend = React.useMemo(() => {
    const yearMap: Record<string, { sanctioned: number; utilized: number }> = {};
    
    projects.forEach((p) => {
      const year = p.sanction_date ? parseInt(p.sanction_date.substring(0, 4)) : 2024;
      const fiscalKey = `${year}-${String((year + 1) % 100).padStart(2, '0')}`;
      if (!yearMap[fiscalKey]) {
        yearMap[fiscalKey] = { sanctioned: 0, utilized: 0 };
      }
      yearMap[fiscalKey].sanctioned += p.sanctioned_amount || 0;
      yearMap[fiscalKey].utilized += p.utilized_amount || 0;
    });

    return Object.entries(yearMap)
      .map(([year, data]) => ({
        year,
        sanctioned: parseFloat((data.sanctioned / 10000000).toFixed(1)), // In ₹ Cr
        utilized: parseFloat((data.utilized / 10000000).toFixed(1)),
      }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [projects]);

  // 2. Vendor Market Concentration (HHI) dynamically computed
  const { vendorConcentration, topVendorsShare } = React.useMemo(() => {
    const totalAllSanctioned = projects.reduce((acc, p) => acc + (p.sanctioned_amount || 0), 0);
    const vendorMap: Record<string, { name: string; count: number; totalAmt: number }> = {};

    projects.forEach((p) => {
      const vName = p.vendor_name || 'Designated Infrastructure Contractor';
      if (!vendorMap[vName]) {
        vendorMap[vName] = { name: vName, count: 0, totalAmt: 0 };
      }
      vendorMap[vName].count += 1;
      vendorMap[vName].totalAmt += p.sanctioned_amount || 0;
    });

    const sorted = Object.values(vendorMap).sort((a, b) => b.totalAmt - a.totalAmt);
    const top4 = sorted.slice(0, 4);
    const others = sorted.slice(4);

    const othersTotalAmt = others.reduce((acc, v) => acc + v.totalAmt, 0);
    const othersCount = others.reduce((acc, v) => acc + v.count, 0);

    const result = top4.map((v) => ({
      name: v.name,
      projects: v.count,
      totalCr: parseFloat((v.totalAmt / 10000000).toFixed(1)),
      share: totalAllSanctioned > 0 ? Math.round((v.totalAmt / totalAllSanctioned) * 100) : 0,
    }));

    if (othersCount > 0) {
      result.push({
        name: `Others (${others.length} Vendors)`,
        projects: othersCount,
        totalCr: parseFloat((othersTotalAmt / 10000000).toFixed(1)),
        share: totalAllSanctioned > 0 ? Math.round((othersTotalAmt / totalAllSanctioned) * 100) : 0,
      });
    }

    const topShare = top4.reduce((acc, v) => acc + (totalAllSanctioned > 0 ? (v.totalAmt / totalAllSanctioned) * 100 : 0), 0);

    return { vendorConcentration: result, topVendorsShare: Math.round(topShare) };
  }, [projects]);

  // 3. State Risk Distribution dynamically computed
  const stateRiskDistribution = React.useMemo(() => {
    const stateMap: Record<string, { state: string; totalRisk: number; count: number; critical: number }> = {};

    projects.forEach((p) => {
      const stateName = p.state_name || 'Other';
      if (!stateMap[stateName]) {
        stateMap[stateName] = { state: stateName, totalRisk: 0, count: 0, critical: 0 };
      }
      stateMap[stateName].count += 1;
      stateMap[stateName].totalRisk += p.risk_score || 0;
      if (p.risk_level === 'CRITICAL' || p.risk_score >= 80) {
        stateMap[stateName].critical += 1;
      }
    });

    return Object.values(stateMap)
      .map((s) => ({
        state: s.state,
        avgRisk: Math.round(s.totalRisk / (s.count || 1)),
        critical: s.critical,
      }))
      .sort((a, b) => b.avgRisk - a.avgRisk);
  }, [projects]);

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
              Top 4 vendors control {topVendorsShare}% of all sanctioned project funds across active jurisdictions.
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
