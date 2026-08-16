import { useState, useEffect } from 'react';
import { DoorOpen, Plus, X, MapPin } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const navLinks = [
  { to: '/owner', label: 'Dashboard' },
  { to: '/owner/properties', label: 'Properties' },
  { to: '/owner/rooms', label: 'Rooms' },
  { to: '/owner/inquiries', label: 'Inquiries' },
  { to: '/owner/visits', label: 'Visits' },
  { to: '/owner/applications', label: 'Applications' },
];

const roomTypes = ['Single Room', 'Double Room', '1BHK', '2BHK', 'Flat', 'Hostel', 'PG'];
const facilityOptions = ['Wi-Fi', 'Parking', 'Attached Bathroom', 'Kitchen', 'Furnished', 'Water', 'Electricity Backup', 'Laundry'];

const statusStyles = {
  available: 'bg-emerald-50 text-emerald-600',
  occupied: 'bg-rose-50 text-rose-600',
  reserved: 'bg-amber-50 text-amber-600',
};

function OwnerRooms() {
  const [rooms, setRooms] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    property: '', roomNumber: '', roomType: 'Single Room', rent: '',
    securityDeposit: '', waterCharge: '', electricityCharge: '', internetCharge: '',
    bathroomType: '', kitchenType: '', facilities: [],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomRes, propRes] = await Promise.all([
        API.get('/rooms/mine'),
        API.get('/properties/mine'),
      ]);
      setRooms(roomRes.data);
      setProperties(propRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleFacility = (f) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/rooms', form);
      setShowForm(false);
      setForm({
        property: '', roomNumber: '', roomType: 'Single Room', rent: '',
        securityDeposit: '', waterCharge: '', electricityCharge: '', internetCharge: '',
        bathroomType: '', kitchenType: '', facilities: [],
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add room');
    }
  };

  const toggleAvailability = async (room) => {
    const next = room.availabilityStatus === 'available' ? 'occupied' : 'available';
    try {
      await API.patch(`/rooms/${room._id}/availability`, { availabilityStatus: next });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <DoorOpen size={22} className="text-sky-500" />
              <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">Manage individual rooms across your properties</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            disabled={properties.length === 0}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus size={16} /> Add Room
          </button>
        </div>

        {properties.length === 0 && !loading && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mt-6">
            You need to add a property first before you can add rooms.
          </div>
        )}

        {loading && <p className="text-gray-400 text-sm mt-8">Loading...</p>}

        {!loading && properties.length > 0 && rooms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-sky-100 mt-8">
            <DoorOpen size={28} className="mx-auto text-sky-100 mb-3" />
            <p className="text-gray-500 font-medium">No rooms yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-5">Add rooms under your property so tenants can find them.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Add Room
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{room.roomType}</h3>
                  <p className="text-xs text-gray-400">Room {room.roomNumber} · {room.property?.name}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold capitalize ${statusStyles[room.availabilityStatus]}`}>
                  {room.availabilityStatus}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3">
                <MapPin size={12} className="text-sky-400" /> {room.property?.location}
              </p>
              <p className="text-lg font-bold text-sky-600 mb-3">
                Rs {room.rent?.toLocaleString()}<span className="text-xs font-normal text-gray-400">/month</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {room.facilities?.slice(0, 3).map((f) => (
                  <span key={f} className="text-[10px] bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-medium">{f}</span>
                ))}
              </div>
              <button
                onClick={() => toggleAvailability(room)}
                className="w-full text-sm font-semibold py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition"
              >
                Mark as {room.availabilityStatus === 'available' ? 'Occupied' : 'Available'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Room modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Add Room</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                name="property" required value={form.property} onChange={handleChange}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Select property</option>
                {properties.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="roomNumber" required placeholder="Room number" value={form.roomNumber} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <select
                  name="roomType" value={form.roomType} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {roomTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="rent" required type="number" placeholder="Monthly rent" value={form.rent} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  name="securityDeposit" type="number" placeholder="Security deposit" value={form.securityDeposit} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  name="waterCharge" type="number" placeholder="Water" value={form.waterCharge} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  name="electricityCharge" type="number" placeholder="Electricity" value={form.electricityCharge} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  name="internetCharge" type="number" placeholder="Internet" value={form.internetCharge} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="bathroomType" placeholder="Bathroom (e.g. Attached)" value={form.bathroomType} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  name="kitchenType" placeholder="Kitchen (e.g. Shared)" value={form.kitchenType} onChange={handleChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {facilityOptions.map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleFacility(f)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${
                        form.facilities.includes(f)
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-gray-400">Room photos coming soon.</p>

              <button className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                Add Room
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerRooms;