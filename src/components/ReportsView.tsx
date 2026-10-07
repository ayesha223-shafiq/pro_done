import { useState } from 'react';
import type { Farm, ReportItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { addReport } from '../services/firestoreService';
import { FileText, Download, Plus, CheckCircle, Sparkles, X } from 'lucide-react';

interface ReportsViewProps {
  farms: Farm[];
  reports: ReportItem[];
}

export function ReportsView({ farms, reports }: ReportsViewProps) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(
    farms.length > 0 ? farms[0].name : 'Main Farm (Rawalpindi)'
  );
  const [reportType, setReportType] = useState('Farm Performance');
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultStarterReports: ReportItem[] = [
    {
      id: 'r1',
      userId: user?.uid || 'guest',
      reportName: 'Monthly Farm Performance Audit',
      reportType: 'Performance',
      farm: 'Main Farm (Rawalpindi)',
      crop: 'Wheat',
      area: 250,
      areaUnit: 'Acres',
      cropHealth: 94,
      diseaseStatus: 'Under Control (Leaf Rust managed)',
      monitoringStatus: 'Completed',
      generatedBy: user?.email || 'Farm Manager',
      status: 'Ready',
      date: 'Today',
    },
    {
      id: 'r2',
      userId: user?.uid || 'guest',
      reportName: 'Crop Health Spectral Analysis',
      reportType: 'Crop Health',
      farm: 'North Field (Chakwal)',
      crop: 'Corn',
      area: 180,
      areaUnit: 'Acres',
      cropHealth: 89,
      diseaseStatus: 'Low Risk',
      monitoringStatus: 'Completed',
      generatedBy: user?.email || 'Agronomist',
      status: 'Ready',
      date: 'Yesterday',
    },
    {
      id: 'r3',
      userId: user?.uid || 'guest',
      reportName: 'Drone Operations Log #AH-020',
      reportType: 'Drone Missions',
      farm: 'East Farm (Islamabad)',
      crop: 'Rice',
      area: 120,
      areaUnit: 'Acres',
      cropHealth: 92,
      diseaseStatus: 'None',
      monitoringStatus: 'Completed',
      generatedBy: user?.email || 'Fleet Pilot',
      status: 'Ready',
      date: 'Sep 09',
    },
  ];

  const displayedReports = reports.length > 0 ? reports : defaultStarterReports;

  const handleGenerate = async (type: string, customFarm?: string) => {
    setIsGenerating(true);
    const targetFarm = customFarm || selectedFarm;
    try {
      if (user) {
        await addReport({
          userId: user.uid,
          reportName: `${type} Audit Report`,
          reportType: type,
          farm: targetFarm,
          crop: 'Wheat',
          area: 250,
          areaUnit: 'Acres',
          cropHealth: 88,
          diseaseStatus: 'No Critical Disease',
          monitoringStatus: 'Completed',
          generatedBy: user.email || 'Farm Manager',
          status: 'Ready',
          date: 'Just now',
        });
      }
      alert(
        `${type} Report Generated Successfully!\n\nFarm: ${targetFarm}\nFormat: CSV / Audit PDF Export\nStatus: Ready for Download\n\n${
          user ? 'Saved to Firebase Firestore.' : 'Sign in to sync your generated reports permanently.'
        }`
      );
      setModalOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error generating report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (name: string) => {
    const content = `AGRIHAWK PRO - AGRICULTURAL AUDIT REPORT\n${name}\nGenerated: ${new Date().toLocaleDateString()}\nStatus: Verified\nPlatform: AgriHawk Pro Cloud`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const farmList =
    farms.length > 0
      ? farms.map((f) => f.name)
      : ['Main Farm (Rawalpindi)', 'North Field (Chakwal)', 'East Farm (Islamabad)', 'South Farm (Attock)'];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
            📊 Compliance & Diagnostics
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-1">Farm Intelligence Reports</h1>
          <p className="text-xs text-emerald-100 max-w-xl mt-1">
            Produce certified agricultural audit reports for crop yield estimation, pesticide compliance, and drone flight logs.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold transition shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Custom Report
        </button>
      </div>

      {/* 4 Quick Pre-Built Generators */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: '🌱',
            title: 'Crop Health Report',
            desc: 'NDVI index, vegetation vigor, and localized crop stress breakdown.',
            type: 'Crop Health',
          },
          {
            icon: '🚁',
            title: 'Drone Flight Report',
            desc: 'Flight hours, area covered, speed, altitude, and battery metrics.',
            type: 'Drone Flight',
          },
          {
            icon: '🦠',
            title: 'Disease Pathology Report',
            desc: 'Diagnosed fungi, AI confidence scores, and affected acreage.',
            type: 'Disease Detection',
          },
          {
            icon: '💦',
            title: 'Precision Spraying Report',
            desc: 'Chemical dosage, spray volume, application dates, and cost savings.',
            type: 'Precision Spraying',
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-600 transition"
          >
            <div>
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
            <button
              onClick={() => handleGenerate(card.type)}
              disabled={isGenerating}
              className="mt-4 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Generate Report →
            </button>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3">Generated Reports Repository</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="py-2.5 px-3">Report Title</th>
                <th className="py-2.5 px-3">Target Farm</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedReports.map((r, i) => (
                <tr key={r.id || i} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    {r.reportName}
                  </td>
                  <td className="py-3 px-3 text-gray-600">{r.farm}</td>
                  <td className="py-3 px-3 text-emerald-900 font-semibold">{r.reportType}</td>
                  <td className="py-3 px-3 text-gray-500">{r.date}</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {r.status || 'Ready'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDownload(r.reportName)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-bold transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-gray-900">Generate Custom Report</h2>
            <p className="text-xs text-gray-500 mt-1 mb-5">Select farm holding and target parameters.</p>

            <div className="space-y-4">
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Report Format & Scope</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Farm Performance">Comprehensive Farm Performance Audit</option>
                  <option value="Crop Health">Spectral NDVI Crop Health</option>
                  <option value="Disease Detection">Pathogen & Pest Pathology Log</option>
                  <option value="Drone Operations">Fleet Flight Log & Telemetry</option>
                  <option value="Precision Spraying">Precision Spraying Chemical Compliance</option>
                </select>
              </div>

              <button
                onClick={() => handleGenerate(reportType)}
                disabled={isGenerating}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Compiling Report...' : 'Compile & Save Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
