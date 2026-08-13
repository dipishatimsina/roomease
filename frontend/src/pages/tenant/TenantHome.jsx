import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import RoomCard from '../../components/RoomCard';

const navLinks = [
  { to: '/tenant', label: 'Home' },
  { to: '/tenant/saved', label: 'Saved' },
  { to: '/tenant/applications', label: 'Applications' },
];

function TenantHome() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [search, setSearch] = useState({ location: '', minRent: '', maxRent: '' });

  const fetchRooms = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await API.get(`/rooms?${query}`);
      setRooms(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await API.get('/saved-rooms');
      setSavedIds(res.data.map((r) => r._id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchSaved();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search.location) params.location = search.location;
    if (search.minRent) params.minRent = search.minRent;
    if (search.maxRent) params.maxRent = search.maxRent;
    fetchRooms(params);
  };

  const toggleSave = async (roomId) => {
    try {
      if (savedIds.includes(roomId)) {
        await API.delete(`/saved-rooms/${roomId}`);
        setSavedIds(savedIds.filter((id) => id !== roomId));
      } else {
        await API.post(`/saved-rooms/${roomId}`);
        setSavedIds([...savedIds, roomId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar links={navLinks} />

      {/* Hero search */}
      <div className="bg-blue-600 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Room in Itahari</h1>
          <p className="text-blue-100 mb-6">Search verified rooms that fit your budget and lifestyle</p>

          <form onSubmit={handleSearch} className="bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-2 shadow-lg">
            <input
              placeholder="Location (e.g. Itahari Chowk)"
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
              className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
            />
            <input
              placeholder="Min rent"
              type="number"
              value={search.minRent}
              onChange={(e) => setSearch({ ...search, minRent: e.target.value })}
              className="w-28 px-4 py-2.5 text-sm border-l border-gray-200 focus:outline-none"
            />
            <input
              placeholder="Max rent"
              type="number"
              value={search.maxRent}
              onChange={(e) => setSearch({ ...search, maxRent: e.target.value })}
              className="w-28 px-4 py-2.5 text-sm border-l border-gray-200 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
            >
              <Search size={16} /> Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {loading ? 'Loading rooms...' : `${rooms.length} rooms found`}
        </h2>

        {!loading && rooms.length === 0 && (
          <p className="text-gray-500 text-sm">No rooms match your search. Try different filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onSave={toggleSave}
              isSaved={savedIds.includes(room._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TenantHome;