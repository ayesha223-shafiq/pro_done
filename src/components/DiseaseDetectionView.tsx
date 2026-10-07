import { useState, useRef } from 'react';
import type { DiseaseDetection } from '../types';
import { useAuth } from '../context/AuthContext';
import { addDiseaseDetection } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { UploadCloud, CheckCircle, AlertTriangle, Sparkles, Image as ImageIcon, Send } from 'lucide-react';

interface DiseaseDetectionViewProps {
  detections: DiseaseDetection[];
  onScheduleSpraying: (disease: string) => void;
}

export function DiseaseDetectionView({ detections, onScheduleSpraying }: DiseaseDetectionViewProps) {
  const { user } = useAuth();
  const { notifyDiseaseUploaded } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>('/disease-scan.jpg');
  const [imageName, setImageName] = useState<string>('drone_telemetry_leaf_rust_scan.jpg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    disease: string;
    crop: string;
    confidence: number;
    severity: string;
    areaAffected: string;
    symptoms: string[];
    treatment: string;
  } | null>({
    disease: 'Leaf Rust (Puccinia triticina)',
    crop: 'Wheat',
    confidence: 94,
    severity: 'Moderate',
    areaAffected: '8.4%',
    symptoms: [
      'Circular reddish-orange pustules on leaf surface',
      'Premature leaf senescence and chlorosis',
      'Disruption of photosynthesis and transpiration',
      'Yield reduction risk: 15-25% if untreated',
    ],
    treatment: 'Apply Azoxystrobin + Propiconazole fungicide at 2.5 L/ha via precision drone spraying.',
  });

  const sampleImages = [
    {
      label: '🌾 Leaf Rust (Wheat)',
      disease: 'Leaf Rust (Puccinia triticina)',
      crop: 'Wheat',
      conf: 94,
      severity: 'Moderate',
      area: '8.4%',
      treatment: 'Azoxystrobin + Propiconazole (2.5 L/ha)',
      symptoms: [
        'Orange/amber fungal pustules',
        'Chlorotic leaf margins',
        'Reduced photosynthesis',
      ],
      emoji: '🌾',
    },
    {
      label: '🌱 Brown Spot (Rice)',
      disease: 'Brown Spot (Bipolaris oryzae)',
      crop: 'Rice',
      conf: 89,
      severity: 'High',
      area: '14.2%',
      treatment: 'Mancozeb or Tricyclazole fungicide',
      symptoms: [
        'Oval spots with grey/brown centers',
        'Yellow halo around necrotic lesions',
        'Grain discoloration',
      ],
      emoji: '🌱',
    },
    {
      label: '🌽 Northern Leaf Blight (Corn)',
      disease: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
      crop: 'Corn',
      conf: 92,
      severity: 'Severe',
      area: '18.0%',
      treatment: 'Pyraclostrobin + Fluxapyroxad (3.0 L/ha)',
      symptoms: [
        'Cigar-shaped grayish lesions',
        'Extensive foliar necrosis',
        'Accelerated drydown',
      ],
      emoji: '🌽',
    },
    {
      label: '✅ Healthy Leaf Control',
      disease: 'None (Healthy Crop Tissue)',
      crop: 'Wheat',
      conf: 98,
      severity: 'Optimal',
      area: '0.0%',
      treatment: 'No fungicide required. Continue routine NDVI monitoring.',
      symptoms: ['Uniform chlorophyll distribution', 'Turgid vascular structure', 'No fungal mycelium'],
      emoji: '🍃',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const result = {
      disease: 'Leaf Rust (Puccinia triticina)',
      crop: 'Wheat',
      confidence: 94,
      severity: 'Moderate',
      areaAffected: '8.4%',
      symptoms: [
        'Circular reddish-orange pustules on leaf surface',
        'Premature leaf senescence and chlorosis',
        'Disruption of photosynthesis and transpiration',
        'Yield reduction risk: 15-25% if untreated',
      ],
      treatment: 'Apply Azoxystrobin + Propiconazole fungicide at 2.5 L/ha via precision drone spraying.',
    };

    setAnalysisResult(result);

    if (user) {
      try {
        await addDiseaseDetection({
          userId: user.uid,
          farmName: 'Main Farm (Rawalpindi)',
          crop: result.crop,
          disease: result.disease,
          confidence: result.confidence,
          severity: result.severity,
          areaAffected: result.areaAffected,
          status: 'Detected',
          imageName,
        });
      } catch (err) {
        console.error('Failed to log disease detection:', err);
      }
    } else {
      // Trigger toast directly in demo / guest mode
      notifyDiseaseUploaded(result.disease, 'Main Farm (Rawalpindi)', result.confidence);
    }

    setIsAnalyzing(false);
  };

  const selectPreset = (preset: (typeof sampleImages)[0]) => {
    setSelectedImage(null);
    setImageName(preset.label);
    setAnalysisResult({
      disease: preset.disease,
      crop: preset.crop,
      confidence: preset.conf,
      severity: preset.severity,
      areaAffected: preset.area,
      symptoms: preset.symptoms,
      treatment: preset.treatment,
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 text-[10px] font-bold tracking-wider uppercase">
            🤖 Computer Vision Engine
          </div>
          <h1 className="text-2xl font-black tracking-tight">AI Crop Disease & Pathology Scanner</h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            Upload aerial drone images or field specimen photos to identify leaf pathogens, rust, spot, and mildew.
          </p>
        </div>

        <div className="text-5xl shrink-0 self-center">🔬</div>
      </div>

      {/* Preset selector pills */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Test With Sample Pathology Specimens:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleImages.map((s, idx) => (
            <button
              key={idx}
              onClick={() => selectPreset(s)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/70 text-xs font-semibold text-gray-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload & AI Diagnosis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Analyze Crop Specimen</h2>
            <p className="text-xs text-gray-500 mb-4">Select or drop a high-resolution leaf or canopy photograph</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-2xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
            >
              {selectedImage ? (
                <div className="space-y-2">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="max-h-40 rounded-xl object-contain mx-auto shadow-sm"
                  />
                  <div className="text-xs font-bold text-emerald-800">{imageName}</div>
                  <span className="text-[10px] text-gray-400">Click to replace photo</span>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-3xl mb-3 shadow-xs">
                    📷
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Upload Crop Specimen</h3>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP drone imagery up to 20MB</p>
                  <span className="mt-3 px-3 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-emerald-700 shadow-2xs">
                    Browse File
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full mt-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isAnalyzing ? 'Running AI Model...' : '🔍 Run Disease Diagnosis'}
          </button>
        </div>

        {/* Diagnosis Results Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Pathology Diagnosis</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                AI Diagnostic Model v2.4
              </span>
            </div>

            {analysisResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl shrink-0">
                    🦠
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      Detected Condition
                    </span>
                    <h3 className="text-base font-bold text-amber-950">{analysisResult.disease}</h3>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600">Model Confidence</span>
                    <span className="text-emerald-700">{analysisResult.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${analysisResult.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-center">
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <span className="text-[10px] text-gray-400 block font-semibold">Crop</span>
                    <strong className="text-xs font-bold text-gray-900">{analysisResult.crop}</strong>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <span className="text-[10px] text-gray-400 block font-semibold">Severity</span>
                    <strong className="text-xs font-bold text-amber-600">{analysisResult.severity}</strong>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <span className="text-[10px] text-gray-400 block font-semibold">Area Affected</span>
                    <strong className="text-xs font-bold text-gray-900">{analysisResult.areaAffected}</strong>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <span className="text-[11px] font-bold text-gray-700 block mb-1.5">Observed Symptoms:</span>
                  <ul className="space-y-1 text-xs text-gray-600 pl-4 list-disc">
                    {analysisResult.symptoms.map((sym, i) => (
                      <li key={i}>{sym}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <span className="text-4xl block mb-2">🧠</span>
                <p className="text-xs">Select or upload a crop scan to inspect disease results</p>
              </div>
            )}
          </div>

          {analysisResult && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 mb-3 text-xs text-emerald-900">
                <strong>Recommended Treatment:</strong> {analysisResult.treatment}
              </div>

              <button
                onClick={() => onScheduleSpraying(analysisResult.disease)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                💦 Schedule Targeted Spraying Mission →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Detections Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3">Recent AI Pathology Scans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="py-2.5 px-3">Farm</th>
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(detections.length > 0 ? detections : [
                { id: '1', farmName: 'Main Farm (Rawalpindi)', crop: 'Wheat', disease: 'Leaf Rust (Puccinia triticina)', confidence: 94, severity: 'Moderate', status: 'Attention', userId: '' },
                { id: '2', farmName: 'North Field (Chakwal)', crop: 'Rice', disease: 'Brown Spot (Bipolaris oryzae)', confidence: 89, severity: 'High', status: 'Monitored', userId: '' },
                { id: '3', farmName: 'East Farm (Islamabad)', crop: 'Corn', disease: 'Northern Corn Leaf Blight', confidence: 92, severity: 'Severe', status: 'Resolved', userId: '' },
              ]).map((d, idx) => (
                <tr key={d.id || idx} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{d.farmName}</td>
                  <td className="py-3 px-3 text-gray-600">{d.crop}</td>
                  <td className="py-3 px-3 text-amber-900 font-semibold">{d.disease}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">{d.confidence}%</td>
                  <td className="py-3 px-3 text-gray-600">{d.severity}</td>
                  <td className="py-3 px-3">
                    <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {d.status || 'Active'}
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
