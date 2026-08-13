import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant',
  });
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
      const res = await API.post('/auth/register', formData);
      login(res.data);
      navigate(res.data.role === 'owner' ? '/owner' : '/tenant');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
          <Home size={22} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Create your account</h2>
        <p className="text-gray-500 text-xs mt-1">Get started with RoomEase today</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Role picker */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">I want to...</label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex flex-col items-center gap-1.5 border rounded-xl px-3 py-3 cursor-pointer transition ${
                formData.role === 'tenant' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input type="radio" name="role" value="tenant" checked={formData.role === 'tenant'} onChange={handleChange} className="sr-only" />
              <Home size={18} className={formData.role === 'tenant' ? 'text-blue-600' : 'text-gray-400'} />
              <span className="text-xs font-semibold text-gray-800">Rent a room</span>
              <span className="text-[11px] text-gray-500 text-center leading-tight">Find rooms as a tenant</span>
            </label>

            <label
              className={`flex flex-col items-center gap-1.5 border rounded-xl px-3 py-3 cursor-pointer transition ${
                formData.role === 'owner' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input type="radio" name="role" value="owner" checked={formData.role === 'owner'} onChange={handleChange} className="sr-only" />
              <Building2 size={18} className={formData.role === 'owner' ? 'text-blue-600' : 'text-gray-400'} />
              <span className="text-xs font-semibold text-gray-800">List a property</span>
              <span className="text-[11px] text-gray-500 text-center leading-tight">Manage and rent rooms</span>
            </label>
          </div>
        </div>

        <FormInput
          icon={User}
          label="Full name"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

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
          icon={Phone}
          label="Phone number"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <FormInput
          icon={Lock}
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          rightElement={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2.5 text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
        >
          {loading ? 'Creating account...' : <>Create account <ArrowRight size={14} /></>}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-5 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;