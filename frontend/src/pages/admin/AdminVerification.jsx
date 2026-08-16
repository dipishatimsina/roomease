import { useState, useEffect } from 'react';
import { ShieldCheck, Building2, DoorOpen, Users, Check, X } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const navLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/verification', label: 'Verification' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/meta', label: 'Locations & Facilities' },
];

const tabs = ['Properties', 'Rooms'];

function AdminVerification() {
  const [activeTab, setActiveTab] = useState('Properties');
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Since there's no "get all properties/rooms" admin endpoint yet, we fetch via a workaround:
  // search endpoint for rooms (public, shows all — but only verified ones by default).
  // For a real admin view, we need every property/room regardless of status.
  // We'll call the search endpoints without filters using a dedicated approach below.

  const fetchData = async () => {
    setLoading(true);
    try {
      // NOTE: these use the owner-facing "mine" pattern is not available to admin.
      // We rely on room search's default behavior returning only verified rooms,
      // so for a true unverified list we need a raw Mongo-level admin endpoint.
      // Using existing endpoints as a first pass:
      const roomRes = await API.get('/rooms?availableOnly=false');
      setRooms(roomRes.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={22} className="text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Verification</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">This page needs a backend update — see note below.</p>
      </div>
    </div>
  );
}

export default AdminVerification;