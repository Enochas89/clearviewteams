import React from 'react';
import { 
  Search,
  Bell,
  Menu,
  UserPlus,
  PlusCircle,
  LogOut
} from 'lucide-react';

import { Project, Profile } from '../types';

interface HeaderProps {
  activeProject: Project;
  user: Profile;
  onMenuClick: () => void;
  onInviteClick: () => void;
  onNewProject: () => void;
  onSignOut: () => void;
}

export function Header({ activeProject, user, onMenuClick, onInviteClick, onNewProject, onSignOut }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 pr-3 border-r border-slate-200">
            <img src="/logo.webp" alt="Clear View logo" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
            <div className="leading-tight">
              <div className="font-black text-slate-900 text-sm">Clear View</div>
              <div className="text-[9px] text-emerald-600 font-semibold uppercase tracking-widest">Teams</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline">Projects</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-bold text-slate-900 truncate max-w-[120px] md:max-w-none">{activeProject?.name}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onNewProject}
          className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs bg-white hover:bg-slate-50 transition"
        >
          <PlusCircle size={16} /> New Project
        </button>
        <button
          onClick={onInviteClick}
          className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-100 text-emerald-700 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 transition"
        >
          <UserPlus size={16} /> Invite
        </button>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs bg-white hover:bg-slate-50 transition"
        >
          <LogOut size={16} /> Sign out
        </button>
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent rounded-xl py-2 pl-10 pr-4 text-sm w-40 lg:w-64 transition-all"
          />
        </div>
        <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
