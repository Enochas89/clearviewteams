import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';

interface TeamListProps {
  project: Project;
}

export function TeamList({ project: _project }: TeamListProps) {
  const [team, setTeam] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeam = async () => {
      if (!isSupabaseReady || !supabase) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }
      const { data, error: teamError } = await supabase
        .from('project_members')
        .select('profiles(full_name)')
        .eq('project_id', _project.id);
      if (teamError) {
        setError(teamError.message);
      } else {
        setTeam(
          (data || [])
            .map((row: any) => {
              if (Array.isArray(row.profiles)) return row.profiles[0]?.full_name;
              return row.profiles?.full_name;
            })
            .filter(Boolean)
        );
      }
      setLoading(false);
    };
    loadTeam();
  }, [_project.id]);

  return (
    <div className="space-y-3">
      {team.map((name, i) => (
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
      {loading && <div className="text-[11px] text-slate-400">Loading team...</div>}
      {error && <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-1">{error}</div>}
      {!loading && team.length === 0 && <div className="text-[11px] text-slate-400">No team members yet.</div>}
    </div>
  );
}
