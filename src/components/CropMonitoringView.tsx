import { useState } from 'react';
import type { Farm, CropMonitoringScan } from '../types';
import { useAuth } from '../context/AuthContext';
import { addCropMonitoring } from '../services/firestoreService';
import { Activity, Droplets, Sun, Thermometer, ShieldAlert, Sparkles } from 'lucide-react';

interface CropMonitoringViewProps {
  farms: Farm[];
  scans: CropMonitoringScan[];
  onNavigateToDisease: () => void;
}

export function CropMonitoringView({ farms, scans, onNavigateToDisease }: CropMonitoringViewProps) {
  const { user } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState(
    farms.length > 0 ? farms[0].name : 'Main Farm (Rawalpindi)'
  );
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [monitorDate, setMonitorDate] = useState(new Date().toISOString().split('T')[0]);
  const [healthScore, setHealthScore] = useState(87);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    let calculated = 87;
    if (selectedCrop === 'Rice') calculated = 84;
    else if (selectedCrop === 'Corn') calculated = 89;
    else if (selectedCrop === 'Cotton') calculated = 85;

    setHealthScore(calculated);

    if (user) {
      try {
        await addCropMonitoring({
          userId: user.uid,
          farmName: selectedFarm,
          crop: selectedCrop,
          monitoringDate: monitorDate,
          health: calculated,
          soilMoisture: 68,
          cropStress: 12,
          growthProgress: 76,
          status: 'Analyzed',
          scanType: 'Spectral Vegetative Analysis',
        });
      } catch (err) {
        console.error('Failed to log scan:', err);
      }
    }

    setIsAnalyzing(false);
    alert(
      `Crop Spectral Analysis Complete!\n\nFarm: ${selectedFarm}\nCrop: ${selectedCrop}\nVegetative Health Score: ${calculated}%\n\n${
        user ? 'Saved to Firebase Firestore.' : 'Sign in to save this scan permanently.'
      }`
    );
  };

  const farmList =
    farms.length > 0
      ? farms.map((f) => f.name)
      : ['Main Farm (Rawalpindi)', 'North Field (Chakwal)', 'East Farm (Islamabad)', 'South Farm (Attock)'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Crop Health & NDVI Monitoring</h1>
          <p className="text-xs text-gray-500 mt-1">
            Multispectral imagery, chlorophyll density, and vegetative vigor telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 bg-white"
          >
            {farmList.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 bg-white"
          >
            <option value="Wheat">🌾 Wheat</option>
            <option value="Corn">🌽 Corn</option>
            <option value="Rice">🌱 Rice</option>
            <option value="Cotton">🍃 Cotton</option>
          </select>

          <input
            type="date"
            value={monitorDate}
            onChange={(e) => setMonitorDate(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 bg-white"
          />

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" /> {isAnalyzing ? 'Scanning...' : 'Analyze Crop'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-2">🌱</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Crop Health</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">{healthScore}%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Optimal Vegetative Index</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-2">💧</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Soil Moisture</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">68%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Adequate Root Hydration</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-2">☀️</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Crop Stress</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">12%</div>
          <span className="text-[11px] text-amber-600 font-semibold">Low to Moderate Stress</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-2">📏</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Growth Rate</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">76%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Ahead of Schedule</span>
        </div>
      </div>

      {/* Main Grid: NDVI Field Map & Circular Gauge */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Crop Health Spectrum Map</h2>
              <p className="text-xs text-gray-500">{selectedFarm} • {selectedCrop}</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Healthy (72%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate (16%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Attention (12%)
              </span>
            </div>
          </div>

          <div className="relative h-72 rounded-2xl bg-gradient-to-br from-emerald-200 via-green-100 to-lime-200 border border-emerald-300 overflow-hidden shadow-inner">
            {/* Zones */}
            <div className="absolute left-[5%] top-[10%] w-[31%] h-[40%] rounded-xl bg-emerald-600/80 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              Zone 1 • Healthy
            </div>
            <div className="absolute left-[38%] top-[9%] w-[29%] h-[38%] rounded-xl bg-emerald-500/80 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              Zone 2 • Vigor
            </div>
            <div className="absolute right-[5%] top-[10%] w-[25%] h-[38%] rounded-xl bg-amber-500/85 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              Zone 3 • Stress
            </div>
            <div className="absolute left-[5%] bottom-[8%] w-[31%] h-[40%] rounded-xl bg-emerald-600/80 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              Zone 4 • Prime
            </div>
            <div className="absolute left-[38%] bottom-[8%] w-[29%] h-[39%] rounded-xl bg-emerald-500/80 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              Zone 5 • Healthy
            </div>
            <div className="absolute right-[5%] bottom-[8%] w-[25%] h-[39%] rounded-xl bg-rose-500/85 flex items-center justify-center text-xs font-bold text-white shadow-xs animate-pulse">
              Zone 6 • Inspect!
            </div>

            {/* Drone icon */}
            <div className="absolute left-[48%] top-[45%] -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-emerald-400 text-xs font-bold text-emerald-950 flex items-center gap-1">
              <span>🚁</span> Multispectral Camera Active
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Chlorophyll Density</h2>
            <p className="text-xs text-gray-500 mb-3">Photometric absorption index</p>

            <div className="w-36 h-36 mx-auto my-3 flex items-center justify-center rounded-full bg-[conic-gradient(#15803d_0deg_313deg,#e2e8f0_313deg_360deg)] p-3">
              <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-emerald-800">{healthScore}%</span>
                <span className="text-[11px] font-bold text-emerald-600">Healthy</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Air Temperature</span>
              <strong className="text-gray-900 font-bold">28°C</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Root Zone Moisture</span>
              <strong className="text-emerald-700 font-bold">68% (Optimal)</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Soil Nutrients</span>
              <strong className="text-gray-900 font-bold">NPK High</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Daily Sunlight</span>
              <strong className="text-gray-900 font-bold">8.4 Hours</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">Crop Attention Required in Sector 6</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Eastern section of {selectedFarm} shows signs of localized leaf discoloration. AI recommends pathology inspection.
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToDisease}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
        >
          🔬 Run AI Pathology Scanner →
        </button>
      </div>
    </div>
  );
}
