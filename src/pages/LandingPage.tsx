import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Bot,
  MapPin,
  CheckCircle2,
  FileText,
  Lock,
  BookOpen,
} from 'lucide-react';
import {
  ClassicalCard,
  ClassicalButton,
  ArchiveLabel,
  OrnateDivider,
  CornerFlourish,
  WaxSeal,
  DossierCard,
} from '../components/ui';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION (Academia / Classical Hero) */}
      <section className="relative pt-8 pb-12 text-center max-w-4xl mx-auto space-y-6">
        {/* Top Institutional Seal & Overline */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ArchiveLabel variant="brass">
            MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
          </ArchiveLabel>
          <span className="text-xs font-['Cinzel'] font-bold tracking-[0.2em] text-[#9C8B7A] uppercase">
            SIH 2026 OFFICIAL ARCHIVE
          </span>
        </div>

        {/* Main Classical Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] leading-[1.1] tracking-tight">
          Find the anomalies <br />
          <span className="text-[#C9A962] italic">
            before they become institutional losses.
          </span>
        </h1>

        <OrnateDivider glyph="star" className="max-w-md mx-auto" />

        {/* Proclamation with Drop Cap */}
        <div className="max-w-2xl mx-auto text-left p-6 bg-[#251E19] border border-[#4A3F35] rounded-[4px] relative shadow-2xl">
          <CornerFlourish size="md" color="#C9A962" />
          <p className="text-base sm:text-lg text-[#E8DFD4] font-['Crimson_Pro'] leading-relaxed drop-cap">
            A prestigious records repository and forensic intelligence command center. MPLAD Sentinel
            cross-references financial vouchers, timeline milestones, contractor concentration, and
            PostGIS spatial data to uncover irregularities with verifiable, evidence-backed explainability.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/dashboard">
            <ClassicalButton
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              ENTER COMMAND CENTER
            </ClassicalButton>
          </Link>
          <Link to="/projects/MPLAD-10291">
            <ClassicalButton
              variant="secondary"
              size="lg"
              icon={<span className="text-[#C9A962]">✶</span>}
            >
              EXAMINE CASE #MPLAD-10291
            </ClassicalButton>
          </Link>
        </div>
      </section>

      {/* 2. THE 5-STEP FORENSIC WORKFLOW (VOLUME ARCHITECTURE) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-['Cinzel'] font-bold tracking-[0.25em] text-[#C9A962] uppercase">
            THE FIVE VOLUMES OF EVIDENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
            How MPLAD Sentinel Operates
          </h2>
          <OrnateDivider glyph="flourish" className="max-w-xs mx-auto" />
          <p className="text-base text-[#9C8B7A] font-['Crimson_Pro'] italic max-w-xl mx-auto">
            From raw administrative records ingest to structured Groq AI case synthesis and tamper-evident audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              vol: 'I',
              title: 'COLLECT',
              desc: 'Project ledgers, treasury disbursements, contractor registries, and PostGIS coordinates.',
              icon: Layers,
            },
            {
              vol: 'II',
              title: 'DETECT',
              desc: 'Deterministic Schedule of Rates rules and statistical isolation models across 6 layers.',
              icon: Search,
            },
            {
              vol: 'III',
              title: 'EXPLAIN',
              desc: 'Strictly grounded Groq Sentinel AI breaks down facts, inferences, and citations.',
              icon: Bot,
            },
            {
              vol: 'IV',
              title: 'INVESTIGATE',
              desc: 'Interactive relational graphs, chronological timelines, and confidential officer notes.',
              icon: FileText,
            },
            {
              vol: 'V',
              title: 'AUDIT',
              desc: 'Formal PDF case dossiers and tamper-evident append-only SHA-256 chained audit trails.',
              icon: Lock,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <DossierCard key={card.vol} flourish={false} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#4A3F35] pb-2">
                  <span className="font-['Cinzel'] font-bold text-sm tracking-widest text-[#C9A962]">
                    VOL. {card.vol}
                  </span>
                  <Icon className="w-4 h-4 text-[#9C8B7A]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9C8B7A] font-['Crimson_Pro'] leading-relaxed">
                  {card.desc}
                </p>
              </DossierCard>
            );
          })}
        </div>
      </section>

      {/* 3. CASE STUDY SHOWCASE (#MPLAD-10291) */}
      <section>
        <DossierCard variant="elevated" className="p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4A3F35] pb-4">
            <div className="flex items-center gap-4">
              <WaxSeal label="FLAGGED" size="md" />
              <div>
                <ArchiveLabel variant="crimson">CONFIDENTIAL CASE FILE</ArchiveLabel>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] mt-1">
                  Case Record: #MPLAD-10291 (Phulpur Block)
                </h3>
                <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">
                  Critical Anomaly Score: 91 / 100 • 5 Multi-layer Discrepancies
                </p>
              </div>
            </div>

            <Link to="/projects/MPLAD-10291">
              <ClassicalButton variant="secondary" size="md">
                OPEN COMPLETE CASE DOSSIER
              </ClassicalButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-['Crimson_Pro']">
            <div className="p-4 bg-[#1C1714] border border-[#4A3F35] rounded-[4px] space-y-1.5">
              <span className="text-xs font-['Cinzel'] font-bold tracking-widest text-[#fca5a5] uppercase block">
                FINANCIAL DISCREPANCY
              </span>
              <h4 className="text-base font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
                Duplicate Invoice Disbursement
              </h4>
              <p className="text-xs text-[#9C8B7A] leading-relaxed">
                Invoice #INV-APX-884 disbursed twice to "Apex Infrastructure" totaling ₹36.40 Lakh
                without milestone reconciliation.
              </p>
            </div>

            <div className="p-4 bg-[#1C1714] border border-[#4A3F35] rounded-[4px] space-y-1.5">
              <span className="text-xs font-['Cinzel'] font-bold tracking-widest text-[#fbbf24] uppercase block">
                GEOGRAPHIC OVERLAP
              </span>
              <h4 className="text-base font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
                Asset Boundary Overlap (8m)
              </h4>
              <p className="text-xs text-[#9C8B7A] leading-relaxed">
                Coordinates match a completed 2023 community hall within 8 meters, indicating potential
                duplicate asset billing.
              </p>
            </div>

            <div className="p-4 bg-[#1C1714] border border-[#4A3F35] rounded-[4px] space-y-1.5">
              <span className="text-xs font-['Cinzel'] font-bold tracking-widest text-[#C9A962] uppercase block">
                TIMELINE CONFLICT
              </span>
              <h4 className="text-base font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
                Chronological Sequence Inversion
              </h4>
              <p className="text-xs text-[#9C8B7A] leading-relaxed">
                Official completion certificate signed on 28-Feb-2024, prior to the sanction order date
                of 15-Mar-2024.
              </p>
            </div>
          </div>
        </DossierCard>
      </section>
    </div>
  );
};
