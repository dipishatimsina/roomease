import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import RoomCard from '../../components/RoomCard';

const navLinks = [
  { to: '/tenant', label: 'Home' },
  { to: '/tenant/saved', label: 'Saved' },
  { to: '/tenant/applications', label: 'Applications' },
];

function SavedRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await API.get('/saved-rooms');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const unsave = async (roomId) => {
    try {
      await API.delete(`/saved-rooms/${roomId}`);
      setRooms(rooms.filter((r) => r._id !== roomId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Saved Rooms</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Rooms you've bookmarked to compare and revisit later</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && rooms.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-sky-100">
            <Heart size={32} className="mx-auto text-sky-100 mb-3" />
            <p className="text-gray-500 font-medium">No saved rooms yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap the heart icon on any room to save it here</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              isSaved={true}
              onSave={unsave}
              onClick={() => navigate(`/tenant/rooms/${room._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SavedRooms;