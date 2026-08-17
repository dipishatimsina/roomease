import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, DoorOpen, ShieldCheck, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const navLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/verification', label: 'Verification' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/meta', label: 'Locations & Facilities' },
];

function KpiCard({ icon: Icon, label, value, sub, tone }) {
  const tones = {
    blue: 'bg-sky-50 text-sky-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tones[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, propRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/properties'),
      ]);
      setStats(statsRes.data);
      setPendingProperties(propRes.data.filter((p) => p.status === 'pending'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7FAFC' }}>
      <Navbar links={navLinks} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Good day, Admin 👋</h1>
        <p className="text-gray-500 text-sm mb-8">Here's what's happening across RoomEase today.</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard
                icon={Users} label="Total Users" value={stats.totalUsers}
                sub={`${stats.totalTenants} tenants · ${stats.totalOwners} owners`}
                tone="blue"
              />
              <KpiCard icon={Building2} label="Properties" value={stats.totalProperties} sub={`${stats.pendingProperties} pending review`} tone="blue" />
              <KpiCard icon={DoorOpen} label="Total Rooms" value={stats.totalRooms} sub={`${stats.availableRooms} available now`} tone="blue" />
              <KpiCard icon={TrendingUp} label="Available Rooms" value={stats.availableRooms} sub={`${stats.occupiedRooms} occupied`} tone="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verification Queue */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldCheck size={17} className="text-amber-500" /> Verification Queue
                  </h2>
                  <Link to="/admin/verification" className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                    View all <ArrowRight size={12} />
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  {pendingProperties.length} propert{pendingProperties.length !== 1 ? 'ies' : 'y'} need{pendingProperties.length === 1 ? 's' : ''} your attention
                </p>

                {pendingProperties.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">Nothing pending — all caught up.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {pendingProperties.slice(0, 5).map((p) => (
                      <div key={p._id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            {p.owner?.fullName} · <Clock size={10} /> {timeAgo(p.createdAt)}
                          </p>
                        </div>
                        <Link to="/admin/verification" className="text-xs text-sky-600 font-semibold">Review →</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room availability breakdown */}
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Room Availability</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Available</span>
                    <span className="font-semibold text-emerald-600">{stats.availableRooms}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.totalRooms ? (stats.availableRooms / stats.totalRooms) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-gray-600">Occupied</span>
                    <span className="font-semibold text-sky-600">{stats.occupiedRooms}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.totalRooms ? (stats.occupiedRooms / stats.totalRooms) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;