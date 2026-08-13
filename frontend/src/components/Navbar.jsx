import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function Navbar({ links = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-sky-100 sticky top-0 z-30">
      <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
                  active ? 'bg-sky-50 text-sky-600' : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition">
            <Bell size={19} />
          </button>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-800">{user?.fullName}</span>
            <span className="text-[11px] text-sky-500 font-medium capitalize">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-gray-500 transition"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;