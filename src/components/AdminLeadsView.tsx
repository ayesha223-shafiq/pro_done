import { useState, useEffect } from 'react';
import {
  subscribeInquiries,
  subscribeConsultations,
  updateInquiryStatus,
  deleteInquiry,
  updateConsultationStatus,
  deleteConsultation,
  subscribeBookings,
} from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  UserCheck,
  Building2,
  ShieldAlert,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { BookingRecord } from '../types';

export function AdminLeadsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'consultations' | 'bookings'>('inquiries');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubInquiries = subscribeInquiries((data) => {
      setInquiries(data);
      setLoading(false);
    });

    const unsubConsultations = subscribeConsultations((data) => {
      setConsultations(data);
    });

    let unsubBookings = () => {};
    if (user) {
      unsubBookings = subscribeBookings(user.uid, (data) => {
        setBookings(data);
      });
    }

    return () => {
      unsubInquiries();
      unsubConsultations();
      unsubBookings();
    };
  }, [user]);

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await updateInquiryStatus(id, status);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry record?')) {
      await deleteInquiry(id);
    }
  };

  const handleUpdateConsultationStatus = async (id: string, status: string) => {
    try {
      await updateConsultationStatus(id, status);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConsultation = async (id: string) => {
    if (confirm('Are you sure you want to delete this consultation record?')) {
      await deleteConsultation(id);
    }
  };

  // Helper to format clean phone for WhatsApp
  const cleanPhoneForWhatsApp = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '92' + clean.slice(1);
    }
    return clean;
  };

  const filteredInquiries = inquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.service || '').toLowerCase().includes(q) ||
      (item.organization || '').toLowerCase().includes(q)
    );
  });

  const filteredConsultations = consultations.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.organization || '').toLowerCase().includes(q) ||
      (item.serviceCategory || '').toLowerCase().includes(q)
    );
  });

  const filteredBookings = bookings.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.customerName || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.farm || '').toLowerCase().includes(q) ||
      (item.service || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE BACKEND DATABASE VIEWER
          </div>
          <h1 className="text-2xl font-black text-gray-900">Client Inquiries & Mission Bookings Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time Firestore stream of customer inquiries, consultation requests, and flight reservations submitted from the website.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="block text-xl font-black text-emerald-700">{inquiries.length}</span>
            <span className="text-[10px] uppercase font-bold text-emerald-600">Inquiries</span>
          </div>
          <div className="text-center px-4 py-2 bg-teal-50 rounded-2xl border border-teal-100">
            <span className="block text-xl font-black text-teal-700">{consultations.length}</span>
            <span className="text-[10px] uppercase font-bold text-teal-600">Consultations</span>
          </div>
          <div className="text-center px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
            <span className="block text-xl font-black text-blue-700">{bookings.length}</span>
            <span className="text-[10px] uppercase font-bold text-blue-600">Spray Bookings</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'consultations' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Consultations ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'bookings' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Drone Bookings ({bookings.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, crop..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* TAB 1: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
              <div className="text-4xl mb-2">📬</div>
              <h3 className="text-base font-bold text-gray-800">No Inquiries Found Yet</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                When visitors on your website fill out the contact form or submit a flight proposal, their full contact details will appear here instantly!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInquiries.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs hover:border-emerald-300 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status || 'New Lead'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {item.organization || 'Private Farmer'} • <span className="font-semibold text-emerald-700">{item.service}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteInquiry(item.id)}
                      className="text-gray-300 hover:text-rose-500 p-1.5 transition rounded-lg hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3.5 p-3 rounded-2xl bg-gray-50 text-xs text-gray-700 leading-relaxed border border-gray-100">
                    "{item.message}"
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      {/* Direct Call */}
                      <a
                        href={`tel:${item.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100 transition"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call: {item.phone}
                      </a>

                      {/* Direct WhatsApp */}
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(item.phone)}?text=Hello%20${encodeURIComponent(item.name)},%20this%20is%20AgriHawk%20Pro%20regarding%20your%20drone%20inquiry.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1 transition"
                      >
                        💬 WhatsApp
                      </a>

                      {/* Direct Email */}
                      {item.email && (
                        <a
                          href={`mailto:${item.email}?subject=AgriHawk%20Drone%20Services%20Follow-up`}
                          className="p-1.5 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                          title={item.email}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <select
                      value={item.status || 'New Lead'}
                      onChange={(e) => handleUpdateInquiryStatus(item.id, e.target.value)}
                      className="text-[11px] font-bold border border-gray-300 rounded-lg px-2 py-1 bg-white text-gray-700"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Mission Scheduled">Mission Scheduled</option>
                      <option value="Closed / Completed">Closed / Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONSULTATIONS */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          {filteredConsultations.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="text-base font-bold text-gray-800">No Consultations Booked Yet</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                Consultation bookings from enterprise farms, sugar mills, or growers will be populated here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConsultations.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs hover:border-teal-300 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                      <p className="text-xs text-teal-700 font-semibold mt-0.5">{item.organization}</p>
                      <span className="text-[11px] text-gray-500">Service: {item.serviceCategory}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteConsultation(item.id)}
                      className="text-gray-300 hover:text-rose-500 p-1.5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p><strong>Preferred Date:</strong> {item.preferredDate || 'Earliest available'}</p>
                    <p className="mt-1"><strong>Requirements:</strong> {item.requirements || 'General field survey'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call: {item.phone}
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(item.phone)}?text=Hello%20${encodeURIComponent(item.name)},%20confirming%20your%20AgriHawk%20drone%20consultation.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-green-600 text-white font-bold text-xs"
                      >
                        💬 WhatsApp
                      </a>
                    </div>

                    <select
                      value={item.status || 'Pending Confirmation'}
                      onChange={(e) => handleUpdateConsultationStatus(item.id, e.target.value)}
                      className="text-[11px] font-bold border border-gray-300 rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="Pending Confirmation">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
              <div className="text-4xl mb-2">🚁</div>
              <h3 className="text-base font-bold text-gray-800">No Drone Bookings Logged</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                Drone flight bookings scheduled through the Farm OS or client portal will show here with estimated quotes and time slots.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{item.customerName}</h3>
                      <p className="text-xs text-gray-500">{item.farm} • {item.area} {item.unit}s</p>
                    </div>
                    <span className="text-sm font-black text-emerald-700">
                      PKR {item.totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="my-3 p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <p><strong>Service:</strong> {item.service}</p>
                    <p><strong>Scheduled:</strong> {item.date} at {item.time}</p>
                    {item.notes && <p className="text-gray-500"><strong>Notes:</strong> {item.notes}</p>}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call: {item.phone}
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(item.phone)}?text=Assalam-o-Alaikum%20${encodeURIComponent(item.customerName)},%20confirming%20your%20drone%20spraying%20schedule%20for%20${item.farm}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-green-600 text-white font-bold text-xs"
                      >
                        💬 WhatsApp
                      </a>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
