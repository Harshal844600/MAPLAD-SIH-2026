import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  badgeColor?: string;
}

export interface ClassicalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'pill' | 'line';
}

export const ClassicalTabs: React.FC<ClassicalTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'pill',
}) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full w-fit ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold font-['Inter'] tracking-wider uppercase transition-all duration-200 rounded-full select-none cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[#c9b8a0] to-[#a78b71] text-[#0a0a0a] font-bold shadow-[0_0_15px_rgba(167,139,113,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black/80 text-[#e8d5b7] font-bold' : 'bg-white/10 text-gray-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const SketchTabs = ClassicalTabs;
export const GlassTabs = ClassicalTabs;
