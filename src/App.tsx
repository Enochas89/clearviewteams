import React, { useState, useEffect } from 'react';
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
import { Profile, Organization, Project, View } from './types';
import { supabase, isSupabaseReady } from './lib/supabaseClient';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [view, setView] = useState<View>('feed');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const shouldShowTour = typeof window !== 'undefined' && !localStorage.getItem('cv_seen_tour');
    setShowTour(Boolean(shouldShowTour));
  }, []);

  useEffect(() => {
    const loadContext = async () => {
      if (!isSupabaseReady || !supabase) {
        setContextError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setAuthRequired(true);
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        setContextError(profileError.message);
        setLoading(false);
        return;
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
        setContextError('No projects available for this user.');
        setLoading(false);
        return;
      }

      const projectRow: any = membership.projects;
      const orgData = Array.isArray(projectRow?.organizations) ? projectRow.organizations[0] : projectRow?.organizations;
      setActiveOrg(orgData ? { id: orgData.id, name: orgData.name } : null);
      setActiveProject({ id: projectRow.id, name: projectRow.name, org_id: projectRow.org_id });
      if (profileData) setProfile(profileData);
      setContextError(null);
      setLoading(false);
    };

    loadContext();
  }, []);

  const closeTour = () => {
    localStorage.setItem('cv_seen_tour', 'true');
    setShowTour(false);
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
      <div className="h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md text-center space-y-3">
          <h2 className="text-xl font-black text-slate-900">Sign in required</h2>
          <p className="text-slate-600 text-sm">Please sign in with Supabase Auth to view your projects.</p>
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
    </div>
  );
}
