import { useState } from 'react';
import type { Farm, SprayingMission } from '../types';
import { useAuth } from '../context/AuthContext';
import { addSprayingMission } from '../services/firestoreService';
import { Droplets, CheckCircle, Sparkles, Shield, AlertCircle } from 'lucide-react';

interface PrecisionSprayingViewProps {
  farms: Farm[];
  sprayingMissions: SprayingMission[];
  initialTreatment?: string;
}

export function PrecisionSprayingView({ farms, sprayingMissions, initialTreatment }: PrecisionSprayingViewProps) {
  const { user } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState(
    farms.length > 0 ? farms[0].name : 'Main Farm (Rawalpindi)'
  );
  const [treatment, setTreatment] = useState(initialTreatment || 'Fungal Disease (Leaf Rust)');
  const [rate, setRate] = useState<number>(2.5);
  const [sprayDate, setSprayDate] = useState(new Date().toISOString().split('T')[0]);
  const [areaHa, setAreaHa] = useState<number>(12.5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedLiters = Math.round(areaHa * rate * 10) / 10;
  const estimatedMins = Math.round(areaHa * 2.7);

  const handleSchedule = async () => {
    setIsSubmitting(true);
    try {
      if (user) {
        await addSprayingMission({
          userId: user.uid,
          missionName: `Precision Spray: ${treatment.split(' ')[0]}`,
          farm: selectedFarm,
          crop: 'Wheat',
          sprayType: 'Foliar Micro-Dose',
          treatment,
          applicationRate: `${rate} L/ha`,
          area: areaHa,
          areaUnit: 'ha',
          estimatedChemical: `${estimatedLiters} L`,
          duration: `${estimatedMins} min`,
          status: 'Scheduled',
          date: sprayDate,
        });
      }
      alert(
        `Precision Spraying Mission Scheduled!\n\nFarm: ${selectedFarm}\nTreatment: ${treatment}\nApplication Rate: ${rate} L/ha\nTarget Area: ${areaHa} ha\nChemical Formulation: ${estimatedLiters} Liters\nScheduled Date: ${sprayDate}\n\n${
          user ? 'Saved to Firebase Firestore.' : 'Sign in to save this mission permanently.'
        }`
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error scheduling mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const farmList =
    farms.length > 0
      ? farms.map((f) => f.name)
      : ['Main Farm (Rawalpindi)', 'North Field (Chakwal)', 'East Farm (Islamabad)', 'South Farm (Attock)'];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 text-[10px] font-bold tracking-wider uppercase">
            🎯 Smart Micro-Dosing
          </div>
          <h1 className="text-2xl font-black tracking-tight">Precision Chemical & Bio Spraying</h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            Target only infected pathogen coordinates to reduce chemical runoff by up to 35% with autonomous nozzle modulation.
          </p>
        </div>

        <div className="text-5xl shrink-0 self-center">💦</div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">💦</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Spraying Flights</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">18</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Completed Missions</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">🌾</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Treated Surface</span>
          <div className="text-2xl font-black text-gray-900 mt-0.5">86 ha</div>
          <span className="text-[11px] text-gray-500 font-semibold">Current season</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">🧪</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Chemical Saved</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5">31%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Vs. Boom Sprayers</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="text-2xl mb-1.5">✓</div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Target Accuracy</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5">96%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Centimeter Swath</span>
        </div>
      </div>

      {/* Main Grid: Form & Interactive Map */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Spraying Form */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Configure Spraying Mission</h2>
              <p className="text-xs text-gray-500">Calculate exact chemical liters and flight duration</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Farm</label>
                <select
                  value={selectedFarm}
                  onChange={(e) => setSelectedFarm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {farmList.map((name, i) => (
                    <option key={i} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Treatment</label>
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Fungal Disease (Leaf Rust)">Fungal Disease (Leaf Rust)</option>
                  <option value="Insecticide (Fall Armyworm)">Insecticide (Armyworm)</option>
                  <option value="Weed Control (Broadleaf)">Weed Control (Herbicide)</option>
                  <option value="Micronutrient Foliar Spray">Micronutrient Fertilizer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Application Rate (L/ha)</label>
                <select
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value={2.0}>2.0 L / ha (Micro Ultra-Low)</option>
                  <option value={2.5}>2.5 L / ha (Standard Fungicide)</option>
                  <option value={3.5}>3.5 L / ha (Heavy Infestation)</option>
                  <option value={5.0}>5.0 L / ha (Foliar Nutrition)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mission Date</label>
                <input
                  type="date"
                  value={sprayDate}
                  onChange={(e) => setSprayDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Dynamic Calculated Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-gray-500 block font-semibold">Target Area</span>
                <strong className="text-sm font-black text-emerald-900">{areaHa} ha</strong>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-gray-500 block font-semibold">Est. Chemical</span>
                <strong className="text-sm font-black text-emerald-900">{estimatedLiters} L</strong>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-gray-500 block font-semibold">Est. Duration</span>
                <strong className="text-sm font-black text-emerald-900">{estimatedMins} min</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleSchedule}
            disabled={isSubmitting}
            className="w-full mt-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Droplets className="w-4 h-4" />
            {isSubmitting ? 'Scheduling...' : '💦 Schedule Spraying Mission'}
          </button>
        </div>

        {/* Visual Map of Spraying Zones */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Precision Treatment Grid</h2>
                <p className="text-xs text-gray-500">Autonomous spot-spray zones vs healthy canopy</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                3 Target Zones
              </span>
            </div>

            <div className="relative h-64 rounded-2xl border border-emerald-300 overflow-hidden shadow-inner group">
              <img
                src="/hero-drone.jpg"
                alt="AgriHawk Drone Spraying Mission"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px]"></div>

              {/* Treatment target zones */}
              <div className="absolute left-[10%] top-[20%] w-[130px] h-[75px] rounded-xl bg-rose-600/85 border-2 border-rose-400 text-white text-[11px] font-bold p-2 shadow-lg backdrop-blur-xs">
                Zone 1 (Rust)
                <span className="text-[9px] block opacity-90 mt-0.5 font-mono">4.2 ha • 2.5L/ha</span>
              </div>

              <div className="absolute left-[52%] top-[15%] w-[140px] h-[75px] rounded-xl bg-rose-600/85 border-2 border-rose-400 text-white text-[11px] font-bold p-2 shadow-lg backdrop-blur-xs">
                Zone 2 (Blight)
                <span className="text-[9px] block opacity-90 mt-0.5 font-mono">5.1 ha • 2.5L/ha</span>
              </div>

              <div className="absolute left-[32%] bottom-[12%] w-[125px] h-[75px] rounded-xl bg-amber-600/85 border-2 border-amber-400 text-white text-[11px] font-bold p-2 shadow-lg backdrop-blur-xs">
                Zone 3 (Nutrient)
                <span className="text-[9px] block opacity-90 mt-0.5 font-mono">3.2 ha • 2.5L/ha</span>
              </div>

              {/* Drone position */}
              <div className="absolute left-[68%] top-[55%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-3 py-1.5 rounded-full shadow-xl border border-emerald-400 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>🚁 Active UAV: AgriHawk-Alpha</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Targeted Treatment Area
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Healthy Untouched Canopy
            </span>
          </div>
        </div>
      </div>

      {/* Spraying Logs Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3">Recent Precision Spraying Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="py-2.5 px-3">Farm</th>
                <th className="py-2.5 px-3">Treatment</th>
                <th className="py-2.5 px-3">Treated Area</th>
                <th className="py-2.5 px-3">Flight Time</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(sprayingMissions.length > 0 ? sprayingMissions : [
                { id: '1', farm: 'Main Farm (Rawalpindi)', treatment: 'Fungal Disease (Leaf Rust)', area: 12.5, areaUnit: 'ha', duration: '34 min', date: 'Today', status: 'Completed', userId: '', missionName: '', crop: '', applicationRate: '', estimatedChemical: '' },
                { id: '2', farm: 'North Field (Chakwal)', treatment: 'Insect Control (Armyworm)', area: 8.2, areaUnit: 'ha', duration: '24 min', date: 'Yesterday', status: 'Completed', userId: '', missionName: '', crop: '', applicationRate: '', estimatedChemical: '' },
                { id: '3', farm: 'East Farm (Islamabad)', treatment: 'Weed Control (Broadleaf)', area: 15.6, areaUnit: 'ha', duration: '39 min', date: 'Sep 09', status: 'Scheduled', userId: '', missionName: '', crop: '', applicationRate: '', estimatedChemical: '' },
              ]).map((s, idx) => (
                <tr key={s.id || idx} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{s.farm}</td>
                  <td className="py-3 px-3 text-emerald-950 font-semibold">{s.treatment}</td>
                  <td className="py-3 px-3 text-gray-600">{s.area} {s.areaUnit || 'ha'}</td>
                  <td className="py-3 px-3 text-gray-600">{s.duration || '30 min'}</td>
                  <td className="py-3 px-3 text-gray-500">{s.date}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        s.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : s.status === 'Scheduled'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {s.status}
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
