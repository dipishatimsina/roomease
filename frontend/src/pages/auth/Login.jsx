import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, Lock, Eye, EyeOff, Users, Smile, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await API.post('/auth/login', formData);
      login(res.data);
      if (res.data.role === 'owner') navigate('/owner');
      else if (res.data.role === 'admin') navigate('/admin');
      else navigate('/tenant');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 to-indigo-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
          alt="A bright modern living room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Room<span className="text-indigo-600">Ease</span>
              </span>
            </div>
            <p className="text-sm text-indigo-500 font-medium ml-11">Find. Rent. Live easy.</p>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-4">
              Find a place you'll love to<br />
              <span className="text-indigo-600">call home.</span>
            </h1>
            <p className="text-gray-600 text-base max-w-md mb-8">
              Discover comfortable rooms and properties that fit your lifestyle, preferences and budget.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md">
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-sm">
                <Home size={20} className="mx-auto text-indigo-600 mb-2" />
                <p className="text-lg font-bold text-gray-900">500+</p>
                <p className="text-xs text-gray-500">Rooms available</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-sm">
                <Users size={20} className="mx-auto text-indigo-600 mb-2" />
                <p className="text-lg font-bold text-gray-900">200+</p>
                <p className="text-xs text-gray-500">Property owners</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-sm">
                <Smile size={20} className="mx-auto text-indigo-600 mb-2" />
                <p className="text-lg font-bold text-gray-900">1,000+</p>
                <p className="text-xs text-gray-500">Happy users</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Home size={14} className="text-indigo-400" />
            Your next <span className="text-indigo-600 font-medium">home</span> is closer than you think.
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <Home size={24} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Welcome back 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your RoomEase account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                Remember me
              </label>
              <a href="#" className="text-indigo-600 font-medium hover:text-indigo-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : (
                <>
                  Log in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;