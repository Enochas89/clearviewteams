import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { InvitePayload, Project, ProjectRole } from '../types';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';

interface InviteModalProps {
  open: boolean;
  project: Project;
  onClose: () => void;
}

const roles: { id: ProjectRole; label: string; desc: string }[] = [
  { id: 'viewer', label: 'Viewer', desc: 'View activity and notifications' },
  { id: 'collaborator', label: 'Collaborator', desc: 'Post updates, manage tasks' },
  { id: 'admin', label: 'Admin', desc: 'Manage invites and change orders' },
];

export function InviteModal({ open, project, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ProjectRole>('collaborator');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!isSupabaseReady || !supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setSubmitting(true);
    const payload: InvitePayload = { email: email.trim(), project_id: project.id, role };
    const { error: supaError } = await supabase.from('invites').insert(payload);
    setSubmitting(false);

    if (supaError) {
      setError(supaError.message);
      return;
    }
    setSuccess(true);
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">Invite teammate</p>
            <h2 className="text-lg font-black text-slate-900">Project access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
            aria-label="Close invite"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</p>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full text-left rounded-lg border px-3 py-3 transition ${role === r.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="text-sm font-bold text-slate-900">{r.label}</div>
                  <div className="text-xs text-slate-500">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
          {success && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">Invite sent.</div>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-emerald-100 disabled:opacity-70"
            >
              <Send size={16} /> {submitting ? 'Sending...' : 'Send invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
