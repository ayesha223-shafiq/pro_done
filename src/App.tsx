import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import {
  subscribeFarms,
  subscribeDroneMissions,
  subscribeBookings,
  subscribeDiseaseDetections,
  subscribeSprayingMissions,
  subscribeFarmMappings,
  subscribeReports,
} from './services/firestoreService';
import type {
  Farm,
  DroneMission,
  BookingRecord,
  DiseaseDetection,
  SprayingMission,
  FarmMapping,
  ReportItem,
} from './types';

// Components
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FarmsView } from './components/FarmsView';
import { FarmMappingView } from './components/FarmMappingView';
import { CropMonitoringView } from './components/CropMonitoringView';
import { DiseaseDetectionView } from './components/DiseaseDetectionView';
import { DroneMissionsView } from './components/DroneMissionsView';
import { PrecisionSprayingView } from './components/PrecisionSprayingView';
import { WeatherView } from './components/WeatherView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportsView } from './components/ReportsView';
import { NotificationsView } from './components/NotificationsView';
import { BookingView } from './components/BookingView';
import { AdminLeadsView } from './components/AdminLeadsView';

// Modals
import { AuthModal } from './components/AuthModal';
import { GitHubModal } from './components/GitHubModal';
import { AddFarmModal } from './components/AddFarmModal';
import { AddMissionModal } from './components/AddMissionModal';

function MainApp() {
  const { user } = useAuth();
  const { notifyMissionCompleted, notifyDiseaseUploaded } = useToast();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [targetFarmForMapping, setTargetFarmForMapping] = useState<string | undefined>(undefined);
  const [targetDiseaseForSpraying, setTargetDiseaseForSpraying] = useState<string | undefined>(undefined);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [addFarmOpen, setAddFarmOpen] = useState(false);
  const [addMissionOpen, setAddMissionOpen] = useState(false);

  // Real-time Firestore state
  const [farms, setFarms] = useState<Farm[]>([]);
  const [missions, setMissions] = useState<DroneMission[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [detections, setDetections] = useState<DiseaseDetection[]>([]);
  const [sprayMissions, setSprayMissions] = useState<SprayingMission[]>([]);
  const [mappings, setMappings] = useState<FarmMapping[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);

  // Subscribe to Firestore collections whenever user logs in or changes
  useEffect(() => {
    if (!user) {
      setFarms([]);
      setMissions([]);
      setBookings([]);
      setDetections([]);
      setSprayMissions([]);
      setMappings([]);
      setReports([]);
      return;
    }

    const unsubFarms = subscribeFarms(user.uid, (data) => setFarms(data));
    const unsubMissions = subscribeDroneMissions(
      user.uid,
      (data) => setMissions(data),
      (changeType, mission) => {
        if (mission.status === 'Completed') {
          notifyMissionCompleted(mission.missionName, mission.farm, () => {
            navigateTo('drone-missions');
          });
        }
      }
    );
    const unsubBookings = subscribeBookings(user.uid, (data) => setBookings(data));
    const unsubDetections = subscribeDiseaseDetections(
      user.uid,
      (data) => setDetections(data),
      (changeType, item) => {
        if (changeType === 'added') {
          notifyDiseaseUploaded(item.disease, item.farmName, item.confidence, () => {
            navigateTo('disease-detection');
          });
        }
      }
    );
    const unsubSpray = subscribeSprayingMissions(user.uid, (data) => setSprayMissions(data));
    const unsubMappings = subscribeFarmMappings(user.uid, (data) => setMappings(data));
    const unsubReports = subscribeReports(user.uid, (data) => setReports(data));

    return () => {
      unsubFarms();
      unsubMissions();
      unsubBookings();
      unsubDetections();
      unsubSpray();
      unsubMappings();
      unsubReports();
    };
  }, [user]);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on landing view, render high-converting landing page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-emerald-200">
        <LandingPage
          onEnterDashboard={(view) => navigateTo(view || 'dashboard')}
          onOpenGitHub={() => setGithubModalOpen(true)}
          onOpenAuth={handleOpenAuth}
        />

        <AuthModal
          isOpen={authModalOpen}
          defaultMode={authMode}
          onClose={() => setAuthModalOpen(false)}
        />

        <GitHubModal
          isOpen={githubModalOpen}
          onClose={() => setGithubModalOpen(false)}
        />
      </div>
    );
  }

  // Dashboard & Operating System Layout
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-gray-900 antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenGitHub={() => setGithubModalOpen(true)}
          onOpenAuth={handleOpenAuth}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative z-10 w-72 h-full">
            <Sidebar
              currentView={currentView}
              onNavigate={navigateTo}
              onOpenGitHub={() => {
                setMobileMenuOpen(false);
                setGithubModalOpen(true);
              }}
              onOpenAuth={(mode) => {
                setMobileMenuOpen(false);
                handleOpenAuth(mode);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          currentView={currentView}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenGitHub={() => setGithubModalOpen(true)}
          onOpenAuth={handleOpenAuth}
          onNavigate={navigateTo}
          unreadCount={3}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {currentView === 'dashboard' && (
              <DashboardView
                farms={farms}
                missions={missions}
                onNavigate={navigateTo}
                onOpenAddFarm={() => setAddFarmOpen(true)}
                onOpenAddMission={() => setAddMissionOpen(true)}
              />
            )}

            {currentView === 'farms' && (
              <FarmsView
                farms={farms}
                onOpenAddModal={() => setAddFarmOpen(true)}
                onNavigateToMapping={(farmName) => {
                  setTargetFarmForMapping(farmName);
                  navigateTo('farm-mapping');
                }}
              />
            )}

            {currentView === 'farm-mapping' && (
              <FarmMappingView
                farms={farms}
                savedMappings={mappings}
                initialSelectedFarm={targetFarmForMapping}
              />
            )}

            {currentView === 'crop-monitoring' && (
              <CropMonitoringView
                farms={farms}
                scans={[]}
                onNavigateToDisease={() => navigateTo('disease-detection')}
              />
            )}

            {currentView === 'disease-detection' && (
              <DiseaseDetectionView
                detections={detections}
                onScheduleSpraying={(disease) => {
                  setTargetDiseaseForSpraying(disease);
                  navigateTo('precision-spraying');
                }}
              />
            )}

            {currentView === 'drone-missions' && (
              <DroneMissionsView
                missions={missions}
                farms={farms}
                onOpenCreateModal={() => setAddMissionOpen(true)}
              />
            )}

            {currentView === 'precision-spraying' && (
              <PrecisionSprayingView
                farms={farms}
                sprayingMissions={sprayMissions}
                initialTreatment={targetDiseaseForSpraying}
              />
            )}

            {currentView === 'weather' && <WeatherView farms={farms} />}

            {currentView === 'analytics' && <AnalyticsView farms={farms} />}

            {currentView === 'reports' && (
              <ReportsView farms={farms} reports={reports} />
            )}

            {currentView === 'notifications' && (
              <NotificationsView notifications={[]} />
            )}

            {currentView === 'booking' && (
              <BookingView farms={farms} bookings={bookings} />
            )}

            {currentView === 'leads' && <AdminLeadsView />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        defaultMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      <GitHubModal
        isOpen={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
      />

      <AddFarmModal
        isOpen={addFarmOpen}
        onClose={() => setAddFarmOpen(false)}
      />

      <AddMissionModal
        isOpen={addMissionOpen}
        onClose={() => setAddMissionOpen(false)}
        farms={farms}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
