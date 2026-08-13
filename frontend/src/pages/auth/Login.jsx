import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <AuthLayout>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <Home size={22} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Welcome Home! 🏠</h2>
        <p className="text-gray-500 text-xs mt-1">Sign in to continue to RoomEase</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          icon={Mail}
          label="Email address"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          icon={Lock}
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          rightElement={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-1.5 text-gray-600">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Remember me
          </label>
          <a href="#" className="text-blue-600 font-medium hover:text-blue-700">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-3 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
        >
          {loading ? 'Logging in...' : (
            <>
              Log in <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;