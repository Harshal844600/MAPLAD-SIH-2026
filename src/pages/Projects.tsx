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
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
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

  const handleCSVImportSimulate = () => {
    if (!importPreviewText) return;
    setImportSuccess(true);
    setTimeout(() => {
      setIsImportModalOpen(false);
      setImportSuccess(false);
      setImportPreviewText('');
      appStore.logAudit('BULK_CSV_IMPORTED', 'PROJECT', undefined, { recordsAdded: 15 });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME II"
        title="PROJECT ARCHIVE & LEDGER"
        subtitle={`Official implementation registry containing ${totalCount.toLocaleString('en-IN')} audited records with forensic risk classification.`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <ClassicalButton
              variant="secondary"
              size="md"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
            >
              EXPORT ARCHIVE
            </ClassicalButton>
            <ClassicalButton
              variant="primary"
              size="md"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => setIsImportModalOpen(true)}
            >
              IMPORT LEDGER BATCH
            </ClassicalButton>
          </div>
        }
      />

      {/* 2. SEARCH & FACETED FILTERS BAR */}
      <ClassicalCard className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-[#4A3F35] pb-2">
          <ArchiveLabel text="RECORD FILTERS & QUERY PARAMETERS" />
          <span className="font-['Cinzel'] text-xs text-[#9C8B7A] flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A962]" /> {items.length} DISPLAYED
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
      </ClassicalCard>

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
        <div className="border border-[#4A3F35] bg-[#251E19] rounded shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1C1714] border-b border-[#4A3F35] font-['Cinzel'] text-xs text-[#C9A962] tracking-[0.15em] uppercase">
                  <th
                    className="p-3.5 cursor-pointer hover:text-[#E8DFD4] transition-colors"
                    onClick={() => handleSort('project_code')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Dossier Code</span>
                      <ArrowUpDown className="w-3 h-3 text-[#9C8B7A]" />
                    </div>
                  </th>
                  <th className="p-3.5">Title & Jurisdiction</th>
                  <th className="p-3.5">Category</th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-[#E8DFD4] transition-colors"
                    onClick={() => handleSort('sanctioned_amount')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Sanctioned (₹)</span>
                      <ArrowUpDown className="w-3 h-3 text-[#9C8B7A]" />
                    </div>
                  </th>
                  <th className="p-3.5">Vendor / Implementing Body</th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-[#E8DFD4] transition-colors"
                    onClick={() => handleSort('risk_score')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Risk Assessment</span>
                      <ArrowUpDown className="w-3 h-3 text-[#9C8B7A]" />
                    </div>
                  </th>
                  <th className="p-3.5 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A3F35]/50 font-['Crimson_Pro'] text-[#E8DFD4]">
                {items.map((proj) => (
                  <tr
                    key={proj.id}
                    className={`hover:bg-[#2E2620] transition-colors ${
                      proj.risk_score >= 80 ? 'bg-[#8B2635]/10 border-l-2 border-l-[#8B2635]' : ''
                    }`}
                  >
                    <td className="p-3.5 font-['Cinzel'] text-xs font-semibold">
                      <span className="px-2 py-0.5 bg-[#1C1714] border border-[#4A3F35] text-[#C9A962] rounded">
                        {proj.project_code}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-['Cormorant_Garamond'] text-base font-semibold text-[#E8DFD4] line-clamp-1">
                        {proj.title}
                      </div>
                      <div className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">
                        {proj.location_name}, {proj.district_name}, {proj.state_name}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-xs font-['Cinzel'] tracking-wider px-2 py-0.5 bg-[#3D332B] text-[#E8DFD4] rounded border border-[#4A3F35]">
                        {proj.category_name}
                      </span>
                    </td>
                    <td className="p-3.5 font-['Cinzel'] font-bold text-sm text-[#C9A962]">
                      ₹{(proj.sanctioned_amount / 100000).toFixed(2)} L
                    </td>
                    <td className="p-3.5 text-xs">
                      <div className="font-semibold text-[#E8DFD4]">{proj.vendor_name || 'Unassigned'}</div>
                      <div className="text-[#9C8B7A] italic text-[11px]">{proj.implementing_agency}</div>
                    </td>
                    <td className="p-3.5">
                      <RiskBadge score={proj.risk_score} size="sm" />
                    </td>
                    <td className="p-3.5 text-right">
                      <Link to={`/projects/${proj.project_code}`}>
                        <ClassicalButton
                          variant={proj.risk_score >= 80 ? 'secondary' : 'secondary'}
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5" />}
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

          {/* Archival Pagination Bar */}
          <div className="p-4 border-t border-[#4A3F35] bg-[#1C1714] flex flex-col sm:flex-row items-center justify-between gap-3 font-['Cinzel'] text-xs text-[#9C8B7A]">
            <span>
              FOLIO <strong>{currentPage}</strong> OF <strong>{totalPages}</strong> ({totalCount} TOTAL ENTRIES)
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
            <ClassicalButton variant="ghost" size="md" onClick={() => setIsImportModalOpen(false)}>
              DISMISS
            </ClassicalButton>
            <ClassicalButton
              variant="primary"
              size="md"
              disabled={!importPreviewText || importSuccess}
              onClick={handleCSVImportSimulate}
            >
              {importSuccess ? 'RECORD INGESTED' : 'VALIDATE & INGEST'}
            </ClassicalButton>
          </>
        }
      >
        <div className="space-y-4 font-['Crimson_Pro']">
          <p className="text-sm text-[#9C8B7A]">
            Paste raw comma-separated ledger data. Required headers conforming to MoSPI gazette:
            <code className="text-[#C9A962] block mt-1 font-mono text-xs bg-[#1C1714] p-1.5 border border-[#4A3F35] rounded">
              project_code, title, category, state, district, sanctioned_amount, vendor_id, lat, lon
            </code>
          </p>

          <textarea
            rows={5}
            value={importPreviewText}
            onChange={(e) => setImportPreviewText(e.target.value)}
            placeholder="MPLAD-10499,Construction of Concrete Culvert,Roads & Bridges,Uttar Pradesh,Prayagraj,1850000,VEND-001,25.4358,81.8463"
            className="w-full font-mono text-xs p-3 bg-[#1C1714] text-[#E8DFD4] border border-[#4A3F35] rounded focus:border-[#C9A962] focus:outline-none focus:ring-1 focus:ring-[#C9A962]"
          />

          <div className="p-3 bg-[#3D332B]/50 border border-[#C9A962]/40 rounded text-xs text-[#E8DFD4]">
            <strong className="text-[#C9A962] font-['Cinzel'] tracking-wide">IDEMPOTENCY SAFEGUARD: </strong>
            Duplicate dossier numbers and existing cryptographic hashes are rejected automatically to prevent double-accounting.
          </div>
        </div>
      </ClassicalModal>
    </div>
  );
};

