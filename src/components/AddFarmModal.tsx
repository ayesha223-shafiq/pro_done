import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addFarm } from '../services/firestoreService';
import { X, Check } from 'lucide-react';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddFarmModal({ isOpen, onClose, onSuccess }: AddFarmModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState<number>(200);
  const [crop, setCrop] = useState('Wheat');
  const [fields, setFields] = useState<number>(4);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in first to save your farm into Firebase Cloud Firestore.');
      return;
    }

    setLoading(true);
    try {
      await addFarm({
        userId: user.uid,
        name: name.trim(),
        location: location.trim(),
        size: Number(size),
        crop,
        health: 88,
        status: 'Active',
        fields: Number(fields),
        mapStatus: 'Pending',
      });
      alert(`Farm "${name}" successfully saved to Firebase Firestore!`);
      setName('');
      setLocation('');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save farm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-gray-900">Add New Agricultural Farm</h2>
        <p className="text-xs text-gray-500 mt-1 mb-5">
          Enter farm acreage and crop information to sync with Firestore.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Name</label>
            <input
              type="text"
              required
              placeholder="e.g. South Valley Farm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Rawalpindi, Punjab"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Area (Acres)</label>
              <input
                type="number"
                required
                min={1}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Plot Zones</label>
              <input
                type="number"
                required
                min={1}
                max={20}
                value={fields}
                onChange={(e) => setFields(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="Wheat">🌾 Wheat</option>
              <option value="Corn">🌽 Corn</option>
              <option value="Rice">🌱 Rice</option>
              <option value="Cotton">🍃 Cotton</option>
              <option value="Sugarcane">🌿 Sugarcane</option>
              <option value="Vegetables">🥬 Vegetables</option>
              <option value="Orchard">🍎 Orchard / Fruit</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-700/20 disabled:opacity-60 cursor-pointer mt-2"
          >
            {loading ? 'Saving to Firebase...' : '💾 Save Farm to Firebase'}
          </button>
        </form>
      </div>
    </div>
  );
}
