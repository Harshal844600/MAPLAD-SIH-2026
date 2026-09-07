import React from 'react';
import { Sparkles, Brain, Cpu } from 'lucide-react';

interface AIThinkingWavesProps {
  isStreaming?: boolean;
  statusText?: string;
  modelName?: string;
}

export const AIThinkingWaves: React.FC<AIThinkingWavesProps> = ({
  isStreaming = true,
  statusText = 'Groq Llama 3.3 70B Synthesizing Forensic Evidence...',
  modelName = 'llama-3.3-70b-versatile',
}) => {
  return (
    <div className="relative p-4 rounded-[4px] border border-[#C9A962]/50 bg-[#1C1714] overflow-hidden shadow-2xl animate-in fade-in">
      {/* Background glowing aura */}
      <div className="absolute inset-0 bg-radial from-[#C9A962]/10 via-transparent to-transparent animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Model ID and Status */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-[4px] border border-[#C9A962] bg-[#251E19] flex items-center justify-center shadow-[0_0_15px_rgba(201,169,98,0.3)]">
            <Brain className="w-5 h-5 text-[#C9A962] animate-pulse" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C9A962] rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-['Cinzel'] font-bold tracking-widest text-[#C9A962] px-1.5 py-0.5 rounded bg-[#251E19] border border-[#C9A962]/40">
                LIVE NEURAL REASONING
              </span>
              <span className="text-xs font-mono text-[#9C8B7A] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#C9A962]" />
                {modelName}
              </span>
            </div>
            <p className="text-sm font-['Crimson_Pro'] italic text-[#E8DFD4] mt-0.5">
              {statusText}
            </p>
          </div>
        </div>

        {/* Right: Soundwave / Neural bars */}
        <div className="flex items-center gap-1 h-6">
          {[40, 75, 100, 60, 90, 45, 80, 100, 50, 70, 95, 30].map((height, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-[#C9A962] to-[#f6e05e] rounded-full shadow-[0_0_6px_rgba(201,169,98,0.5)]"
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
