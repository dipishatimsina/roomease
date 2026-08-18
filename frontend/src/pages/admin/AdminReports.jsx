import { useState, useEffect } from 'react';
import { BarChart3, Building2, DoorOpen, Users, MapPin } from 'lucide-react';
import API from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

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

  // Group properties/rooms by location
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

  // Facility usage across rooms
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
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Platform-wide statistics and breakdowns</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {stats && (
          <>
            {/* Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
                <Users size={18} className="text-sky-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
                <Building2 size={18} className="text-sky-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                <p className="text-xs text-gray-500">Total Properties</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
                <DoorOpen size={18} className="text-sky-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                <p className="text-xs text-gray-500">Total Rooms</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
                <BarChart3 size={18} className="text-emerald-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
                <p className="text-xs text-gray-500">Occupancy Rate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Properties by location */}
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-sky-500" /> Properties by Location
                </h2>
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

              {/* Room types */}
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Rooms by Type</h2>
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

            {/* Facility usage */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Most Common Facilities</h2>
              {facilityStats.length === 0 ? (
                <p className="text-sm text-gray-400">No facility data yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilityStats.map(([f, count]) => (
                    <div key={f} className="flex items-center justify-between bg-sky-50/60 rounded-xl px-3 py-2.5">
                      <span className="text-sm text-gray-700 font-medium">{f}</span>
                      <span className="text-xs text-sky-600 font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminReports;