import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function Navbar({ links = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-blue-600 transition">
            <Bell size={20} />
          </button>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-800">{user?.fullName}</span>
            <span className="text-[11px] text-gray-400 capitalize">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-gray-500 transition"
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