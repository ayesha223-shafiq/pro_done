import { useState } from 'react';
import type { Farm, FarmMapping } from '../types';
import { useAuth } from '../context/AuthContext';
import { addFarmMapping } from '../services/firestoreService';
import { MapPin, CheckCircle, Navigation, Layers, Save, Compass } from 'lucide-react';

interface FarmMappingViewProps {
  farms: Farm[];
  savedMappings: FarmMapping[];
  initialSelectedFarm?: string;
}

export function FarmMappingView({ farms, savedMappings, initialSelectedFarm }: FarmMappingViewProps) {
  const { user } = useAuth();
  const [selectedFarmName, setSelectedFarmName] = useState(
    initialSelectedFarm || (farms.length > 0 ? farms[0].name : 'Main Farm (Rawalpindi)')
  );
  const [mappingStatus, setMappingStatus] = useState<'Not Mapped' | 'Mapping in Progress' | 'Mapped'>('Mapped');
  const [activeLayer, setActiveLayer] = useState<'boundary' | 'ndvi' | 'elevation'>('boundary');
  const [isSaving, setIsSaving] = useState(false);

  const selectedFarm = farms.find((f) => f.name === selectedFarmName);
  const farmArea = selectedFarm ? selectedFarm.size : 250;
  const fieldsCount = selectedFarm ? selectedFarm.fields : 4;

  const handleStartMapping = () => {
    setMappingStatus('Mapping in Progress');
    alert(`Autonomous mapping mission started for ${selectedFarmName}. Drone telemetry is now capturing boundary polygons.`);
  };

  const handleSaveMapping = async () => {
    if (!user) {
      alert('Please sign in to save digital map boundaries to Firebase.');
      return;
    }
    setIsSaving(true);
    try {
      await addFarmMapping({
        userId: user.uid,
        farmId: selectedFarm?.id || 'demo-id',
        farmName: selectedFarmName,
        area: farmArea,
        areaUnit: 'Acres',
        fields: fieldsCount,
        status: 'Mapped',
      });
      setMappingStatus('Mapped');
      alert(`Digital spatial map for "${selectedFarmName}" saved successfully to Firebase Firestore!`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save mapping');
    } finally {
      setIsSaving(false);
    }
  };

  const farmOptions =
    farms.length > 0
      ? farms.map((f) => f.name)
      : ['Main Farm (Rawalpindi)', 'North Field (Chakwal)', 'East Farm (Islamabad)', 'South Farm (Attock)'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Farm Spatial Mapping</h1>
          <p className="text-xs text-gray-500 mt-1">
            Centimeter-accurate GPS boundaries, multi-zone polygons, and drone flight corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFarmName}
            onChange={(e) => setSelectedFarmName(e.target.value)}
            className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          >
            {farmOptions.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map Canvas */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <h2 className="text-base font-bold text-gray-900">{selectedFarmName} Boundary Visualizer</h2>
            </div>
            {/* Layer switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setActiveLayer('boundary')}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeLayer === 'boundary' ? 'bg-white shadow-xs text-emerald-800' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cadastral
              </button>
              <button
                onClick={() => setActiveLayer('ndvi')}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeLayer === 'ndvi' ? 'bg-white shadow-xs text-emerald-800' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                NDVI Zones
              </button>
              <button
                onClick={() => setActiveLayer('elevation')}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeLayer === 'elevation' ? 'bg-white shadow-xs text-emerald-800' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contours
              </button>
            </div>
          </div>

          {/* Interactive Visual Map Area */}
          <div className="relative h-80 rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-green-100 border border-emerald-200 overflow-hidden shadow-inner">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Field Zones */}
            <div className="absolute left-[8%] top-[12%] w-[38%] h-[35%] rounded-xl border-3 border-emerald-700 bg-emerald-600/35 flex flex-col items-center justify-center text-xs font-bold text-emerald-950 shadow-xs">
              <span>Sector Alpha</span>
              <span className="text-[10px] text-emerald-800 font-semibold font-mono">33.5651° N, 73.0169° E</span>
            </div>

            <div className="absolute right-[10%] top-[10%] w-[34%] h-[32%] rounded-xl border-3 border-emerald-700 bg-emerald-600/35 flex flex-col items-center justify-center text-xs font-bold text-emerald-950 shadow-xs">
              <span>Sector Beta</span>
              <span className="text-[10px] text-emerald-800 font-semibold font-mono">33.5688° N, 73.0210° E</span>
            </div>

            <div className="absolute left-[12%] bottom-[10%] w-[42%] h-[32%] rounded-xl border-3 border-amber-600 bg-amber-500/30 flex flex-col items-center justify-center text-xs font-bold text-amber-950 shadow-xs">
              <span>Sector Gamma</span>
              <span className="text-[10px] text-amber-800 font-semibold font-mono">33.5612° N, 73.0142° E</span>
            </div>

            <div className="absolute right-[12%] bottom-[12%] w-[28%] h-[30%] rounded-xl border-3 border-emerald-700 bg-emerald-600/35 flex flex-col items-center justify-center text-xs font-bold text-emerald-950 shadow-xs">
              <span>Sector Delta</span>
              <span className="text-[10px] text-emerald-800 font-semibold font-mono">33.5599° N, 73.0195° E</span>
            </div>

            {/* Simulated drone position marker */}
            <div className="absolute left-[48%] top-[45%] -translate-x-1/2 -translate-y-1/2 bg-white px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-400 flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 animate-pulse">
              <span>📍</span> 33.5645° N, 73.0185° E
            </div>

            {/* Flight corridor path dashed line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="27%" y1="28%" x2="48%" y2="45%" stroke="#15803d" strokeWidth="2" strokeDasharray="4" />
              <line x1="48%" y1="45%" x2="80%" y2="26%" stroke="#15803d" strokeWidth="2" strokeDasharray="4" />
              <line x1="80%" y1="26%" x2="76%" y2="72%" stroke="#15803d" strokeWidth="2" strokeDasharray="4" />
              <line x1="76%" y1="72%" x2="33%" y2="74%" stroke="#15803d" strokeWidth="2" strokeDasharray="4" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={handleStartMapping}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" /> Start New Mapping
            </button>

            <button
              onClick={handleSaveMapping}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-100/70 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Map to Firebase'}
            </button>
          </div>
        </div>

        {/* Mapping Information Sidebar Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Mapping Specifications</h2>
            <p className="text-xs text-gray-500 mb-4">Spatial properties & RTK telemetry stats</p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Selected Farm</span>
                <strong className="text-gray-900 font-bold">{selectedFarmName}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Total Surface Area</span>
                <strong className="text-gray-900 font-bold">{farmArea} Acres</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Zoned Field Plots</span>
                <strong className="text-gray-900 font-bold">{fieldsCount} Sectors</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Current Status</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    mappingStatus === 'Mapped'
                      ? 'bg-emerald-50 text-emerald-700'
                      : mappingStatus === 'Mapping in Progress'
                      ? 'bg-blue-50 text-blue-700 animate-pulse'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {mappingStatus}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">RTK GPS Fix</span>
                <strong className="text-emerald-700 font-bold">Centimeter (±2.5cm)</strong>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 mt-4 text-xs text-emerald-950 leading-relaxed">
            💡 <strong>Smart Waypoints:</strong> Digital map boundaries automatically define restricted keep-out zones and optimal return-to-home battery thresholds for your agricultural drones.
          </div>
        </div>
      </div>

      {/* Recent Farm Maps History Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3">Recent Farm Mappings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="py-2.5 px-3">Farm Name</th>
                <th className="py-2.5 px-3">Mapped Area</th>
                <th className="py-2.5 px-3">Sub-Sectors</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(savedMappings.length > 0 ? savedMappings : [
                { id: '1', farmName: 'Main Farm (Rawalpindi)', area: 250, areaUnit: 'Acres', fields: 4, status: 'Mapped', userId: '' },
                { id: '2', farmName: 'North Field (Chakwal)', area: 180, areaUnit: 'Acres', fields: 3, status: 'Mapped', userId: '' },
                { id: '3', farmName: 'East Farm (Islamabad)', area: 120, areaUnit: 'Acres', fields: 2, status: 'Mapped', userId: '' },
              ]).map((m, i) => (
                <tr key={m.id || i} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{m.farmName}</td>
                  <td className="py-3 px-3 text-gray-600">{m.area} {m.areaUnit || 'Acres'}</td>
                  <td className="py-3 px-3 text-gray-600">{m.fields} Zones</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
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
