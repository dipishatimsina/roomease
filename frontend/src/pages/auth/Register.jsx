import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';

function Register() {
  const [step, setStep] = useState(1);
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const goToStep2 = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.fullName || !formData.email) {
      setError('Please fill in your name and email');
      return;
    }
    setStep(2);
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
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <Home size={22} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
        <p className="text-gray-500 text-xs mt-1">Get started with RoomEase today</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
      </div>
      <div className="flex justify-between text-[11px] text-gray-500 mb-5 -mt-3">
        <span className={step === 1 ? 'text-blue-600 font-medium' : ''}>Personal details</span>
        <span className={step === 2 ? 'text-blue-600 font-medium' : ''}>Account security</span>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">{error}</div>}

      {step === 1 && (
        <form onSubmit={goToStep2} className="space-y-4 animate-fade-up">
          {/* Segmented role switcher */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">I want to...</label>
            <div className="relative flex bg-slate-100 rounded-xl p-1">
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-lg transition-transform duration-300"
                style={{ transform: formData.role === 'owner' ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }}
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'tenant' })}
                className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  formData.role === 'tenant' ? 'text-white' : 'text-gray-600'
                }`}
              >
                <Home size={14} /> Rent a room
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'owner' })}
                className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  formData.role === 'owner' ? 'text-white' : 'text-gray-600'
                }`}
              >
                <Building2 size={14} /> List a property
              </button>
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

          <button
            type="submit"
            className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            Continue <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
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
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-700 font-medium rounded-xl py-3 text-sm hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-3 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : (
                <>
                  Create account <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <p className="text-xs text-gray-500 mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;