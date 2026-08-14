import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck2, MapPin, Calendar } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const navLinks = [
  { to: '/tenant', label: 'Home' },
  { to: '/tenant/saved', label: 'Saved' },
  { to: '/tenant/applications', label: 'Applications' },
];

const statusStyles = {
  pending: 'bg-amber-50 text-amber-600',
  accepted: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-rose-50 text-rose-600',
};

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/applications/mine');
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

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <FileCheck2 size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Track the status of rooms you've applied for</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && applications.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-sky-100">
            <FileCheck2 size={32} className="mx-auto text-sky-100 mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Apply to a room to see its status here</p>
          </div>
        )}

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              onClick={() => app.room?._id && navigate(`/tenant/rooms/${app.room._id}`)}
              className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{app.room?.roomType}</h3>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize ${statusStyles[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                  <MapPin size={13} className="text-sky-400" /> Rs {app.room?.rent?.toLocaleString()}/month
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Calendar size={12} />
                  Preferred move-in: {new Date(app.preferredMoveInDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Applications;