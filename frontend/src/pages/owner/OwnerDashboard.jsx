import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, DoorOpen, CheckCircle2, XCircle, MessageCircle,
  CalendarClock, FileCheck2, Sparkles, Plus, ArrowRight,
} from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const navLinks = [
  { to: '/owner', label: 'Dashboard' },
  { to: '/owner/properties', label: 'Properties' },
  { to: '/owner/rooms', label: 'Rooms' },
  { to: '/owner/inquiries', label: 'Inquiries' },
  { to: '/owner/visits', label: 'Visits' },
  { to: '/owner/applications', label: 'Applications' },
];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function OwnerDashboard() {
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [propRes, roomRes, inqRes, visitRes, appRes] = await Promise.all([
        API.get('/properties/mine'),
        API.get('/rooms/mine'),
        API.get('/inquiries/received'),
        API.get('/visits/received'),
        API.get('/applications/received'),
      ]);
      setProperties(propRes.data);
      setRooms(roomRes.data);
      setInquiries(inqRes.data);
      setVisits(visitRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const availableRooms = rooms.filter((r) => r.availabilityStatus === 'available').length;
  const occupiedRooms = rooms.filter((r) => r.availabilityStatus === 'occupied').length;
  const newInquiries = inquiries.filter((i) => i.status === 'pending').length;
  const pendingVisits = visits.filter((v) => v.status === 'pending').length;
  const pendingApps = applications.filter((a) => a.status === 'pending').length;

  const step1Done = properties.length > 0;
  const step2Done = rooms.length > 0;
  const step3Done = applications.length > 0;

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Owner Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Overview of your properties, rooms, and tenant activity</p>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
              <StatCard icon={Building2} label="Properties" value={properties.length} color="bg-sky-500" />
              <StatCard icon={DoorOpen} label="Total Rooms" value={rooms.length} color="bg-blue-500" />
              <StatCard icon={CheckCircle2} label="Available" value={availableRooms} color="bg-emerald-500" />
              <StatCard icon={XCircle} label="Occupied" value={occupiedRooms} color="bg-rose-500" />
              <StatCard icon={MessageCircle} label="New Inquiries" value={newInquiries} color="bg-amber-500" />
              <StatCard icon={CalendarClock} label="Visit Requests" value={pendingVisits} color="bg-purple-500" />
              <StatCard icon={FileCheck2} label="Applications" value={pendingApps} color="bg-indigo-500" />
            </div>

            {/* Get Started onboarding — shown until owner has properties, rooms, and applications */}
            {!(step1Done && step2Done && step3Done) && (
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-sky-500" />
                  <h2 className="font-semibold text-gray-900">Get started with RoomEase</h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">List your property, add rooms, and connect with tenants.</p>

                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className={`flex-1 flex items-center gap-3 rounded-xl border p-4 ${step1Done ? 'border-emerald-200 bg-emerald-50/50' : 'border-sky-200 bg-sky-50/50'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${step1Done ? 'bg-emerald-500' : 'bg-sky-500'}`}>
                      {step1Done ? '✓' : '1'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Add Property</p>
                      <p className="text-xs text-gray-500">List your rental building</p>
                    </div>
                  </div>

                  <ArrowRight size={16} className="text-gray-300 hidden sm:block self-center flex-shrink-0" />

                  <div className={`flex-1 flex items-center gap-3 rounded-xl border p-4 ${step2Done ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${step2Done ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                      {step2Done ? '✓' : '2'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Add Rooms</p>
                      <p className="text-xs text-gray-500">List rooms under your property</p>
                    </div>
                  </div>

                  <ArrowRight size={16} className="text-gray-300 hidden sm:block self-center flex-shrink-0" />

                  <div className={`flex-1 flex items-center gap-3 rounded-xl border p-4 ${step3Done ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${step3Done ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                      {step3Done ? '✓' : '3'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Receive Applications</p>
                      <p className="text-xs text-gray-500">Tenants start applying</p>
                    </div>
                  </div>
                </div>

                {!step1Done && (
                  <Link
                    to="/owner/properties"
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl mt-5 transition"
                  >
                    <Plus size={16} /> Add Property
                  </Link>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
                  <Link to="/owner/inquiries" className="text-xs text-sky-600 font-semibold">View all →</Link>
                </div>
                {inquiries.length === 0 ? (
                  <p className="text-sm text-gray-400">No inquiries yet — tenant inquiries will appear here.</p>
                ) : (
                  inquiries.slice(0, 4).map((i) => (
                    <div key={i._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{i.tenant?.fullName}</p>
                        <p className="text-xs text-gray-400">Interested in {i.room?.roomType}</p>
                      </div>
                      <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-semibold capitalize">
                        {i.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Recent Applications</h2>
                  <Link to="/owner/applications" className="text-xs text-sky-600 font-semibold">View all →</Link>
                </div>
                {applications.length === 0 ? (
                  <p className="text-sm text-gray-400">No applications yet — applications from tenants will appear here.</p>
                ) : (
                  applications.slice(0, 4).map((a) => (
                    <div key={a._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{a.tenant?.fullName}</p>
                        <p className="text-xs text-gray-400">{a.room?.roomType}</p>
                      </div>
                      <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-semibold capitalize">
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;