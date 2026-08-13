import { Home, Users, Smile } from 'lucide-react';
import Logo from './Logo';
import StatCard from './StatCard';
import loginHero from '../assets/login-hero.jpg';

function AuthLayout({ children }) {
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
        <Logo />
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
            <StatCard icon={Home} value="500+" label="Rooms available" />
            <StatCard icon={Users} value="200+" label="Property owners" />
            <StatCard icon={Smile} value="1,000+" label="Happy users" />
          </div>

          <p className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
            <Home size={12} className="text-blue-500" />
            Your next <span className="text-blue-600 font-semibold">home</span> is closer than you think.
          </p>
        </div>

        {/* Right panel — the actual form, passed in as children */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-[510px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/70">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile fallback */}
      <div className="lg:hidden absolute inset-0 z-20 flex items-center justify-center px-6 bg-white/95 overflow-y-auto py-10">
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;