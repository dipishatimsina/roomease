import { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, X } from 'lucide-react';
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

function OwnerProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', address: '', location: '', description: '', propertyType: '',
  });
  const [error, setError] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await API.get('/properties/mine');
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/properties', form);
      setShowForm(false);
      setForm({ name: '', address: '', location: '', description: '', propertyType: '' });
      fetchProperties();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add property');
    }
  };

  const statusColors = {
    pending: 'bg-amber-50 text-amber-600',
    approved: 'bg-emerald-50 text-emerald-600',
    rejected: 'bg-rose-50 text-rose-600',
    suspended: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-sky-50/40">
      <Navbar links={navLinks} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <Building2 size={22} className="text-sky-500" />
              <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">Manage the properties you own and rent out</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus size={16} /> Add Property
          </button>
        </div>

        {loading && <p className="text-gray-400 text-sm mt-8">Loading...</p>}

        {!loading && properties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-sky-100 mt-8">
            <Building2 size={28} className="mx-auto text-sky-100 mb-3" />
            <p className="text-gray-500 font-medium">No properties yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-5">Add your first property to start listing rooms.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Add Property
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {properties.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-[#E5EEF7] shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold capitalize ${statusColors[p.status]}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3">
                <MapPin size={12} className="text-sky-400" /> {p.location}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description || 'No description added.'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Property modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Add Property</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name" required placeholder="Property name" value={form.name} onChange={handleChange}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                name="address" required placeholder="Address" value={form.address} onChange={handleChange}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                name="location" required placeholder="Location (e.g. Itahari Chowk)" value={form.location} onChange={handleChange}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                name="propertyType" placeholder="Property type (e.g. Rental House)" value={form.propertyType} onChange={handleChange}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <textarea
                name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                Add Property
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerProperties;