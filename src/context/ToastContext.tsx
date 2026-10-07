import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Plane, Bug, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info' | 'error' | 'drone' | 'disease';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  removeToast: (id: string) => void;
  notifyMissionCompleted: (missionName: string, farm: string, onNavigate?: () => void) => void;
  notifyDiseaseUploaded: (disease: string, farm: string, confidence: number, onNavigate?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Web Audio API chime generator for pleasant notification alert sound
function playNotificationChime(type: ToastType) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'disease') {
      // Alert minor chord for disease alert
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.25); // A4
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Pleasant upward chime for mission completed
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch {
    // Ignore audio permission or playback restrictions
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type = 'info',
      title,
      message,
      actionLabel,
      onAction,
      duration = 5500,
    }: Omit<ToastItem, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      playNotificationChime(type);

      const newToast: ToastItem = {
        id,
        type,
        title,
        message,
        timestamp: timeStr,
        actionLabel,
        onAction,
        duration,
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 visible

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const notifyMissionCompleted = useCallback(
    (missionName: string, farm: string, onNavigate?: () => void) => {
      showToast({
        type: 'drone',
        title: '🚁 Drone Mission Completed',
        message: `"${missionName}" at ${farm} has landed safely. Telemetry & scans are synced to Firestore.`,
        actionLabel: 'View Missions',
        onAction: onNavigate,
        duration: 6500,
      });
    },
    [showToast]
  );

  const notifyDiseaseUploaded = useCallback(
    (disease: string, farm: string, confidence: number, onNavigate?: () => void) => {
      showToast({
        type: 'disease',
        title: '🦠 New Disease Detection Uploaded',
        message: `${disease} (${confidence}% confidence) detected at ${farm}. Recommended spraying treatment available.`,
        actionLabel: 'Inspect & Treat',
        onAction: onNavigate,
        duration: 7500,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        notifyMissionCompleted,
        notifyDiseaseUploaded,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="assertive"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-top-4 fade-in ${
              toast.type === 'drone'
                ? 'bg-emerald-950/95 text-white border-emerald-500/40 shadow-emerald-950/30'
                : toast.type === 'disease'
                ? 'bg-amber-950/95 text-white border-amber-500/50 shadow-amber-950/30'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-white border-rose-500/40 shadow-rose-950/30'
                : 'bg-gray-900/95 text-white border-gray-700 shadow-gray-950/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  toast.type === 'drone'
                    ? 'bg-emerald-800 text-emerald-200'
                    : toast.type === 'disease'
                    ? 'bg-amber-800 text-amber-200 animate-pulse'
                    : toast.type === 'error'
                    ? 'bg-rose-800 text-rose-200'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                {toast.type === 'drone' ? '🚁' : toast.type === 'disease' ? '🦠' : '🔔'}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold tracking-tight text-white line-clamp-1">
                    {toast.title}
                  </h4>
                  <span className="text-[10px] text-white/50 shrink-0">{toast.timestamp}</span>
                </div>
                <p className="text-[11px] text-white/80 mt-1 leading-snug break-words">
                  {toast.message}
                </p>

                {/* Optional Action Button */}
                {toast.actionLabel && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className={`mt-2.5 px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      toast.type === 'drone'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : toast.type === 'disease'
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <span>{toast.actionLabel}</span>
                    <span>→</span>
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Countdown animation bar */}
            <div className="mt-2.5 w-full bg-white/10 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-[5000ms] ease-linear ${
                  toast.type === 'drone'
                    ? 'bg-emerald-400'
                    : toast.type === 'disease'
                    ? 'bg-amber-400'
                    : 'bg-white/60'
                }`}
                style={{
                  width: '0%',
                  animation: `toastProgress ${toast.duration || 5500}ms linear forwards`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
