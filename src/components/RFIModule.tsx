import React from 'react';
import { 
  MessageSquare,
} from 'lucide-react';
import { Project } from '../types';

interface RFIModuleProps {
  project: Project;
}

export function RFIModule({ project: _project }: RFIModuleProps) {
  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
        <MessageSquare size={32} className="md:w-10 md:h-10" />
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900">Clear Communication</h3>
        <p className="text-slate-500 text-sm md:text-base max-w-sm mx-auto">RFIs are coming to mobile soon. Keep track of every request from your pocket.</p>
      </div>
      <button className="bg-slate-100 text-slate-500 px-6 py-2 rounded-xl font-bold text-xs md:text-sm cursor-not-allowed">Coming Soon</button>
    </div>
  );
}
