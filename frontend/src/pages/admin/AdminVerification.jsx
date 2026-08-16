import { useState, useEffect } from 'react';
import { ShieldCheck, Building2, DoorOpen, Users, Check, MapPin } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const navLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/verification', label: 'Verification' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/meta', label: 'Locations & Facilities' },
];

const tabs = ['Owners', 'Properties', 'Rooms'];

function AdminVerification() {
  const [activeTab, setActiveTab] = useState('Owners');
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

  const pendingOwners = owners.filter((o) => !o.isVerifiedOwner);
  const pendingProperties = properties.filter((p) => p.status === 'pending');
  const pendingRooms = rooms.filter((r) => !r.isVerified);

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Verification</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Approve owners, properties, and rooms before they go live</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-[#E5EEF7] p-1 mb-6 w-fit">
          {tabs.map((tab) => {
            const count = tab === 'Owners' ? pendingOwners.length : tab === 'Properties' ? pendingProperties.length : pendingRooms.length;
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

        {/* Owners tab */}
        {!loading && activeTab === 'Owners' && (
          <div className="space-y-3">
            {pendingOwners.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-sky-100">
                <Users size={28} className="mx-auto text-sky-100 mb-3" />
                <p className="text-gray-500 font-medium">No owners pending verification</p>
              </div>
            )}
            {pendingOwners.map((o) => (
              <div key={o._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{o.fullName}</p>
                  <p className="text-xs text-gray-400">{o.email} · {o.phone}</p>
                </div>
                <button
                  onClick={() => verifyOwner(o._id)}
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Properties tab */}
        {!loading && activeTab === 'Properties' && (
          <div className="space-y-3">
            {pendingProperties.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-sky-100">
                <Building2 size={28} className="mx-auto text-sky-100 mb-3" />
                <p className="text-gray-500 font-medium">No properties pending verification</p>
              </div>
            )}
            {pendingProperties.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">Owner: {p.owner?.fullName}</p>
                  </div>
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

        {/* Rooms tab */}
        {!loading && activeTab === 'Rooms' && (
          <div className="space-y-3">
            {pendingRooms.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-sky-100">
                <DoorOpen size={28} className="mx-auto text-sky-100 mb-3" />
                <p className="text-gray-500 font-medium">No rooms pending verification</p>
              </div>
            )}
            {pendingRooms.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{r.roomType} — Room {r.roomNumber}</p>
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