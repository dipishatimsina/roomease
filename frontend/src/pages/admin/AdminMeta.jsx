import { useState, useEffect } from 'react';
import { MapPin, Wifi, Plus, Trash2, Pencil, Eye, EyeOff, Search, Check, X } from 'lucide-react';
import API from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

function AdminMeta() {
  const [locations, setLocations] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newLocation, setNewLocation] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [locError, setLocError] = useState('');
  const [facError, setFacError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [locRes, facRes, propRes, roomRes] = await Promise.all([
        API.get('/meta/locations'),
        API.get('/meta/facilities'),
        API.get('/properties'),
        API.get('/rooms/admin/all'),
      ]);
      setLocations(locRes.data);
      setFacilities(facRes.data);
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

  const locationUsage = (name) => properties.filter((p) => p.location === name).length;
  const facilityUsage = (name) => rooms.filter((r) => r.facilities?.includes(name)).length;

  const addLocation = async (e) => {
    e.preventDefault();
    setLocError('');
    if (!newLocation.trim()) return;
    try {
      await API.post('/meta/locations', { name: newLocation.trim() });
      setNewLocation('');
      fetchData();
    } catch (err) {
      setLocError(err.response?.data?.message || 'Failed to add location');
    }
  };

  const addFacility = async (e) => {
    e.preventDefault();
    setFacError('');
    if (!newFacility.trim()) return;
    try {
      await API.post('/meta/facilities', { name: newFacility.trim() });
      setNewFacility('');
      fetchData();
    } catch (err) {
      setFacError(err.response?.data?.message || 'Failed to add facility');
    }
  };

  const deleteLocation = async (id) => {
    try {
      await API.delete(`/meta/locations/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFacility = async (id) => {
    try {
      await API.delete(`/meta/facilities/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLocationActive = async (loc) => {
    try {
      await API.patch(`/meta/locations/${loc._id}`, { isActive: !loc.isActive });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFacilityActive = async (f) => {
    try {
      await API.patch(`/meta/facilities/${f._id}`, { isActive: !f.isActive });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditValue(item.name);
  };

  const saveEdit = async (type, id) => {
    if (!editValue.trim()) return;
    try {
      const endpoint = type === 'location' ? `/meta/locations/${id}` : `/meta/facilities/${id}`;
      await API.patch(endpoint, { name: editValue.trim() });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const q = search.trim().toLowerCase();
  const matchesStatus = (item) =>
    statusFilter === 'All' || (statusFilter === 'Active' ? item.isActive : !item.isActive);

  const filteredLocations = locations
    .filter((l) => !q || l.name.toLowerCase().includes(q))
    .filter(matchesStatus);
  const filteredFacilities = facilities
    .filter((f) => !q || f.name.toLowerCase().includes(q))
    .filter(matchesStatus);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7FAFC' }}>
      <AdminSidebar pendingCount={0} />

      <div className="flex-1 px-8 py-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Locations & Facilities</h1>
        <p className="text-gray-500 text-sm mb-8">Manage the location and facility options available across RoomEase</p>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
            <MapPin size={18} className="text-sky-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
            <p className="text-xs text-gray-500">Total Locations</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
            <Wifi size={18} className="text-sky-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{facilities.length}</p>
            <p className="text-xs text-gray-500">Total Facilities</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
            <MapPin size={18} className="text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{locations.filter((l) => l.isActive).length}</p>
            <p className="text-xs text-gray-500">Active Locations</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
            <Wifi size={18} className="text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{facilities.filter((f) => f.isActive).length}</p>
            <p className="text-xs text-gray-500">Active Facilities</p>
          </div>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              placeholder="Search locations or facilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-sm border border-[#E5EEF7] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div className="flex gap-1 bg-white rounded-xl border border-[#E5EEF7] p-1">
            {['All', 'Active', 'Inactive'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                  statusFilter === s ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Locations */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={17} className="text-sky-500" /> Locations
                </h2>
                <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold">{locations.length}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Manage areas where properties are available</p>

              <form onSubmit={addLocation} className="flex gap-2 mb-4">
                <input
                  placeholder="e.g. Dharan Road"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition flex-shrink-0"
                >
                  <Plus size={15} /> Add
                </button>
              </form>
              {locError && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mb-3">{locError}</p>}

              {filteredLocations.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No locations match.</div>
              ) : (
                <div className="space-y-2">
                  {filteredLocations.map((loc) => (
                    <div key={loc._id} className="flex items-center justify-between bg-sky-50/40 hover:bg-sky-50 rounded-xl px-3.5 py-2.5 transition">
                      {editingId === loc._id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 text-sm border border-sky-300 rounded-lg px-2 py-1 focus:outline-none"
                          />
                          <button onClick={() => saveEdit('location', loc._id)} className="text-emerald-600"><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400"><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                              {loc.name}
                              <span className={`w-1.5 h-1.5 rounded-full ${loc.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            </p>
                            <p className="text-[11px] text-gray-400">{locationUsage(loc.name)} properties</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit(loc)} className="text-gray-400 hover:text-sky-600 p-1.5 transition"><Pencil size={13} /></button>
                            <button onClick={() => toggleLocationActive(loc)} className="text-gray-400 hover:text-sky-600 p-1.5 transition">
                              {loc.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button onClick={() => deleteLocation(loc._id)} className="text-gray-400 hover:text-rose-600 p-1.5 transition"><Trash2 size={13} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Wifi size={17} className="text-sky-500" /> Facilities
                </h2>
                <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold">{facilities.length}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Manage amenities available for properties</p>

              <form onSubmit={addFacility} className="flex gap-2 mb-4">
                <input
                  placeholder="e.g. CCTV"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition flex-shrink-0"
                >
                  <Plus size={15} /> Add
                </button>
              </form>
              {facError && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mb-3">{facError}</p>}

              {filteredFacilities.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No facilities match.</div>
              ) : (
                <div className="space-y-2">
                  {filteredFacilities.map((f) => (
                    <div key={f._id} className="flex items-center justify-between bg-sky-50/40 hover:bg-sky-50 rounded-xl px-3.5 py-2.5 transition">
                      {editingId === f._id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 text-sm border border-sky-300 rounded-lg px-2 py-1 focus:outline-none"
                          />
                          <button onClick={() => saveEdit('facility', f._id)} className="text-emerald-600"><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400"><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                              {f.name}
                              <span className={`w-1.5 h-1.5 rounded-full ${f.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            </p>
                            <p className="text-[11px] text-gray-400">{facilityUsage(f.name)} rooms</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit(f)} className="text-gray-400 hover:text-sky-600 p-1.5 transition"><Pencil size={13} /></button>
                            <button onClick={() => toggleFacilityActive(f)} className="text-gray-400 hover:text-sky-600 p-1.5 transition">
                              {f.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button onClick={() => deleteFacility(f._id)} className="text-gray-400 hover:text-rose-600 p-1.5 transition"><Trash2 size={13} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMeta;