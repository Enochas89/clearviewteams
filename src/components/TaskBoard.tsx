import React from 'react';
import { 
  PlusCircle,
} from 'lucide-react';
import { Project, Task } from '../types';
import { MOCK_TASKS } from '../data/mock';

interface TaskBoardProps {
  project: Project;
}

export function TaskBoard({ project: _project }: TaskBoardProps) {
  const tasks: Task[] = MOCK_TASKS;

  const columns: Task['status'][] = ['todo', 'in-progress', 'review', 'done'];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
      {columns.map(col => (
        <div key={col} className="w-[280px] shrink-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">{col.replace('-', ' ')}</h3>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
              {tasks.filter(t => t.status === col).length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks.filter(t => t.status === col).map(task => (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-all">
                <div className="text-sm font-bold text-slate-800 mb-3">{task.title}</div>
                <div className="flex items-center justify-between">
                  <div className={`text-[9px] font-bold px-2 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                    {task.priority.toUpperCase()}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-white flex items-center justify-center text-[9px] font-bold text-emerald-600">JR</div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 flex items-center justify-center gap-2 hover:border-emerald-200 hover:text-emerald-500 transition-all">
              <PlusCircle size={16} /> <span className="text-xs font-bold">Clear Task</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
