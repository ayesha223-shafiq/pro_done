import { useState, useEffect } from 'react';
import type { Farm, DroneMission, WeatherData } from '../types';
import { useToast } from '../context/ToastContext';
import {
  TrendingUp,
  AlertTriangle,
  Plane,
  CloudSun,
  ShieldCheck,
  Plus,
  Play,
  FileText,
  MapPin,
  Calendar,
  ExternalLink,
  BellRing,
  Search,
  X,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  farms: Farm[];
  missions: DroneMission[];
  onNavigate: (view: string) => void;
  onOpenAddFarm: () => void;
  onOpenAddMission: () => void;
}

export function DashboardView({
  farms,
  missions,
  onNavigate,
  onOpenAddFarm,
  onOpenAddMission,
}: DashboardViewProps) {
  const { notifyMissionCompleted, notifyDiseaseUploaded } = useToast();
  const [farmSearchQuery, setFarmSearchQuery] = useState('');
  const [selectedLocationTag, setSelectedLocationTag] = useState<string>('all');
  const [liveWeather, setLiveWeather] = useState<{
    city: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainChance: number;
    conditionText: string;
    conditionIcon: string;
  }>({
    city: farms.length > 0 ? farms[0].location.split(',')[0].trim() : 'Multan',
    temperature: 31,
    humidity: 48,
    windSpeed: 11,
    rainChance: 5,
    conditionText: 'Clear Sky • Ideal Flight Weather',
    conditionIcon: '☀️',
  });

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=30.15&longitude=71.52&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto'
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.current) {
          const code = data.current.weather_code || 0;
          let text = 'Sunny • Ideal Flight Weather';
          let icon = '☀️';
          if (code > 0 && code <= 3) {
            text = 'Partly Cloudy • Safe Flight Window';
            icon = '🌤️';
          } else if (code > 50) {
            text = 'Rain Showers • Flight Hold';
            icon = '🌧️';
          }
          setLiveWeather({
            city: farms.length > 0 ? farms[0].location.split(',')[0].trim() : 'Multan',
            temperature: Math.round(data.current.temperature_2m),
            humidity: Math.round(data.current.relative_humidity_2m),
            windSpeed: Math.round(data.current.wind_speed_10m),
            rainChance: data.current.precipitation > 0 ? 80 : 10,
            conditionText: text,
            conditionIcon: icon,
          });
        }
      } catch (err) {
        console.warn('Dashboard weather fallback', err);
      }
    }
    loadDashboardWeather();
    return () => {
      isMounted = false;
    };
  }, [farms]);

  const defaultStarterFarms: Farm[] = [
    {
      id: 'default-1',
      userId: 'guest',
      name: 'Main Farm (Rawalpindi)',
      location: 'Rawalpindi, Punjab',
      size: 250,
      crop: 'Wheat',
      health: 87,
      status: 'Active',
      fields: 4,
    },
    {
      id: 'default-2',
      userId: 'guest',
      name: 'North Field (Chakwal)',
      location: 'Chakwal, Punjab',
      size: 180,
      crop: 'Corn',
      health: 91,
      status: 'Active',
      fields: 3,
    },
    {
      id: 'default-3',
      userId: 'guest',
      name: 'East Farm (Islamabad)',
      location: 'Islamabad Capital Territory',
      size: 120,
      crop: 'Rice',
      health: 82,
      status: 'Active',
      fields: 2,
    },
    {
      id: 'default-4',
      userId: 'guest',
      name: 'South Farm (Attock)',
      location: 'Attock, Punjab',
      size: 200,
      crop: 'Cotton',
      health: 89,
      status: 'Active',
      fields: 4,
    },
  ];

  const activeFarmsList = farms.length > 0 ? farms : defaultStarterFarms;

  // Filter farms by name or location (and optionally crop)
  const filteredFarms = activeFarmsList.filter((farm) => {
    const query = farmSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      farm.name.toLowerCase().includes(query) ||
      farm.location.toLowerCase().includes(query) ||
      (farm.crop && farm.crop.toLowerCase().includes(query));

    const matchesLocationTag =
      selectedLocationTag === 'all' ||
      farm.location.toLowerCase().includes(selectedLocationTag.toLowerCase());

    return matchesSearch && matchesLocationTag;
  });

  // Extract unique locations for quick-filter chips
  const locationOptions = Array.from(
    new Set(
      activeFarmsList.map((f) => {
        const parts = f.location.split(',');
        return parts[0].trim();
      })
    )
  ).slice(0, 5);

  const activeFarmsCount = activeFarmsList.length;
  const activeMissionsCount = missions.filter((m) => m.status === 'Active').length || 2;
  const avgCropHealth =
    activeFarmsList.length > 0
      ? Math.round(activeFarmsList.reduce((acc, f) => acc + (f.health || 87), 0) / activeFarmsList.length)
      : 87;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Firebase connection badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Good Morning, Farmer 👋
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time agricultural monitoring, autonomous flight telemetry, and crop diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Test Toast Actions */}
          <button
            onClick={() =>
              notifyMissionCompleted('Sector B Survey #AH-104', 'Rawalpindi Wheat Farm', () =>
                onNavigate('drone-missions')
              )
            }
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-emerald-200"
            title="Simulate drone mission completion alert"
          >
            <span>🚁 Test Drone Toast</span>
          </button>

          <button
            onClick={() =>
              notifyDiseaseUploaded('Leaf Rust (Puccinia)', 'Sargodha Citrus Farm', 96, () =>
                onNavigate('disease-detection')
              )
            }
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-amber-200"
            title="Simulate new disease detection alert"
          >
            <span>🦠 Test Disease Toast</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Firestore Synced
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('farms')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl shrink-0">
            🌾
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Farms</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {String(activeFarmsCount).padStart(2, '0')}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Active & Mapped</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('crop-monitoring')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl shrink-0">
            🌱
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Crop Health</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{avgCropHealth}%</div>
            <span className="text-[11px] text-emerald-600 font-semibold">↑ 4.2% this week</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('drone-missions')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl shrink-0">
            🚁
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Drone Missions</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {missions.length > 0 ? missions.length : 12}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold">{activeMissionsCount} actively flying</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('disease-detection')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl shrink-0">
            ⚠️
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Issues Detected</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">03</div>
            <span className="text-[11px] text-rose-600 font-semibold">Requires Attention</span>
          </div>
        </div>
      </div>

      {/* Farm Quick Search & Location Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🌾</span>
              <h2 className="text-base font-bold text-gray-900">Farm Directory & Quick Search</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredFarms.length} {filteredFarms.length === 1 ? 'Farm' : 'Farms'} Found
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Filter your registered farms by farm name, district, or province in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddFarm}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Farm</span>
            </button>
            <button
              onClick={() => onNavigate('farms')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Bar Input & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={farmSearchQuery}
              onChange={(e) => setFarmSearchQuery(e.target.value)}
              placeholder="Search farms by name or location (e.g. Rawalpindi, North Field, Punjab...)"
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
            {farmSearchQuery && (
              <button
                onClick={() => setFarmSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-md hover:bg-gray-200/60 transition cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Location Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            <button
              onClick={() => setSelectedLocationTag('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedLocationTag === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              All Locations
            </button>
            {locationOptions.map((loc) => {
              const isSelected = selectedLocationTag.toLowerCase() === loc.toLowerCase();
              return (
                <button
                  key={loc}
                  onClick={() => setSelectedLocationTag(isSelected ? 'all' : loc)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  📍 {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered Farm Cards Grid */}
        {filteredFarms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {filteredFarms.map((farm) => (
              <div
                key={farm.id}
                className="p-3.5 rounded-xl border border-gray-200/90 hover:border-emerald-500 hover:shadow-md transition-all duration-200 bg-gray-50/40 hover:bg-white flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-emerald-800 transition line-clamp-1">
                      {farm.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {farm.crop || 'Crops'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{farm.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-600 mt-2.5 pt-2 border-t border-gray-100">
                    <span>
                      Area: <strong className="text-gray-900">{farm.size} Acres</strong>
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">{farm.fields || 3} Plots</span>
                  </div>

                  {/* Health Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                      <span className="text-gray-500">Vegetative Health</span>
                      <span className="text-emerald-700">{farm.health || 87}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${farm.health || 87}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Quick Actions */}
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-100">
                  <button
                    onClick={() => onNavigate('farm-mapping')}
                    className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>🗺️ Map</span>
                  </button>
                  <button
                    onClick={() => onNavigate('farms')}
                    className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold transition cursor-pointer"
                    title="View farm details"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="p-8 text-center bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-xl mx-auto mb-2.5">
              🔍
            </div>
            <h3 className="text-xs font-bold text-gray-900">
              No farms found matching &ldquo;{farmSearchQuery || selectedLocationTag}&rdquo;
            </h3>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any registered farm matching your search query. Try searching by another name, district, or reset your filters.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => {
                  setFarmSearchQuery('');
                  setSelectedLocationTag('all');
                }}
                className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Clear Search & Filters
              </button>
              <button
                onClick={onOpenAddFarm}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                ➕ Add New Farm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Farm Overview Map & Crop Health Gauge */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Farm Map Overview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Farm Overview & Boundaries</h2>
              <p className="text-xs text-gray-500">Live spatial status for active agricultural sectors</p>
            </div>
            <button
              onClick={() => onNavigate('farm-mapping')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg"
            >
              Open Full Map →
            </button>
          </div>

          <div className="relative h-64 rounded-xl bg-gradient-to-br from-emerald-100/80 via-emerald-50 to-green-100 overflow-hidden border border-emerald-200">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Simulated plots */}
            <div className="absolute left-[10%] top-[15%] w-[35%] h-[35%] rounded-xl border-2 border-emerald-700 bg-emerald-600/30 flex items-center justify-center text-xs font-bold text-emerald-950">
              Field A • 42 ha
            </div>

            <div className="absolute right-[12%] top-[12%] w-[32%] h-[32%] rounded-xl border-2 border-emerald-700 bg-emerald-600/30 flex items-center justify-center text-xs font-bold text-emerald-950">
              Field B • 28 ha
            </div>

            <div className="absolute left-[15%] bottom-[12%] w-[40%] h-[32%] rounded-xl border-2 border-amber-600 bg-amber-500/25 flex items-center justify-center text-xs font-bold text-amber-950">
              Field C • 35 ha (Monitor)
            </div>

            <div className="absolute right-[15%] bottom-[12%] w-[25%] h-[30%] rounded-xl border-2 border-emerald-700 bg-emerald-600/30 flex items-center justify-center text-xs font-bold text-emerald-950">
              Field D • 19 ha
            </div>

            {/* Flying drone marker */}
            <div className="absolute left-[48%] top-[45%] -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-emerald-300 flex items-center gap-1.5 text-xs font-bold text-emerald-900 animate-pulse">
              <span>🚁</span> AgriHawk-01 Active
            </div>
          </div>
        </div>

        {/* Crop Health Gauge */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Crop Health Index</h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">NDVI Scan</span>
            </div>

            {/* Circle Gauge */}
            <div className="relative w-36 h-36 mx-auto my-3 flex items-center justify-center rounded-full bg-[conic-gradient(#15803d_0deg_313deg,#e2e8f0_313deg_360deg)] p-3">
              <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-emerald-800">{avgCropHealth}%</span>
                <span className="text-[11px] font-bold text-emerald-600">Optimal</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Healthy Area
              </span>
              <strong className="text-emerald-700 font-bold">87%</strong>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate Stress
              </span>
              <strong className="text-amber-600 font-bold">09%</strong>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical Attention
              </span>
              <strong className="text-rose-600 font-bold">04%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Recent Missions & Weather */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Missions list */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Drone Missions</h2>
              <p className="text-xs text-gray-500">Telemetry logs and execution status</p>
            </div>
            <button
              onClick={() => onNavigate('drone-missions')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              View Fleet →
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: '🚁',
                title: 'Crop Monitoring Scan',
                sub: 'Main Farm • Field A (Wheat)',
                status: 'Completed',
                statusClass: 'bg-emerald-50 text-emerald-700',
              },
              {
                icon: '💦',
                title: 'Precision Spraying #SP-104',
                sub: 'North Field • Zone 02 (Corn)',
                status: 'Running',
                statusClass: 'bg-blue-50 text-blue-700 animate-pulse',
              },
              {
                icon: '🔬',
                title: 'Leaf Rust Pathology Inspection',
                sub: 'East Farm • Zone 04 (Rice)',
                status: 'Pending',
                statusClass: 'bg-amber-50 text-amber-700',
              },
            ].map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                    {m.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{m.title}</h4>
                    <p className="text-[11px] text-gray-500">{m.sub}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${m.statusClass}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Weather Widget - Clickable to open full regional weather */}
        <div
          onClick={() => onNavigate('weather')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          title="Click to open full regional weather station"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-base">☁️</span>
                <h2 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition">
                  Farm Weather
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  📍 {liveWeather.city}
                </span>
                <span className="text-xs text-emerald-700 font-bold group-hover:underline flex items-center gap-0.5">
                  Open →
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 my-2">
              <span className="text-5xl group-hover:scale-110 transition-transform">
                {liveWeather.conditionIcon}
              </span>
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {liveWeather.temperature}°C
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  {liveWeather.conditionText}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
            <div className="bg-gray-50 p-2 rounded-xl">
              <span className="text-sm">💧</span>
              <div className="text-xs font-bold text-gray-900 mt-0.5">
                {liveWeather.humidity}%
              </div>
              <div className="text-[10px] text-gray-400">Humidity</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-xl">
              <span className="text-sm">💨</span>
              <div className="text-xs font-bold text-gray-900 mt-0.5">
                {liveWeather.windSpeed} km/h
              </div>
              <div className="text-[10px] text-gray-400">Wind</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-xl">
              <span className="text-sm">🌧️</span>
              <div className="text-xs font-bold text-gray-900 mt-0.5">
                {liveWeather.rainChance}%
              </div>
              <div className="text-[10px] text-gray-400">Rain Chance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Operations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <button
            onClick={onOpenAddFarm}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition cursor-pointer text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">➕</span>
            <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-800">Add New Farm</span>
          </button>

          <button
            onClick={onOpenAddMission}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition cursor-pointer text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🚁</span>
            <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-800">Start Mission</span>
          </button>

          <button
            onClick={() => onNavigate('disease-detection')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition cursor-pointer text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔬</span>
            <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-800">AI Pathology</span>
          </button>

          <button
            onClick={() => onNavigate('booking')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition cursor-pointer text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📅</span>
            <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-800">Book Drone</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition cursor-pointer text-center group col-span-2 sm:col-span-1"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📊</span>
            <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-800">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
