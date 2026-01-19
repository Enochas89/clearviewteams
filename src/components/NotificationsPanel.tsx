import React from 'react';
import { 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Profile } from '../types';

interface NotificationsPanelProps {
  user: Profile;
}

export function NotificationsPanel({ user }: NotificationsPanelProps) {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="font-bold text-[10px] md:text-sm text-slate-400 uppercase tracking-wider">Site Eyes</h3>
        <span className="bg-emerald-600 text-white text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-bold">2 Alert</span>
      </div>
      <div className="space-y-4">
        <NotificationItem 
          title="Team Check-in" 
          desc="Exterior framing crew is now active on site." 
          time="2m ago" 
          icon={<CheckCircle2 className="text-emerald-500" size={18}/>} 
        />
        <NotificationItem 
          title="Financial Clear" 
          desc="CO #102 sourcing was approved by PM." 
          time="1h ago" 
          icon={<FileText className="text-teal-500" size={18}/>} 
        />
      </div>
    </div>
  );
}
