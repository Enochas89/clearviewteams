import React, { useState } from 'react';
import { 
  MoreVertical,
  ThumbsUp,
  MessageSquare,
  ClipboardList,
  FileText
} from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [acks, setAcks] = useState(0);
  const [discussCount, setDiscussCount] = useState(0);
  const [acked, setAcked] = useState(false);
  const [discussed, setDiscussed] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
            {post.profiles?.full_name?.[0]}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-none text-sm md:text-base">{post.profiles?.full_name}</h4>
            <span className="text-[10px] md:text-[11px] text-slate-400 font-medium uppercase tracking-tight mt-1 inline-block">
              {new Date(post.created_at).toLocaleDateString()} - {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-600 p-1"><MoreVertical size={18}/></button>
      </div>

      <div className="text-slate-700 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
        {post.content}
      </div>

      {post.entity_type && (
        <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {post.entity_type === 'task' ? <ClipboardList className="text-emerald-600" size={18} /> : <FileText className="text-teal-600" size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest truncate">Team {post.entity_type.replace('_', ' ')}</div>
            <div className="text-xs md:text-sm font-bold text-slate-700 truncate">Reference: CV-{post.id}</div>
          </div>
          <button className="text-emerald-600 text-xs font-bold hover:underline shrink-0">View</button>
        </div>
      )}

      <div className="flex items-center gap-6 pt-3 md:pt-4 border-t border-slate-50">
        <button
          onClick={() => {
            if (acked) return;
            setAcked(true);
            setAcks((c) => c + 1);
          }}
          className={`flex items-center gap-2 text-xs md:text-sm font-bold transition-colors ${acked ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
        >
          <ThumbsUp size={16} className="md:w-[18px] md:h-[18px]" /> <span>Ack{acks ? ` (${acks})` : ''}</span>
        </button>
        <button
          onClick={() => {
            if (discussed) return;
            setDiscussed(true);
            setDiscussCount((c) => c + 1);
          }}
          className={`flex items-center gap-2 text-xs md:text-sm font-bold transition-colors ${discussed ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
        >
          <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" /> <span>Discuss{discussCount ? ` (${discussCount})` : ''}</span>
        </button>
      </div>
    </div>
  );
}
