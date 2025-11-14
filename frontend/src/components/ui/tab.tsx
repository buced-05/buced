import { cn } from "../../utils/cn";

export type Tab = {
  id: string;
  label: string;
  badge?: number;
};

export type TabsProps = {
  tabs: Tab[];
  current: string;
  onChange: (id: string) => void;
};

export const Tabs = ({ tabs, current, onChange }: TabsProps) => (
  <div className="inline-flex rounded-full border-2 border-neon-cyan/30 bg-[#1A1A2E] p-1 text-sm shadow-neon">
    {tabs.map((tab) => {
      const isActive = tab.id === current;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative inline-flex items-center gap-2 rounded-full px-4 py-2 font-black transition-all duration-300 hover:scale-105",
            isActive
              ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-[#0A0A0F] shadow-neon"
              : "text-gray-400 hover:bg-neon-cyan/10 hover:text-neon-cyan"
          )}
        >
          <span>{tab.label}</span>
          {typeof tab.badge !== "undefined" ? (
            <span
              className={cn(
                "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full text-xs font-black",
                isActive ? "bg-[#0A0A0F]/20 text-neon-cyan" : "bg-[#2A2A3E] text-gray-400"
              )}
            >
              {tab.badge}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
);

