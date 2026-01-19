import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  Bell,
  LucideIcon,
} from 'lucide-react';
import { View } from '../types';

interface MobileNavProps {
  activeView: View;
  setView: (view: View) => void;
}

export function MobileNav({ activeView, setView }: MobileNavProps) {
  const tabs: { id: View; icon: LucideIcon; label: string }[] = [
    { id: 'feed', icon: LayoutDashboard, label: 'Feed' },
    { id: 'tasks', icon: ClipboardList, label: 'Tasks' },
    { id: 'co', icon: FileText, label: 'Budget' },
    { id: 'notifications', icon: Bell, label: 'Activity' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-40">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${
            activeView === tab.id ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          <tab.icon size={20} strokeWidth={activeView === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
