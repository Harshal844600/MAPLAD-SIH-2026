import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Upload,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ClassicalCard,
  ClassicalButton,
  ClassicalSearch,
  ClassicalSelect,
  RiskBadge,
  ClassicalModal,
  EmptyState,
  VolumeHeader,
  ArchiveLabel,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { DEMO_STATES, DEMO_DISTRICTS, DEMO_CATEGORIES } from '../services/demo/syntheticData';
import { ProjectEntity } from '../types';

export const Projects: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreviewText, setImportPreviewText] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<keyof ProjectEntity>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const districtsForState =
    selectedState !== 'ALL' && DEMO_DISTRICTS[selectedState]
      ? DEMO_DISTRICTS[selectedState]
      : [];

  const { items, totalCount, totalPages } = appStore.getProjects({
    search,
    stateId: selectedState !== 'ALL' ? selectedState : undefined,
    districtId: selectedDistrict !== 'ALL' ? selectedDistrict : undefined,
    category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
    riskLevel: selectedRisk !== 'ALL' ? selectedRisk : undefined,
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
    page: currentPage,
    pageSize: 12,
    sortBy,
    sortOrder,
  });

  const handleSort = (field: keyof ProjectEntity) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Project Code',
      'Title',
      'Category',
      'State',
      'District',
      'Vendor',
      'Status',
      'Sanctioned (INR)',
      'Released (INR)',
      'Utilized (INR)',
      'Risk Score',
      'Risk Level',
    ];
    const rows = items.map((p) => [
      p.project_code,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category_name,
      p.state_name,
      p.district_name,
      `"${(p.vendor_name || 'N/A').replace(/"/g, '""')}"`,
      p.status,
      p.sanctioned_amount,
      p.released_amount,
      p.utilized_amount,
      p.risk_score,
      p.risk_level,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_Sentinel_Ledger_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    appStore.logAudit('CSV_EXPORTED', 'PROJECT', undefined, { rowCount: items.length });
  };

  const handleCSVImport = () => {
    if (!importPreviewText) return;
    const count = appStore.importProjectsCSV(importPreviewText);
    setImportSuccess(true);
    setTimeout(() => {
      setIsImportModalOpen(false);
      setImportSuccess(false);
      setImportPreviewText('');
      setCurrentPage(1);
    }, 1200);
  };

  const handleLoadSampleCSV = () => {
    setImportPreviewText(
      `MPLAD-10901,Solar Microgrid Electrification Phase II,Renewable Energy,Uttar Pradesh,Prayagraj,3200000,Surya Ganga Water & Power,25.4358,81.8463\nMPLAD-10902,Construction of RCC Drain Saidabad Ward 4,Public Health & Sanitation,Uttar Pradesh,Prayagraj,1450000,Apex Infrastructure Ltd.,25.5482,81.9834\nMPLAD-10903,Panchayat Digital Library Community Hub,Education,Bihar,Patna,2100000,Bharat Rural Works Ltd.,25.5941,85.1376`
    );
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME II"
        title="Project Ledger & Implementation Registry"
        subtitle={`Official scheme ledger containing ${totalCount.toLocaleString('en-IN')} audited records with multi-layer forensic risk classifications.`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <ClassicalButton
              variant="secondary"
              size="md"
              icon={<Download className="w-4 h-4 text-[#c9b8a0]" />}
              onClick={handleExportCSV}
            >
              EXPORT CSV
            </ClassicalButton>
            <ClassicalButton
              variant="primary"
              size="md"
              icon={<Upload className="w-4 h-4 text-black" />}
              onClick={() => setIsImportModalOpen(true)}
            >
              IMPORT LEDGER BATCH
            </ClassicalButton>
          </div>
        }
      />

      {/* 2. SEARCH & FACETED FILTERS BAR */}
      <div className="p-5 bg-white/[0.03] light:bg-white backdrop-blur-md border border-white/10 light:border-slate-200 rounded-[28px] space-y-4 shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
          <ArchiveLabel text="RECORD FILTERS & QUERY PARAMETERS" />
          <span className="font-mono text-xs text-gray-400 light:text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#c9b8a0] light:text-[#8C735D]" /> {items.length} DISPLAYED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <ClassicalSearch
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
              placeholder="Search code, title, contractor, village..."
            />
          </div>

          <div className="md:col-span-2">
            <ClassicalSelect
              options={[
                { value: 'ALL', label: 'All States' },
                ...DEMO_STATES.map((s) => ({ value: s.id, label: s.name })),
              ]}
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="md:col-span-2">
            <ClassicalSelect
              options={[
                { value: 'ALL', label: 'All Districts' },
                ...districtsForState.map((d) => ({ value: d.id, label: d.name })),
              ]}
              value={selectedDistrict}
              disabled={selectedState === 'ALL'}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="md:col-span-2">
            <ClassicalSelect
              options={[
                { value: 'ALL', label: 'All Categories' },
                ...DEMO_CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="md:col-span-2">
            <ClassicalSelect
              options={[
                { value: 'ALL', label: 'All Risk Tiers' },
                { value: 'CRITICAL', label: 'Critical (80-100)' },
                { value: 'HIGH', label: 'High (60-79)' },
                { value: 'MEDIUM', label: 'Medium (30-59)' },
                { value: 'LOW', label: 'Low (0-29)' },
              ]}
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. ARCHIVAL DATA TABLE */}
      {items.length === 0 ? (
        <EmptyState
          title="NO RECORDS FOUND IN ARCHIVE"
          description="The repository contains no matching implementation entries for the specified parameters."
          actionText="CLEAR FILTERS"
          onAction={() => {
            setSearch('');
            setSelectedState('ALL');
            setSelectedDistrict('ALL');
            setSelectedCategory('ALL');
            setSelectedRisk('ALL');
            setSelectedStatus('ALL');
          }}
        />
      ) : (
        <div className="border border-white/10 light:border-slate-200 bg-white/[0.02] light:bg-white backdrop-blur-xl rounded-[28px] shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.04] light:bg-[#FAF8F5] border-b border-white/10 light:border-slate-200 font-mono text-xs text-[#c9b8a0] light:text-[#8C735D] tracking-wider uppercase">
                  <th
                    className="p-4 cursor-pointer hover:text-white light:hover:text-slate-950 transition-colors"
                    onClick={() => handleSort('project_code')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Dossier Code</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400 light:text-slate-500" />
                    </div>
                  </th>
                  <th className="p-4">Title & Jurisdiction</th>
                  <th className="p-4">Category</th>
                  <th
                    className="p-4 cursor-pointer hover:text-white light:hover:text-slate-950 transition-colors"
                    onClick={() => handleSort('sanctioned_amount')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Sanctioned (₹)</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400 light:text-slate-500" />
                    </div>
                  </th>
                  <th className="p-4">Vendor / Implementing Body</th>
                  <th
                    className="p-4 cursor-pointer hover:text-white light:hover:text-slate-950 transition-colors"
                    onClick={() => handleSort('risk_score')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Risk Assessment</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400 light:text-slate-500" />
                    </div>
                  </th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 light:divide-slate-100 font-['Inter'] text-gray-200 light:text-slate-800">
                {items.map((proj) => (
                  <tr
                    key={proj.id}
                    className={`hover:bg-white/[0.04] light:hover:bg-[#F8FAFC] transition-colors ${
                      proj.risk_score >= 80 ? 'bg-rose-950/15 light:bg-rose-50/60 border-l-2 border-l-rose-500' : ''
                    }`}
                  >
                    <td className="p-4 font-mono text-xs font-semibold">
                      <span className="px-2.5 py-1 bg-black/40 light:bg-slate-100 border border-white/10 light:border-slate-200 text-[#e8d5b7] light:text-[#78350F] rounded-full">
                        #{proj.project_code}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-['Playfair_Display'] text-base font-semibold text-white light:text-slate-900 line-clamp-1">
                        {proj.title}
                      </div>
                      <div className="text-xs text-gray-400 light:text-slate-500 font-['Inter'] mt-0.5">
                        {proj.location_name}, {proj.district_name}, {proj.state_name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono px-2.5 py-1 bg-white/5 light:bg-slate-100 text-gray-300 light:text-slate-700 rounded-full border border-white/10 light:border-slate-200">
                        {proj.category_name}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-sm text-white light:text-slate-900">
                      ₹{(proj.sanctioned_amount / 100000).toFixed(2)} L
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-semibold text-white light:text-slate-900">{proj.vendor_name || 'Unassigned'}</div>
                      <div className="text-gray-400 light:text-slate-500 text-[11px]">{proj.implementing_agency}</div>
                    </td>
                    <td className="p-4">
                      <RiskBadge score={proj.risk_score} size="sm" />
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/projects/${proj.project_code}`}>
                        <ClassicalButton
                          variant="secondary"
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5 text-[#c9b8a0] light:text-[#8C735D]" />}
                        >
                          EXAMINE
                        </ClassicalButton>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 border-t border-white/10 light:border-slate-200 bg-white/[0.02] light:bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-gray-400 light:text-slate-600">
            <span>
              PAGE <strong className="text-white light:text-slate-900">{currentPage}</strong> OF <strong className="text-white light:text-slate-900">{totalPages}</strong> ({totalCount} TOTAL WORKS)
            </span>
            <div className="flex items-center gap-2">
              <ClassicalButton
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> PREVIOUS
              </ClassicalButton>
              <ClassicalButton
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                NEXT <ChevronRight className="w-4 h-4 ml-1" />
              </ClassicalButton>
            </div>
          </div>
        </div>
      )}

      {/* 4. CSV BULK IMPORT MODAL */}
      <ClassicalModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="INGEST BULK MPLAD CSV LEDGER"
        subtitle="Import official departmental spreadsheet records with automatic schema validation and deduplication."
        actions={
          <>
            <ClassicalButton variant="ghost" size="md" onClick={handleLoadSampleCSV}>
              PASTE SAMPLE CSV
            </ClassicalButton>
            <ClassicalButton variant="secondary" size="md" onClick={() => setIsImportModalOpen(false)}>
              DISMISS
            </ClassicalButton>
            <ClassicalButton
              variant="primary"
              size="md"
              disabled={!importPreviewText || importSuccess}
              onClick={handleCSVImport}
            >
              {importSuccess ? 'RECORD INGESTED & AUDITED' : 'VALIDATE & INGEST'}
            </ClassicalButton>
          </>
        }
      >
        <div className="space-y-4 font-['Inter']">
          <p className="text-sm text-gray-400 light:text-slate-600">
            Paste raw comma-separated ledger data conforming to the MoSPI data schema:
            <code className="text-[#e8d5b7] light:text-[#78350F] block mt-1.5 font-mono text-xs bg-black/60 light:bg-slate-100 p-2.5 border border-white/10 light:border-slate-200 rounded-xl">
              project_code, title, category, state, district, sanctioned_amount, vendor_id, lat, lon
            </code>
          </p>

          <textarea
            rows={5}
            value={importPreviewText}
            onChange={(e) => setImportPreviewText(e.target.value)}
            placeholder="MPLAD-10499,Construction of Concrete Culvert,Roads & Bridges,Uttar Pradesh,Prayagraj,1850000,VEND-001,25.4358,81.8463"
            className="w-full font-mono text-xs p-3.5 bg-white/[0.04] light:bg-white text-white light:text-slate-900 border border-white/10 light:border-slate-300 rounded-2xl focus:border-[#a78b71] light:focus:border-[#8C735D] focus:outline-none focus:ring-1 focus:ring-[#a78b71] shadow-xs"
          />

          <div className="p-3.5 bg-[#a78b71]/10 light:bg-[#FFFDF5] border border-[#a78b71]/30 light:border-[#FDE68A] rounded-2xl text-xs text-gray-200 light:text-slate-800">
            <strong className="text-[#e8d5b7] light:text-[#78350F] font-mono tracking-wide">IDEMPOTENCY SAFEGUARD: </strong>
            Duplicate dossier numbers and existing cryptographic hashes are rejected automatically to prevent double-disbursements.
          </div>
        </div>
      </ClassicalModal>
    </div>
  );
};
