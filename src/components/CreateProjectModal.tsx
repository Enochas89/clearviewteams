import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { Organization, Profile, Project } from '../types';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';

interface CreateProjectModalProps {
  open: boolean;
  user: Profile;
  onClose: () => void;
  onCreated: (org: Organization, project: Project) => void;
}

export function CreateProjectModal({ open, user, onClose, onCreated }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('Project name is required.');
      return;
    }
    if (!isSupabaseReady || !supabase) {
      setError('Supabase is not configured.');
      return;
    }
    setLoading(true);
    setError(null);
    const orgLabel = orgName.trim() || `${user.full_name?.split(' ')[0] || 'Team'} Workspace`;
    try {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({ name: orgLabel })
        .select('id, name')
        .single();
      if (orgError) throw orgError;

      const { data: projData, error: projError } = await supabase
        .from('projects')
        .insert({ name: projectName.trim(), org_id: orgData.id })
        .select('id, name, org_id')
        .single();
      if (projError) throw projError;

      const { error: memberError } = await supabase
        .from('project_members')
        .insert({ project_id: projData.id, user_id: user.id, role: 'admin' });
      if (memberError) throw memberError;

      onCreated({ id: orgData.id, name: orgData.name }, { id: projData.id, name: projData.name, org_id: projData.org_id });
      setProjectName('');
      setOrgName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">New project</p>
            <h2 className="text-lg font-black text-slate-900">Create a workspace</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
            aria-label="Close create project"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Horizon Residential Phase I"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Clear View Construction"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-[11px] text-slate-400">Leave blank to auto-fill from your name.</p>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || !projectName.trim()}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-emerald-100 disabled:opacity-60"
            >
              <PlusCircle size={16} /> {loading ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
