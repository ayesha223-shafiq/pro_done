import { useState } from 'react';
import type { BookingRecord, Farm } from '../types';
import { useAuth } from '../context/AuthContext';
import { addBooking } from '../services/firestoreService';
import { Calendar, Clock, Phone, User, CheckCircle, Calculator, FileCheck } from 'lucide-react';

interface BookingViewProps {
  farms: Farm[];
  bookings: BookingRecord[];
}

export function BookingView({ farms, bookings }: BookingViewProps) {
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('0318-5416054');
  const [selectedFarm, setSelectedFarm] = useState(
    farms.length > 0 ? farms[0].name : 'Main Farm (Rawalpindi)'
  );
  const [fieldCategory, setFieldCategory] = useState('Wheat Field');
  const [areaUnit, setAreaUnit] = useState<'kanal' | 'acre'>('kanal');
  const [areaInput, setAreaInput] = useState<number>(10);
  const [selectedService, setSelectedService] = useState('crop-inspection');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User rates
  const serviceRates: Record<string, number> = {
    'crop-inspection': 300,
    'precision-mapping': 400,
    'disease-detection': 400,
    'precision-spraying': 350,
    'monitoring-analytics': 500,
    'full-package': 700,
  };

  const serviceNames: Record<string, string> = {
    'crop-inspection': '🌱 Crop Inspection',
    'precision-mapping': '🗺️ Precision Mapping',
    'disease-detection': '🔍 Disease Detection',
    'precision-spraying': '🚁 Precision Spraying',
    'monitoring-analytics': '📡 Monitoring + Analytics',
    'full-package': '🌾 Full Drone Package',
  };

  // Convert to Kanal (1 Acre = 8 Kanals)
  const areaInKanal = areaUnit === 'acre' ? areaInput * 8 : areaInput;
  const currentRate = serviceRates[selectedService] || 300;
  const totalPrice = Math.round(areaInKanal * currentRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in first to submit and track your commercial drone booking in Firebase.');
      return;
    }

    setIsSubmitting(true);
    try {
      const id = await addBooking({
        userId: user.uid,
        customerName: customerName.trim(),
        phone: phone.trim(),
        farm: selectedFarm,
        fieldCategory,
        area: areaInput,
        unit: areaUnit,
        areaInKanal,
        service: serviceNames[selectedService],
        serviceCode: selectedService,
        ratePerKanal: currentRate,
        totalPrice,
        date: bookingDate,
        time: bookingTime,
        notes: notes.trim(),
        status: 'Pending Confirmation',
      });

      alert(
        `Commercial Drone Booking Confirmed!\n\nBooking ID: ${id.slice(0, 8)}\nCustomer: ${customerName}\nFarm: ${selectedFarm}\nService: ${serviceNames[selectedService]}\nTotal Estimated: Rs. ${totalPrice.toLocaleString()}\nStatus: Pending Confirmation\n\nSaved to Firebase Cloud Firestore.`
      );
      setNotes('');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error submitting booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const farmList =
    farms.length > 0
      ? farms.map((f) => f.name)
      : ['Main Farm (Rawalpindi)', 'North Field (Chakwal)', 'East Farm (Islamabad)', 'South Farm (Attock)'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Book Commercial Drone Service</h1>
          <p className="text-xs text-gray-500 mt-1">
            Calculate instant acreage pricing, schedule flight missions, and receive certified pilot dispatch.
          </p>
        </div>

        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
          Standard Acre conversion: 1 Acre = 8 Kanals
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Booking Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-1">Flight Booking Details</h2>
          <p className="text-xs text-gray-500 mb-5">Fill in your field location, area size, and requested drone capability</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Information */}
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                1. Customer Information
              </span>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farmer Adnan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="03XX-XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Field Information */}
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                2. Field & Crop Information
              </span>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Farm</label>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Field Category</label>
                  <select
                    value={fieldCategory}
                    onChange={(e) => setFieldCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Wheat Field">🌾 Wheat Field</option>
                    <option value="Rice Field">🌱 Rice Field</option>
                    <option value="Corn Field">🌽 Corn Field</option>
                    <option value="Vegetable Field">🥬 Vegetable Field</option>
                    <option value="Orchard">🍎 Orchard / Fruit Garden</option>
                    <option value="Other">🌿 Other Pasture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Area Unit</label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as 'kanal' | 'acre')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="kanal">Kanal (Traditional)</option>
                    <option value="acre">Acre (1 Acre = 8 Kanals)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Field Size ({areaUnit === 'acre' ? 'Acres' : 'Kanals'})
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    required
                    value={areaInput}
                    onChange={(e) => setAreaInput(Math.max(0.5, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Service & Schedule */}
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                3. Drone Flight Service & Timings
              </span>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Drone Capability</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="crop-inspection">🌱 Crop Inspection & Scouting (Rs. 300 / Kanal)</option>
                  <option value="precision-mapping">🗺️ Precision Cadastral Mapping (Rs. 400 / Kanal)</option>
                  <option value="disease-detection">🔍 AI Disease Pathology Detection (Rs. 400 / Kanal)</option>
                  <option value="precision-spraying">🚁 Precision Chemical Spraying (Rs. 350 / Kanal)</option>
                  <option value="monitoring-analytics">📡 Multispectral Monitoring + Analytics (Rs. 500 / Kanal)</option>
                  <option value="full-package">🌾 Full Turnkey Drone Agriculture Package (Rs. 700 / Kanal)</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Time Window</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="08:00 AM">08:00 AM (Early Calm Wind)</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM (Late Afternoon)</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Special Field Access Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Obstacles, high tension wires, canal access, crop stage..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              {isSubmitting ? 'Confirming Booking...' : '📅 Confirm Booking & Calculate Quote'}
            </button>
          </form>
        </div>

        {/* Price Summary Sticky Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs sticky top-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
                💰
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Instant Rate Quote</h2>
                <p className="text-xs text-gray-500">Live dynamic price calculation</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs py-2 border-y border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Capability</span>
                <strong className="text-gray-900">{serviceNames[selectedService]}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Field Target</span>
                <strong className="text-gray-900">{selectedFarm}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Specified Area</span>
                <strong className="text-gray-900">
                  {areaInput} {areaUnit === 'acre' ? 'Acres' : 'Kanals'} ({areaInKanal} Kanals)
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Base Unit Rate</span>
                <strong className="text-gray-900">Rs. {currentRate.toLocaleString()} / Kanal</strong>
              </div>
            </div>

            {/* Total Box */}
            <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Estimated Service Total
              </span>
              <div className="text-3xl font-black text-emerald-900">Rs. {totalPrice.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-700 mt-1 block">
                Calculated automatically: {areaInKanal} Kanals × Rs. {currentRate}
              </span>
            </div>

            {/* Rate Card Table */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                AgriHawk Pro Standard Rates:
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-gray-600 py-0.5 border-b border-gray-50">
                  <span>🌱 Crop Inspection</span>
                  <strong className="text-gray-900">Rs. 300 / Kanal</strong>
                </div>
                <div className="flex justify-between text-gray-600 py-0.5 border-b border-gray-50">
                  <span>🗺️ Precision Mapping</span>
                  <strong className="text-gray-900">Rs. 400 / Kanal</strong>
                </div>
                <div className="flex justify-between text-gray-600 py-0.5 border-b border-gray-50">
                  <span>🔍 Disease Detection</span>
                  <strong className="text-gray-900">Rs. 400 / Kanal</strong>
                </div>
                <div className="flex justify-between text-gray-600 py-0.5 border-b border-gray-50">
                  <span>🚁 Precision Spraying</span>
                  <strong className="text-gray-900">Rs. 350 / Kanal</strong>
                </div>
                <div className="flex justify-between text-gray-600 py-0.5 border-b border-gray-50">
                  <span>📡 Monitoring + Analytics</span>
                  <strong className="text-gray-900">Rs. 500 / Kanal</strong>
                </div>
                <div className="flex justify-between text-gray-600 py-0.5">
                  <span>🌾 Full Turnkey Package</span>
                  <strong className="text-gray-900">Rs. 700 / Kanal</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Bookings Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3">Your Booked Flight Services</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Farm</th>
                <th className="py-2.5 px-3">Area</th>
                <th className="py-2.5 px-3">Quote</th>
                <th className="py-2.5 px-3">Schedule</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(bookings.length > 0 ? bookings : [
                { id: '1', service: '🌱 Crop Inspection', customerName: 'Farmer Adnan', farm: 'Main Farm (Rawalpindi)', area: 10, unit: 'kanal', totalPrice: 3000, date: '2026-09-25', time: '10:00 AM', status: 'Pending Confirmation', userId: '', phone: '', fieldCategory: '', areaInKanal: 10, serviceCode: '', ratePerKanal: 300, notes: '' },
              ]).map((b, i) => (
                <tr key={b.id || i} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{b.service}</td>
                  <td className="py-3 px-3 text-gray-700">{b.customerName}</td>
                  <td className="py-3 px-3 text-gray-600">{b.farm}</td>
                  <td className="py-3 px-3 text-gray-600">{b.area} {b.unit}</td>
                  <td className="py-3 px-3 font-black text-emerald-700">Rs. {b.totalPrice.toLocaleString()}</td>
                  <td className="py-3 px-3 text-gray-500">{b.date} • {b.time}</td>
                  <td className="py-3 px-3">
                    <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {b.status || 'Pending'}
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
