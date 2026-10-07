import { useState } from 'react';
import type { NotificationItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { markNotificationRead, markAllNotificationsRead, addNotification } from '../services/firestoreService';
import { Bell, Check, CheckCheck, AlertCircle, Droplets, Plane, Battery, SunMedium } from 'lucide-react';

interface NotificationsViewProps {
  notifications: NotificationItem[];
}

export function NotificationsView({ notifications }: NotificationsViewProps) {
  const { user } = useAuth();

  const defaultStarterNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      userId: user?.uid || 'guest',
      type: 'disease',
      title: 'Pathology Detected',
      message: 'Leaf Rust (Puccinia triticina) detected in Main Farm with 94% AI confidence.',
      timeAgo: '10 minutes ago',
      read: false,
    },
    {
      id: 'notif-2',
      userId: user?.uid || 'guest',
      type: 'drone',
      title: 'Drone Flight Completed',
      message: 'Main Farm Crop Scan mission AH-024 has landed successfully at home coordinates.',
      timeAgo: '35 minutes ago',
      read: false,
    },
    {
      id: 'notif-3',
      userId: user?.uid || 'guest',
      type: 'weather',
      title: 'Atmospheric Advisory',
      message: 'Surface wind velocity is optimal (12 km/h) for precision foliar application.',
      timeAgo: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-4',
      userId: user?.uid || 'guest',
      type: 'spray',
      title: 'Spraying Mission Dispatched',
      message: 'Precision spraying mission #SP-104 has been scheduled for East Farm.',
      timeAgo: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-5',
      userId: user?.uid || 'guest',
      type: 'battery',
      title: 'Fleet Battery Notice',
      message: 'Drone unit 02 telemetry reports battery capacity at 48%. Swap recommended.',
      timeAgo: '3 hours ago',
      read: false,
    },
    {
      id: 'notif-6',
      userId: user?.uid || 'guest',
      type: 'success',
      title: 'Spectral Mapping Sync',
      message: 'North Field crop vegetative index analysis has synced with Firebase.',
      timeAgo: 'Yesterday',
      read: true,
    },
  ];

  const [localItems, setLocalItems] = useState<NotificationItem[]>(defaultStarterNotifications);

  const displayed = notifications.length > 0 ? notifications : localItems;
  const unreadCount = displayed.filter((n) => !n.read).length;

  const handleMarkOne = async (id: string) => {
    setLocalItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    if (user && !id.startsWith('notif-')) {
      try {
        await markNotificationRead(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkAll = async () => {
    setLocalItems((prev) => prev.map((item) => ({ ...item, read: true })));
    if (user) {
      const realIds = notifications.filter((n) => !n.read && !n.id.startsWith('notif-')).map((n) => n.id);
      if (realIds.length > 0) {
        try {
          await markAllNotificationsRead(realIds);
        } catch (err) {
          console.error(err);
        }
      }
    }
    alert('All agricultural notifications marked as read.');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'disease':
        return <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">🦠</div>;
      case 'drone':
        return <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl shrink-0">🚁</div>;
      case 'weather':
        return <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl shrink-0">🌧️</div>;
      case 'spray':
        return <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">💦</div>;
      case 'battery':
        return <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl shrink-0">🔋</div>;
      default:
        return <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center text-xl shrink-0">✓</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notification Center</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time fleet telemetry warnings, disease pathology alerts, and flight mission outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">
            {unreadCount} Unread Alerts
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCheck className="w-4 h-4" /> Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {displayed.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
              !item.read
                ? 'bg-white border-l-4 border-l-emerald-600 border-gray-200 shadow-xs'
                : 'bg-gray-50/70 border-gray-200/60 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {getIcon(item.type)}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.message}</p>
                <span className="text-[10px] text-gray-400 mt-1.5 block font-semibold">{item.timeAgo}</span>
              </div>
            </div>

            {!item.read && (
              <button
                onClick={() => handleMarkOne(item.id)}
                className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer shadow-2xs"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
