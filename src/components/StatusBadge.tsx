import React from 'react';
import { ChangeOrder } from '../types';

interface StatusBadgeProps {
  status: ChangeOrder['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<ChangeOrder['status'], string> = {
    submitted: 'bg-blue-50 text-blue-600',
    approved: 'bg-emerald-50 text-emerald-600',
    rejected: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
}
