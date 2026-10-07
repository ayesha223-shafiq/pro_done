import { useState } from 'react';
import type { DroneMission, Farm } from '../types';
import { useAuth } from '../context/AuthContext';
import { addDroneMission, updateDroneMissionStatus } from '../services/firestoreService';
import { Plane, Play, Square, Plus, ShieldCheck, Battery, Gauge, Mountain, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface DroneMissionsViewProps {
  missions: DroneMission[];
  farms: Farm[];
  onOpenCreateModal: () => void;
}

export function DroneMissionsView({ missions, farms, onOpenCreateModal }: DroneMissionsViewProps) {
  const { user } = useAuth();
  const { notifyMissionCompleted } = useToast();
  const [stoppingId, setStoppingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const defaultStarterMissions: DroneMission[] = [
    {
      id: 'default-m1',
      userId: user?.uid || 'guest',
      missionName: 'Main Farm Crop Scan',
      missionType: 'Crop Monitoring',
      farm: 'Main Farm (Rawalpindi)',
      crop: 'Wheat',
      area: 18.4,
      areaUnit: 'ha',
      altitude: 42,
      speed: 5.8,
      battery: 76,
      status: 'Active',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 'default-m2',
      userId: user?.uid || 'guest',
      missionName: 'North Field Inspection',
      missionType: 'Disease Inspection',
      farm: 'North Field (Chakwal)',
      crop: 'Corn',
      area: 7.2,
      areaUnit: 'ha',
      altitude: 35,
      speed: 4.9,
      battery: 48,
      status: 'Active',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 'default-m3',
      userId: user?.uid || 'guest',
      missionName: 'East Field Mapping #AH-020',
      missionType: 'Farm Mapping',
      farm: 'East Farm (Islamabad)',
      crop: 'Rice',
      area: 35.0,
      areaUnit: 'ha',
      altitude: 60,
      speed: 6.2,
      battery: 100,
      status: 'Completed',
      date: 'Yesterday',
    },
  ];

  const displayedMissions = missions.length > 0 ? missions : defaultStarterMissions;
  const activeMissions = displayedMissions.filter((m) => m.status === 'Active');
  const completedMissions = displayedMissions.filter((m) => m.status === 'Completed');

  const handleStop = async (id: string, name: string) => {
    if (confirm(`Do you wish to stop mission "${name}"? Drone will initiate safe return-to-home.`)) {
      setStoppingId(id);
      try {
        if (!id.startsWith('default-')) {
          await updateDroneMissionStatus(id, 'Cancelled');
        }
        alert(`Stop command acknowledged. Drone returning to landing coordinates.`);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Error stopping mission');
      } finally {
        setStoppingId(null);
      }
    }
  };

  const handleCompleteFlight = async (mission: DroneMission) => {
    setCompletingId(mission.id);
    try {
      if (!mission.id.startsWith('default-')) {
        await updateDroneMissionStatus(mission.id, 'Completed');
      } else {
        // Trigger toast directly for local demo mission
        notifyMissionCompleted(mission.missionName, mission.farm);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error completing mission');
    } finally {
      setCompletingId(null);
    }
  };

  const handleMonitor = (name: string) => {
    alert(`Live Telemetry Stream Connected:\n\nMission: ${name}\nDownlink: RTK Fix 5.8GHz\nSensor: 4K Multispectral Gimbal\nLive feed is nominal.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Drone Flight Missions</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time drone telemetry, flight altitude, battery tracking, and autonomous waypoint routing.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Mission
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">🚁</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Missions</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">{displayedMissions.length}</div>
          <span className="text-[11px] text-gray-500 font-medium">Logged in system</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">▶️</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active Flying</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5">{activeMissions.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Currently in air</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">⏳</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Scheduled</span>
          <div className="text-2xl font-black text-amber-700 mt-0.5">
            {displayedMissions.filter((m) => m.status === 'Pending').length || 2}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Upcoming flights</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">✓</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Completed</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">{completedMissions.length || 17}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Successfully logged</span>
        </div>
      </div>

      {/* Active Missions Cards */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h2 className="text-base font-bold text-gray-900">Active Airborne Missions</h2>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            LIVE TELEMETRY
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {activeMissions.map((m, idx) => (
            <div
              key={m.id || idx}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-50 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
                    🚁
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{m.missionName}</h3>
                    <p className="text-[11px] text-gray-500">{m.farm} • {m.missionType}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                  ● In Flight
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                  <span>Coverage Progress</span>
                  <span className="text-emerald-700 font-bold">{idx === 0 ? '68%' : '34%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: idx === 0 ? '68%' : '34%' }}
                  ></div>
                </div>
              </div>

              {/* Telemetry specs */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-[9px] text-gray-400 block font-semibold">Altitude</span>
                  <strong className="text-gray-900 font-bold">{m.altitude}m</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-[9px] text-gray-400 block font-semibold">Speed</span>
                  <strong className="text-gray-900 font-bold">{m.speed}m/s</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-[9px] text-gray-400 block font-semibold">Battery</span>
                  <strong className={`font-bold ${m.battery < 50 ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {m.battery}%
                  </strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-[9px] text-gray-400 block font-semibold">Scanned</span>
                  <strong className="text-gray-900 font-bold">{m.area} {m.areaUnit}</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleMonitor(m.missionName)}
                  className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  📡 Telemetry
                </button>
                <button
                  onClick={() => handleCompleteFlight(m)}
                  disabled={completingId === m.id}
                  className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shadow-2xs"
                  title="Mark mission complete and trigger Firestore alert"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {completingId === m.id ? 'Completing...' : 'Complete Flight'}
                </button>
                <button
                  onClick={() => handleStop(m.id, m.missionName)}
                  disabled={stoppingId === m.id}
                  className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Square className="w-3 h-3" /> Stop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Operator Ground Control Station (GCS) Preview Card */}
      <div className="bg-[#0b132b] text-white p-5 rounded-2xl border border-emerald-500/30 shadow-md">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative aspect-video rounded-xl overflow-hidden border border-white/20 group">
            <img
              src="/drone-controller.jpg"
              alt="Rugged Field Controller Telemetry"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-400/30">
              GCS RTK · 26 SATELLITES
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-[11px] font-semibold text-white flex justify-between items-center">
              <span>Ground Control Station (GCS)</span>
              <span className="text-amber-400 font-mono text-[10px]">5.8 GHz Link OK</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
              🎮 Dual-Band Remote GCS
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Tactical Drone Command &amp; Field Telemetry
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Equipped with sun-readable 2000-nit high-brightness displays, AES-256 encrypted flight communications, automated fail-safe return-to-home (RTH), and live multispectral video downlink.
            </p>
            <div className="pt-1 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block">Link Range</span>
                <span className="font-bold text-emerald-400">12 km HD</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block">Latency</span>
                <span className="font-bold text-emerald-400">&lt; 45 ms</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block">Battery Life</span>
                <span className="font-bold text-emerald-400">6.5 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Missions Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3">Flight Mission Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="py-2.5 px-3">Mission</th>
                <th className="py-2.5 px-3">Farm</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Altitude</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedMissions.map((m, idx) => (
                <tr key={m.id || idx} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{m.missionName}</td>
                  <td className="py-3 px-3 text-gray-600">{m.farm}</td>
                  <td className="py-3 px-3 text-gray-600">{m.missionType}</td>
                  <td className="py-3 px-3 text-gray-600">{m.altitude}m</td>
                  <td className="py-3 px-3 text-gray-500">{m.date}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        m.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'Completed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
