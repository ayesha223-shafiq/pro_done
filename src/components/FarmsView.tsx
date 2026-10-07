import { useState } from 'react';
import type { Farm } from '../types';
import { addFarm, deleteFarm } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FarmsViewProps {
  farms: Farm[];
  onOpenAddModal: () => void;
  onNavigateToMapping: (farmName: string) => void;
}

export function FarmsView({ farms, onOpenAddModal, onNavigateToMapping }: FarmsViewProps) {
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleSeedStarterFarm = async () => {
    if (!user) {
      alert('Please sign in to save farms to your database.');
      return;
    }
    setSeeding(true);
    try {
      await addFarm({
        userId: user.uid,
        name: 'Al-Rehman Agri Estate (Multan)',
        location: 'Multan, Punjab',
        size: 150,
        crop: 'Cotton & Wheat',
        health: 92,
        status: 'Active',
        fields: 4,
        mapStatus: 'Mapped',
      });
    } catch (e: any) {
      alert(e.message || 'Failed to seed farm');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (farm: Farm) => {
    if (confirm(`Are you sure you want to remove ${farm.name}?`)) {
      setDeletingId(farm.id);
      try {
        await deleteFarm(farm.id);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Failed to delete farm');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Agricultural Farms</h1>
          <p className="text-xs text-gray-500 mt-1">
            Registered land holdings, acreage, active crop types, and NDVI health indices.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Farm
        </button>
      </div>

      {farms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <div className="text-4xl">🌾</div>
          <h3 className="text-base font-bold text-gray-900">No Farms Registered in Database Yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Add your acreage, crop varieties, and regional plots to enable autonomous aerial mapping and precision spray planning.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              ➕ Register Your Farm
            </button>
            <button
              onClick={handleSeedStarterFarm}
              disabled={seeding}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer disabled:opacity-50"
            >
              {seeding ? 'Saving to Database...' : '⚡ Add Starter Farm to Firestore'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {farms.map((farm, idx) => (
            <div
              key={farm.id || idx}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Visual Banner */}
                <div className="h-32 bg-gradient-to-r from-emerald-100 via-green-100 to-emerald-200 relative flex items-center justify-center text-5xl">
                  {farm.crop.toLowerCase().includes('wheat')
                    ? '🌾'
                    : farm.crop.toLowerCase().includes('corn')
                    ? '🌽'
                    : farm.crop.toLowerCase().includes('rice')
                    ? '🌱'
                    : '🍃'}
                  <span className="absolute top-3 right-3 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {farm.status || 'Active'}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-xs text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {farm.fields || 4} Plots
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-950">{farm.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        {farm.location}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(farm)}
                      disabled={deletingId === farm.id}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Delete farm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-gray-100 text-center">
                    <div>
                      <strong className="block text-base font-black text-gray-900">{farm.size}</strong>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Acres</span>
                    </div>
                    <div className="border-x border-gray-100">
                      <strong className="block text-base font-black text-emerald-700">{farm.crop}</strong>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Cultivated</span>
                    </div>
                    <div>
                      <strong className="block text-base font-black text-gray-900">{farm.health || 87}%</strong>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Health</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onNavigateToMapping(farm.name)}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  🗺️ Open Spatial Mapping →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
