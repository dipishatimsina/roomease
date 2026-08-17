import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, DoorOpen, TrendingUp, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import API from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

function KpiCard({ icon: Icon, label, value, sub, tone }) {
  const tones = {
    blue: 'bg-sky-50 text-sky-600',
    green: 'bg-emerald-50 text-emerald-600',
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
  const [pendingOwnersCount, setPendingOwnersCount] = useState(0);
  const [pendingRoomsCount, setPendingRoomsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, propRes, ownerRes, roomRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/properties'),
        API.get('/admin/owners'),
        API.get('/rooms/admin/all'),
      ]);
      setStats(statsRes.data);
      setPendingProperties(propRes.data.filter((p) => p.status === 'pending'));
      setPendingOwnersCount(ownerRes.data.filter((o) => !o.isVerifiedOwner).length);
      setPendingRoomsCount(roomRes.data.filter((r) => !r.isVerified).length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPending = pendingProperties.length + pendingOwnersCount + pendingRoomsCount;
  const occupancyRate = stats?.totalRooms ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7FAFC' }}>
      <AdminSidebar pendingCount={totalPending} />

      <div className="flex-1 px-8 py-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Good day, Admin 👋</h1>
        <p className="text-gray-500 text-sm mb-8">Here's what's happening with RoomEase today.</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                sub={`${stats.totalTenants} tenants · ${stats.totalOwners} owners`}
                tone="blue"
              />
              <KpiCard
                icon={Building2}
                label="Properties"
                value={stats.totalProperties}
                sub={pendingProperties.length > 0 ? `${pendingProperties.length} awaiting verification` : 'All verified'}
                tone="blue"
              />
              <KpiCard
                icon={DoorOpen}
                label="Total Rooms"
                value={stats.totalRooms}
                sub={`${stats.availableRooms} available · ${stats.occupiedRooms} occupied`}
                tone="blue"
              />
              <KpiCard
                icon={TrendingUp}
                label="Occupancy Rate"
                value={`${occupancyRate}%`}
                sub={`${stats.occupiedRooms} of ${stats.totalRooms} rooms occupied`}
                tone="green"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" /> Needs your attention
                  </h2>
                  {totalPending > 0 && (
                    <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">{totalPending}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-4">Items waiting on your review</p>

                {pendingProperties.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">Nothing pending — all caught up.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingProperties.slice(0, 4).map((p) => (
                      <div key={p._id} className="flex items-center justify-between bg-sky-50/40 rounded-xl p-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            Submitted by {p.owner?.fullName} · <Clock size={10} /> {timeAgo(p.createdAt)}
                          </p>
                        </div>
                        <Link
                          to="/admin/verification"
                          className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg"
                        >
                          Review <ArrowRight size={12} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <Link to="/admin/verification" className="text-xs text-sky-600 font-semibold flex items-center gap-1 mt-4">
                  View all verification requests <ArrowRight size={12} />
                </Link>
              </div>

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