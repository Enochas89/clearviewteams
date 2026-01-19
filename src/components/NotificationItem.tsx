import React from 'react';

interface NotificationItemProps {
  title: string;
  desc: string;
  time: string;
  icon: React.ReactNode;
}

export function NotificationItem({ title, desc, time, icon }: NotificationItemProps) {
  return (
    <div className="flex gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-slate-800 text-xs truncate">{title}</h4>
          <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap ml-2">{time}</span>
        </div>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
