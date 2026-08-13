import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, Lock, Eye, EyeOff, Users, Smile, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import loginHero from '../../assets/login-hero.jpg';

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
    <div className="h-screen relative overflow-hidden text-sm">
      <img
        src={loginHero}
        alt="A bright modern living room"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-black/20" />

      {/* Logo pinned to top-left corner */}
      <div className="absolute top-6 left-6 lg:top-8 lg:left-10 z-20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <Home size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Room<span className="text-blue-600">Ease</span>
          </span>
        </div>
        <p className="text-xs text-blue-700 font-semibold ml-11">Find. Rent. Live easy.</p>
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto flex items-center justify-between px-10 lg:px-16">
        {/* Left branding content */}
        <div className="flex flex-col justify-center max-w-lg py-10">
          <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-4">
            Find a place you'll love to<br />
            <span className="text-blue-600">call home.</span>
          </h1>
          <p className="text-gray-800 text-sm max-w-sm mb-8 font-medium">
            Discover comfortable rooms and properties that fit your lifestyle, preferences and budget.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-sm mb-10">
            <div className="bg-white/85 backdrop-blur-md rounded-xl p-3.5 text-center shadow-md border border-white/60">
              <Home size={17} className="mx-auto text-blue-600 mb-1.5" />
              <p className="text-base font-bold text-gray-900">500+</p>
              <p className="text-[11px] text-gray-600">Rooms available</p>
            </div>
            <div className="bg-white/85 backdrop-blur-md rounded-xl p-3.5 text-center shadow-md border border-white/60">
              <Users size={17} className="mx-auto text-blue-600 mb-1.5" />
              <p className="text-base font-bold text-gray-900">200+</p>
              <p className="text-[11px] text-gray-600">Property owners</p>
            </div>
            <div className="bg-white/85 backdrop-blur-md rounded-xl p-3.5 text-center shadow-md border border-white/60">
              <Smile size={17} className="mx-auto text-blue-600 mb-1.5" />
              <p className="text-base font-bold text-gray-900">1,000+</p>
              <p className="text-[11px] text-gray-600">Happy users</p>
            </div>
          </div>

          <p className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
            <Home size={12} className="text-blue-500" />
            Your next <span className="text-blue-600 font-semibold">home</span> is closer than you think.
          </p>
        </div>

        {/* Right login glass card - wider */}
        <div className="hidden lg:flex items-center justify-center">
          <div
            className="w-full max-w-[510px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/70"
            style={{ minHeight: '100px' }}
          >
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Home size={22} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Welcome Home! 🏠</h2>
              <p className="text-gray-500 text-xs mt-1">Sign in to your RoomEase account</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-white rounded-lg pl-8 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-white rounded-lg pl-8 pr-8 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="text-blue-600 font-medium hover:text-blue-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2.5 text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? 'Logging in...' : (
                  <>
                    Log in <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-5 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: show login card below hero content on small screens */}
      <div className="lg:hidden absolute inset-0 z-20 flex items-center justify-center px-6 bg-white/95">
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Home size={22} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Welcome Home! 🏠</h2>
            <p className="text-gray-500 text-xs mt-1">Sign in to your RoomEase account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3.5" style={{ minHeight: '100px' }}>
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2.5 text-sm transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-5 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;   