import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth, testConnection } from '../firebase';
import { addFarm, addDroneMission, addNotification } from '../services/firestoreService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signInGuest: () => Promise<void>;
  signInEmail: (e: string, p: string) => Promise<void>;
  signUpEmail: (e: string, p: string, name: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setIsAuthReady(true);

      // Seed starter records if this is a newly authenticated session
      if (currentUser) {
        try {
          const seededKey = `agrihawk_seeded_${currentUser.uid}`;
          if (!localStorage.getItem(seededKey)) {
            localStorage.setItem(seededKey, 'true');
            // Seed a starter farm and starter mission for immediate engagement
            await addFarm({
              userId: currentUser.uid,
              name: 'Main Farm (Rawalpindi)',
              location: 'Rawalpindi, Punjab',
              size: 250,
              crop: 'Wheat',
              health: 87,
              status: 'Active',
              fields: 4,
              mapStatus: 'Mapped',
            });
            await addDroneMission({
              userId: currentUser.uid,
              missionName: 'Main Farm Crop Scan',
              missionType: 'Crop Monitoring',
              farm: 'Main Farm (Rawalpindi)',
              crop: 'Wheat',
              area: 18.4,
              areaUnit: 'Acres',
              altitude: 42,
              speed: 5.8,
              battery: 76,
              status: 'Active',
              date: new Date().toISOString().split('T')[0],
            });
            await addNotification({
              userId: currentUser.uid,
              type: 'drone',
              title: 'Welcome to AgriHawk Pro',
              message: 'Your smart agricultural drone system is connected to Firebase and operational.',
              timeAgo: 'Just now',
              read: false,
            });
          }
        } catch {
          // ignore seeding error if permission rules or quota prevents it
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInGuest = async () => {
    const res = await signInAnonymously(auth);
    if (res.user && !res.user.displayName) {
      await updateProfile(res.user, { displayName: 'Verified Demo Farmer' });
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user && name) {
      await updateProfile(res.user, { displayName: name });
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthReady,
        signInWithGoogle,
        signInGuest,
        signInEmail,
        signUpEmail,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
