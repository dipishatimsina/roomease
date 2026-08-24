import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Heart, ShieldCheck, ArrowLeft, Wallet, Droplet, Zap,
  MessageCircle, CalendarClock, FileCheck2, Star, Wifi, Car,
  ChefHat, Bath, Home as HomeIcon,
} from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import RoomCard from '../../components/RoomCard';
import { getRoomImage } from '../../components/roomImages';

const navLinks = [
  { to: '/tenant', label: 'Home' },
  { to: '/tenant/saved', label: 'Saved' },
  { to: '/tenant/applications', label: 'Applications' },
];

const facilityIcons = {
  'Wi-Fi': Wifi,
  Parking: Car,
  Furnished: HomeIcon,
  Kitchen: ChefHat,
  Water: Droplet,
  'Electricity Backup': Zap,
  Laundry: Bath,
};

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
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

      if (res.data.property?.location) {
        const simRes = await API.get(`/rooms?location=${encodeURIComponent(res.data.property.location)}`);
        setSimilar(simRes.data.results.filter((r) => r._id !== id).slice(0, 3));
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
      if (isSaved) await API.delete(`/saved-rooms/${id}`);
      else await API.post(`/saved-rooms/${id}`);
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
        <div className="max-w-6xl mx-auto px-6 py-16 text-center text-gray-400">Loading room...</div>
      </div>
    );
  }

  if (!room) return null;

  const totalMonthly = (room.rent || 0) + (room.waterCharge || 0) + (room.electricityCharge || 0) + (room.internetCharge || 0);
  const isAvailable = room.availabilityStatus === 'available';
  const lat = room.property?.latitude;
  const lng = room.property?.longitude;

  return (
    <div className="min-h-screen bg-sky-50/40 pb-16">
      <Navbar links={navLinks} />

      <div className="max-w-6xl mx-auto px-6 pt-6">
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

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden relative mb-6 shadow-sm" style={{ height: '320px' }}>
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
                <h1 className="text-3xl font-bold text-gray-900">{room.roomType} for Rent</h1>
                {room.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-sky-600 font-semibold bg-sky-50 px-2 py-1 rounded-full">
                    <ShieldCheck size={13} /> Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                <MapPin size={14} className="text-sky-400" />
                {room.property?.name} · {room.property?.location}
              </p>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">About this property</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {room.property?.description ||
                  `Comfortable ${room.roomType.toLowerCase()} located in ${room.property?.location}, with easy access to nearby transportation, shops, and daily essentials.`}
              </p>
            </div>

            {/* Property details — only show fields that actually exist */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Property details</h2>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Room type</p>
                  <p className="font-medium text-gray-800">{room.roomType}</p>
                </div>
                {room.roomNumber && (
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Room number</p>
                    <p className="font-medium text-gray-800">{room.roomNumber}</p>
                  </div>
                )}
                {room.bathroomType && (
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Bathroom</p>
                    <p className="font-medium text-gray-800">{room.bathroomType}</p>
                  </div>
                )}
                {room.kitchenType && (
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Kitchen</p>
                    <p className="font-medium text-gray-800">{room.kitchenType}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Facilities */}
            {room.facilities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Facilities & amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.facilities.map((f) => {
                    const Icon = facilityIcons[f] || HomeIcon;
                    return (
                      <div key={f} className="flex items-center gap-2 bg-sky-50/60 rounded-xl px-3 py-2.5">
                        <Icon size={16} className="text-sky-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{f}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly cost */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Monthly cost</h2>
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
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-gray-700 font-semibold">Estimated monthly total</span>
                  <span className="font-bold text-sky-600 text-base">Rs {totalMonthly.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Location + map */}
            {lat && lng && (
              <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Location</h2>
                <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-3">
                  <MapPin size={14} className="text-sky-400" />
                  {room.property?.name} · {room.property?.location}
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: '260px' }}>
                  <iframe
                    title="Property location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
                  />
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Reviews</h2>
              {reviews.length === 0 ? (
                <div className="text-center py-6">
                  <Star size={28} className="mx-auto text-sky-100 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">No reviews yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first tenant to share your experience.</p>
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="border-b border-gray-100 last:border-0 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-800">{r.tenant?.fullName}</span>
                      <span className="flex items-center gap-0.5 text-amber-500 text-xs">
                        <Star size={12} className="fill-amber-500" /> {r.ownerRating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: sticky actions for right */}
          <div>
            <div className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-6 sticky top-24">
              <p className="text-2xl font-extrabold text-sky-600 mb-1">
                Rs {room.rent?.toLocaleString()}<span className="text-sm font-medium text-gray-400">/month</span>
              </p>
              <p className={`text-xs font-semibold mb-5 flex items-center gap-1.5 ${isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {isAvailable ? 'Available now' : 'Currently occupied'}
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
                {isAvailable && (
                  <button
                    onClick={() => setShowApply(!showApply)}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm hover:shadow-md hover:shadow-sky-500/20"
                  >
                    <FileCheck2 size={16} /> Apply Now
                  </button>
                )}
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

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Similar properties nearby</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((r) => (
                <RoomCard key={r._id} room={r} onClick={() => navigate(`/tenant/rooms/${r._id}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomDetails;