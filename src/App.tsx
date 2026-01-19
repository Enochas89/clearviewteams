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
import { MOCK_PROFILE, MOCK_ORG, MOCK_PROJECT } from './data/mock';
import { Profile, Organization, Project, View } from './types';

export default function App() {
  const [profile] = useState<Profile>(MOCK_PROFILE);
  const [activeOrg] = useState<Organization>(MOCK_ORG);
  const [activeProject] = useState<Project>(MOCK_PROJECT);
  const [view, setView] = useState<View>('feed');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const shouldShowTour = typeof window !== 'undefined' && !localStorage.getItem('cv_seen_tour');
    setShowTour(Boolean(shouldShowTour));
  }, []);

  const closeTour = () => {
    localStorage.setItem('cv_seen_tour', 'true');
    setShowTour(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-[60] animate-pulse" />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar 
          activeOrg={activeOrg} 
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
          activeOrg={activeOrg} 
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
              {view === 'feed' && <SocialFeed user={profile} />}
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
