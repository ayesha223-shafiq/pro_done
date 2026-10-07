import { Bell, Github, Menu, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onOpenMobileMenu: () => void;
  onOpenGitHub: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigate: (view: string) => void;
  unreadCount?: number;
}

export function Navbar({
  currentView,
  onOpenMobileMenu,
  onOpenGitHub,
  onOpenAuth,
  onNavigate,
  unreadCount = 3,
}: NavbarProps) {
  const { user, logOut } = useAuth();

  const viewTitles: Record<string, string> = {
    dashboard: 'Farm Intelligence Dashboard',
    farms: 'My Agricultural Farms',
    'farm-mapping': 'Autonomous Spatial Mapping',
    'crop-monitoring': 'Crop Health & NDVI Index',
    'disease-detection': 'AI Crop Pathology & Diagnostics',
    'drone-missions': 'Drone Flight Missions & Fleet',
    'precision-spraying': 'Precision Micro-Dose Spraying',
    weather: 'Farm Weather Telemetry',
    analytics: 'Yield & Vegetative Analytics',
    reports: 'Agricultural Audit Reports',
    notifications: 'Alerts & Telemetry Center',
    booking: 'Commercial Flight Booking',
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Official Logo at top for mobile/desktop navbar */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer lg:hidden"
        >
          <img
            src="/logo.jpg"
            alt="AI-AgriHawk Pro"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-xl object-cover border border-emerald-500/30 shadow-xs"
          />
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-900 hidden sm:block">
            {viewTitles[currentView] || 'AgriHawk Pro'}
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span>AI-AgriHawk Pro</span>
            <span>›</span>
            <span className="text-emerald-700 font-semibold capitalize">
              {currentView.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* AgriHawk Website Home Button */}
        <button
          onClick={() => onNavigate('landing')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0b132b] hover:bg-[#152347] text-amber-300 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer border border-amber-400/30"
          title="Return to AgriHawk Pro public portal"
        >
          <span>🌐</span>
          <span>AgriHawk Home</span>
        </button>

        {/* Firebase Live Status */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Firestore Connected</span>
        </div>

        {/* GitHub Button */}
        <button
          onClick={onOpenGitHub}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Connect GitHub</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Auth profile */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <span className="font-bold text-gray-900 block truncate max-w-[120px]">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-gray-400 block">Farmer / Operator</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth('login')}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
