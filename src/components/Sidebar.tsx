import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  MessageSquare, 
  Paperclip,
  Settings,
  X
} from 'lucide-react';

import { Profile, Organization, View } from '../types';
import { LucideIcon } from 'lucide-react';

interface SidebarProps {
  activeOrg: Organization;
  view: View;
  setView: (view: View) => void;
  profile: Profile;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeOrg, view, setView, profile, isMobile, onClose }: SidebarProps) {
  const menuItems: { id: View; label: string; icon: LucideIcon }[] = [
    { id: 'feed', label: 'Activity Feed', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Board', icon: ClipboardList },
    { id: 'co', label: 'Change Orders', icon: FileText },
    { id: 'rfis', label: 'RFIs & Requests', icon: MessageSquare },
    { id: 'files', label: 'Team Documents', icon: Paperclip },
  ];

  return (
    <nav className="h-full w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.webp" 
            alt="Clear View logo" 
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-inner bg-white"
          />
          <div className="truncate">
            <h1 className="font-black text-slate-900 leading-tight truncate tracking-tight">Clear View</h1>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Teams Edition</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Workspace</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              view === item.id 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon size={20} className={view === item.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border-2 border-white shadow-sm font-bold">
            {profile?.full_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">{profile?.full_name}</div>
            <div className="text-[10px] text-emerald-600 font-medium truncate uppercase tracking-tighter">Team Lead</div>
          </div>
          <Settings size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </div>
    </nav>
  );
}
