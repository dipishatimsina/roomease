import { useState, useEffect } from 'react';
import { MessageCircle, MapPin, Send } from 'lucide-react';
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
  replied: 'bg-emerald-50 text-emerald-600',
  closed: 'bg-gray-100 text-gray-600',
};

function OwnerInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await API.get('/inquiries/received');
      setInquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const sendReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await API.patch(`/inquiries/${id}/reply`, { ownerReply: replyText });
      setReplyingTo(null);
      setReplyText('');
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Messages from tenants interested in your rooms</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && inquiries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-sky-100">
            <MessageCircle size={28} className="mx-auto text-sky-100 mb-3" />
            <p className="text-gray-500 font-medium">No inquiries yet</p>
            <p className="text-gray-400 text-sm mt-1">Tenant inquiries about your rooms will appear here.</p>
          </div>
        )}

        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{inq.tenant?.fullName}</p>
                  <p className="text-xs text-gray-400">{inq.tenant?.phone} · {inq.tenant?.email}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${statusStyles[inq.status]}`}>
                  {inq.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3">
                <MapPin size={12} className="text-sky-400" /> {inq.room?.roomType} · Rs {inq.room?.rent?.toLocaleString()}/month
              </p>

              <div className="bg-sky-50/60 rounded-xl p-3 mb-3">
                <p className="text-sm text-gray-700">{inq.message}</p>
              </div>

              {inq.ownerReply && (
                <div className="bg-emerald-50/60 rounded-xl p-3 mb-3">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Your reply</p>
                  <p className="text-sm text-gray-700">{inq.ownerReply}</p>
                </div>
              )}

              {inq.status === 'pending' && (
                <>
                  {replyingTo === inq._id ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                      <button
                        onClick={() => sendReply(inq._id)}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 rounded-lg flex items-center justify-center"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(inq._id)}
                      className="text-sm text-sky-600 font-semibold hover:text-sky-700"
                    >
                      Reply →
                    </button>
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

export default OwnerInquiries;