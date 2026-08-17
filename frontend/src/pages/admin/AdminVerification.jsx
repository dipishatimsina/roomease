import { useState, useEffect } from 'react';
import { ShieldCheck, Building2, DoorOpen, Users, Check, MapPin, Search, Clock } from 'lucide-react';
import API from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

const tabs = ['Owners', 'Properties', 'Rooms'];

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
}

function AdminVerification() {
  const [activeTab, setActiveTab] = useState('Owners');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [owners, setOwners] = useState([]);
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ownerRes, propRes, roomRes] = await Promise.all([
        API.get('/admin/owners'),
        API.get('/properties'),
        API.get('/rooms/admin/all'),
      ]);
      setOwners(ownerRes.data);
      setProperties(propRes.data);
      setRooms(roomRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const verifyOwner = async (id) => {
    try {
      await API.patch(`/admin/verify-owner/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const setPropertyStatus = async (id, status) => {
    try {
      await API.patch(`/properties/${id}/verify`, { status });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const setRoomVerified = async (id, isVerified) => {
    try {
      await API.patch(`/rooms/${id}/verify`, { isVerified });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const q = search.trim().toLowerCase();

  const sortFn = (a, b) =>
    sortOrder === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);

  const pendingOwners = owners.filter((o) => !o.isVerifiedOwner);
  const pendingProperties = properties.filter((p) => p.status === 'pending');
  const pendingRooms = rooms.filter((r) => !r.isVerified);

  const filteredOwners = pendingOwners
    .filter((o) => !q || o.fullName?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q))
    .sort(sortFn);
  const filteredProperties = pendingProperties
    .filter((p) => !q || p.name?.toLowerCase().includes(q) || p.owner?.fullName?.toLowerCase().includes(q))
    .sort(sortFn);
  const filteredRooms = pendingRooms
    .filter((r) => !q || r.roomType?.toLowerCase().includes(q) || r.owner?.fullName?.toLowerCase().includes(q))
    .sort(sortFn);

  const totalApproved = owners.filter((o) => o.isVerifiedOwner).length + properties.filter((p) => p.status === 'approved').length;
  const totalRejected = properties.filter((p) => p.status === 'rejected').length;
  const totalPending = pendingOwners.length + pendingProperties.length + pendingRooms.length;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7FAFC' }}>
      <AdminSidebar pendingCount={totalPending} />

      <div className="flex-1 px-8 py-10 max-w-4xl">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Verification</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Review and approve listings before they go live</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-4 text-center">
            <p className="text-xl font-bold text-amber-600">{totalPending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-4 text-center">
            <p className="text-xl font-bold text-emerald-600">{totalApproved}</p>
            <p className="text-xs text-gray-500">Approved</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-4 text-center">
            <p className="text-xl font-bold text-rose-600">{totalRejected}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search owner, property, or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-sm border border-[#E5EEF7] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white text-sm border border-[#E5EEF7] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="flex gap-1 bg-white rounded-xl border border-[#E5EEF7] p-1 mb-6 w-fit">
          {tabs.map((tab) => {
            const count = tab === 'Owners' ? filteredOwners.length : tab === 'Properties' ? filteredProperties.length : filteredRooms.length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition ${
                  activeTab === tab ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && activeTab === 'Owners' && (
          <div className="space-y-3">
            {filteredOwners.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E5EEF7]">
                <Users size={28} className="mx-auto text-sky-100 mb-3" />
                <p className="text-gray-500 font-medium">
                  {q ? 'No matching owners found' : 'No owners pending verification'}
                </p>
              </div>
            )}
            {filteredOwners.map((o) => (
              <div key={o._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">
                      {o.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{o.fullName}</p>
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                      </div>
                      <p className="text-xs text-gray-400">{o.email} · {o.phone}</p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                        <Clock size={10} /> Registered {timeAgo(o.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => verifyOwner(o._id)}
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg transition flex-shrink-0"
                  >
                    <Check size={14} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'Properties' && (
          <div className="space-y-3">
            {filteredProperties.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E5EEF7]">
                <Building2 size={28} className="mx-auto text-sky-100 mb-3" />
                <p className="text-gray-500 font-medium">
                  {q ? 'No matching properties found' : 'No properties pending verification'}
                </p>
              </div>
            )}
            {filteredProperties.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                    </div>
                    <p className="text-xs text-gray-400">Owner: {p.owner?.fullName}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {timeAgo(p.createdAt)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                  <MapPin size={12} className="text-sky-400" /> {p.address}, {p.location}
                </p>
                <p className="text-sm text-gray-600 mb-4">{p.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPropertyStatus(p._id, 'approved')}
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => setPropertyStatus(p._id, 'rejected')}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'Rooms' && (
          <div className="space-y-3">
            {filteredRooms.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E5EEF7]">
                <DoorOpen size={28} className="mx-auto text-sky-100 mb-3" />
                <p className="text-gray-500 font-medium">
                  {q ? 'No matching rooms found' : 'No rooms pending verification'}
                </p>
              </div>
            )}
            {filteredRooms.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{r.roomType} — Room {r.roomNumber}</p>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                  </div>
                  <p className="text-xs text-gray-400">{r.property?.name} · {r.property?.location} · Owner: {r.owner?.fullName}</p>
                  <p className="text-sm text-sky-600 font-semibold mt-1">Rs {r.rent?.toLocaleString()}/month</p>
                </div>
                <button
                  onClick={() => setRoomVerified(r._id, true)}
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  <Check size={14} /> Verify
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminVerification;