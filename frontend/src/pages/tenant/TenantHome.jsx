import { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, ShieldCheck, MessageCircle, Heart } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import RoomCard from '../../components/RoomCard';
import loginHero from '../../assets/login-hero.jpg';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      {/* Hero search */}
      <div className="relative py-20 px-6 overflow-hidden">
        <img
          src={loginHero}
          alt="A bright modern living room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/30 via-sky-500/30 to-blue-500/30" />

        <div className="relative max-w-4xl mx-auto text-center animate-fade-up">
          <h1
            className="text-4xl font-extrabold text-white mb-3 tracking-tight animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            Find Your Room in Itahari
          </h1>
          <p
            className="text-sky-100 mb-8 text-[15px] animate-fade-up"
            style={{ animationDelay: '150ms' }}
          >
            Search verified rooms that fit your budget and lifestyle
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-2.5 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-blue-900/20 animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <MapPin size={16} className="text-sky-400 flex-shrink-0" />
              <input
                placeholder="Location (e.g. Itahari Chowk)"
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
                className="w-full py-2.5 text-sm focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0">
              <DollarSign size={15} className="text-sky-400 flex-shrink-0" />
              <input
                placeholder="Min rent"
                type="number"
                value={search.minRent}
                onChange={(e) => setSearch({ ...search, minRent: e.target.value })}
                className="w-24 py-2.5 text-sm focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0">
              <DollarSign size={15} className="text-sky-400 flex-shrink-0" />
              <input
                placeholder="Max rent"
                type="number"
                value={search.maxRent}
                onChange={(e) => setSearch({ ...search, maxRent: e.target.value })}
                className="w-24 py-2.5 text-sm focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-7 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-sky-500/30 active:scale-[0.98]"
            >
              <Search size={16} /> Search
            </button>
          </form>

          <div
            className="flex flex-wrap justify-center gap-6 mt-6 text-white/90 animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <ShieldCheck size={15} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-xs">Verified Listings</p>
                <p className="text-[11px] text-sky-100">100% verified rooms</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <MessageCircle size={15} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-xs">Easy Communication</p>
                <p className="text-[11px] text-sky-100">Chat directly with owners</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Heart size={15} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-xs">Trusted by Thousands</p>
                <p className="text-[11px] text-sky-100">Join thousands of happy tenants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {loading ? 'Loading rooms...' : `${rooms.length} rooms found`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by</span>
            <select
              onChange={(e) => fetchRooms({ ...search, sortBy: e.target.value })}
              className="text-sm border border-sky-100 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="recent">Newest first</option>
              <option value="lowest">Lowest rent</option>
              <option value="highest">Highest rent</option>
            </select>
          </div>
        </div>

        {!loading && rooms.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-sky-100">
            <p className="text-gray-500 text-sm">No rooms match your search. Try different filters.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} onSave={toggleSave} isSaved={savedIds.includes(room._id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TenantHome;