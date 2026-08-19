import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Building2, DoorOpen, Users, MapPin, Wifi, Car, Home, Droplet, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

const facilityIcons = {
  'Wi-Fi': Wifi,
  Parking: Car,
  Furnished: Home,
  Kitchen: Home,
  Water: Droplet,
  'Electricity Backup': Zap,
  CCTV: ShieldCheck,
};
const facilityColors = ['bg-sky-50 text-sky-600', 'bg-emerald-50 text-emerald-600', 'bg-blue-50 text-blue-600', 'bg-purple-50 text-purple-600', 'bg-amber-50 text-amber-600', 'bg-rose-50 text-rose-600'];

function AdminReports() {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, propRes, roomRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/properties'),
        API.get('/rooms/admin/all'),
      ]);
      setStats(statsRes.data);
      setProperties(propRes.data);
      setRooms(roomRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const locationMap = {};
  properties.forEach((p) => {
    if (!locationMap[p.location]) locationMap[p.location] = { properties: 0, rooms: 0 };
    locationMap[p.location].properties += 1;
  });
  rooms.forEach((r) => {
    const loc = r.property?.location;
    if (loc) {
      if (!locationMap[loc]) locationMap[loc] = { properties: 0, rooms: 0 };
      locationMap[loc].rooms += 1;
    }
  });
  const locationStats = Object.entries(locationMap).sort((a, b) => b[1].rooms - a[1].rooms);

  const facilityCount = {};
  rooms.forEach((r) => {
    r.facilities?.forEach((f) => {
      facilityCount[f] = (facilityCount[f] || 0) + 1;
    });
  });
  const facilityStats = Object.entries(facilityCount).sort((a, b) => b[1] - a[1]);

  const roomTypeCount = {};
  rooms.forEach((r) => {
    roomTypeCount[r.roomType] = (roomTypeCount[r.roomType] || 0) + 1;
  });
  const roomTypeStats = Object.entries(roomTypeCount).sort((a, b) => b[1] - a[1]);

  const occupancyRate = stats?.totalRooms ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7FAFC' }}>
      <AdminSidebar pendingCount={stats?.pendingProperties || 0} />

      <div className="flex-1 px-8 py-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <BarChart3 size={22} className="text-sky-500" /> Reports
        </h1>
        <p className="text-gray-500 text-sm mb-8">Platform-wide statistics and breakdowns</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                  <Users size={18} className="text-sky-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                  <Building2 size={18} className="text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                <p className="text-xs text-gray-500">Total Properties</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                  <DoorOpen size={18} className="text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                <p className="text-xs text-gray-500">Total Rooms</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                  <BarChart3 size={18} className="text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
                <p className="text-xs text-gray-500">Occupancy Rate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={16} className="text-sky-500" /> Properties by Location
                  </h2>
                  <Link to="/admin/meta" className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                    View details <ArrowRight size={12} />
                  </Link>
                </div>
                {locationStats.length === 0 ? (
                  <p className="text-sm text-gray-400">No location data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {locationStats.map(([loc, data]) => {
                      const maxRooms = Math.max(...locationStats.map(([, d]) => d.rooms), 1);
                      return (
                        <div key={loc}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 font-medium">{loc}</span>
                            <span className="text-gray-500">{data.properties} propert{data.properties !== 1 ? 'ies' : 'y'} · {data.rooms} rooms</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-sky-500 h-2 rounded-full transition-all"
                              style={{ width: `${(data.rooms / maxRooms) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Rooms by Type</h2>
                  <Link to="/owner/rooms" className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                    View details <ArrowRight size={12} />
                  </Link>
                </div>
                {roomTypeStats.length === 0 ? (
                  <p className="text-sm text-gray-400">No room data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {roomTypeStats.map(([type, count]) => {
                      const maxCount = Math.max(...roomTypeStats.map(([, c]) => c), 1);
                      return (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 font-medium">{type}</span>
                            <span className="text-gray-500">{count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all"
                              style={{ width: `${(count / maxCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Most Common Facilities</h2>
                <Link to="/admin/meta" className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                  View all facilities <ArrowRight size={12} />
                </Link>
              </div>
              {facilityStats.length === 0 ? (
                <p className="text-sm text-gray-400">No facility data yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilityStats.map(([f, count], i) => {
                    const Icon = facilityIcons[f] || Home;
                    const color = facilityColors[i % facilityColors.length];
                    return (
                      <div key={f} className="flex items-center gap-3 bg-gray-50/60 rounded-xl px-3.5 py-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium truncate">{f}</p>
                        </div>
                        <span className="text-xs text-gray-500 font-semibold flex-shrink-0">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={18} className="text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Track and analyze your platform performance</p>
                  <p className="text-xs text-gray-500">These figures reflect your live RoomEase data.</p>
                </div>
              </div>
              <button
                onClick={fetchData}
                className="bg-white hover:bg-sky-50 text-sky-600 text-sm font-semibold px-4 py-2 rounded-lg border border-sky-200 transition flex-shrink-0"
              >
                Refresh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminReports;