import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addDroneMission } from '../services/firestoreService';
import type { Farm } from '../types';
import { X, Plane } from 'lucide-react';

interface AddMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms: Farm[];
  onSuccess?: () => void;
}

export function AddMissionModal({ isOpen, onClose, farms, onSuccess }: AddMissionModalProps) {
  const { user } = useAuth();
  const [missionName, setMissionName] = useState('Autonomous Sector Survey');
  const [farm, setFarm] = useState(farms.length > 0 ? farms[0].name : 'Main Farm (Rawalpindi)');
  const [missionType, setMissionType] = useState('Crop Monitoring');
  const [altitude, setAltitude] = useState<number>(40);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to schedule missions into Firebase.');
      return;
    }

    setLoading(true);
    try {
      await addDroneMission({
        userId: user.uid,
        missionName: missionName.trim(),
        missionType,
        farm,
        area: 15.0,
        areaUnit: 'ha',
        altitude: Number(altitude),
        speed: 5.5,
        battery: 100,
        status: 'Active',
        date,
      });
      alert(`Mission "${missionName}" scheduled & saved to Firebase Firestore!`);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to schedule mission');
    } finally {
      setLoading(false);
    }
  };

  const farmNames =
    farms.length > 0
      ? farms.map((f) => f.name)
      : ['Main Farm (Rawalpindi)', 'North Field (Chakwal)', 'East Farm (Islamabad)', 'South Farm (Attock)'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-gray-900">Schedule Drone Flight Mission</h2>
        <p className="text-xs text-gray-500 mt-1 mb-5">
          Configure autonomous flight parameters and dispatch drone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mission Name</label>
            <input
              type="text"
              required
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Farm</label>
            <select
              value={farm}
              onChange={(e) => setFarm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {farmNames.map((name, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mission Type</label>
            <select
              value={missionType}
              onChange={(e) => setMissionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="Crop Monitoring">🌱 Crop Monitoring & NDVI</option>
              <option value="Disease Inspection">🔬 Disease Pathology Inspection</option>
              <option value="Farm Mapping">🗺️ Cadastral & Elevation Mapping</option>
              <option value="Field Survey">📡 Boundary & Livestock Survey</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Flight Altitude</label>
              <select
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value={30}>30 meters (Foliar Detail)</option>
                <option value={40}>40 meters (Recommended)</option>
                <option value={50}>50 meters (Fast Survey)</option>
                <option value={60}>60 meters (Broad Canopy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Flight Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-700/20 disabled:opacity-60 cursor-pointer mt-2"
          >
            {loading ? 'Dispatching...' : '🚁 Dispatch Mission & Save to Firebase'}
          </button>
        </form>
      </div>
    </div>
  );
}
