import { useState } from 'react';
import {
  Plane,
  Shield,
  Activity,
  Droplets,
  MapPin,
  BarChart3,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  Cpu,
  Github,
  Award,
  Clock,
  Menu,
  X,
  ExternalLink,
  Star,
  Send,
  Building2,
  Layers,
  FileCheck,
  Compass,
  Play,
  Film,
  Radio,
} from 'lucide-react';
import { ConsultationModal } from './ConsultationModal';
import { VideoStoryModal } from './VideoStoryModal';
import { addInquiry } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';

interface LandingPageProps {
  onEnterDashboard: (view?: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenGitHub: () => void;
}

export function LandingPage({ onEnterDashboard, onOpenAuth, onOpenGitHub }: LandingPageProps) {
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationService, setConsultationService] = useState('Multispectral Crop Health (NDVI) Survey');
  const [activePillarTab, setActivePillarTab] = useState<'ndvi' | 'spraying' | 'disease' | 'mapping' | 'fleet' | 'analytics'>('ndvi');

  // Video Story Modal State
  const [videoStoryOpen, setVideoStoryOpen] = useState(false);
  const [videoStoryChapter, setVideoStoryChapter] = useState(0);
  const [videoStoryLanguage, setVideoStoryLanguage] = useState<'en' | 'ur'>('ur');
  const [heroActiveMedia, setHeroActiveMedia] = useState<'drone' | 'malik' | 'scan' | 'controller'>('drone');

  const openVideoStory = (chapter: number = 0, lang: 'en' | 'ur' = 'ur') => {
    setVideoStoryChapter(chapter);
    setVideoStoryLanguage(lang);
    setVideoStoryOpen(true);
  };

  // Contact Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryService, setInquiryService] = useState('Multispectral Crop Health (NDVI)');
  const [inquiryFarm, setInquiryFarm] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Mission Proposal Estimator State
  const [estService, setEstService] = useState('spraying');
  const [estAcreage, setEstAcreage] = useState('100');
  const [estTurnaround, setEstTurnaround] = useState('express');

  const openConsultationWithService = (service: string) => {
    setConsultationService(service);
    setConsultationOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone) return;

    setInquirySending(true);
    try {
      await addInquiry({
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        service: inquiryService,
        organization: inquiryFarm || 'Agricultural Farm',
        message: inquiryMessage || 'Flight mission inquiry submitted from AgriHawk portal.',
      });

      setInquirySent(true);
      showToast({
        type: 'success',
        title: '✈️ Flight Mission Inquiry Dispatched',
        message: `Thank you ${inquiryName}. AgriHawk flight operations will contact you at ${inquiryPhone} to coordinate coordinates and flight windows.`,
        duration: 7000,
      });

      setTimeout(() => {
        setInquirySent(false);
        setInquiryName('');
        setInquiryEmail('');
        setInquiryPhone('');
        setInquiryFarm('');
        setInquiryMessage('');
      }, 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error sending inquiry');
    } finally {
      setInquirySending(false);
    }
  };

  const servicesData = {
    ndvi: {
      title: 'Multispectral Crop Health & NDVI Mapping',
      tagline: 'See what the human eye cannot: vegetative vigor and nitrogen stress.',
      desc: 'Our enterprise quadcopters carry 5-band multispectral sensors (Red, Green, Blue, RedEdge, NIR) calibrated via downwelling light sensors to produce millimeter-accurate NDVI, NDRE, and chlorophyll distribution indices.',
      badge: 'Spectral Agronomy',
      features: [
        '5-Band Calibrated NDVI & Chlorophyll Stress Indexing',
        'Identification of Early Crop Underperformance 14 Days Before Visual Symptoms',
        'Zonal Prescription Maps for Variable Rate Fertilizer Application',
        'Precise Plant Canopy Vigor & Emergence Density Calculation',
      ],
      cta: 'Book Spectral Survey',
      actionView: 'crop-monitoring',
    },
    spraying: {
      title: 'Autonomous Precision Micro-Spraying',
      tagline: 'Slash chemical usage by up to 35% with centimeter-accurate atomized droplet delivery.',
      desc: 'Equipped with dual atomized centrifugal nozzles and terrain-following millimeter-wave radar, our 16L & 30L agricultural spray drones apply pesticides and foliar micronutrients precisely where needed, eliminating overspray and soil compaction.',
      badge: 'Precision Application',
      features: [
        'Variable-Rate Micro-Dosing Tailored to Zonal Stress Maps',
        'Terrain-Following Radar Traversing Slopes & High-Canopy Orchards',
        'Zero Soil Compaction and Zero Crop Trampling Compared to Heavy Tractors',
        'Night-Flight Capability for Wind-Sensitive Herbicide Formulations',
      ],
      cta: 'Schedule Spraying Mission',
      actionView: 'precision-spraying',
    },
    disease: {
      title: 'AI Crop Pathology & Early Diagnostics',
      tagline: 'Deep-learning computer vision trained on over 50,000 agricultural pathology specimens.',
      desc: 'High-resolution aerial macro imagery is fed into our edge AI inference pipeline to detect leaf rust, fungal blight, viral mosaics, and insect infestations in wheat, corn, rice, cotton, and citrus with over 94% diagnostic confidence.',
      badge: 'Neural Pathology',
      features: [
        'Instant Pathogen Identification (Rust, Blight, Powdery Mildew, Stem Rot)',
        'Accurate Confidence Rating with Affected Foliage Percentage',
        'Automated Curative & Preventative Chemical Formulation Recommendations',
        'GPS Geo-Tagged Infection Clusters for Surgical Spot Treatments',
      ],
      cta: 'Explore AI Diagnostics',
      actionView: 'disease-detection',
    },
    mapping: {
      title: 'RTK Sub-Centimeter 3D Topographic Mapping',
      tagline: 'Centimeter-accurate digital elevation models and boundary telemetry.',
      desc: 'High-precision RTK GPS and photogrammetry reconstruct exact 3D field elevation contours, drainage channels, irrigation gradients, and property cadastral boundaries to optimize farm hydrology and planting rows.',
      badge: 'Spatial Topography',
      features: [
        'Sub-Centimeter Digital Surface Models (DSM) & Digital Terrain Models (DTM)',
        'Automated Water Pooling, Runoff Simulation & Slope Analysis',
        'Geofenced Boundary Definition Compatible with Tractor Autosteer',
        'Volumetric Earthwork Calculations for Field Leveling & Terracing',
      ],
      cta: 'Launch 3D Farm Mapping',
      actionView: 'farm-mapping',
    },
    fleet: {
      title: 'Commercial Drone Fleet & Certified Pilots',
      tagline: 'On-demand agricultural aviation deployed directly to your farm within 24 hours.',
      desc: 'No equipment capital cost required. Our network of certified commercial drone operators arrives on-site with mobile charging stations, RTK base units, and pre-calibrated aircraft to execute turnkey flight operations.',
      badge: 'Turnkey Aviation',
      features: [
        'Fully Licensed & Insured Agricultural UAV Flight Crews',
        'Rapid Mobilization Across Punjab, Sindh, and Islamabad Capital Territory',
        'Self-Contained Mobile Power Generators & High-Speed Battery Chargers',
        'Real-Time Live Telemetry Telecast to Farm Owners Mobile Device',
      ],
      cta: 'Book Turnkey Flight Mission',
      actionView: 'booking',
    },
    analytics: {
      title: 'Enterprise Yield Intelligence & Farm Reports',
      tagline: 'Data-driven agricultural management connecting aerial sensors to financial ROI.',
      desc: 'Seamlessly translate flight missions into actionable managerial intelligence. Export certified agricultural audit reports, vegetative health charts, weather telemetry correlations, and historical yield trendlines.',
      badge: 'Farm Intelligence',
      features: [
        'Automated PDF Executive Flight & Agronomy Reports',
        'Historic Multi-Season Vegetative Index Comparison',
        'Integrated Microclimate Weather Telemetry & Spray Window Warnings',
        'Chemical and Water Conservation Metrics for Sustainable ESG Compliance',
      ],
      cta: 'Access Farm Analytics',
      actionView: 'analytics',
    },
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-amber-200 selection:text-stone-950">
      {/* ================= 1. TOP FLIGHT OPERATIONS BAR ================= */}
      <div className="bg-[#070f20] text-white/80 text-[11px] border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>AgriHawk Aviation Base: Islamabad / Rawalpindi Hangar, Pakistan</span>
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Flight Operations: Mon - Sat: 06:00 - 18:00 PKT (Dawn to Dusk)</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="tel:0516101808"
              className="flex items-center gap-1.5 hover:text-amber-400 transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>051-6101808 / (+92)-51-6101808</span>
            </a>
            <a
              href="mailto:operations@agrihawk.com"
              className="flex items-center gap-1.5 hover:text-amber-400 transition font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>operations@agrihawk.com</span>
            </a>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>RTK Base Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN HEADER & NAVIGATION ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo with Official AI-AGRIHAWK PRO Emblem */}
          <div
            onClick={() => onEnterDashboard('dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <img
              src="/logo.jpg"
              alt="AI-AgriHawk Pro Emblem Logo"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50 shadow-md bg-white group-hover:scale-105 transition shrink-0"
            />
            <div>
              <div className="flex items-baseline gap-1 font-serif text-lg sm:text-xl font-black tracking-tight text-[#0b132b] leading-tight">
                <span>AI-AgriHawk</span>
                <span className="text-amber-600 text-xs font-sans font-bold tracking-wider">PRO</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-emerald-800 block uppercase">
                Autonomous Aerial Agriculture &amp; Farm OS
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-stone-700">
            <a href="#about" className="hover:text-amber-600 transition">About AgriHawk</a>
            <a href="#documentary" className="hover:text-amber-600 transition flex items-center gap-1.5 text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Story &amp; Videos</span>
            </a>
            <a href="#services" className="hover:text-amber-600 transition">Flight Solutions</a>
            <a href="#protocol" className="hover:text-amber-600 transition">Flight Protocol</a>
            <a href="#estimator" className="hover:text-amber-600 transition">Mission Estimator</a>
            <a href="#testimonials" className="hover:text-amber-600 transition">Grower Stories</a>
            <a href="#contact" className="hover:text-amber-600 transition">Operations Hub</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onEnterDashboard('dashboard')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>📊</span>
              <span>Launch Farm OS</span>
            </button>

            <button
              onClick={() => openConsultationWithService('Multispectral Crop Health (NDVI) Survey')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Flight Mission</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 p-4 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            <div className="space-y-1 text-xs font-bold text-stone-700">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                About AgriHawk
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                Flight Solutions &amp; Sensors
              </a>
              <a
                href="#protocol"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                5-Phase Flight Protocol
              </a>
              <a
                href="#estimator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                Mission &amp; Acreage Estimator
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                Flight Hangar Contact
              </a>
            </div>

            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openConsultationWithService('Multispectral Crop Health (NDVI) Survey');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs transition"
              >
                Book Drone Flight Mission
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterDashboard('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-[#0b132b] text-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>🚁 Launch Farm OS Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= 3. HERO SECTION ================= */}
      <section className="relative bg-[#070f20] text-white pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Ambient subtle glow & architectural grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_40%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Editorial Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AGRIHAWK PRO · AUTONOMOUS AERIAL INTELLIGENCE</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Connecting Aerial Intelligence,{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-300 bg-clip-text text-transparent">
                  Agronomy &amp; Precision Robotics.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-light">
                Empowering growers, commercial agro-enterprises, and agricultural researchers across Pakistan with autonomous drone scouting, multispectral NDVI indexing, AI crop disease diagnostics, and ultra-low volume precision spraying.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => openVideoStory(0)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>Watch Malik&apos;s Story &amp; Drone Film</span>
                </button>

                <button
                  onClick={() => openConsultationWithService('Multispectral Crop Health (NDVI) Survey')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Schedule Flight Mission</span>
                </button>

                <button
                  onClick={() => onEnterDashboard('dashboard')}
                  className="px-5 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-500/40 transition cursor-pointer flex items-center gap-2"
                  title="Open Farm and Drone Management Suite"
                >
                  <span>📊</span>
                  <span>Launch Farm OS</span>
                </button>
              </div>

              {/* 6 Official Badges from AI-AGRIHAWK PRO Logo */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>OFFICIAL AI-AGRIHAWK PRO CAPABILITIES</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition">
                    <span className="text-base shrink-0">🧠</span>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-tight">AI POWERED</div>
                      <div className="text-[8px] text-stone-400">Computer Vision</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition">
                    <span className="text-base shrink-0">🌿</span>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-tight">PRECISION AG</div>
                      <div className="text-[8px] text-stone-400">NDVI Multi-Band</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition">
                    <span className="text-base shrink-0">🚁</span>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-tight">SMART SPRAY</div>
                      <div className="text-[8px] text-stone-400">Centrifugal Mist</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition">
                    <span className="text-base shrink-0">⛅</span>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-tight">WEATHER OPS</div>
                      <div className="text-[8px] text-stone-400">Telemetry Radar</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition">
                    <span className="text-base shrink-0">🔗</span>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-tight">BLOCKCHAIN</div>
                      <div className="text-[8px] text-stone-400">Secured Audits</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition">
                    <span className="text-base shrink-0">🛰️</span>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-tight">SWARM READY</div>
                      <div className="text-[8px] text-stone-400">Multi-UAV Sync</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sub-Centimeter RTK Topography</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Over 35% Chemical Conservation</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Islamabad / Rawalpindi Hangar Base</span>
                </span>
              </div>
            </div>

            {/* Right Card / Interactive Video & Cinematic Media Theater */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 p-5 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-4">
                {/* Media Header */}
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>FIELD MEDIA CINEMA</span>
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                      Autonomous Flight in Pakistan
                    </h3>
                  </div>
                  <button
                    onClick={() => openVideoStory(heroActiveMedia === 'drone' ? 1 : heroActiveMedia === 'malik' ? 0 : heroActiveMedia === 'scan' ? 2 : 4)}
                    className="px-2.5 py-1 rounded-xl bg-amber-400 text-stone-950 text-[10px] font-bold hover:bg-amber-300 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-stone-950" />
                    <span>Watch Full Story</span>
                  </button>
                </div>

                {/* Cinematic Media Screen */}
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 group shadow-lg">
                  <img
                    src={
                      heroActiveMedia === 'drone'
                        ? '/hero-drone.jpg'
                        : heroActiveMedia === 'malik'
                        ? '/farmer-malik.jpg'
                        : heroActiveMedia === 'scan'
                        ? '/disease-scan.jpg'
                        : '/drone-controller.jpg'
                    }
                    alt="AgriHawk Pro Media Scene"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient & Scanline effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                  {/* Live HUD Badges on screen */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                    {heroActiveMedia === 'drone' && 'SPEED: 101 m/min · 60 AC/HR'}
                    {heroActiveMedia === 'malik' && 'MALIK: THE STRUGGLE & THE THREAT'}
                    {heroActiveMedia === 'scan' && 'AI PATHOLOGY: 94.8% CONFIDENCE'}
                    {heroActiveMedia === 'controller' && 'RTK FIX: 26 SATELLITES'}
                  </div>

                  {/* Center Play Button Overlay */}
                  <button
                    onClick={() => openVideoStory(heroActiveMedia === 'drone' ? 1 : heroActiveMedia === 'malik' ? 0 : heroActiveMedia === 'scan' ? 2 : 4)}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-amber-400/95 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-xl hover:scale-110 transition cursor-pointer backdrop-blur-xs border-2 border-white/40"
                    title="Play Full Cinematic Documentary"
                  >
                    <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-[11px]">
                    <span className="font-semibold drop-shadow-sm">
                      {heroActiveMedia === 'drone' && 'Autonomous Drone Flight & Atomized Spraying'}
                      {heroActiveMedia === 'malik' && 'The Struggle: Generations of Manual Spraying'}
                      {heroActiveMedia === 'scan' && 'Deep Learning Disease Bounding Boxes'}
                      {heroActiveMedia === 'controller' && 'Rugged Field Tablet Telemetry'}
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">HD · 4K</span>
                  </div>
                </div>

                {/* Media Switcher Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={() => setHeroActiveMedia('drone')}
                    className={`p-2 rounded-xl text-center text-[10px] font-bold border transition cursor-pointer ${
                      heroActiveMedia === 'drone'
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    🚁 Flight
                  </button>

                  <button
                    onClick={() => setHeroActiveMedia('malik')}
                    className={`p-2 rounded-xl text-center text-[10px] font-bold border transition cursor-pointer ${
                      heroActiveMedia === 'malik'
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    🌾 Malik
                  </button>

                  <button
                    onClick={() => setHeroActiveMedia('scan')}
                    className={`p-2 rounded-xl text-center text-[10px] font-bold border transition cursor-pointer ${
                      heroActiveMedia === 'scan'
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    🔬 AI Scan
                  </button>

                  <button
                    onClick={() => setHeroActiveMedia('controller')}
                    className={`p-2 rounded-xl text-center text-[10px] font-bold border transition cursor-pointer ${
                      heroActiveMedia === 'controller'
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    📱 Cockpit
                  </button>
                </div>

                {/* Quick Deploy Strip */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Islamabad Hangar Desk</span>
                    <span className="font-bold text-white">051-6101808</span>
                  </div>
                  <button
                    onClick={() => openConsultationWithService('Multispectral Crop Health (NDVI) Survey')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    Book Turnkey Drone
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-300">
                25,000+
              </div>
              <div className="text-xs text-stone-300 mt-1 font-medium">
                Acres Mapped &amp; Monitored
              </div>
            </div>

            <div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-400">
                99.2%
              </div>
              <div className="text-xs text-stone-300 mt-1 font-medium">
                Autonomous Flight Mission Success
              </div>
            </div>

            <div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                35%
              </div>
              <div className="text-xs text-stone-300 mt-1 font-medium">
                Reduction in Chemical Runoff
              </div>
            </div>

            <div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-400">
                ±1.5 cm
              </div>
              <div className="text-xs text-stone-300 mt-1 font-medium">
                RTK Topographic Survey Accuracy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. ABOUT AGRIHAWK & AGRONOMY MISSION ================= */}
      <section id="about" className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphic / Malik Farmer Story & Image */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl bg-[#0b132b] text-white overflow-hidden shadow-2xl border border-emerald-500/30">
                {/* Farmer Photo */}
                <div className="relative aspect-4/3 overflow-hidden group">
                  <img
                    src="/farmer-malik.jpg"
                    alt="Malik: Traditional Farmer in Pakistan"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b] via-transparent to-transparent"></div>
                  
                  {/* Play Video Button on Photo */}
                  <button
                    onClick={() => openVideoStory(0)}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-2xl transition hover:scale-110 cursor-pointer"
                    title="Play Malik's Story (Video)"
                  >
                    <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
                  </button>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-400/30">
                    FIELD DOCUMENTARY · CHAPTER 01
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-xs font-serif italic text-stone-200">
                    “For generations, we’ve poured our sweat into this soil. But the workload is overwhelming...”
                  </div>
                </div>

                {/* Narrative Card */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        Malik: The Struggle &amp; The Threat
                      </h4>
                      <span className="text-[11px] text-amber-400 font-medium">
                        The Human Reality of Farming in Pakistan
                      </span>
                    </div>
                    <button
                      onClick={() => openVideoStory(0)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span>Watch (0:45)</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    Manual inspections are slow. Pests like whiteflies and stem borers are often discovered only after irreversible damage is done. Backbreaking 20kg knapsack sprayers expose farmers to toxic chemicals in blazing heat.
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300">
                    <span>AgriHawk Pro AI Solution:</span>
                    <span className="font-bold text-white">60 Acres / Hour Autonomous</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-amber-600">
                <span>OUR CORE AGRONOMY MISSION</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                Transforming Crop Production with Autonomous Aviation &amp; Artificial Intelligence.
              </h2>

              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                AgriHawk Pro connects aerial robotics with modern agronomy. By replacing manual field scouting and imprecise tractor spraying with autonomous drones, we empower farm managers to detect vegetative stress up to 14 days earlier and apply chemicals with surgical micro-precision.
              </p>

              <p className="text-stone-600 leading-relaxed text-sm">
                From our aviation base in Islamabad and mobile flight crews across Punjab, AgriHawk provides end-to-end aerial surveys, RTK boundary mapping, disease diagnostics, and automated reporting that safeguard crop yields and maximize grower profitability.
              </p>

              {/* Three Institutional Pillars */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="font-serif text-base font-bold text-stone-900 mb-1">
                    01. Early Detection
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Multispectral sensors isolate stressed plants before irreversible yield loss occurs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="font-serif text-base font-bold text-stone-900 mb-1">
                    02. Precision Spraying
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Micro-dosing atomized sprays directly to affected clusters with zero crop damage.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="font-serif text-base font-bold text-stone-900 mb-1">
                    03. Sustainable Yields
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Maximizing profit margins while reducing chemical usage and protecting soil biology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4B. CINEMATIC DOCUMENTARY & FIELD VIDEO STORIES ================= */}
      <section id="documentary" className="py-20 lg:py-28 bg-[#070f20] text-white border-b border-white/10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                <Film className="w-3.5 h-3.5" />
                <span>Cinematic Documentary Film</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-white">
                The AgriHawk Revolution: The Official Film
              </h2>
              <p className="text-stone-300 text-sm">
                Experience the complete continuous documentary film with synchronized AI voiceover narration in both <strong className="text-emerald-400 font-bold">Urdu (اردو)</strong> and <strong className="text-amber-400 font-bold">English</strong>. Learn how precision aerial robotics rescues harvests across Pakistan.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold flex items-center gap-1.5">
                  <span>🇵🇰</span>
                  <span>اردو AI آواز (Urdu Voice)</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>English AI Voice</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-stone-300 border border-white/10 font-medium">
                  🎵 Harmonic Web Audio Score
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                onClick={() => openVideoStory(0, 'ur')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>اردو میں دیکھیں (Watch in Urdu)</span>
              </button>

              <button
                onClick={() => openVideoStory(0, 'en')}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-stone-950" />
                <span>Watch in English</span>
              </button>
            </div>
          </div>

          {/* 5 Video Chapters Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Chapter 1 */}
            <div
              onClick={() => openVideoStory(0)}
              className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src="/farmer-malik.jpg"
                  alt="Malik: The Struggle and The Threat"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-stone-200">
                  0:45
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Chapter 01 · Reality
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  Malik: The Struggle &amp; The Threat
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  Manual inspections are slow. Pests strike before human eyes notice.
                </p>
              </div>
            </div>

            {/* Chapter 2 */}
            <div
              onClick={() => openVideoStory(1)}
              className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src="/hero-drone.jpg"
                  alt="Autonomous Aerial Lift-Off"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-400 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-stone-200">
                  0:50
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Chapter 02 · Robotics
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  Autonomous Aerial Lift-Off
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  Meet the future: 101 m/min flight speed, laser grid terrain tracking.
                </p>
              </div>
            </div>

            {/* Chapter 3 */}
            <div
              onClick={() => openVideoStory(2)}
              className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src="/disease-scan.jpg"
                  alt="AI Crop Pathology & Diagnostics"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-stone-200">
                  0:40
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Chapter 03 · Edge AI
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  AI Pathology &amp; Diagnostics
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  Live bounding boxes pinpointing yellow rust and whitefly clusters.
                </p>
              </div>
            </div>

            {/* Chapter 4 */}
            <div
              onClick={() => openVideoStory(3)}
              className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src="/hero-drone.jpg"
                  alt="Precision Micro-Spraying"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-400 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-stone-200">
                  0:35
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Chapter 04 · Targeted
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  Precision Micro-Spraying
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  Atomized centrifugal mist saving 35% chemicals with zero plant damage.
                </p>
              </div>
            </div>

            {/* Chapter 5 */}
            <div
              onClick={() => openVideoStory(4)}
              className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src="/drone-controller.jpg"
                  alt="Digital Farmer Cockpit"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-400 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-stone-200">
                  0:55
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Chapter 05 · Cockpit
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  The Field Operator Cockpit
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  Rugged tablet showing live NDVI vegetation charts and battery health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. CORE FLIGHT SOLUTIONS (INTERACTIVE TABS) ================= */}
      <section id="services" className="py-20 lg:py-28 bg-stone-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
              AERIAL CAPABILITIES &amp; SENSORS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Autonomous Flight Solutions Designed for Every Acre.
            </h2>
            <p className="text-stone-600 text-sm">
              Explore our specialized drone payloads, multispectral workflows, and AI diagnostics built for modern agriculture.
            </p>
          </div>

          {/* Interactive Segmented Tabs */}
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActivePillarTab('ndvi')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activePillarTab === 'ndvi'
                  ? 'bg-[#0b132b] text-amber-300 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>NDVI Health Mapping</span>
            </button>

            <button
              onClick={() => setActivePillarTab('spraying')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activePillarTab === 'spraying'
                  ? 'bg-[#0b132b] text-amber-300 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>Precision Spraying</span>
            </button>

            <button
              onClick={() => setActivePillarTab('disease')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activePillarTab === 'disease'
                  ? 'bg-[#0b132b] text-amber-300 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>AI Crop Diagnostics</span>
            </button>

            <button
              onClick={() => setActivePillarTab('mapping')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activePillarTab === 'mapping'
                  ? 'bg-[#0b132b] text-amber-300 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>RTK 3D Mapping</span>
            </button>

            <button
              onClick={() => setActivePillarTab('fleet')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activePillarTab === 'fleet'
                  ? 'bg-[#0b132b] text-amber-300 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Commercial Drone Fleet</span>
            </button>

            <button
              onClick={() => setActivePillarTab('analytics')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activePillarTab === 'analytics'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Yield Analytics</span>
            </button>
          </div>

          {/* Active Tab Card Display */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl transition-all">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {servicesData[activePillarTab].badge}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {servicesData[activePillarTab].title}
                </h3>

                <p className="text-amber-800 font-medium text-sm">
                  {servicesData[activePillarTab].tagline}
                </p>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {servicesData[activePillarTab].desc}
                </p>

                <div className="pt-2 space-y-2.5">
                  {servicesData[activePillarTab].features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => openConsultationWithService(servicesData[activePillarTab].title)}
                    className="px-6 py-3 rounded-xl bg-[#0b132b] hover:bg-[#152347] text-amber-300 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>{servicesData[activePillarTab].cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEnterDashboard(servicesData[activePillarTab].actionView)}
                    className="px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer border border-emerald-200 flex items-center gap-1.5"
                  >
                    <span>Open in OS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Technical Specifications Blueprint Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0b132b] to-[#122b22] rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-lg border border-emerald-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Aviation Payload Specs
                  </span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-stone-300">
                    <strong className="text-white block mb-0.5">Sensor Configuration:</strong>
                    Calibrated multispectral &amp; RGB high-resolution radiometric camera suite with RTK geo-tagging.
                  </div>

                  <div className="text-xs text-stone-300">
                    <strong className="text-white block mb-0.5">Flight Altitude &amp; Speed:</strong>
                    Operates at 60m - 120m AGL (Above Ground Level) at speeds optimized for 1cm/pixel Ground Sampling Distance.
                  </div>

                  <div className="text-xs text-stone-300">
                    <strong className="text-white block mb-0.5">Automated Prescriptions:</strong>
                    Direct export to ISO-XML and Shapefile formats for smart sprayers and variable-rate applicators.
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Flight Window: Optimal</span>
                  </div>
                  <span className="text-[10px] text-stone-400">Islamabad Radar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. 5-PHASE FLIGHT PROTOCOL SPOTLIGHT ================= */}
      <section id="protocol" className="py-20 lg:py-28 bg-[#0b132b] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AGRIHAWK STANDARD OPERATING PROCEDURE</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                5-Phase Full-Cycle Precision Agricultural Flight Protocol.
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                Every AgriHawk mission follows an exhaustive 5-stage aviation and agronomy workflow to guarantee flight safety, data integrity, and targeted crop intervention.
              </p>

              <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-xs font-serif">Phase 1: RTK Field Calibration</div>
                  <div className="text-[11px] text-stone-300">
                    Base station setup, geofence boundaries, obstacle safety verification.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-xs font-serif">Phase 2: Multispectral Grid Scouting</div>
                  <div className="text-[11px] text-stone-300">
                    Autonomous 100m AGL aerial pass capturing calibrated 5-band NDVI imagery.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-xs font-serif">Phase 3: Edge AI Pathology Inference</div>
                  <div className="text-[11px] text-stone-300">
                    Neural network detects disease lesions, rust pustules &amp; weed hotspots.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-xs font-serif">Phase 4: Variable-Rate Precision Spray</div>
                  <div className="text-[11px] text-stone-300">
                    Centrifugal atomizers deliver micro-dose formulations directly to clusters.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => openConsultationWithService('Full Season Farm Intelligence & Yield Optimization')}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition cursor-pointer flex items-center gap-2"
                >
                  <span>Schedule Field Mission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEnterDashboard('drone-missions')}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 border border-white/20 cursor-pointer"
                >
                  <Plane className="w-4 h-4 text-emerald-400" />
                  <span>View Drone Fleet</span>
                </button>
              </div>
            </div>

            {/* Testimonial / Credibility Box */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <blockquote className="font-serif italic text-base text-stone-100 leading-relaxed">
                &ldquo;AgriHawk Pro detected early yellow rust in Sector 4 of our Rawalpindi wheat farm when ground scouting saw nothing. Their precision spray drone contained the fungal outbreak within 4 hours, saving an estimated 150 maunds of grain.&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-3 border-t border-white/15">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center font-serif text-sm">
                  MT
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Malik Tariq Mehmood</div>
                  <div className="text-[11px] text-stone-400">Owner, Al-Faisal Wheat Farm · Rawalpindi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. INTERACTIVE MISSION & ACREAGE ESTIMATOR ================= */}
      <section id="estimator" className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
              MISSION PLANNING &amp; ESTIMATOR
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Calculate Flight Time &amp; Chemical Savings for Your Farm.
            </h2>
            <p className="text-stone-600 text-sm">
              Configure your farm acreage, desired drone mission, and turnaround window to preview your operational flight plan.
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  1. Drone Mission Service
                </label>
                <select
                  value={estService}
                  onChange={(e) => setEstService(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="spraying">Precision Micro-Spraying</option>
                  <option value="ndvi">Multispectral NDVI Survey</option>
                  <option value="mapping">RTK 3D Boundary Mapping</option>
                  <option value="disease">AI Plant Pathology Scouting</option>
                  <option value="combo">Full Turnkey Season Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  2. Farm Acreage
                </label>
                <select
                  value={estAcreage}
                  onChange={(e) => setEstAcreage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="25">Smallholding (25 Acres)</option>
                  <option value="50">Commercial Plot (50 Acres)</option>
                  <option value="100">Medium Farm (100 Acres)</option>
                  <option value="250">Large Agro-Estate (250 Acres)</option>
                  <option value="500">Corporate Scale (500+ Acres)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  3. Deployment Window
                </label>
                <select
                  value={estTurnaround}
                  onChange={(e) => setEstTurnaround(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="standard">Standard Dispatch (48 Hours)</option>
                  <option value="express">Express Emergency (24 Hours)</option>
                  <option value="scheduled">Scheduled Seasonal Contract</option>
                </select>
              </div>
            </div>

            {/* Calculated Blueprint Summary */}
            <div className="p-5 rounded-2xl bg-[#0b132b] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Estimated Aerial Operation Blueprint
                </span>
                <div className="font-serif text-lg font-bold text-white mt-0.5">
                  {estService === 'spraying' && `~${Math.round(Number(estAcreage) * 0.15)} Flight Hours · ~35% Chemical Saved`}
                  {estService === 'ndvi' && `~${Math.round(Number(estAcreage) * 0.1)} Flight Hours · Millimeter NDVI Resolution`}
                  {estService === 'mapping' && `~${Math.round(Number(estAcreage) * 0.12)} Flight Hours · ±1.5cm RTK DSM Map`}
                  {estService === 'disease' && `~${Math.round(Number(estAcreage) * 0.08)} Flight Hours · Edge AI Pathology Scan`}
                  {estService === 'combo' && `Turnkey Seasonal Support · Continuous Cloud Sync`}
                </div>
                <div className="text-xs text-stone-300 mt-1">
                  Calibrated for {estAcreage} acres · Dispatch: {estTurnaround === 'express' ? '24h Rapid Mobilization' : '48h Standard Window'}
                </div>
              </div>

              <button
                onClick={() => openConsultationWithService(estService)}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs whitespace-nowrap shadow-md transition cursor-pointer"
              >
                Confirm Flight Dispatch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. GROWER STORIES & TESTIMONIALS ================= */}
      <section id="testimonials" className="py-20 lg:py-28 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
              TRUSTED BY PROGRESSIVE GROWERS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Proven Results Across Pakistan&apos;s Agricultural Belts.
            </h2>
            <p className="text-stone-600 text-sm">
              Discover how leading wheat, citrus, corn, and cotton producers have unlocked record vegetative vigor with AgriHawk Pro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
                &ldquo;Our 180-acre corn crop in Chakwal was severely affected by armyworm. AgriHawk deployed two spray drones at twilight and eliminated the infestation with zero chemical drift to our adjacent canola fields.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100">
                <div className="text-xs font-bold text-stone-900">Chaudhry Waqas Munir</div>
                <div className="text-[11px] text-stone-500">Progressive Corn Grower · Chakwal</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
                &ldquo;The multispectral NDVI scans showed severe nitrogen deficiency in the western quadrant of our citrus orchards in Sargodha. We corrected the micronutrient dosing and saw an 18% improvement in fruit set.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100">
                <div className="text-xs font-bold text-stone-900">Mian Asadullah Khan</div>
                <div className="text-[11px] text-stone-500">Citrus Orchard Estate · Sargodha</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
                &ldquo;The AI disease detection on leaf spots gave us exact pesticide formulations within minutes right on our phone. No need to wait days for laboratory tests. AgriHawk Pro is indispensable for large-scale cotton.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100">
                <div className="text-xs font-bold text-stone-900">Sardar Bilal Leghari</div>
                <div className="text-[11px] text-stone-500">Cotton Agribusiness · Multan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. FLIGHT OPERATIONS HANGAR & CONTACT DESK ================= */}
      <section id="contact" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
              FLIGHT OPERATIONS BASE · ISLAMABAD
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Coordinate Your Drone Mission with AgriHawk Flight Control.
            </h2>
            <p className="text-stone-600 text-sm">
              Contact our flight planning desk to reserve flight windows, confirm RTK field coordinates, or request emergency pest intervention.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Address Card */}
            <div className="lg:col-span-5 bg-stone-50 p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0b132b] text-amber-400 flex items-center justify-center font-bold text-2xl shadow-sm border border-amber-500/20">
                    🚁
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-950">
                      AgriHawk Pro Aviation Desk
                    </h3>
                    <span className="text-xs text-stone-500 font-medium">Flight Operations &amp; Agronomy Dispatch</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-stone-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 text-sm">Flight Operations Base:</strong>
                      <span>Plot No. 11, Tulip Road, Sector-A, Near World Trade Centre / Giga Mall, Gate No. 03, Facing GT Road, DHA-II Islamabad / Rawalpindi Hangar, Pakistan.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 text-sm">Flight Dispatch Lines:</strong>
                      <div className="space-y-1 mt-1">
                        <a href="tel:0516101808" className="hover:text-amber-600 block font-semibold text-emerald-800">
                          📞 051-6101808 (Rawalpindi Hangar)
                        </a>
                        <a href="tel:+923001234567" className="hover:text-amber-600 block font-semibold text-emerald-800">
                          📱 +92 300 1234567 (Direct Operations Mobile)
                        </a>
                        <a
                          href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20AgriHawk%20Pro,%20I%20am%20interested%20in%20drone%20spraying%20and%20NDVI%20crop%20surveying."
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs mt-1 shadow-xs transition"
                        >
                          💬 Direct WhatsApp Support
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 text-sm">Mission Email:</strong>
                      <div className="space-y-0.5 mt-0.5">
                        <a href="mailto:operations@agrihawk.com?subject=AgriHawk%20Drone%20Flight%20Inquiry" className="hover:text-amber-600 block">operations@agrihawk.com</a>
                        <a href="mailto:support@agrihawk.com?subject=AgriHawk%20Support%20Request" className="hover:text-amber-600 block">support@agrihawk.com</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 text-sm">Operational Hours:</strong>
                      <span>Monday to Saturday: 06:00 AM – 06:00 PM PKT (Dawn to Dusk)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-500">Live Weather Radar: Clear</span>
                <button
                  onClick={() => onEnterDashboard('weather')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Farm Weather Telemetry</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Message / Direct Inquiry Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                  DISPATCH AN AERIAL INQUIRY
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Request Drone Flight Mission or Quote
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Logged directly into our flight dispatch CRM in Firestore for immediate pilot coordination.
                </p>
              </div>

              {inquirySent ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-emerald-950">
                    Mission Request Dispatched &amp; Saved to Database
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Thank you! Your inquiry has been stored in our operational database. Our flight dispatcher will review coordinates and contact you shortly.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={`tel:${inquiryPhone || '0516101808'}`}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Helpline Now</span>
                    </a>
                    <a
                      href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20AgriHawk%20Pro,%20I%20just%20submitted%20a%20flight%20request%20online."
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>💬 WhatsApp Us Directly</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Grower / Farm Owner Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Malik Muhammad Tariq"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="tariq@farm.pk"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Phone / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Farm Name &amp; District
                      </label>
                      <input
                        type="text"
                        value={inquiryFarm}
                        onChange={(e) => setInquiryFarm(e.target.value)}
                        placeholder="Al-Faisal Farm, Rawalpindi"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Required Drone Service
                    </label>
                    <select
                      value={inquiryService}
                      onChange={(e) => setInquiryService(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value="Multispectral Crop Health (NDVI)">Multispectral Crop Health (NDVI) Survey</option>
                      <option value="Precision Micro-Dose Spraying">Precision Micro-Dose Spraying &amp; Chemical Application</option>
                      <option value="AI Plant Pathology Diagnostics">AI Plant Pathology &amp; Early Disease Diagnostics</option>
                      <option value="RTK 3D Topographic Mapping">RTK 3D Topographic Elevation &amp; Boundary Mapping</option>
                      <option value="Commercial Drone Fleet Booking">Commercial Drone Fleet &amp; Pilot Deployment</option>
                      <option value="Full Season Farm Intelligence">Full Season Farm Intelligence Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Field Acreage, Crop Type &amp; Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Specify your crop (Wheat, Corn, Rice, Cotton, Citrus), field acreage, any observed disease symptoms, or urgency level..."
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      Rapid dispatch response within 2 hours.
                    </span>
                    <button
                      type="submit"
                      disabled={inquirySending}
                      className="px-6 py-2.5 rounded-xl bg-[#0b132b] hover:bg-[#152347] text-amber-300 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer border border-amber-400/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{inquirySending ? 'Transmitting...' : 'Dispatch Request'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. CORPORATE FOOTER ================= */}
      <footer className="bg-[#050b17] text-white/80 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Col 1: Identity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="AI-AgriHawk Pro Emblem Logo"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50 shadow-md bg-white shrink-0"
                />
                <div>
                  <div className="font-serif text-lg font-bold text-white leading-tight">
                    AI-AgriHawk Pro
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                    Autonomous Aerial Agriculture &amp; Farm OS
                  </span>
                </div>
              </div>

              <p className="text-stone-400 text-xs leading-relaxed max-w-sm font-light">
                Connecting Aerial Intelligence, Agronomy &amp; Precision Robotics. Empowering farm owners and corporate agro-enterprises with autonomous scouting, NDVI mapping, and precision micro-spraying.
              </p>

              <div className="text-[11px] text-stone-400 space-y-1 pt-1">
                <div>Operations Base: Plot No. 11, Tulip Road, DHA-II Islamabad / Rawalpindi Hangar</div>
                <div>Helpline: 051-6101808 · operations@agrihawk.com</div>
              </div>
            </div>

            {/* Col 2: Aerial Solutions */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm">Aerial Solutions</h4>
              <ul className="space-y-2 text-stone-400">
                <li><button onClick={() => onEnterDashboard('crop-monitoring')} className="hover:text-amber-400 transition cursor-pointer text-left">NDVI Health Mapping</button></li>
                <li><button onClick={() => onEnterDashboard('precision-spraying')} className="hover:text-amber-400 transition cursor-pointer text-left">Precision Micro-Spraying</button></li>
                <li><button onClick={() => onEnterDashboard('disease-detection')} className="hover:text-amber-400 transition cursor-pointer text-left">AI Crop Diagnostics</button></li>
                <li><button onClick={() => onEnterDashboard('farm-mapping')} className="hover:text-amber-400 transition cursor-pointer text-left">RTK 3D Topography</button></li>
                <li><button onClick={() => onEnterDashboard('booking')} className="hover:text-amber-400 transition cursor-pointer text-left">Commercial Fleet Booking</button></li>
              </ul>
            </div>

            {/* Col 3: Farm Operations OS */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm">Farm Operations OS</h4>
              <ul className="space-y-2 text-stone-400">
                <li><button onClick={() => onEnterDashboard('dashboard')} className="hover:text-emerald-400 transition cursor-pointer text-left text-emerald-300 font-semibold">Executive Dashboard</button></li>
                <li><button onClick={() => onEnterDashboard('farms')} className="hover:text-amber-400 transition cursor-pointer text-left">My Registered Farms</button></li>
                <li><button onClick={() => onEnterDashboard('drone-missions')} className="hover:text-amber-400 transition cursor-pointer text-left">Active Drone Missions</button></li>
                <li><button onClick={() => onEnterDashboard('weather')} className="hover:text-amber-400 transition cursor-pointer text-left">Microclimate Weather</button></li>
                <li><button onClick={() => onEnterDashboard('analytics')} className="hover:text-amber-400 transition cursor-pointer text-left">Yield Analytics &amp; Reports</button></li>
              </ul>
            </div>

            {/* Col 4: Corporate Quick Connect */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm">Flight Operations</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Schedule a flight mission or launch the full farm intelligence suite.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => openConsultationWithService('Multispectral Crop Health (NDVI) Survey')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  Schedule Flight Mission
                </button>
                <button
                  onClick={() => onEnterDashboard('dashboard')}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Launch Farm OS</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              &copy; {new Date().getFullYear()} AI-AgriHawk Pro. All Rights Reserved. Smart Aerial Agriculture &amp; Farm Intelligence.
            </div>
            <div className="flex items-center gap-4">
              <span>Islamabad / Rawalpindi Hangar Base</span>
              <span>·</span>
              <span>Sub-Centimeter RTK Precision</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= 11. CONSULTATION / MISSION MODAL ================= */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        defaultService={consultationService}
      />

      {/* ================= 12. CINEMATIC VIDEO STORY MODAL ================= */}
      <VideoStoryModal
        isOpen={videoStoryOpen}
        onClose={() => setVideoStoryOpen(false)}
        initialChapter={videoStoryChapter}
        initialLanguage={videoStoryLanguage}
        onLaunchDashboard={onEnterDashboard}
      />
    </div>
  );
}
