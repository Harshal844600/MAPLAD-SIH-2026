import React from 'react';
import { Sparkles, Brain, Cpu } from 'lucide-react';

interface AIThinkingWavesProps {
  isStreaming?: boolean;
  statusText?: string;
  modelName?: string;
}

export const AIThinkingWaves: React.FC<AIThinkingWavesProps> = ({
  isStreaming = true,
  statusText = 'Groq Neural Model Synthesizing Grounded Evidence...',
  modelName = 'openai/gpt-oss-120b',
}) => {
  return (
    <div className="relative p-4 rounded-2xl border border-[#c9b8a0]/40 light:border-[#E2E8F0] bg-black/60 light:bg-white backdrop-blur-xl overflow-hidden shadow-2xl light:shadow-[0_8px_30px_rgba(15,23,42,0.08)] animate-in fade-in border-beam-card">
      {/* Background glowing aura */}
      <div className="absolute inset-0 bg-radial from-[#c9b8a0]/15 light:from-[#8C735D]/10 via-transparent to-transparent animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Model ID and Status */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl border border-[#c9b8a0]/60 light:border-[#D8C7B5] bg-white/5 light:bg-[#F5EFEB] flex items-center justify-center shadow-[0_0_15px_rgba(201,184,160,0.3)] light:shadow-[0_2px_8px_rgba(140,115,93,0.15)]">
            <Brain className="w-5 h-5 text-[#c9b8a0] light:text-[#8C735D] animate-pulse" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#c9b8a0] light:bg-[#8C735D] rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] light:text-[#78350F] px-2 py-0.5 rounded bg-white/5 light:bg-[#FFFBEB] border border-white/10 light:border-[#FDE68A]">
                LIVE NEURAL REASONING
              </span>
              <span className="text-xs font-mono text-zinc-400 light:text-[#475569] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#c9b8a0] light:text-[#8C735D]" />
                {modelName}
              </span>
            </div>
            <p className="text-xs font-sans text-zinc-200 light:text-[#0F172A] font-medium mt-0.5">
              {statusText}
            </p>
          </div>
        </div>

        {/* Right: Soundwave / Neural bars */}
        <div className="flex items-center gap-1 h-6">
          {[40, 75, 100, 60, 90, 45, 80, 100, 50, 70, 95, 30].map((height, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-[#a78b71] to-[#e8d5b7] light:from-[#8C735D] light:to-[#D8C7B5] rounded-full shadow-[0_0_6px_rgba(201,184,160,0.5)] light:shadow-[0_0_6px_rgba(140,115,93,0.25)]"
              style={{
                height: isStreaming ? `${height}%` : '20%',
                animation: isStreaming ? `soundwave 1s ease-in-out infinite alternate ${i * 0.08}s` : 'none',
                transition: 'height 200ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
