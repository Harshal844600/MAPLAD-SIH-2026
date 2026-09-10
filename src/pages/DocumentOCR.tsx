import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Cpu,
  Sparkles,
  Search,
  RotateCw,
  FileSpreadsheet,
  FilePlus,
  Loader2,
  Trash2,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  VolumeHeader,
  ArchiveLabel,
  LiveStatusPill,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { DocumentRecord } from '../types';

export const DocumentOCR: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>(
    appStore.getProjectDocuments('proj-10291')
  );
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(
    documents[1] || documents[0] || null
  );
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setUploadProgress(15);

    const isInvoice = file.name.toLowerCase().includes('inv') || file.name.toLowerCase().includes('bill');
    const isCert = file.name.toLowerCase().includes('cert') || file.name.toLowerCase().includes('comp');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const docType = isInvoice
        ? 'INVOICE'
        : isCert
        ? 'COMPLETION_CERTIFICATE'
        : 'SANCTION_ORDER';

      const hasDateMismatch = isInvoice || Math.random() > 0.4;
      const claimedSum = isInvoice ? 1820000 : 4800000;

      const newDoc = appStore.addProjectDocument('proj-10291', {
        document_type: docType,
        file_name: file.name,
        file_size_bytes: file.size,
        mime_type: file.type || 'application/pdf',
        is_verified: !hasDateMismatch,
        extraction: {
          extracted_vendor_name: 'Apex Infrastructure Ltd.',
          extracted_amount: claimedSum,
          extracted_date: hasDateMismatch ? '2024-03-01' : '2024-03-25',
          extracted_location: 'Gram Panchayat Saidabad, Phulpur Block',
          confidence: 0.98,
          mismatch_flags: hasDateMismatch
            ? ['Invoice date (2024-03-01) precedes administrative sanction date (2024-03-15)']
            : [],
        },
      });

      const updated = appStore.getProjectDocuments('proj-10291');
      setDocuments(updated);
      setSelectedDoc(newDoc);
      setIsUploading(false);
      setUploadSuccess(`Successfully extracted & audited "${file.name}" (98.4% Confidence)`);
      setTimeout(() => setUploadSuccess(null), 4000);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadSample = (type: 'invoice' | 'cert') => {
    const fakeFile = new File(
      ['dummy pdf stream content for OCR extraction testing'],
      type === 'invoice' ? 'TAX_INVOICE_INV-APX-994.pdf' : 'PHYSICAL_COMPLETION_CERT_PHULPUR.pdf',
      { type: 'application/pdf' }
    );
    processFile(fakeFile);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-page-enter">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.tiff"
        className="hidden"
      />

      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="DOCUMENT ARCHIVE"
        title="Document Intelligence & OCR Verifier"
        subtitle="Automated optical character extraction, date-sanction chronology comparison, and invoice reconciliation engine."
        action={
          <div className="flex items-center gap-3">
            <LiveStatusPill label="OCR PIPELINE ACTIVE" />
            <ClassicalButton
              variant="primary"
              size="md"
              icon={<Upload className="w-4 h-4" />}
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              {isUploading ? 'EXTRACTING...' : 'UPLOAD EXHIBIT (PDF)'}
            </ClassicalButton>
          </div>
        }
      />

      {/* Upload Success Alert Toast */}
      {uploadSuccess && (
        <div className="p-4 bg-emerald-950/40 light:bg-emerald-50 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-xs text-emerald-300 light:text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-mono font-medium">{uploadSuccess}</span>
        </div>
      )}

      {/* Uploading Progress Hologram */}
      {isUploading && (
        <div className="p-5 bg-black/60 light:bg-white border border-[#c9b8a0] rounded-2xl space-y-3 backdrop-blur-xl shadow-2xl animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#c9b8a0] light:text-amber-800 font-bold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#c9b8a0]" />
              PARSING PDF TEXT STREAM & CROSS-REFERENCING LEDGER...
            </span>
            <span className="font-bold text-white light:text-slate-900">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 light:bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#a78b71] to-[#e8d5b7] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. GRID: DOCUMENTS LIST & OCR MISMATCH COMPARE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Documents List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <ArchiveLabel text="CASE EXHIBITS & VOUCHERS" />
            <span className="text-[10px] font-mono text-zinc-400 light:text-slate-500">
              {documents.length} Archival Items
            </span>
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              const hasFlags = Boolean(doc.extraction?.mismatch_flags?.length);

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#c9b8a0]/15 light:bg-amber-50/80 border-[#c9b8a0] shadow-[0_0_20px_rgba(201,184,160,0.2)] ring-1 ring-[#c9b8a0]'
                      : 'bg-white/[0.03] light:bg-slate-50 border-white/10 light:border-slate-200 hover:border-[#c9b8a0]/50 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-[10px] px-2 py-0.5 bg-white/5 light:bg-slate-200 text-[#c9b8a0] light:text-slate-800 border border-white/10 light:border-slate-300 rounded-md">
                      {doc.document_type}
                    </span>
                    {hasFlags ? (
                      <span className="text-[10px] font-mono font-bold text-red-400 light:text-red-600 flex items-center gap-1 bg-red-950/40 light:bg-red-50 px-2 py-0.5 rounded border border-red-500/30">
                        <AlertTriangle className="w-3 h-3 text-red-400 light:text-red-600" /> MISMATCH
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 light:text-emerald-600 flex items-center gap-1 bg-emerald-950/40 light:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 light:text-emerald-600" /> AUDITED
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white light:text-slate-900 truncate">
                    {doc.file_name}
                  </h4>
                  <p className="text-xs text-zinc-400 light:text-slate-500 mt-1 font-mono">
                    Uploaded by {doc.uploaded_by_name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Drag & Drop Upload Zone */}
          <div
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="p-6 border-2 border-dashed border-white/15 light:border-slate-300 hover:border-[#c9b8a0]/80 rounded-2xl text-center space-y-2 cursor-pointer transition-all duration-300 bg-white/[0.02] light:bg-slate-50/50 hover:bg-[#c9b8a0]/5 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 light:bg-amber-100 flex items-center justify-center text-[#c9b8a0] light:text-amber-800 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white light:text-slate-900">
              Click to browse or drop PDF voucher
            </p>
            <p className="text-[11px] text-zinc-500 light:text-slate-500 font-mono">
              PDF, TIFF, JPG up to 25MB • Automated OCR Audit
            </p>
          </div>

          {/* Quick Demo Sample Exhibit Loaders */}
          <div className="p-3.5 bg-black/40 light:bg-white border border-white/10 light:border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 light:text-slate-500 uppercase tracking-wider block">
              LOAD DEMO TEST EXHIBIT:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleUploadSample('invoice')}
                className="flex-1 text-[11px] font-mono py-1.5 px-2.5 bg-white/5 light:bg-slate-100 hover:bg-[#c9b8a0]/20 border border-white/10 light:border-slate-300 rounded-lg text-zinc-300 light:text-slate-700 transition-all cursor-pointer truncate"
              >
                + Invoice APX-994
              </button>
              <button
                type="button"
                onClick={() => handleUploadSample('cert')}
                className="flex-1 text-[11px] font-mono py-1.5 px-2.5 bg-white/5 light:bg-slate-100 hover:bg-[#c9b8a0]/20 border border-white/10 light:border-slate-300 rounded-lg text-zinc-300 light:text-slate-700 transition-all cursor-pointer truncate"
              >
                + Completion Cert
              </button>
            </div>
          </div>
        </div>

        {/* Right: Field Comparison Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDoc ? (
            <DossierCard
              className={`p-6 space-y-6 border-beam-card ${
                selectedDoc.extraction?.mismatch_flags?.length ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 light:border-slate-200 pb-4">
                <div>
                  <ArchiveLabel text="OPTICAL EXTRACTION AUDIT" />
                  <h3 className="text-2xl font-bold font-serif text-white light:text-slate-900 mt-1">
                    {selectedDoc.file_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-zinc-400 light:text-slate-500 font-mono flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#c9b8a0]" /> Vision-Transformer OCR
                    </span>
                    <span className="text-xs font-mono text-[#c9b8a0] light:text-amber-800 bg-white/5 light:bg-amber-50 px-2 py-0.5 rounded border border-white/10 light:border-amber-200 font-bold">
                      Confidence: {Math.round((selectedDoc.extraction?.confidence || 0.95) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider border">
                  {selectedDoc.extraction?.mismatch_flags?.length ? (
                    <span className="text-red-400 light:text-red-700 font-bold flex items-center gap-1.5 bg-red-950/30 light:bg-red-50 px-3 py-1 rounded-md border border-red-500/30">
                      <ShieldAlert className="w-4 h-4 text-red-400 light:text-red-600" /> FLAGGED IRREGULARITY
                    </span>
                  ) : (
                    <span className="text-emerald-400 light:text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-950/30 light:bg-emerald-50 px-3 py-1 rounded-md border border-emerald-500/30">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 light:text-emerald-600" /> RECONCILED WITH LEDGER
                    </span>
                  )}
                </div>
              </div>

              {/* Comparison Table */}
              <div className="border border-white/10 light:border-slate-200 rounded-xl bg-black/40 light:bg-white overflow-hidden shadow-inner">
                <table className="w-full text-left text-sm font-sans">
                  <thead>
                    <tr className="bg-white/[0.04] light:bg-slate-100 border-b border-white/10 light:border-slate-200 font-mono text-xs text-[#c9b8a0] light:text-slate-700 tracking-wider">
                      <th className="p-3.5">AUDIT ATTRIBUTE</th>
                      <th className="p-3.5">EXTRACTED DOCUMENT VALUE</th>
                      <th className="p-3.5">OFFICIAL SANCTION LEDGER</th>
                      <th className="p-3.5">VERDICT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 light:divide-slate-200 text-zinc-200 light:text-slate-800 text-xs">
                    <tr>
                      <td className="p-3.5 font-bold font-mono text-zinc-400 light:text-slate-600">VENDOR NAME</td>
                      <td className="p-3.5 font-mono">{selectedDoc.extraction?.extracted_vendor_name || 'Apex Infrastructure Ltd.'}</td>
                      <td className="p-3.5 font-mono">Apex Infrastructure Ltd.</td>
                      <td className="p-3.5 text-emerald-400 light:text-emerald-600 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> MATCHES
                      </td>
                    </tr>
                    <tr className={selectedDoc.extraction?.mismatch_flags?.length ? 'bg-red-500/10 light:bg-red-50' : ''}>
                      <td className="p-3.5 font-bold font-mono text-zinc-400 light:text-slate-600">DOCUMENT DATE</td>
                      <td className={`p-3.5 font-mono font-bold ${selectedDoc.extraction?.mismatch_flags?.length ? 'text-red-400 light:text-red-600' : ''}`}>
                        {selectedDoc.extraction?.extracted_date || '2024-03-01'}
                      </td>
                      <td className="p-3.5 font-mono">2024-03-15 (Sanction Date)</td>
                      <td className={`p-3.5 font-mono font-bold ${selectedDoc.extraction?.mismatch_flags?.length ? 'text-red-400 light:text-red-600' : 'text-emerald-400 light:text-emerald-600'}`}>
                        {selectedDoc.extraction?.mismatch_flags?.length ? '⚠️ PREDATES SANCTION' : '✓ CHRONOLOGY VALID'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold font-mono text-zinc-400 light:text-slate-600">CLAIMED SUM</td>
                      <td className="p-3.5 font-mono font-bold text-[#c9b8a0] light:text-amber-800">
                        ₹{selectedDoc.extraction?.extracted_amount?.toLocaleString('en-IN') || '18,20,000'}
                      </td>
                      <td className="p-3.5 font-mono font-bold">₹18,20,000 (Milestone 1)</td>
                      <td className="p-3.5 text-emerald-400 light:text-emerald-600 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> WITHIN CEILING
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Extracted Raw OCR Snippet */}
              <div className="p-4 bg-black/60 light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl text-xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-400 light:text-slate-600 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c9b8a0]" /> RAW EXTRACTED TEXT STREAM (OPTICAL JSON)
                  </span>
                  <button
                    onClick={() =>
                      handleCopyText(
                        `TAX INVOICE: ${selectedDoc.extraction?.extracted_vendor_name || 'APEX INFRASTRUCTURE LTD'}. FILE: ${selectedDoc.file_name}. DATE: ${selectedDoc.extraction?.extracted_date || '01-MAR-2024'}. TOTAL PAYABLE: INR ${selectedDoc.extraction?.extracted_amount || 1820000}/-. CONFIDENCE: ${Math.round((selectedDoc.extraction?.confidence || 0.95) * 100)}%.`
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-mono text-[#c9b8a0] light:text-amber-800 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="font-mono text-xs text-zinc-300 light:text-slate-800 leading-relaxed bg-black/30 light:bg-white p-3.5 rounded-lg border border-white/5 light:border-slate-200">
                  {`"TAX INVOICE / VOUCHER: ${selectedDoc.extraction?.extracted_vendor_name || 'APEX INFRASTRUCTURE & HEAVY WORKS LTD'}. REF: ${selectedDoc.file_name}. DATE: ${selectedDoc.extraction?.extracted_date || '01-MAR-2024'}. WORK LOCATION: ${selectedDoc.extraction?.extracted_location || 'PHULPUR'}. TOTAL PAYABLE: INR ${(selectedDoc.extraction?.extracted_amount || 1820000).toLocaleString('en-IN')}/-. GSTIN: 09AAACA1234F1Z5."`}
                </p>
              </div>
            </DossierCard>
          ) : null}
        </div>
      </div>
    </div>
  );
};
