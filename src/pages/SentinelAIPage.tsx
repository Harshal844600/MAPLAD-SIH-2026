import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ShieldAlert,
  Bot,
  Scroll,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Zap,
  HelpCircle,
  FileText,
  MapPin,
  Fingerprint,
  ShieldCheck,
  User,
  Radio,
} from 'lucide-react';
import {
  ClassicalCard,
  ClassicalButton,
  VolumeHeader,
  ArchiveLabel,
  AIThinkingWaves,
  LiveStatusPill,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { querySentinelGroqAI, buildGroundingContext } from '../services/ai';
import { SentinelAIAnalysisResult } from '../types';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'SENTINEL';
  text: string;
  analysis?: SentinelAIAnalysisResult;
  timestamp: string;
  isStreaming?: boolean;
}

export const SentinelAIPage: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const flagshipProject = appStore.getProjectById('MPLAD-10291')!;
  const anomalies = appStore.getProjectAnomalies(flagshipProject.id);
  const transactions = appStore.getProjectTransactions(flagshipProject.id);
  const documents = appStore.getProjectDocuments(flagshipProject.id);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'SENTINEL',
      text: `Hello, Officer. I am **Sentinel AI**, your real-time forensic intelligence and investigative copilot for the MPLAD Scheme.\n\nI am powered by live generative neural models with direct access to national project ledgers, Schedule of Rates, contractor HHI cartel matrices, and PostGIS spatial proximity buffers. How can I assist your investigation today?`,
      timestamp: '10:00 AM',
    },
  ]);

  const presetCategories = [
    {
      label: 'Financial & Invoices',
      query: 'Explain the duplicate invoice disbursement pattern on #INV-APX-884.',
      icon: FileText,
    },
    {
      label: 'Vendor Cartel (HHI)',
      query: 'Which contractors have excessive award concentration in Prayagraj?',
      icon: Fingerprint,
    },
    {
      label: 'Spatial Overlap (PostGIS)',
      query: 'Explain the 8.2m spatial boundary overlap detected at Phulpur.',
      icon: MapPin,
    },
    {
      label: 'Flagship Dossier (#10291)',
      query: 'Why is Project #MPLAD-10291 flagged as Critical (91/100)?',
      icon: Sparkles,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'SENTINEL',
        text: `Chat session reset. You can ask me any question in natural language regarding project compliance, vendor cartels, spatial proximity buffers, or financial audits across the MPLADS repository.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Dynamic Context Resolution: Check if query references any specific project in store
      let targetProject = flagshipProject;
      const foundMatch = appStore.getProjects({ pageSize: 50 }).items.find((p) =>
        queryText.toLowerCase().includes(p.project_code.toLowerCase())
      );
      if (foundMatch) {
        targetProject = foundMatch;
      }

      const pAnomalies = appStore.getProjectAnomalies(targetProject.id);
      const pTransactions = appStore.getProjectTransactions(targetProject.id);
      const pDocuments = appStore.getProjectDocuments(targetProject.id);

      const context = buildGroundingContext(
        targetProject,
        pAnomalies,
        pTransactions,
        pDocuments
      );

      const analysis = await querySentinelGroqAI(queryText, context);

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'SENTINEL',
        text: analysis.summary,
        analysis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      appStore.logAudit('AI_QUERY_EXECUTED', 'AI', undefined, {
        query: queryText,
        modelVersion: analysis.modelVersion,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-page-enter">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="SENTINEL AI"
        title="Live Grounded Forensic Intelligence Copilot"
        subtitle="Real-time multi-layer neural reasoning engine connected to live MPLADS telemetry with zero hallucination."
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 light:bg-emerald-50 border border-emerald-500/40 rounded-full text-xs font-mono text-emerald-300 light:text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE AI CONNECTED</span>
            </div>
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl border border-white/10 light:border-slate-300 bg-white/[0.04] light:bg-slate-100 hover:bg-white/[0.08] text-zinc-400 light:text-slate-600 transition-all cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* 2. PRESET CATEGORY CHIPS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {presetCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendQuery(cat.query)}
              className="p-3 bg-white/[0.03] light:bg-white hover:bg-[#c9b8a0]/15 light:hover:bg-[#FDF8F3] border border-white/10 light:border-[#E7E5E4] hover:border-[#c9b8a0] light:hover:border-[#8C735D] rounded-2xl text-left transition-all shadow-sm cursor-pointer group flex items-start gap-2.5"
            >
              <div className="p-1.5 rounded-lg bg-white/5 light:bg-[#F5EFEB] text-[#c9b8a0] light:text-[#8C735D] shrink-0 mt-0.5 border light:border-[#E7E0D8]">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-mono font-bold text-[#c9b8a0] light:text-[#8C735D] uppercase tracking-wider block truncate">
                  {cat.label}
                </span>
                <p className="text-xs text-zinc-300 light:text-[#334155] font-sans line-clamp-1 group-hover:text-white light:group-hover:text-[#0F172A]">
                  {cat.query}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. CHAT MESSAGES CONTAINER */}
      <div className="space-y-6 min-h-[480px] max-h-[640px] overflow-y-auto p-6 bg-black/40 light:bg-[#FAFAF9] border border-white/10 light:border-[#E7E5E4] rounded-[32px] shadow-2xl backdrop-blur-xl sentinel-copilot-card">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-3xl p-6 rounded-[28px] space-y-4 shadow-sm ${
                msg.sender === 'USER'
                  ? 'bg-gradient-to-r from-[#a78b71]/25 to-[#c9b8a0]/20 light:from-[#F6F1EB] light:to-[#EDE4D8] border border-[#a78b71]/40 light:border-[#D8C7B5] text-white light:text-[#1E293B] shadow-[0_0_20px_rgba(167,139,113,0.15)] light:shadow-[0_4px_16px_rgba(140,115,93,0.12)]'
                  : 'bg-white/[0.03] light:bg-white backdrop-blur-md border border-white/10 light:border-[#E2E8F0] text-zinc-100 light:text-[#0F172A] light:shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)]'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 light:border-[#E2E8F0] pb-2.5">
                <span className="font-bold text-[#c9b8a0] light:text-[#8C735D] flex items-center gap-2">
                  {msg.sender === 'USER' ? (
                    <>
                      <User className="w-3.5 h-3.5" /> INVESTIGATOR INQUIRY
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-[#e8d5b7] light:text-[#8C735D]" /> SENTINEL AI SYNTHESIS
                    </>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-400 light:text-[#64748B]">{msg.timestamp}</span>
                  {msg.sender === 'SENTINEL' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-zinc-400 hover:text-white light:text-[#64748B] light:hover:text-[#0F172A] transition-colors cursor-pointer"
                      title="Copy Response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="font-sans text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-zinc-200 light:text-[#1E293B]">
                {msg.text}
              </div>

              {/* Structured Key Findings Cards if provided */}
              {msg.analysis && (
                <div className="space-y-4 pt-3 border-t border-white/10 light:border-[#E2E8F0] font-sans text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#c9b8a0] light:text-[#8C735D] tracking-wider uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> EVIDENCE GROUNDING BREAKDOWN:
                    </span>
                    <span
                      className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                        msg.analysis.riskLevel === 'CRITICAL'
                          ? 'bg-red-950/50 light:bg-red-50 text-red-400 light:text-red-700 border border-red-500/30 light:border-red-200'
                          : 'bg-amber-950/50 light:bg-amber-50 text-amber-400 light:text-amber-800 border border-amber-500/30 light:border-amber-200'
                      }`}
                    >
                      {msg.analysis.riskLevel} RISK (Confidence: {Math.round(msg.analysis.confidence * 100)}%)
                    </span>
                  </div>

                  {msg.analysis.keyFindings.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {msg.analysis.keyFindings.map((finding, fi) => (
                        <div
                          key={fi}
                          className="p-3.5 bg-black/40 light:bg-[#F8FAFC] border border-white/10 light:border-[#E2E8F0] rounded-2xl space-y-2 shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-serif text-sm font-bold text-white light:text-[#0F172A]">
                              {finding.title}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                                finding.severity === 'CRITICAL'
                                  ? 'bg-red-950/50 light:bg-red-50 text-red-400 light:text-red-700 border border-red-500/30 light:border-red-200'
                                  : 'bg-amber-950/50 light:bg-amber-50 text-amber-400 light:text-amber-800 border border-amber-500/30 light:border-amber-200'
                              }`}
                            >
                              {finding.severity}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 light:text-[#334155] leading-relaxed">
                            <strong className="text-[#c9b8a0] light:text-[#8C735D] font-mono text-[10px] block">DOCUMENTED FACT:</strong>
                            {finding.fact}
                          </p>
                          <p className="text-xs text-zinc-200 light:text-[#1E293B] leading-relaxed">
                            <strong className="text-red-400 light:text-red-700 font-mono text-[10px] block">FORENSIC INFERENCE:</strong>
                            {finding.inference}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommended Audit Protocol */}
                  {msg.analysis.recommendedNextSteps?.length > 0 && (
                    <div className="p-4 bg-[#a78b71]/10 light:bg-[#FFFDF5] border border-[#a78b71]/30 light:border-[#FDE68A] rounded-2xl space-y-2">
                      <strong className="font-mono text-xs text-[#e8d5b7] light:text-[#78350F] tracking-wider uppercase block flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 light:text-emerald-600" /> STATUTORY AUDIT DIRECTIVES:
                      </strong>
                      <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300 light:text-[#475569] leading-relaxed">
                        {msg.analysis.recommendedNextSteps.map((step, si) => (
                          <li key={si}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-zinc-400 light:text-[#64748B] uppercase tracking-wider block mb-1.5">
                      SUGGESTED INVESTIGATION FOLLOW-UPS:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Generate CAG Statutory Audit Reference Docket',
                        'View Raw OCR Invoice Text Streams',
                        'Check PostGIS 25m Topological Map Buffer',
                      ].map((sug, suidx) => (
                        <button
                          key={suidx}
                          onClick={() => handleSendQuery(sug)}
                          className="text-[11px] font-mono px-3 py-1 bg-white/[0.04] light:bg-white hover:bg-[#c9b8a0]/20 light:hover:bg-[#F8FAFC] border border-white/10 light:border-[#CBD5E1] light:hover:border-[#8C735D] rounded-lg text-zinc-300 light:text-[#334155] light:hover:text-[#0F172A] transition-all cursor-pointer shadow-xs"
                        >
                          → {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="w-full">
            <AIThinkingWaves isStreaming={true} statusText="Groq Neural Model Generating Real-Time Grounded Evidence..." />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. INPUT PROMPT BOX */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(inputQuery);
        }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Sentinel AI anything in natural language..."
          className="flex-1 bg-black/60 light:bg-white border border-white/15 light:border-[#CBD5E1] rounded-2xl px-5 py-3.5 min-h-[52px] font-sans text-sm text-white light:text-[#0F172A] placeholder:text-zinc-500 light:placeholder:text-[#94A3B8] focus:outline-none focus:border-[#c9b8a0] light:focus:border-[#8C735D] light:focus:ring-2 light:focus:ring-[#8C735D]/20 transition-all shadow-xl light:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
        />
        <ClassicalButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={!inputQuery.trim() || isLoading}
          icon={<Send className="w-4 h-4" />}
        >
          SUBMIT
        </ClassicalButton>
      </form>
    </div>
  );
};
