import { useState } from 'react';
import { X, CheckCircle2, Building2, User, Mail, Phone, Calendar, Users, Sparkles, Send } from 'lucide-react';
import { addConsultationBooking } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export function ConsultationModal({ isOpen, onClose, defaultService = 'Multispectral Crop Health (NDVI) Survey' }: ConsultationModalProps) {
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [serviceCategory, setServiceCategory] = useState(defaultService);
  const [participantCount, setParticipantCount] = useState<number>(50); // Farm Acreage
  const [preferredDate, setPreferredDate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setSubmitting(true);
    try {
      await addConsultationBooking({
        name: fullName,
        email,
        phone,
        organization: organization || 'Agricultural Farm / Grower',
        serviceCategory,
        participantCount,
        preferredDate: preferredDate || 'Flexible',
        requirements: requirements || 'AgriHawk drone flight mission consultation',
      });

      setSubmitted(true);
      showToast({
        type: 'success',
        title: '🚁 Drone Mission Consultation Dispatched',
        message: `Thank you ${fullName}. Our flight dispatch and agronomy team will contact you at ${phone} to schedule your aerial mission.`,
        duration: 7000,
      });

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        // Reset form
        setFullName('');
        setEmail('');
        setPhone('');
        setOrganization('');
        setRequirements('');
      }, 2500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-amber-900/10 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#0b132b] text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-lg shadow-xs">
                🚁
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                  AgriHawk Pro · Autonomous Aviation
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight">
                  Schedule Drone Mission &amp; Flight
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-white/75 mt-2 max-w-md leading-relaxed relative z-10">
            Schedule an RTK aerial survey, precision micro-spray mission, or AI disease diagnostic flight across your agricultural fields.
          </p>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-950 font-serif">
              Flight Consultation Confirmed &amp; Logged to Database
            </h4>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Your mission specifications have been recorded in our flight operations database. An AgriHawk flight dispatcher will call you to confirm weather windows and RTK coordinates.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <a
                href="tel:0516101808"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Dispatch Line: 051-6101808</span>
              </a>
              <a
                href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20AgriHawk%20Pro,%20I%20just%20scheduled%20a%20drone%20consultation."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>💬 WhatsApp Support (+92 300 1234567)</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Service Stream */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Target Drone Mission Type
              </label>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                <option value="Multispectral Crop Health (NDVI) Survey">Multispectral Crop Health (NDVI) Survey</option>
                <option value="Precision Micro-Dose Spraying & Chemical Dosing">Precision Micro-Dose Spraying &amp; Chemical Dosing</option>
                <option value="AI Plant Pathology & Disease Diagnostic Scouting">AI Plant Pathology &amp; Disease Diagnostic Scouting</option>
                <option value="RTK Topographic Elevation & 3D Farm Mapping">RTK Topographic Elevation &amp; 3D Farm Mapping</option>
                <option value="Commercial Drone Fleet & Pilot Deployment">Commercial Drone Fleet &amp; Pilot Deployment</option>
                <option value="Full Season Farm Intelligence & Yield Optimization">Full Season Farm Intelligence &amp; Yield Optimization</option>
              </select>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Grower / Manager Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Malik Muhammad Tariq"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="grower@farm.pk"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Farm Name &amp; District
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Al-Faisal Wheat Farm, Rawalpindi"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Attendees & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Estimated Field Size (Acres)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="5"
                    max="10000"
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Target Flight Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Crop Type &amp; Special Requirements
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Mention crop type (e.g. Wheat, Cotton, Citrus, Rice), any observed disease symptoms (e.g. leaf rust, yellowing), or desired spraying formulations..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              ></textarea>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                Aviation Base: Islamabad / Rawalpindi, PK
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0b132b] hover:bg-[#152347] text-amber-300 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer border border-amber-400/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Transmitting...' : 'Confirm Flight Request'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

