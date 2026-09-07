import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Eye,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  VolumeHeader,
  ArchiveLabel,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { DocumentRecord } from '../types';

export const DocumentOCR: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(
    appStore.getProjectDocuments('proj-10291')[1] || null // Invoice INV-APX-884
  );

  const documents = appStore.getProjectDocuments('proj-10291');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="DOCUMENT ARCHIVE"
        title="DOCUMENT INTELLIGENCE & OCR VERIFIER"
        subtitle="Automated optical text extraction, date-sanction chronology comparison, and invoice reconciliation."
        action={
          <ClassicalButton variant="primary" size="md" icon={<Upload className="w-4 h-4" />}>
            UPLOAD EXHIBIT (PDF)
          </ClassicalButton>
        }
      />

      {/* 2. GRID: DOCUMENTS LIST & OCR MISMATCH COMPARE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Documents List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <ArchiveLabel text="CASE EXHIBITS & VOUCHERS" />

          {documents.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            const hasFlags = Boolean(doc.extraction?.mismatch_flags?.length);

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 border rounded cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2E2620] border-[#C9A962] shadow-lg'
                    : 'bg-[#251E19] border-[#4A3F35] hover:border-[#C9A962]/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-['Cinzel'] mb-1.5">
                  <span className="font-bold text-[10px] px-2 py-0.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded">
                    {doc.document_type}
                  </span>
                  {hasFlags ? (
                    <span className="text-[10px] font-bold text-[#8B2635] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> MISMATCH
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#9C8B7A]">✓ AUDITED</span>
                  )}
                </div>

                <h4 className="text-base font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] truncate">
                  {doc.file_name}
                </h4>
                <p className="text-xs font-['Crimson_Pro'] text-[#9C8B7A] italic">
                  Uploaded by {doc.uploaded_by_name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Field Comparison Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDoc ? (
            <DossierCard
              className={`p-6 space-y-6 ${
                selectedDoc.extraction?.mismatch_flags?.length ? 'border-l-4 border-l-[#8B2635]' : ''
              }`}
            >
              <div className="flex items-start justify-between border-b border-[#4A3F35] pb-4">
                <div>
                  <ArchiveLabel text="OPTICAL EXTRACTION AUDIT" />
                  <h3 className="text-2xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] mt-1">
                    {selectedDoc.file_name}
                  </h3>
                  <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro']">
                    Extraction Engine: Tesseract / Transformer-Vision (Confidence:{' '}
                    {Math.round((selectedDoc.extraction?.confidence || 0.95) * 100)}%)
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1714] border border-[#4A3F35] rounded text-xs font-['Cinzel'] tracking-wider">
                  {selectedDoc.extraction?.mismatch_flags?.length ? (
                    <span className="text-[#8B2635] font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> FLAGGED MISMATCH
                    </span>
                  ) : (
                    <span className="text-[#C9A962] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> RECONCILED
                    </span>
                  )}
                </div>
              </div>

              {/* Comparison Table */}
              <div className="border border-[#4A3F35] rounded bg-[#1C1714] overflow-hidden">
                <table className="w-full text-left text-sm font-['Crimson_Pro']">
                  <thead>
                    <tr className="bg-[#1C1714] border-b border-[#4A3F35] font-['Cinzel'] text-xs text-[#C9A962] tracking-wider">
                      <th className="p-3">Field</th>
                      <th className="p-3">Document OCR Text</th>
                      <th className="p-3">Sanction Ledger</th>
                      <th className="p-3">Audit Finding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A3F35]/50 text-[#E8DFD4]">
                    <tr>
                      <td className="p-3 font-semibold font-['Cinzel'] text-xs">VENDOR NAME</td>
                      <td className="p-3 font-mono text-xs">{selectedDoc.extraction?.extracted_vendor_name || 'N/A'}</td>
                      <td className="p-3 font-mono text-xs">Apex Infrastructure Ltd.</td>
                      <td className="p-3 text-[#C9A962] font-bold font-['Cinzel'] text-xs">✓ MATCHES</td>
                    </tr>
                    <tr className={selectedDoc.id === 'doc-10291-2' ? 'bg-[#8B2635]/10' : ''}>
                      <td className="p-3 font-semibold font-['Cinzel'] text-xs">INVOICE DATE</td>
                      <td className="p-3 font-mono text-xs font-bold text-[#8B2635]">
                        {selectedDoc.extraction?.extracted_date || '2024-03-01'}
                      </td>
                      <td className="p-3 font-mono text-xs">2024-03-15 (Sanction Date)</td>
                      <td className="p-3 text-[#8B2635] font-bold font-['Cinzel'] text-xs">
                        ⚠️ PREDATES SANCTION!
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold font-['Cinzel'] text-xs">CLAIMED SUM</td>
                      <td className="p-3 font-['Cinzel'] font-bold text-xs text-[#C9A962]">
                        ₹{selectedDoc.extraction?.extracted_amount?.toLocaleString('en-IN') || '18,20,000'}
                      </td>
                      <td className="p-3 font-['Cinzel'] font-bold text-xs">₹18,20,000 (1st Milestone)</td>
                      <td className="p-3 text-[#C9A962] font-bold font-['Cinzel'] text-xs">✓ WITHIN CEILING</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Extracted Raw OCR Snippet */}
              <div className="p-4 bg-[#1C1714] border border-[#4A3F35] rounded text-xs space-y-1">
                <span className="font-['Cinzel'] text-[10px] text-[#9C8B7A] tracking-wider block">
                  RAW EXTRACTED TEXT STREAM:
                </span>
                <p className="font-mono text-xs text-[#E8DFD4] leading-relaxed">
                  "TAX INVOICE: APEX INFRASTRUCTURE & HEAVY WORKS LTD. BILL NO: INV-APX-884. DATE:
                  01-MAR-2024. WORK: CONSTRUCTION OF RCC COMMUNITY CENTER PHULPUR. TOTAL PAYABLE:
                  INR 18,20,000/-. GSTIN: 09AAACA1234F1Z5."
                </p>
              </div>
            </DossierCard>
          ) : null}
        </div>
      </div>
    </div>
  );
};

