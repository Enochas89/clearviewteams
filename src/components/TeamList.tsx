import React from 'react';
import { Project } from '../types';
import { MOCK_TEAM } from '../data/mock';

interface TeamListProps {
  project: Project;
}

export function TeamList({ project: _project }: TeamListProps) {
  return (
    <div className="space-y-3">
      {MOCK_TEAM.map((name, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600">
            {name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-700 truncate">{name}</div>
            <div className="text-[10px] text-slate-400 font-medium">Clear View Team</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      ))}
    </div>
  );
}
