import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  ShieldAlert,
  Bot,
  Scroll,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  ClassicalInput,
  VolumeHeader,
  ArchiveLabel,
  AIThinkingWaves,
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
}

export const SentinelAIPage: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flagshipProject = appStore.getProjectById('MPLAD-10291')!;
  const anomalies = appStore.getProjectAnomalies(flagshipProject.id);
  const transactions = appStore.getProjectTransactions(flagshipProject.id);
  const documents = appStore.getProjectDocuments(flagshipProject.id);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'SENTINEL',
      text: `Greetings, Officer. I am Sentinel AI, your evidence-grounded forensic copilot for the MPLAD Scheme. I operate under strict institutional hallucination controls: every conclusion is grounded in documented project vouchers, timeline logs, and PostGIS coordinates.`,
      timestamp: '10:00 AM',
    },
  ]);

  const presetQueries = [
    'Why is Project #MPLAD-10291 flagged as Critical (91/100)?',
    'Which contractors have excessive award concentration in Prayagraj?',
    'Explain the duplicate invoice disbursement pattern on #INV-APX-884.',
    'Summarize recommended on-ground verification steps for Phulpur site.',
  ];

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
      const context = buildGroundingContext(
        flagshipProject,
        anomalies,
        transactions,
        documents
      );

      const analysis = await querySentinelGroqAI(queryText, context);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'SENTINEL',
        text: analysis.summary,
        analysis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      appStore.logAudit('AI_QUERY_EXECUTED', 'AI', undefined, { query: queryText });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="SENTINEL AI"
        title="ARCHIVAL RESEARCH DESK & COPILOT"
        subtitle="Evidence-backed investigation assistant powered by Groq Llama-3.3 70B with strict evidentiary grounding."
        action={
          <span className="font-['Cinzel'] text-xs font-bold px-3 py-1.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded tracking-widest">
            MODEL: GROQ/LLAMA-3.3-70B
          </span>
        }
      />

      {/* 2. PRESET QUERY CHIPS */}
      <div className="flex flex-wrap gap-2">
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(pq)}
            className="text-xs font-['Cinzel'] px-3.5 py-2 bg-[#251E19] text-[#E8DFD4] border border-[#4A3F35] rounded hover:border-[#C9A962] hover:text-[#C9A962] text-left transition-colors shadow-sm"
          >
            ✦ {pq}
          </button>
        ))}
      </div>

      {/* 3. CHAT MESSAGES CONTAINER */}
      <div className="space-y-4 min-h-[420px] max-h-[560px] overflow-y-auto p-5 bg-[#1C1714] border border-[#4A3F35] rounded shadow-xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl p-5 border rounded space-y-3 ${
                msg.sender === 'USER'
                  ? 'bg-[#251E19] border-[#C9A962]/50 text-[#E8DFD4]'
                  : 'bg-[#251E19] border-[#4A3F35] text-[#E8DFD4]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-['Cinzel'] border-b border-[#4A3F35] pb-2">
                <span className="font-bold text-[#C9A962]">
                  {msg.sender === 'USER' ? 'INVESTIGATOR INQUIRY' : 'SENTINEL ARCHIVAL RESPONSE'}
                </span>
                <span className="text-[10px] text-[#9C8B7A]">{msg.timestamp}</span>
              </div>

              <p className="font-['Crimson_Pro'] text-base leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </p>

              {/* Structured Key Findings Cards if provided */}
              {msg.analysis && (
                <div className="space-y-3 pt-3 border-t border-[#4A3F35] font-['Crimson_Pro'] text-xs">
                  <h5 className="font-['Cinzel'] font-bold text-xs text-[#C9A962] tracking-wider">
                    EVIDENCE GROUNDING BREAKDOWN:
                  </h5>
                  {msg.analysis.keyFindings.map((finding, fi) => (
                    <div
                      key={fi}
                      className="p-3 bg-[#1C1714] border border-[#4A3F35] rounded space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-['Cormorant_Garamond'] text-base font-bold text-[#E8DFD4]">{finding.title}</span>
                        <span className="text-[10px] font-['Cinzel'] px-2 py-0.5 bg-[#8B2635]/20 text-[#E8DFD4] border border-[#8B2635] rounded">{finding.severity}</span>
                      </div>
                      <p className="text-xs text-[#9C8B7A]">
                        <strong className="text-[#C9A962] font-['Cinzel'] text-[10px]">FACT: </strong> {finding.fact}
                      </p>
                      <p className="text-xs text-[#E8DFD4]">
                        <strong className="text-[#8B2635] font-['Cinzel'] text-[10px]">INFERENCE: </strong> {finding.inference}
                      </p>
                    </div>
                  ))}

                  <div className="p-3 bg-[#3D332B]/50 border border-[#C9A962]/40 rounded text-[#E8DFD4]">
                    <strong className="font-['Cinzel'] text-xs text-[#C9A962] tracking-wider block mb-1">
                      RECOMMENDED AUDIT PROTOCOL:
                    </strong>
                    <ul className="list-disc list-inside space-y-1">
                      {msg.analysis.recommendedNextSteps.map((step, si) => (
                        <li key={si}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="w-full">
            <AIThinkingWaves isStreaming={true} statusText="Groq Llama 3.3 70B Grounding Evidence Across Vouchers & Coordinates..." />
          </div>
        )}
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
          placeholder="Consult Sentinel AI regarding risk indicators, contractor history, or timeline conflicts..."
          className="flex-1 bg-[#251E19] border border-[#4A3F35] rounded px-4 py-3 min-h-[50px] font-['Crimson_Pro'] text-base text-[#E8DFD4] placeholder:italic placeholder:text-[#9C8B7A] focus:outline-none focus:border-[#C9A962]"
        />
        <ClassicalButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={!inputQuery.trim() || isLoading}
          icon={<Send className="w-4 h-4" />}
        >
          QUERY
        </ClassicalButton>
      </form>
    </div>
  );
};

