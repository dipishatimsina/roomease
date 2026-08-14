import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Heart, ShieldCheck, ArrowLeft, Wallet, Droplet, Zap,
  MessageCircle, CalendarClock, FileCheck2, Star,
} from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import { getRoomImage } from '../../components/roomImages';

const navLinks = [
  { to: '/tenant', label: 'Home' },
  { to: '/tenant/saved', label: 'Saved' },
  { to: '/tenant/applications', label: 'Applications' },
];

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const [showInquiry, setShowInquiry] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [message, setMessage] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/rooms/${id}`);
      setRoom(res.data);
      if (res.data.property?._id) {
        const revRes = await API.get(`/reviews/property/${res.data.property._id}`);
        setReviews(revRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkSaved = async () => {
    try {
      const res = await API.get('/saved-rooms');
      setIsSaved(res.data.some((r) => r._id === id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoom();
    checkSaved();
  }, [id]);

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await API.delete(`/saved-rooms/${id}`);
      } else {
        await API.post(`/saved-rooms/${id}`);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  const sendInquiry = async (e) => {
    e.preventDefault();
    try {
      await API.post('/inquiries', { room: id, message });
      setActionStatus('Inquiry sent! The owner will respond soon.');
      setShowInquiry(false);
      setMessage('');
    } catch (err) {
      setActionStatus(err.response?.data?.message || 'Failed to send inquiry');
    }
  };

  const sendVisitRequest = async (e) => {
    e.preventDefault();
    try {
      await API.post('/visits', { room: id, visitDate, visitTime });
      setActionStatus('Visit request sent!');
      setShowVisit(false);
      setVisitDate('');
      setVisitTime('');
    } catch (err) {
      setActionStatus(err.response?.data?.message || 'Failed to request visit');
    }
  };

  const sendApplication = async (e) => {
    e.preventDefault();
    try {
      await API.post('/applications', { room: id, preferredMoveInDate: moveInDate });
      setActionStatus('Application submitted!');
      setShowApply(false);
      setMoveInDate('');
    } catch (err) {
      setActionStatus(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50/40">
        <Navbar links={navLinks} />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-400">Loading room...</div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-sky-50/40 pb-16">
      <Navbar links={navLinks} />

      <div className="max-w-5xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-600 mb-4 transition"
        >
          <ArrowLeft size={16} /> Back to search
        </button>

        {actionStatus && (
          <div className="bg-sky-50 border border-sky-200 text-sky-700 text-sm px-4 py-3 rounded-xl mb-4">
            {actionStatus}
          </div>
        )}

        {/* Hero image — fixed height, guaranteed via inline style */}
        <div
          className="rounded-2xl overflow-hidden relative mb-8 shadow-sm"
          style={{ height: '280px' }}
        >
          <img
            src={getRoomImage(room.roomType)}
            alt={room.roomType}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            onClick={toggleSave}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart size={20} className={isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-2xl font-bold text-gray-900">{room.roomType}</h1>
                {room.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-sky-600 font-semibold bg-sky-50 px-2 py-1 rounded-full">
                    <ShieldCheck size={13} /> Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                <MapPin size={14} className="text-sky-400" />
                {room.property?.name}, {room.property?.location}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-sky-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Facilities</h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {room.facilities?.length > 0 ? (
                  room.facilities.map((f) => (
                    <span
                      key={f}
                      className="text-xs bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full font-medium"
                    >
                      {f}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">No facilities listed</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
                <p className="text-gray-500">
                  Bathroom <span className="block font-semibold text-gray-800 mt-0.5">{room.bathroomType || 'N/A'}</span>
                </p>
                <p className="text-gray-500">
                  Kitchen <span className="block font-semibold text-gray-800 mt-0.5">{room.kitchenType || 'N/A'}</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-sky-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Financial breakdown</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><Wallet size={15} className="text-sky-400" /> Monthly rent</span>
                  <span className="font-semibold text-gray-900">Rs {room.rent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><FileCheck2 size={15} className="text-sky-400" /> Security deposit</span>
                  <span className="font-semibold text-gray-900">Rs {room.securityDeposit?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><Droplet size={15} className="text-sky-400" /> Water charge</span>
                  <span className="font-semibold text-gray-900">Rs {room.waterCharge?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><Zap size={15} className="text-sky-400" /> Electricity charge</span>
                  <span className="font-semibold text-gray-900">Rs {room.electricityCharge?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-sky-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Reviews</h2>
              {reviews.length === 0 && <p className="text-sm text-gray-400">No reviews yet.</p>}
              {reviews.map((r) => (
                <div key={r._id} className="border-b border-gray-100 last:border-0 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-800">{r.tenant?.fullName}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 text-xs">
                      <Star size={12} className="fill-amber-500" /> {r.ownerRating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: sticky actions */}
          <div>
            <div className="bg-white rounded-2xl border border-sky-100 p-6 sticky top-24">
              <p className="text-2xl font-extrabold text-sky-600 mb-1">
                Rs {room.rent?.toLocaleString()}<span className="text-sm font-medium text-gray-400">/month</span>
              </p>
              <p className={`text-xs font-semibold capitalize mb-5 ${room.availabilityStatus === 'available' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {room.availabilityStatus}
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={() => setShowInquiry(!showInquiry)}
                  className="w-full flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium py-2.5 rounded-xl text-sm transition"
                >
                  <MessageCircle size={16} /> Contact Owner
                </button>
                <button
                  onClick={() => setShowVisit(!showVisit)}
                  className="w-full flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium py-2.5 rounded-xl text-sm transition"
                >
                  <CalendarClock size={16} /> Request Visit
                </button>
                <button
                  onClick={() => setShowApply(!showApply)}
                  disabled={room.availabilityStatus !== 'available'}
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl text-sm transition"
                >
                  <FileCheck2 size={16} /> Apply Now
                </button>
              </div>

              {showInquiry && (
                <form onSubmit={sendInquiry} className="mt-4 space-y-2 animate-fade-up">
                  <textarea
                    required
                    placeholder="I'm interested in this room..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-sm border border-sky-100 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    rows={3}
                  />
                  <button className="w-full bg-sky-600 text-white text-sm font-medium py-2 rounded-lg">Send</button>
                </form>
              )}

              {showVisit && (
                <form onSubmit={sendVisitRequest} className="mt-4 space-y-2 animate-fade-up">
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full text-sm border border-sky-100 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Preferred time (e.g. 4:00 PM)"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full text-sm border border-sky-100 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button className="w-full bg-sky-600 text-white text-sm font-medium py-2 rounded-lg">Request</button>
                </form>
              )}

              {showApply && (
                <form onSubmit={sendApplication} className="mt-4 space-y-2 animate-fade-up">
                  <input
                    type="date"
                    required
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full text-sm border border-sky-100 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button className="w-full bg-sky-600 text-white text-sm font-medium py-2 rounded-lg">Submit Application</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;