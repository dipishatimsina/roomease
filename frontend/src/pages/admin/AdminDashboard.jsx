import { useState, useEffect } from 'react';
import { Users, Building2, DoorOpen, ShieldCheck, Flag, TrendingUp } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const navLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/verification', label: 'Verification' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/meta', label: 'Locations & Facilities' },
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

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Platform-wide overview and controls</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-sky-500" />
              <StatCard icon={Users} label="Tenants" value={stats.totalTenants} color="bg-blue-500" />
              <StatCard icon={Building2} label="Owners" value={stats.totalOwners} color="bg-indigo-500" />
              <StatCard icon={Building2} label="Properties" value={stats.totalProperties} color="bg-purple-500" />
              <StatCard icon={DoorOpen} label="Total Rooms" value={stats.totalRooms} color="bg-cyan-500" />
              <StatCard icon={TrendingUp} label="Available Rooms" value={stats.availableRooms} color="bg-emerald-500" />
              <StatCard icon={ShieldCheck} label="Pending Verification" value={stats.pendingProperties} color="bg-amber-500" />
              <StatCard icon={Flag} label="Occupied Rooms" value={stats.occupiedRooms} color="bg-rose-500" />
            </div>

            {stats.pendingProperties > 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
                <span>{stats.pendingProperties} propert{stats.pendingProperties > 1 ? 'ies' : 'y'} awaiting verification.</span>
                <a href="/admin/verification" className="font-semibold underline">Review now →</a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;