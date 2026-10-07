import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import type {
  Farm,
  FarmMapping,
  CropMonitoringScan,
  DiseaseDetection,
  DroneMission,
  SprayingMission,
  WeatherData,
  ReportItem,
  AnalyticsReport,
  BookingRecord,
  NotificationItem,
} from '../types';

// ================= FARMS =================
export async function addFarm(farm: Omit<Farm, 'id'>): Promise<string> {
  const path = 'farms';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...farm,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeFarms(userId: string, onUpdate: (farms: Farm[]) => void): () => void {
  const path = 'farms';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const farms: Farm[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Farm, 'id'>),
        }));
        onUpdate(farms);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function deleteFarm(id: string): Promise<void> {
  const path = `farms/${id}`;
  try {
    await deleteDoc(doc(db, 'farms', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= FARM MAPPINGS =================
export async function addFarmMapping(mapping: Omit<FarmMapping, 'id'>): Promise<string> {
  const path = 'farmMappings';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...mapping,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeFarmMappings(userId: string, onUpdate: (mappings: FarmMapping[]) => void): () => void {
  const path = 'farmMappings';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const mappings: FarmMapping[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<FarmMapping, 'id'>),
        }));
        onUpdate(mappings);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= CROP MONITORING =================
export async function addCropMonitoring(scan: Omit<CropMonitoringScan, 'id'>): Promise<string> {
  const path = 'cropMonitoring';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...scan,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeCropMonitoring(userId: string, onUpdate: (scans: CropMonitoringScan[]) => void): () => void {
  const path = 'cropMonitoring';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const scans: CropMonitoringScan[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<CropMonitoringScan, 'id'>),
        }));
        onUpdate(scans);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= DISEASE DETECTIONS =================
export async function addDiseaseDetection(detection: Omit<DiseaseDetection, 'id'>): Promise<string> {
  const path = 'diseaseDetections';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...detection,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeDiseaseDetections(
  userId: string,
  onUpdate: (items: DiseaseDetection[]) => void,
  onDocChange?: (changeType: 'added' | 'modified', item: DiseaseDetection) => void
): () => void {
  const path = 'diseaseDetections';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    let isInitialLoad = true;
    return onSnapshot(
      q,
      (snapshot) => {
        const items: DiseaseDetection[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<DiseaseDetection, 'id'>),
        }));
        onUpdate(items);

        if (!isInitialLoad && onDocChange) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const item: DiseaseDetection = {
                id: change.doc.id,
                ...(change.doc.data() as Omit<DiseaseDetection, 'id'>),
              };
              onDocChange('added', item);
            }
          });
        }
        isInitialLoad = false;
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= DRONE MISSIONS =================
export async function addDroneMission(mission: Omit<DroneMission, 'id'>): Promise<string> {
  const path = 'droneMissions';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...mission,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeDroneMissions(
  userId: string,
  onUpdate: (missions: DroneMission[]) => void,
  onDocChange?: (changeType: 'added' | 'modified', mission: DroneMission) => void
): () => void {
  const path = 'droneMissions';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    let isInitialLoad = true;
    return onSnapshot(
      q,
      (snapshot) => {
        const missions: DroneMission[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<DroneMission, 'id'>),
        }));
        onUpdate(missions);

        if (!isInitialLoad && onDocChange) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const mission: DroneMission = {
                id: change.doc.id,
                ...(change.doc.data() as Omit<DroneMission, 'id'>),
              };
              onDocChange(change.type, mission);
            }
          });
        }
        isInitialLoad = false;
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateDroneMissionStatus(id: string, status: DroneMission['status']): Promise<void> {
  const path = `droneMissions/${id}`;
  try {
    await updateDoc(doc(db, 'droneMissions', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ================= SPRAYING MISSIONS =================
export async function addSprayingMission(mission: Omit<SprayingMission, 'id'>): Promise<string> {
  const path = 'sprayingMissions';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...mission,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeSprayingMissions(userId: string, onUpdate: (missions: SprayingMission[]) => void): () => void {
  const path = 'sprayingMissions';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const missions: SprayingMission[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<SprayingMission, 'id'>),
        }));
        onUpdate(missions);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= WEATHER DATA =================
export async function addWeatherData(weather: Omit<WeatherData, 'id'>): Promise<string> {
  const path = 'weatherData';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...weather,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeWeatherData(userId: string, onUpdate: (data: WeatherData[]) => void): () => void {
  const path = 'weatherData';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const data: WeatherData[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<WeatherData, 'id'>),
        }));
        onUpdate(data);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= REPORTS =================
export async function addReport(report: Omit<ReportItem, 'id'>): Promise<string> {
  const path = 'reports';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...report,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeReports(userId: string, onUpdate: (reports: ReportItem[]) => void): () => void {
  const path = 'reports';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const reports: ReportItem[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ReportItem, 'id'>),
        }));
        onUpdate(reports);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= ANALYTICS REPORTS =================
export async function addAnalyticsReport(report: Omit<AnalyticsReport, 'id'>): Promise<string> {
  const path = 'analyticsReports';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...report,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeAnalyticsReports(userId: string, onUpdate: (reports: AnalyticsReport[]) => void): () => void {
  const path = 'analyticsReports';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const reports: AnalyticsReport[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<AnalyticsReport, 'id'>),
        }));
        onUpdate(reports);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= BOOKINGS =================
export async function addBooking(booking: Omit<BookingRecord, 'id'>): Promise<string> {
  const path = 'bookings';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...booking,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeBookings(userId: string, onUpdate: (bookings: BookingRecord[]) => void): () => void {
  const path = 'bookings';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const bookings: BookingRecord[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<BookingRecord, 'id'>),
        }));
        onUpdate(bookings);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= NOTIFICATIONS =================
export function subscribeNotifications(userId: string, onUpdate: (notifications: NotificationItem[]) => void): () => void {
  const path = 'notificationActions';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const notifications: NotificationItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userId: data.userId || userId,
            type: data.type || 'success',
            title: data.title || 'Notification',
            message: data.message || '',
            timeAgo: data.timeAgo || 'Just now',
            read: data.read || false,
          };
        });
        onUpdate(notifications);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function addNotification(notif: Omit<NotificationItem, 'id'>): Promise<string> {
  const path = 'notificationActions';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...notif,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const path = `notificationActions/${id}`;
  try {
    await updateDoc(doc(db, 'notificationActions', id), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function markAllNotificationsRead(ids: string[]): Promise<void> {
  try {
    await Promise.all(
      ids.map((id) => updateDoc(doc(db, 'notificationActions', id), { read: true }))
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'notificationActions');
  }
}

// ================= THE SIGNATURE IMPACT INQUIRIES & CONSULTATIONS =================
export async function addInquiry(inquiry: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  organization?: string;
}): Promise<string> {
  const path = 'inquiries';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...inquiry,
      status: 'New Lead',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeInquiries(onUpdate: (inquiries: any[]) => void): () => void {
  const path = 'inquiries';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        // Sort newest first
        list.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateInquiryStatus(id: string, status: string): Promise<void> {
  const path = `inquiries/${id}`;
  try {
    await updateDoc(doc(db, 'inquiries', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  const path = `inquiries/${id}`;
  try {
    await deleteDoc(doc(db, 'inquiries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function addConsultationBooking(booking: {
  name: string;
  email: string;
  phone: string;
  organization: string;
  serviceCategory: string;
  participantCount?: number;
  preferredDate?: string;
  requirements?: string;
}): Promise<string> {
  const path = 'consultations';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...booking,
      status: 'Pending Confirmation',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeConsultations(onUpdate: (consultations: any[]) => void): () => void {
  const path = 'consultations';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        list.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateConsultationStatus(id: string, status: string): Promise<void> {
  const path = `consultations/${id}`;
  try {
    await updateDoc(doc(db, 'consultations', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteConsultation(id: string): Promise<void> {
  const path = `consultations/${id}`;
  try {
    await deleteDoc(doc(db, 'consultations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}


