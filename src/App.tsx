import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { SocialFeed } from './components/SocialFeed';
import { TaskBoard } from './components/TaskBoard';
import { ChangeOrderModule } from './components/ChangeOrderModule';
import { RFIModule } from './components/RFIModule';
import { NotificationsPanel } from './components/NotificationsPanel';
import { TeamList } from './components/TeamList';
import { LoadingState } from './components/LoadingState';
import { OnboardingTour } from './components/OnboardingTour';
import { InviteModal } from './components/InviteModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { Profile, Organization, Project, View } from './types';
import { supabase, isSupabaseReady } from './lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [view, setView] = useState<View>('feed');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [missingProject, setMissingProject] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectError, setProjectError] = useState<string | null>(null);

  const handleSignOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setProfile(null);
    setActiveOrg(null);
    setActiveProject(null);
    setAuthRequired(true);
    setShowInvite(false);
    setShowCreateProject(false);
    setMissingProject(false);
  }, [supabase]);

  useEffect(() => {
    const shouldShowTour = typeof window !== 'undefined' && !localStorage.getItem('cv_seen_tour');
    setShowTour(Boolean(shouldShowTour));
  }, []);

  const loadContext = useCallback(async () => {
    if (!isSupabaseReady || !supabase) {
      setContextError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email ?? 'New User';

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      setContextError(profileError.message);
      setLoading(false);
      return;
    }

    if (!profileData) {
      const { data: newProfile, error: insertProfileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userEmail,
          avatar_url: null,
        })
        .select('id, full_name, avatar_url')
        .single();
      if (insertProfileError) {
        setContextError(insertProfileError.message);
        setLoading(false);
        return;
      }
      setProfile(newProfile);
    } else {
      setProfile(profileData);
    }

    const { data: membership, error: membershipError } = await supabase
      .from('project_members')
      .select(`
        project_id,
        role,
        projects (
          id,
          name,
          org_id,
          organizations (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      setContextError(membershipError.message);
      setLoading(false);
      return;
    }

    if (!membership?.projects) {
      setMissingProject(true);
      setLoading(false);
      return;
    }

    const projectRow: any = membership.projects;
    const orgData = Array.isArray(projectRow?.organizations) ? projectRow.organizations[0] : projectRow?.organizations;
    setActiveOrg(orgData ? { id: orgData.id, name: orgData.name } : null);
    setActiveProject({ id: projectRow.id, name: projectRow.name, org_id: projectRow.org_id });
    setContextError(null);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadContext();
  }, [loadContext]);

  useEffect(() => {
    if (!supabase) return;
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setAuthRequired(false);
        setContextError(null);
        setMissingProject(false);
        loadContext();
      }
      if (event === 'SIGNED_OUT') {
        handleSignOut();
      }
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, loadContext, handleSignOut]);

  const closeTour = () => {
    localStorage.setItem('cv_seen_tour', 'true');
    setShowTour(false);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim() || !supabase || !profile) return;
    setCreatingProject(true);
    setProjectError(null);
    try {
      const orgName = `${profile.full_name?.split(' ')[0] || 'Team'} Workspace`;
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({ name: orgName })
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
        .insert({ project_id: projData.id, user_id: profile.id, role: 'admin' });
      if (memberError) throw memberError;

      setActiveOrg({ id: orgData.id, name: orgData.name });
      setActiveProject({ id: projData.id, name: projData.name, org_id: projData.org_id });
      setMissingProject(false);
      setProjectName('');
      setContextError(null);
    } catch (err: any) {
      setProjectError(err.message || 'Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  if (loading) return <LoadingState />;

  if (contextError) {
    return (
      <div className="h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md text-center space-y-3">
          <h2 className="text-xl font-black text-slate-900">Setup needed</h2>
          <p className="text-slate-600 text-sm">{contextError}</p>
        </div>
      </div>
    );
  }

  if (authRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt="Clear View logo" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">Clear View</p>
              <h2 className="text-lg font-black text-slate-900">Sign in</h2>
              <p className="text-slate-500 text-sm">Access your projects and site activity.</p>
            </div>
          </div>
          {supabase && (
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#059669',
                      brandAccent: '#047857',
                    },
                  },
                },
                className: {
                  button: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
                  input: 'rounded-lg border-slate-200',
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />
          )}
          {!supabase && (
            <p className="text-sm text-red-600">
              Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (missingProject && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt="Clear View logo" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">Clear View</p>
              <h2 className="text-lg font-black text-slate-900">Create your first project</h2>
              <p className="text-slate-500 text-sm">Set up a workspace to start posting updates.</p>
            </div>
          </div>
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
          {projectError && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{projectError}</div>}
          <button
            onClick={handleCreateProject}
            disabled={creatingProject || !projectName.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-emerald-100 disabled:opacity-60"
          >
            {creatingProject ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !activeProject) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-[60] animate-pulse" />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar 
          activeOrg={activeOrg || { name: 'Workspace' }} 
          view={view} 
          setView={setView} 
          profile={profile}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Slide-out) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeOrg={activeOrg || { name: 'Workspace' }} 
          view={view} 
          setView={(v: View) => { setView(v); setIsMobileMenuOpen(false); }} 
          profile={profile}
          isMobile
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header 
          activeProject={activeProject} 
          user={profile} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onInviteClick={() => setShowInvite(true)}
          onNewProject={() => setShowCreateProject(true)}
          onSignOut={handleSignOut}
        />
        
        <div className="flex-1 flex overflow-hidden pb-16 lg:pb-0">
          <main className="flex-1 overflow-y-auto scrollbar-hide bg-slate-50/30">
            <div className="max-w-3xl mx-auto py-4 md:py-6 px-4">
              {view === 'feed' && <SocialFeed user={profile} projectId={activeProject.id} />}
              {view === 'tasks' && <TaskBoard project={activeProject} />}
              {view === 'co' && <ChangeOrderModule project={activeProject} />}
              {view === 'rfis' && <RFIModule project={activeProject} />}
              {view === 'notifications' && <div className="lg:hidden"><NotificationsPanel user={profile} /></div>}
            </div>
          </main>

          {/* Right Sidebar - Desktop Only */}
          <aside className="w-80 bg-white hidden xl:flex flex-col border-l border-slate-200">
            <NotificationsPanel user={profile} />
            <div className="p-6 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Project Team</h3>
              <TeamList project={activeProject} />
            </div>
          </aside>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav activeView={view} setView={setView} />
      </div>

      <OnboardingTour open={showTour} onClose={closeTour} />
      <InviteModal open={showInvite} onClose={() => setShowInvite(false)} project={activeProject} />
      <CreateProjectModal
        open={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        user={profile}
        onCreated={(org, proj) => {
          setActiveOrg(org);
          setActiveProject(proj);
          setMissingProject(false);
          setShowCreateProject(false);
        }}
      />
    </div>
  );
}
