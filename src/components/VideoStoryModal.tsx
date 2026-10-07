import { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldAlert,
  Activity,
  Droplets,
  Radio,
  Sparkles,
  Languages,
} from 'lucide-react';
import { cinematicAudio } from '../utils/cinematicAudioEngine';

interface VideoStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapter?: number;
  initialLanguage?: 'en' | 'ur';
  onLaunchDashboard: (view?: string) => void;
}

interface Scene {
  id: number;
  actTitleEn: string;
  actTitleUr: string;
  sceneNameEn: string;
  sceneNameUr: string;
  timestamp: string;
  image: string;
  badgeEn: string;
  badgeUr: string;
  voiceType: 'malik' | 'narrator' | 'dispatch';
  spokenTextEn: string;
  spokenTextUr: string;
  subtitlesEn: string;
  subtitlesUr: string;
  hudType: 'malik' | 'scan' | 'spray' | 'controller';
  telemetryEn: { label: string; value: string }[];
  telemetryUr: { label: string; value: string }[];
}

export function VideoStoryModal({
  isOpen,
  onClose,
  initialChapter = 0,
  initialLanguage = 'ur',
  onLaunchDashboard,
}: VideoStoryModalProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(initialChapter);
  const [language, setLanguage] = useState<'en' | 'ur'>(initialLanguage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scanLineY, setScanLineY] = useState(25);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scenes: Scene[] = [
    {
      id: 0,
      actTitleEn: 'ACT I · THE STRUGGLE AND THE THREAT',
      actTitleUr: 'پہلا حصہ · جدوجہد اور خطرہ',
      sceneNameEn: 'Malik’s Heritage & Rising Crisis',
      sceneNameUr: 'ملک محمد طارق کا ورثہ اور محنت کی مشکلات',
      timestamp: '0:00 - 0:32',
      image: '/farmer-malik.jpg',
      badgeEn: 'Traditional Agriculture Reality',
      badgeUr: 'روایتی کاشتکاری کی حقیقت',
      voiceType: 'malik',
      spokenTextEn:
        'For generations, we have poured our sweat into this soil. But the land is getting harder to watch. Labor costs are rising, and the work is backbreaking. Manual inspections are slow—often pests and diseases are discovered only after the damage is done. And the workload is overwhelming.',
      spokenTextUr:
        'ہم نے نسلوں سے اس مٹی میں اپنا پسینہ بہایا ہے۔ لیکن اب اس زمین کی دیکھ بھال مشکل ہوتی جا رہی ہے۔ مزدوروں کی اجرت بڑھ رہی ہے اور کام کمر توڑ ہے۔ دستی معائنہ بہت سست ہے، کیڑے اور بیماریاں اکثر نقصان ہونے کے بعد نظر آتے ہیں۔ اور بوجھ ناقابل برداشت ہے۔',
      subtitlesEn:
        '“For generations, we’ve poured our sweat into this soil. But the land is getting harder to watch. Labor costs are rising, and the work is backbreaking. Manual inspections are slow—often pests and diseases are discovered only after the damage is done.”',
      subtitlesUr:
        '”ہم نے نسلوں سے اس مٹی میں اپنا پسینہ بہایا ہے۔ لیکن اب اس زمین کی دیکھ بھال مشکل ہوتی جا رہی ہے۔ مزدوری بڑھ رہی ہے اور کام کمر توڑ ہے۔ دستی معائنہ سست ہے، کیڑے اور بیماریاں اکثر نقصان کے بعد نظر آتے ہیں۔“',
      hudType: 'malik',
      telemetryEn: [
        { label: 'Manual Scouting Time', value: '5 Days / 100 Ac' },
        { label: 'Chemical Runoff Loss', value: '42% Wasted' },
        { label: 'Farm Heat Index', value: '43°C High' },
      ],
      telemetryUr: [
        { label: 'دستی نگرانی کا وقت', value: '5 دن / 100 ایکڑ' },
        { label: 'کیمیکل کا ضیاع', value: '42% ضائع' },
        { label: 'گرمی کی شدت', value: '43°C شدید' },
      ],
    },
    {
      id: 1,
      actTitleEn: 'ACT II · THE BACKBONE OF PAKISTAN',
      actTitleUr: 'دوسرا حصہ · پاکستان کی ریڑھ کی ہڈی',
      sceneNameEn: 'Pest Invasions & Labor Scarcity',
      sceneNameUr: 'کیڑوں کا حملہ اور مزدوروں کی قلت',
      timestamp: '0:32 - 0:58',
      image: '/farmer-malik.jpg',
      badgeEn: 'Vulnerability to Pathogens',
      badgeUr: 'فصلوں کی نازک صورتحال',
      voiceType: 'narrator',
      spokenTextEn:
        'Agriculture is the backbone of Pakistan. A proud tradition passed down through generations. But today, challenges are growing. Labor is scarce. Unseen whitefly swarms and fungal rust attack wheat, cotton, and citrus before human eyes notice.',
      spokenTextUr:
        'زراعت پاکستان کی ریڑھ کی ہڈی ہے۔ ایک فخریہ روایت جو نسل در نسل چلی آرہی ہے۔ لیکن آج مشکلات بڑھ رہی ہیں۔ مزدور کم ہیں، اور سفید مکھی اور فنگل رسٹ جیسی پوشیدہ بیماریاں کسانوں کی آنکھوں کے سامنے فصلیں تباہ کر دیتی ہیں۔',
      subtitlesEn:
        '“Agriculture is the backbone of Pakistan. A proud tradition passed down through generations. But today, challenges are growing. Labor is scarce, and unseen crop diseases threaten entire harvests.”',
      subtitlesUr:
        '”زراعت پاکستان کی ریڑھ کی ہڈی ہے۔ ایک فخریہ روایت جو نسل در نسل چلی آرہی ہے۔ لیکن آج مزدوروں کی قلت اور فصلوں کی پوشیدہ بیماریاں پوری فصل کو خطرے میں ڈال دیتی ہیں۔“',
      hudType: 'malik',
      telemetryEn: [
        { label: 'Crop Vulnerability', value: 'High (Wheat/Cotton)' },
        { label: 'Whitefly Threat Index', value: 'Severe Warning' },
        { label: 'Pesticide Exposure', value: 'Manual Knapsack' },
      ],
      telemetryUr: [
        { label: 'فصل کا خطرہ', value: 'شدید (گندم/کپاس)' },
        { label: 'سفید مکھی کا خطرہ', value: 'ریڈ الرٹ' },
        { label: 'زہر کا براہ راست اثر', value: 'دستی اسپرے پمپ' },
      ],
    },
    {
      id: 2,
      actTitleEn: 'ACT III · AERIAL AWAKENING',
      actTitleUr: 'تیسرا حصہ · فضا میں انقلاب',
      sceneNameEn: 'Autonomous RTK Drone Lift-Off',
      sceneNameUr: 'خودکار آر ٹی کے ڈرون کی پرواز',
      timestamp: '0:58 - 1:30',
      image: '/hero-drone.jpg',
      badgeEn: 'Autonomous Aerial Robotics',
      badgeUr: 'خودکار فضائی روبوٹکس',
      voiceType: 'dispatch',
      spokenTextEn:
        'Meet the future of farming. AgriHawk Pro takes flight. Autonomous drones scan your fields with sub-centimeter precision, tracking crop contours, elevation gradients, and moisture levels across hundreds of acres.',
      spokenTextUr:
        'کاشتکاری کا نیا مستقبل دیکھیں۔ ایگری ہاک پرو اب میدان میں ہے۔ خودکار ڈرونز سینٹی میٹر کی درستگی سے آپ کے کھیتوں کو اسکین کرتے ہیں، زمین کی اونچ نیچ اور نمی کا جائزہ لیتے ہیں، اور ساٹھ ایکڑ فی گھنٹہ کی رفتار سے نگرانی کرتے ہیں۔',
      subtitlesEn:
        '“Meet the future of farming: AgriHawk Pro scans your fields with precision, spotting disease and spraying with targeted accuracy. Put AI to work for your farm.”',
      subtitlesUr:
        '”کاشتکاری کا نیا مستقبل: ایگری ہاک پرو مکمل درستگی کے ساتھ کھیتوں کو اسکین کرتا ہے، بیماریوں کی نشاندہی کرتا ہے اور ہدف بنا کر اسپرے کرتا ہے۔ مصنوعی ذہانت کو اپنے کھیت کے کام لگائیں۔“',
      hudType: 'scan',
      telemetryEn: [
        { label: 'Flight Speed', value: '101 m/min' },
        { label: 'Altitude AGL', value: '15.4 Meters' },
        { label: 'Coverage Capacity', value: '60 Acres/hr' },
      ],
      telemetryUr: [
        { label: 'پرواز کی رفتار', value: '101 میٹر / منٹ' },
        { label: 'بلندی', value: '15.4 میٹر' },
        { label: 'اسکیننگ رقبہ', value: '60 ایکڑ / گھنٹہ' },
      ],
    },
    {
      id: 3,
      actTitleEn: 'ACT IV · SURGICAL AI PATHOLOGY',
      actTitleUr: 'چوتھا حصہ · مصنوعی ذہانت سے بیماریوں کی شناخت',
      sceneNameEn: 'Deep Computer Vision Bounding Boxes',
      sceneNameUr: 'ڈیپ لرننگ کیمرہ اور ریڈ باکسز',
      timestamp: '1:30 - 2:05',
      image: '/disease-scan.jpg',
      badgeEn: 'Edge Neural Network Diagnostics',
      badgeUr: 'نیورل نیٹ ورک تشخیصی نظام',
      voiceType: 'narrator',
      spokenTextEn:
        'High-resolution multispectral cameras feed live imagery into deep convolutional neural networks. Early-stage yellow rust, leaf blight, and stem borers are instantly isolated with ninety-five percent confidence, georeferenced down to the exact plant.',
      spokenTextUr:
        'ہائی ریزولوشن ملٹی اسپیکٹرل کیمرے مصنوعی ذہانت کے نیورل نیٹ ورکس کے ذریعے فصل کی تصاویر کا تجزیہ کرتے ہیں۔ پیلی زنگ، پتوں کے جھلاؤ اور تنے کے کیڑوں کو پچانوے فیصد درستگی کے ساتھ فوری طور پر شناخت کر لیا جاتا ہے۔',
      subtitlesEn:
        '“Deep neural computer vision isolates pathogens down to individual crop leaves with 94.8% confidence. Real-time bounding boxes pinpoint exact infection hotspots.”',
      subtitlesUr:
        '”مصنوعی ذہانت 94.8 فیصد تصدیق شدہ درستگی کے ساتھ پتوں پر بیماریوں کی جراحی جیسی شناخت کرتی ہے۔ ریئل ٹائم باؤنڈنگ باکسز بیماری کے مرکز کی نشاندہی کرتے ہیں۔“',
      hudType: 'scan',
      telemetryEn: [
        { label: 'Pathology Confidence', value: '94.8% Verified' },
        { label: 'Hotspot Coordinates', value: '33.6844° N, 73.0479° E' },
        { label: 'Inference Latency', value: '38 ms' },
      ],
      telemetryUr: [
        { label: 'تشخیصی درستگی', value: '94.8% تصدیق شدہ' },
        { label: 'مقام کے نقاط (GPS)', value: '33.6844° N, 73.0479° E' },
        { label: 'پراسیسنگ رفتار', value: '38 ملی سیکنڈ' },
      ],
    },
    {
      id: 4,
      actTitleEn: 'ACT V · TARGETED MICRO-SPRAYING & ZERO LOSS',
      actTitleUr: 'پانچواں حصہ · نشانے پر اسپرے اور بچت',
      sceneNameEn: 'Centrifugal Atomized Precision Dosing',
      sceneNameUr: 'سینٹری فیوگل اسپرے اور کیمیکل بچت',
      timestamp: '2:05 - 2:38',
      image: '/hero-drone.jpg',
      badgeEn: 'Variable-Rate Downwash Spraying',
      badgeUr: 'ہوائی دباؤ کے ساتھ اسپرے',
      voiceType: 'dispatch',
      spokenTextEn:
        'Target identified. Centrifugal atomizers release microscopic droplets under powerful propeller downwash, coating both sides of infected leaves while saving up to thirty-five percent of chemical spray and ninety percent of water.',
      spokenTextUr:
        'ہدف کی نشاندہی کے بعد، سینٹری فیوگل اسپرے کے باریک قطرے ڈرون کے پنکھے کے زور دار دباؤ کے ساتھ پتے کے نیچے اور تنے تک پہنچتے ہیں۔ اس سے پینتیس فیصد دوائی اور نوے فیصد پانی کی بچت ہوتی ہے بغیر پودوں کو کچلے۔',
      subtitlesEn:
        '“Centrifugal atomizers deliver precision micro-droplets directly into the crop canopy. Zero soil compaction, zero crop trampling, and over 35% reduction in pesticide waste.”',
      subtitlesUr:
        '”سینٹری فیوگل اسپرے باریک ترین قطرے پودے کے اندر تک پہنچاتا ہے۔ زمین کو کوئی نقصان نہیں، پودے کچلے بغیر 35 فیصد سے زائد کیمیکل کی بچت۔“',
      hudType: 'spray',
      telemetryEn: [
        { label: 'Chemical Saved', value: '35.4% Waste Cut' },
        { label: 'Water Conserved', value: '90% Saved' },
        { label: 'Downwash Penetration', value: '98.2%' },
      ],
      telemetryUr: [
        { label: 'کیمیکل کی بچت', value: '35.4% کم خرچ' },
        { label: 'پانی کی بچت', value: '90% محفوظ' },
        { label: 'پودے میں نفوذ', value: '98.2%' },
      ],
    },
    {
      id: 5,
      actTitleEn: 'ACT VI · THE MODERN FARMER’S COCKPIT',
      actTitleUr: 'چھٹا حصہ · جدید کسان کا ڈیجیٹل کنٹرول روم',
      sceneNameEn: 'Digital Empowerment & Real-Time Sync',
      sceneNameUr: 'کلاؤڈ ڈیٹا اور کسان کی خودمختاری',
      timestamp: '2:38 - 3:00',
      image: '/drone-controller.jpg',
      badgeEn: 'Field Command & Cloud Records',
      badgeUr: 'کھیت سے کلاؤڈ کنٹرول',
      voiceType: 'narrator',
      spokenTextEn:
        'From the palm of their hand, farmers now command aerial robotics. Real-time vegetation health, battery telemetry, and yield forecasts sync to cloud records. Agriculture is no longer backbreaking toil—it is precision intelligence. Welcome to AgriHawk Pro.',
      spokenTextUr:
        'اپنے ہاتھ میں موجود ٹیبلیٹ سے کسان اب فضائی روبوٹکس کو کنٹرول کرتے ہیں۔ فصل کی صحت، بیٹری اور موسم کی معلومات فورا کلاؤڈ ڈیٹا بیس میں محفوظ ہوتی ہیں۔ زراعت اب مشقت نہیں، ذہانت اور خود مختاری ہے۔ ایگری ہاک پرو میں خوش آمدید۔',
      subtitlesEn:
        '“Farmers are no longer laborers battling the elements—they are data-driven operations commanders steering aerial robotics. Welcome to AgriHawk Pro.”',
      subtitlesUr:
        '”کسان اب موسموں کے رحم و کرم پر نہیں، بلکہ جدید فضائی روبوٹکس کے کمانڈر ہیں۔ زراعت اب مشقت نہیں بلکہ خود مختاری ہے۔ ایگری ہاک پرو میں خوش آمدید۔“',
      hudType: 'controller',
      telemetryEn: [
        { label: 'Live Data Link', value: '5.8 GHz AES-256' },
        { label: 'Battery Telemetry', value: '88% Health' },
        { label: 'Cloud Database', value: 'Firestore Synced' },
      ],
      telemetryUr: [
        { label: 'لائیو ڈیٹا لنک', value: '5.8 GHz محفوظ' },
        { label: 'بیٹری چارج', value: '88% صحت مند' },
        { label: 'کلاؤڈ ریکارڈ', value: 'فوری ہم آہنگ' },
      ],
    },
  ];

  const currentScene = scenes[currentSceneIndex];

  // Play voiceover & background music for active scene in selected language
  const playSceneAudio = (index: number, activeLang: 'en' | 'ur') => {
    const scene = scenes[index];
    if (!scene) return;

    if (!isMuted) {
      cinematicAudio.startCinematicScore();
    }

    if (voiceEnabled && !isMuted) {
      const textToSpeak = activeLang === 'ur' ? scene.spokenTextUr : scene.spokenTextEn;

      cinematicAudio.speakText(textToSpeak, {
        lang: activeLang,
        voiceType: scene.voiceType,
        onEnd: () => {
          // If video is actively playing, automatically advance to next scene!
          if (isPlaying) {
            sceneTimerRef.current = setTimeout(() => {
              if (index < scenes.length - 1) {
                setCurrentSceneIndex(index + 1);
              } else {
                // End of film: pause
                setIsPlaying(false);
              }
            }, 800);
          }
        },
      });
    } else {
      // If voice is disabled/muted, advance scene via visual timer
      if (isPlaying) {
        sceneTimerRef.current = setTimeout(() => {
          if (index < scenes.length - 1) {
            setCurrentSceneIndex(index + 1);
          } else {
            setIsPlaying(false);
          }
        }, 12000);
      }
    }
  };

  // Trigger audio whenever scene changes or play state toggles
  useEffect(() => {
    if (!isOpen) {
      cinematicAudio.stopSpeech();
      cinematicAudio.stopCinematicScore();
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      return;
    }

    if (isPlaying) {
      playSceneAudio(currentSceneIndex, language);
    } else {
      cinematicAudio.pause();
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    }

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    };
  }, [isOpen, isPlaying, currentSceneIndex, voiceEnabled, isMuted, language]);

  // Initial startup when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSceneIndex(initialChapter);
      if (initialLanguage) {
        setLanguage(initialLanguage);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      cinematicAudio.cleanup();
    }
  }, [isOpen, initialChapter, initialLanguage]);

  // Animated laser scan line simulation
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setScanLineY((y) => (y > 78 ? 18 : y + 3));
    }, 120);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    cinematicAudio.toggleMute(nextMuted);
    if (!nextMuted && isPlaying) {
      playSceneAudio(currentSceneIndex, language);
    }
  };

  const handleLanguageChange = (newLang: 'en' | 'ur') => {
    if (newLang === language) return;
    setLanguage(newLang);
    cinematicAudio.stopSpeech();
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    if (isPlaying) {
      // Small tick to ensure previous utterance cancels cleanly
      setTimeout(() => {
        playSceneAudio(currentSceneIndex, newLang);
      }, 100);
    }
  };

  const jumpToScene = (index: number) => {
    cinematicAudio.stopSpeech();
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    setCurrentSceneIndex(index);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  const isUr = language === 'ur';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl bg-[#070f20] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl text-white my-auto flex flex-col max-h-[96vh]"
      >
        {/* ================= TOP THEATRE HEADER ================= */}
        <div className="px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="AI-AgriHawk Pro Emblem"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400/50 shadow-md bg-white shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-sm sm:text-base tracking-tight text-white">
                  AgriHawk Pro
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  {isUr ? 'مکمل دستاویزی فلم' : 'Official Film · Full Movie'}
                </span>
                {isPlaying && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{isUr ? 'اردو وائس فعال' : 'AI Voice Active'}</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-400 block truncate max-w-xs sm:max-w-md">
                {isUr
                  ? 'پاکستان کی زراعت کا المیہ، کسان کی محنت اور جدید فضائی ڈرونز کا انقلاب'
                  : 'The Story of Farming in Pakistan: Tradition, Labor Threat & Autonomous Aerial Rescue'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Buttons (Urdu vs English) */}
            <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/15 shadow-inner">
              <button
                onClick={() => handleLanguageChange('ur')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  language === 'ur'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="اردو میں سنیں اور دیکھیں"
              >
                <span>🇵🇰</span>
                <span>اردو (Urdu)</span>
              </button>

              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-400 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Listen & Watch in English"
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>

            {/* Audio Wave Visualizer Indicator */}
            {isPlaying && !isMuted && voiceEnabled && (
              <div className="hidden lg:flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-amber-300 text-xs font-mono">
                <span className="h-2 w-0.5 bg-amber-400 animate-pulse"></span>
                <span className="h-4 w-0.5 bg-amber-400 animate-pulse delay-75"></span>
                <span className="h-3 w-0.5 bg-amber-400 animate-pulse delay-150"></span>
                <span className="h-5 w-0.5 bg-emerald-400 animate-pulse delay-100"></span>
                <span className="h-2 w-0.5 bg-amber-400 animate-pulse"></span>
                <span className="text-[10px] text-stone-300 ml-1.5 font-sans">
                  {isUr ? 'آواز: اے آئی' : 'Voice: Active'}
                </span>
              </div>
            )}

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                voiceEnabled
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
                  : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10'
              }`}
              title={voiceEnabled ? 'Disable Voice Narration' : 'Enable Voice Narration'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isUr ? 'آواز' : 'AI Voice'}</span>
            </button>

            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                cinematicAudio.stopSpeech();
                cinematicAudio.stopCinematicScore();
                onClose();
              }}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-rose-500/20 transition cursor-pointer"
              title="Close Movie Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= CINEMATIC VIDEO CANVAS ================= */}
        <div className="relative aspect-video max-h-[56vh] sm:max-h-[60vh] w-full bg-black overflow-hidden flex items-center justify-center select-none group">
          {/* Animated Pan/Zoom Camera Effect (Ken Burns) */}
          <img
            key={currentScene.id}
            src={currentScene.image}
            alt={currentScene.sceneNameEn}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center filter brightness-95 transition-all duration-1000 transform ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />

          {/* Film Grain & Cinematic Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070f20] via-black/25 to-black/60 pointer-events-none"></div>

          {/* Scene Act Indicator Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/70 border border-white/20 text-[10px] font-mono font-bold tracking-widest text-amber-300 backdrop-blur-md uppercase shadow-md inline-flex items-center gap-1.5 w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{isUr ? currentScene.actTitleUr : currentScene.actTitleEn}</span>
            </span>
            <span className="text-white text-xs sm:text-sm font-serif font-bold drop-shadow-md">
              {isUr ? currentScene.sceneNameUr : currentScene.sceneNameEn}
            </span>
          </div>

          <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/70 border border-emerald-400/30 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
              {isUr ? 'اردو آڈیو 🇵🇰' : 'English Audio 🇬🇧'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[11px] font-mono text-stone-200 backdrop-blur-md">
              {currentScene.timestamp}
            </span>
          </div>

          {/* Interactive Scanning HUD Overlay for Drone & Pathology Scenes */}
          {currentScene.hudType === 'scan' && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Laser Grid Scan Line */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] transition-all duration-150"
                style={{ top: `${scanLineY}%` }}
              ></div>

              {/* Real-time Pathology AI Bounding Boxes */}
              <div className="absolute top-[26%] left-[22%] border-2 border-rose-500 bg-rose-500/20 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-rose-200 animate-pulse flex items-center gap-1.5 shadow-xl backdrop-blur-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>
                  {isUr
                    ? 'پیلی زنگ (PUCCINIA STRIIFORMIS) · 96.4% تصدیق شدہ'
                    : 'YELLOW RUST (PUCCINIA STRIIFORMIS) · 96.4%'}
                </span>
              </div>

              <div className="absolute top-[55%] right-[20%] border-2 border-amber-400 bg-amber-400/20 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-amber-200 flex items-center gap-1.5 shadow-xl backdrop-blur-xs">
                <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isUr ? 'پتوں کی خرابی زون بی' : 'NDVI CHLOROPHYLL STRESS · ZONE B'}</span>
              </div>
            </div>
          )}

          {currentScene.hudType === 'spray' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 bg-blue-500/20 border border-blue-400/40 px-4 py-2 rounded-2xl backdrop-blur-md text-blue-200 text-xs font-mono flex items-center gap-2 shadow-xl">
                <Droplets className="w-4 h-4 text-blue-400 animate-bounce" />
                <span>
                  {isUr
                    ? 'سینٹری فیوگل اسپرے: 120 مائیکرون قطرے فعال'
                    : 'CENTRIFUGAL ATOMIZERS: 120-MICRON DROPLET DISPERSAL ACTIVE'}
                </span>
              </div>
            </div>
          )}

          {currentScene.hudType === 'controller' && (
            <div className="absolute top-16 left-4 p-3 rounded-2xl bg-black/70 border border-emerald-500/40 backdrop-blur-md pointer-events-none font-mono text-[11px] text-emerald-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{isUr ? 'لائیو ڈرون ڈیٹا لنک: فعال' : 'GCS STREAM: 5.8 GHz TELEMETRY'}</span>
              </div>
              <div className="text-white">
                {isUr ? 'ڈرون کی اونچائی: 15.4 میٹر | رفتار: 101 میٹر/منٹ' : 'UAV ALTITUDE: 15.4m | SPEED: 101 m/min'}
              </div>
              <div className="text-stone-300">
                {isUr ? 'بیٹری: 88% | سیٹلائٹ سگنل: 26 فکسڈ' : 'BATTERY: 88% | SATELLITES: 26 RTK-FIXED'}
              </div>
            </div>
          )}

          {/* Central Play/Pause Big Trigger */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-2xl hover:scale-110 transition cursor-pointer border-2 border-white/50 backdrop-blur-xs"
              title={isUr ? 'فلم شروع کریں' : 'Play Video'}
            >
              <Play className="w-8 h-8 fill-stone-950 ml-1" />
            </button>
          )}

          {/* Subtitles & Closed Captions Bar with Bilingual Support */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-black/85 border border-white/15 p-3.5 sm:p-4 rounded-2xl backdrop-blur-lg">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-pulse"></div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                  <span className="text-amber-400 font-mono">
                    {isUr ? (
                      currentScene.voiceType === 'malik' ? (
                        '🎙️ ملک محمد طارق (روایتی کسان، پاکستان)'
                      ) : currentScene.voiceType === 'dispatch' ? (
                        '🎙️ ایگری ہاک مشن کنٹرول (اسلام آباد)'
                      ) : (
                        '🎙️ سرکاری اردو دستاویزی آواز'
                      )
                    ) : currentScene.voiceType === 'malik' ? (
                      '🎙️ Malik Muhammad Tariq (Traditional Farmer)'
                    ) : currentScene.voiceType === 'dispatch' ? (
                      '🎙️ AgriHawk Mission Control'
                    ) : (
                      '🎙️ Official AI Voice Narrator'
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono">{isUr ? 'اردو ترجمہ' : 'English CC'}</span>
                    <button
                      onClick={() => handleLanguageChange(isUr ? 'en' : 'ur')}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-stone-300 font-sans cursor-pointer"
                    >
                      {isUr ? 'Switch to English' : 'اردو میں سنیں'}
                    </button>
                  </div>
                </div>

                {/* Primary Subtitle */}
                <p
                  dir={isUr ? 'rtl' : 'ltr'}
                  className={`text-xs sm:text-sm text-stone-100 font-serif leading-relaxed ${
                    isUr ? 'text-right font-medium text-amber-100' : 'text-left italic'
                  }`}
                >
                  {isUr ? currentScene.subtitlesUr : currentScene.subtitlesEn}
                </p>

                {/* Secondary Subtitle Preview (Bilingual Learning feature) */}
                <p
                  dir={isUr ? 'ltr' : 'rtl'}
                  className={`text-[10px] sm:text-[11px] text-stone-400 ${
                    isUr ? 'text-left italic font-sans' : 'text-right text-stone-300'
                  }`}
                >
                  {isUr ? currentScene.subtitlesEn : currentScene.subtitlesUr}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MASTER TIMELINE SCRUBBER & ACT SELECTOR ================= */}
        <div className="p-4 sm:p-5 bg-white/5 space-y-4 shrink-0">
          {/* Master Timeline Scrubber with 6 Segmented Act Bars */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-6 gap-1.5">
              {scenes.map((scene, idx) => {
                const isPast = idx < currentSceneIndex;
                const isCurrent = idx === currentSceneIndex;
                return (
                  <button
                    key={scene.id}
                    onClick={() => jumpToScene(idx)}
                    className="group relative h-2.5 rounded-full bg-white/10 overflow-hidden cursor-pointer transition-all hover:h-3"
                    title={`Jump to Act ${idx + 1}: ${isUr ? scene.sceneNameUr : scene.sceneNameEn}`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPast
                          ? 'bg-amber-400 w-full'
                          : isCurrent
                          ? 'bg-gradient-to-r from-amber-400 to-emerald-400 w-full'
                          : 'w-0'
                      }`}
                    ></div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span className="text-amber-300 font-sans font-bold">
                {isUr
                  ? `حصہ ${currentSceneIndex + 1} از 6: ${currentScene.sceneNameUr}`
                  : `Act ${currentSceneIndex + 1} of 6: ${currentScene.sceneNameEn}`}
              </span>
              <span>{currentScene.timestamp} ({isUr ? 'کل وقت: 3 منٹ' : 'Full Film: 3:00'})</span>
            </div>
          </div>

          {/* Master Playback Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
                <span>
                  {isPlaying
                    ? isUr
                      ? 'روکیں (Pause)'
                      : 'Pause Film'
                    : isUr
                    ? 'چلائیں (Play Film)'
                    : 'Play Film'}
                </span>
              </button>

              <button
                onClick={() => jumpToScene(0)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                title={isUr ? 'شروع سے دوبارہ چلائیں' : 'Restart Film from Act 1'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-white/15 text-xs text-stone-300">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[11px]">
                  {isUr ? 'اردو وائس اوور اور موسیقی فعال' : 'Cinematic Audio + AI Voiceover Synced'}
                </span>
              </div>
            </div>

            {/* Quick Act Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(idx)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    currentSceneIndex === idx
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'bg-white/10 text-stone-300 hover:bg-white/20'
                  }`}
                >
                  {isUr ? `حصہ 0${idx + 1}` : `Act 0${idx + 1}`}
                </button>
              ))}
            </div>

            {/* Launch in OS Button */}
            <button
              onClick={() => {
                cinematicAudio.stopSpeech();
                cinematicAudio.stopCinematicScore();
                onClose();
                onLaunchDashboard('drone-missions');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 ml-auto"
            >
              <span>{isUr ? 'ڈرون مشن شروع کریں' : 'Launch Mission in OS'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live Telemetry Data Feed for the Current Act */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
            {(isUr ? currentScene.telemetryUr : currentScene.telemetryEn).map((item, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
                <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-semibold tracking-wider">
                  {item.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
