import { useState, useEffect } from 'react';
import { FileCheck2, MapPin, Check, X } from 'lucide-react';
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
};

function OwnerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/applications/received');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const respond = async (id, action) => {
    try {
      await API.patch(`/applications/${id}/respond`, { action });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <FileCheck2 size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Review and respond to rental applications</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && applications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-sky-100">
            <FileCheck2 size={28} className="mx-auto text-sky-100 mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Applications from tenants will appear here.</p>
          </div>
        )}

        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{app.tenant?.fullName}</p>
                  <p className="text-xs text-gray-400">{app.tenant?.phone} · {app.tenant?.email}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${statusStyles[app.status]}`}>
                  {app.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                <MapPin size={12} className="text-sky-400" /> {app.room?.roomType} · Rs {app.room?.rent?.toLocaleString()}/month
              </p>

              <p className="text-sm text-gray-700 mb-1">
                Preferred move-in: <span className="font-medium">{new Date(app.preferredMoveInDate).toLocaleDateString()}</span>
              </p>
              {app.note && <p className="text-sm text-gray-600 italic mt-1">"{app.note}"</p>}

              {app.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => respond(app._id, 'accept')}
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => respond(app._id, 'reject')}
                    className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerApplications;