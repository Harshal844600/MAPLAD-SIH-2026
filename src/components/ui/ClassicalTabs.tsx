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
}

export const ClassicalTabs: React.FC<ClassicalTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 border-b border-[#4A3F35] pb-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold font-['Cinzel'] uppercase tracking-[0.15em] transition-all duration-300 rounded-[2px] border ${
              isActive
                ? 'bg-[#C9A962]/10 text-[#C9A962] border-[#C9A962] shadow-sm'
                : 'bg-transparent text-[#9C8B7A] border-transparent hover:text-[#E8DFD4] hover:bg-[#251E19]'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-[#C9A962] text-[#1C1714] font-bold' : 'bg-[#3D332B] text-[#9C8B7A]'
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
