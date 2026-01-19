import React from 'react';
import { 
  PlusCircle,
  FileText
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Project, ChangeOrder } from '../types';
import { MOCK_CHANGE_ORDERS } from '../data/mock';

interface ChangeOrderModuleProps {
  project: Project;
}

export function ChangeOrderModule({ project: _project }: ChangeOrderModuleProps) {
  const cos: ChangeOrder[] = MOCK_CHANGE_ORDERS;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">Change Orders</h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Budgeting and variations.</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-100 transition-all text-sm">
          <PlusCircle size={18} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {cos.map(co => (
          <div key={co.id} className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-all group gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-teal-100 transition-colors">
                <FileText size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-base md:text-lg truncate">{co.title}</div>
                <div className="flex gap-3 mt-1 items-center">
                  <span className="text-xs md:text-sm font-bold text-teal-700">${co.amount.toLocaleString()}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-[10px] md:text-xs text-slate-400 font-medium">CV-CO-{co.id.slice(-1)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-start sm:justify-end">
              <StatusBadge status={co.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
