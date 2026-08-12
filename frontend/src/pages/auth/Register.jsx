import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', formData);
      login(res.data);
      if (res.data.role === 'owner') navigate('/owner');
      else navigate('/tenant');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md border border-sky-100">
        <h1 className="text-2xl font-bold text-sky-600 mb-1">RoomEase</h1>
        <p className="text-gray-500 mb-6">Create your account</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <div className="flex gap-3">
            <label className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50">
              <input
                type="radio"
                name="role"
                value="tenant"
                checked={formData.role === 'tenant'}
                onChange={handleChange}
              />
              I'm a Tenant
            </label>
            <label className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50">
              <input
                type="radio"
                name="role"
                value="owner"
                checked={formData.role === 'owner'}
                onChange={handleChange}
              />
              I'm an Owner
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg py-2 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;