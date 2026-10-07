export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  size: number;
  crop: string;
  health: number;
  status: string;
  fields: number;
  mapStatus?: string;
  createdAt?: string;
}

export interface FarmMapping {
  id: string;
  userId: string;
  farmId?: string;
  farmName: string;
  area: number;
  areaUnit: string;
  fields: number;
  status: string;
  createdAt?: string;
}

export interface CropMonitoringScan {
  id: string;
  userId: string;
  farmId?: string;
  farmName: string;
  crop: string;
  monitoringDate: string;
  health: number;
  soilMoisture?: number;
  cropStress?: number;
  growthProgress?: number;
  status: string;
  scanType: string;
  createdAt?: string;
}

export interface DiseaseDetection {
  id: string;
  userId: string;
  farmName: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: string;
  areaAffected: string;
  imageURL?: string;
  imageName?: string;
  status: string;
  createdAt?: string;
}

export interface DroneMission {
  id: string;
  userId: string;
  missionName: string;
  missionType: string;
  farm: string;
  crop?: string;
  area: number;
  areaUnit: string;
  altitude: number;
  speed: number;
  battery: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
  date: string;
  createdAt?: string;
}

export interface SprayingMission {
  id: string;
  userId: string;
  missionName: string;
  farm: string;
  crop: string;
  sprayType?: string;
  treatment: string;
  applicationRate: string;
  area: number;
  areaUnit: string;
  estimatedChemical: string;
  duration?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  date: string;
  createdAt?: string;
}

export interface WeatherData {
  id?: string;
  userId?: string;
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  condition: string;
  uvIndex?: number;
  recordedAt: string;
  advisory?: string;
}

export interface AnalyticsReport {
  id: string;
  userId: string;
  reportName: string;
  period: string;
  farmsMonitored: number;
  totalArea: number;
  averageCropHealth: number;
  farmProductivity: number;
  diseaseDetections: number;
  droneMissions: number;
  sprayingMissions: number;
  status: string;
  createdAt?: string;
}

export interface ReportItem {
  id: string;
  userId: string;
  reportName: string;
  reportType: string;
  farm: string;
  crop: string;
  area: number;
  areaUnit: string;
  cropHealth: number;
  diseaseStatus: string;
  monitoringStatus: string;
  generatedBy: string;
  status: string;
  date: string;
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'disease' | 'drone' | 'weather' | 'spray' | 'battery' | 'success';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  createdAt?: string;
}

export interface BookingRecord {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  farm: string;
  fieldCategory: string;
  area: number;
  unit: 'kanal' | 'acre';
  areaInKanal: number;
  service: string;
  serviceCode: string;
  ratePerKanal: number;
  totalPrice: number;
  date: string;
  time: string;
  notes: string;
  status: string;
  createdAt?: string;
}

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  organization?: string;
  message: string;
  status?: string;
  createdAt?: any;
}

export interface ConsultationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  serviceCategory: string;
  participantCount?: number;
  preferredDate?: string;
  requirements?: string;
  status?: string;
  createdAt?: any;
}
