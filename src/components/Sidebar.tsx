import {
  LayoutDashboard,
  Trees,
  Map,
  Sprout,
  Bug,
  Plane,
  Droplets,
  CloudSun,
  BarChart3,
  FileText,
  Bell,
  Calendar,
  Home,
  LogOut,
  Github,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenGitHub: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function Sidebar({ currentView, onNavigate, onOpenGitHub, onOpenAuth }: SidebarProps) {
  const { user, logOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'farms', label: 'My Farms', icon: '🌾' },
    { id: 'farm-mapping', label: 'Farm Mapping', icon: '🗺️' },
    { id: 'crop-monitoring', label: 'Crop Monitoring', icon: '🌱' },
    { id: 'disease-detection', label: 'Disease Detection', icon: '🦠' },
    { id: 'drone-missions', label: 'Drone Missions', icon: '🚁' },
    { id: 'precision-spraying', label: 'Precision Spraying', icon: '💦' },
    { id: 'weather', label: 'Weather', icon: '☁️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'booking', label: 'Book Drone Service', icon: '📅' },
    { id: 'leads', label: 'Backend Leads & Inquiries', icon: '📬' },
  ];

  return (
    <aside className="w-64 bg-[#0b3d2e] text-white flex flex-col shrink-0 min-h-screen border-r border-[#082d22]">
      {/* Brand */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="AI-AgriHawk Pro"
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover border-2 border-amber-400/50 shadow-md bg-white shrink-0"
          />
          <div>
            <div className="flex items-baseline gap-1 font-serif text-base tracking-tight text-white font-black leading-tight">
              <span>AI-AgriHawk</span>
              <span className="text-amber-400 text-xs font-sans font-bold tracking-wider">PRO</span>
            </div>
            <span className="text-[10px] text-emerald-200/80 font-medium block">
              Autonomous Aerial Farm OS
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <button
          onClick={() => onNavigate('landing')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:bg-white/10 transition cursor-pointer text-left bg-white/5 border border-amber-400/20"
        >
          <span>🌐</span>
          <span>AgriHawk Portal Home</span>
        </button>

        <div className="pt-2 pb-1 px-3.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
          Autonomous Aerial OS
        </div>

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-white/10 space-y-1.5">
        <button
          onClick={onOpenGitHub}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-200 hover:bg-white/10 transition cursor-pointer"
        >
          <Github className="w-4 h-4 text-emerald-300" />
          <span>GitHub Setup</span>
        </button>

        {user ? (
          <button
            onClick={() => logOut()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({user.email?.split('@')[0]})</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuth('login')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition cursor-pointer shadow-xs"
          >
            <span>🔐</span>
            <span>Sign In to Firebase</span>
          </button>
        )}
      </div>
    </aside>
  );
}
