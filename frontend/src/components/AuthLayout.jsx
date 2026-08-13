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
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/30 to-blue-950/25" />

      {/* Logo pinned to top-left corner */}
      <div className="absolute top-6 left-6 lg:top-8 lg:left-10 z-20 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <Logo />
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto flex items-center justify-between px-10 lg:px-16">
        {/* Left branding content */}
        <div className="flex flex-col justify-center max-w-lg py-10">
          <h1
            className="text-4xl font-bold leading-tight text-gray-900 mb-4 animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            Find a place you'll love<br />
            to <span className="text-blue-600">call home.</span>
          </h1>
          <p
            className="text-gray-700 text-sm max-w-sm mb-7 font-medium animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            Discover comfortable rooms and properties that fit your lifestyle, preferences and budget.
          </p>

          <div
            className="grid grid-cols-3 gap-2.5 max-w-md mb-9 animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            <StatCard icon={Home} value="500+" label="Rooms" />
            <StatCard icon={Users} value="200+" label="Owners" />
            <StatCard icon={Smile} value="1,000+" label="Users" />
          </div>

          <p
            className="text-xs text-gray-600 flex items-center gap-1.5 font-medium animate-fade-up"
            style={{ animationDelay: '500ms' }}
          >
            <Home size={12} className="text-blue-500" />
            Your next <span className="text-blue-600 font-semibold">home</span> is closer than you think.
          </p>
        </div>

        {/* Right panel — glass card */}
        <div className="hidden lg:flex items-center justify-center animate-slide-in-card" style={{ animationDelay: '150ms' }}>
          <div
            className="w-full max-w-[430px] rounded-[28px] bg-white/80 backdrop-blur-2xl border border-white/70 p-8"
            style={{ boxShadow: '0 25px 70px rgba(30,64,175,0.16)' }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Mobile fallback */}
      <div className="lg:hidden absolute inset-0 z-20 flex items-center justify-center px-6 bg-white/95 overflow-y-auto py-10">
        <div className="w-full max-w-[400px] rounded-[28px] bg-white p-7 shadow-xl border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;