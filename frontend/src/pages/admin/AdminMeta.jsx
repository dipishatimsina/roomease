import { useState, useEffect } from 'react';
import { MapPin, Wifi, Plus, X, Trash2 } from 'lucide-react';
import API from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

function AdminMeta() {
  const [locations, setLocations] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLocation, setNewLocation] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [locRes, facRes] = await Promise.all([
        API.get('/meta/locations'),
        API.get('/meta/facilities'),
      ]);
      setLocations(locRes.data);
      setFacilities(facRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addLocation = async (e) => {
    e.preventDefault();
    setError('');
    if (!newLocation.trim()) return;
    try {
      await API.post('/meta/locations', { name: newLocation.trim() });
      setNewLocation('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add location');
    }
  };

  const addFacility = async (e) => {
    e.preventDefault();
    setError('');
    if (!newFacility.trim()) return;
    try {
      await API.post('/meta/facilities', { name: newFacility.trim() });
      setNewFacility('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add facility');
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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7FAFC' }}>
      <AdminSidebar pendingCount={0} />

      <div className="flex-1 px-8 py-10 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Locations & Facilities</h1>
        <p className="text-gray-500 text-sm mb-8">Manage the location and facility options available across RoomEase</p>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Locations */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={17} className="text-sky-500" /> Locations
              </h2>

              <form onSubmit={addLocation} className="flex gap-2 mb-4">
                <input
                  placeholder="e.g. Dharan Road"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
                >
                  <Plus size={15} /> Add
                </button>
              </form>

              {locations.length === 0 ? (
                <p className="text-sm text-gray-400">No locations added yet.</p>
              ) : (
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <div key={loc._id} className="flex items-center justify-between bg-sky-50/60 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700 font-medium">{loc.name}</span>
                      <button
                        onClick={() => deleteLocation(loc._id)}
                        className="text-gray-400 hover:text-rose-600 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wifi size={17} className="text-sky-500" /> Facilities
              </h2>

              <form onSubmit={addFacility} className="flex gap-2 mb-4">
                <input
                  placeholder="e.g. CCTV"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
                >
                  <Plus size={15} /> Add
                </button>
              </form>

              {facilities.length === 0 ? (
                <p className="text-sm text-gray-400">No facilities added yet.</p>
              ) : (
                <div className="space-y-2">
                  {facilities.map((f) => (
                    <div key={f._id} className="flex items-center justify-between bg-sky-50/60 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700 font-medium">{f.name}</span>
                      <button
                        onClick={() => deleteFacility(f._id)}
                        className="text-gray-400 hover:text-rose-600 transition"
                      >
                        <Trash2 size={14} />
                      </button>
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