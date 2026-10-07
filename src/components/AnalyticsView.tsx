import { useState } from 'react';
import type { Farm } from '../types';
import { useAuth } from '../context/AuthContext';
import { addAnalyticsReport } from '../services/firestoreService';
import { BarChart3, TrendingUp, Download, CheckCircle2 } from 'lucide-react';

interface AnalyticsViewProps {
  farms: Farm[];
}

export function AnalyticsView({ farms }: AnalyticsViewProps) {
  const { user } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState('All Farms');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [isExporting, setIsExporting] = useState(false);

  const farmHealthValues: Record<string, string> = {
    'All Farms': '91%',
    'Main Farm (Rawalpindi)': '94%',
    'North Field (Chakwal)': '89%',
    'East Farm (Islamabad)': '92%',
    'South Farm (Attock)': '81%',
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (user) {
        await addAnalyticsReport({
          userId: user.uid,
          reportName: `Farm Analytics Report (${selectedPeriod})`,
          period: selectedPeriod,
          farmsMonitored: farms.length || 4,
          totalArea: 750,
          averageCropHealth: 91,
          farmProductivity: 87,
          diseaseDetections: 3,
          droneMissions: 24,
          sprayingMissions: 18,
          status: 'Generated',
        });
      }
      alert(
        `Analytics Report Export Prepared!\n\nPeriod: ${selectedPeriod}\nFarms Monitored: ${
          farms.length || 4
        }\nAverage Crop Health: 91%\nFarm Productivity: 87%\n\n${
          user ? 'Saved to Firebase Firestore.' : 'Sign in to save this export permanently.'
        }`
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error exporting report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Agricultural Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">
            Historical crop vegetative curves, flight yield correlation, and sector productivity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 bg-white"
          >
            <option value="All Farms">All Farms</option>
            <option value="Main Farm (Rawalpindi)">Main Farm</option>
            <option value="North Field (Chakwal)">North Field</option>
            <option value="East Farm (Islamabad)">East Farm</option>
            <option value="South Farm (Attock)">South Farm</option>
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 bg-white"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Season">This Season</option>
          </select>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Export Analytics'}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Average Crop Health</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {farmHealthValues[selectedFarm] || '91%'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">▲ 4.2% this month</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Farm Productivity</span>
          <div className="text-2xl font-black text-gray-900 mt-1">87%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">▲ 6.8% this month</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Drone Missions</span>
          <div className="text-2xl font-black text-gray-900 mt-1">24</div>
          <span className="text-[11px] text-gray-500 font-medium">18 flights completed</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Issues Detected</span>
          <div className="text-2xl font-black text-gray-900 mt-1">12</div>
          <span className="text-[11px] text-amber-600 font-semibold">3 require action</span>
        </div>
      </div>

      {/* Charts & Summary Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Crop Health Weekly Trend</h2>
            <p className="text-xs text-gray-500 mb-4">Chlorophyll & canopy index evolution over recent 6 weeks</p>

            {/* Custom Bar Visualizer */}
            <div className="h-56 flex items-end justify-between gap-4 pt-6 px-4 border-b border-gray-100">
              {[
                { label: 'Week 1', height: '62%', val: '62%' },
                { label: 'Week 2', height: '70%', val: '70%' },
                { label: 'Week 3', height: '67%', val: '67%' },
                { label: 'Week 4', height: '79%', val: '79%' },
                { label: 'Week 5', height: '86%', val: '86%' },
                { label: 'Week 6', height: '91%', val: '91%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.val}
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-emerald-600 group-hover:bg-emerald-700 rounded-t-xl transition-all duration-500 shadow-sm"
                    style={{ height: bar.height }}
                  ></div>
                  <span className="text-[10px] text-gray-400 font-semibold">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3">
            <span>Historical Baseline: 60%</span>
            <span className="text-emerald-700 font-bold">Trend: +29% Over Baseline</span>
          </div>
        </div>

        {/* Operation Summary */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Operational Utilization</h2>
            <p className="text-xs text-gray-500 mb-4">Autonomous execution rates by workflow</p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-gray-700">Crop Monitoring</span>
                  <strong className="text-emerald-700">86%</strong>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-gray-700">Disease Detection</span>
                  <strong className="text-emerald-700">72%</strong>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-gray-700">Drone Missions</span>
                  <strong className="text-emerald-700">94%</strong>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-gray-700">Precision Spraying</span>
                  <strong className="text-emerald-700">81%</strong>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '81%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 mt-4">
            Optimal agricultural drone deployment uptime: <strong>94.2%</strong>
          </div>
        </div>
      </div>

      {/* Farm Performance Comparison Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3">Farm Regional Performance Benchmark</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="py-2.5 px-3">Farm</th>
                <th className="py-2.5 px-3">Surface Area</th>
                <th className="py-2.5 px-3">Crop Health</th>
                <th className="py-2.5 px-3">Productivity</th>
                <th className="py-2.5 px-3">Issues</th>
                <th className="py-2.5 px-3">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { farm: 'Main Farm (Rawalpindi)', area: '42 ha', health: '94%', prod: '91%', issues: 2, status: 'Excellent', statusClass: 'text-emerald-700 font-bold' },
                { farm: 'North Field (Chakwal)', area: '28 ha', health: '89%', prod: '85%', issues: 4, status: 'Good', statusClass: 'text-emerald-700 font-bold' },
                { farm: 'East Farm (Islamabad)', area: '35 ha', health: '92%', prod: '88%', issues: 3, status: 'Good', statusClass: 'text-emerald-700 font-bold' },
                { farm: 'South Farm (Attock)', area: '19 ha', health: '81%', prod: '77%', issues: 6, status: 'Attention', statusClass: 'text-amber-600 font-bold' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{r.farm}</td>
                  <td className="py-3 px-3 text-gray-600">{r.area}</td>
                  <td className="py-3 px-3 font-bold text-emerald-800">{r.health}</td>
                  <td className="py-3 px-3 text-gray-800 font-semibold">{r.prod}</td>
                  <td className="py-3 px-3 text-gray-600">{r.issues} incidents</td>
                  <td className={`py-3 px-3 ${r.statusClass}`}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
