import { useState, useEffect } from 'react';
import { CalendarClock, MapPin, Check, X, RotateCcw } from 'lucide-react';
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

const statusStyles = {
  pending: 'bg-amber-50 text-amber-600',
  accepted: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-rose-50 text-rose-600',
  rescheduled: 'bg-purple-50 text-purple-600',
};

function OwnerVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await API.get('/visits/received');
      setVisits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const respond = async (id, action) => {
    try {
      await API.patch(`/visits/${id}/respond`, { action });
      fetchVisits();
    } catch (err) {
      console.error(err);
    }
  };

  const submitReschedule = async (id) => {
    if (!newDate || !newTime) return;
    try {
      await API.patch(`/visits/${id}/respond`, {
        action: 'reschedule',
        rescheduledDate: newDate,
        rescheduledTime: newTime,
      });
      setReschedulingId(null);
      setNewDate('');
      setNewTime('');
      fetchVisits();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Visit Requests</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Manage room viewing requests from tenants</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && visits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-sky-100">
            <CalendarClock size={28} className="mx-auto text-sky-100 mb-3" />
            <p className="text-gray-500 font-medium">No visit requests yet</p>
            <p className="text-gray-400 text-sm mt-1">Tenant visit requests will appear here.</p>
          </div>
        )}

        <div className="space-y-4">
          {visits.map((v) => (
            <div key={v._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{v.tenant?.fullName}</p>
                  <p className="text-xs text-gray-400">{v.tenant?.phone}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${statusStyles[v.status]}`}>
                  {v.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                <MapPin size={12} className="text-sky-400" /> {v.room?.roomType} · Rs {v.room?.rent?.toLocaleString()}/month
              </p>

              <p className="text-sm text-gray-700 mb-1">
                Requested: <span className="font-medium">{new Date(v.visitDate).toLocaleDateString()} at {v.visitTime}</span>
              </p>

              {v.status === 'rescheduled' && (
                <p className="text-sm text-purple-700 mb-3">
                  Rescheduled to: <span className="font-medium">{new Date(v.rescheduledDate).toLocaleDateString()} at {v.rescheduledTime}</span>
                </p>
              )}

              {v.status === 'pending' && (
                <>
                  {reschedulingId === v._id ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                      <input
                        type="text"
                        placeholder="Time (e.g. 5:00 PM)"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                      <button
                        onClick={() => submitReschedule(v._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => respond(v._id, 'accept')}
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-2 rounded-lg transition"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        onClick={() => setReschedulingId(v._id)}
                        className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-2 rounded-lg transition"
                      >
                        <RotateCcw size={14} /> Reschedule
                      </button>
                      <button
                        onClick={() => respond(v._id, 'reject')}
                        className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold px-3 py-2 rounded-lg transition"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerVisits;