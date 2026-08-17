import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, BarChart3, MapPin, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/verification', label: 'Verification', icon: ShieldCheck, badgeKey: 'pending' },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/meta', label: 'Locations & Facilities', icon: MapPin },
];

function AdminSidebar({ pendingCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-60 flex-shrink-0 bg-white border-r border-[#E5EEF7] min-h-screen flex flex-col">
      <div className="p-5 border-b border-[#E5EEF7]">
        <Logo />
      </div>

      <div className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={17} />
                {link.label}
              </span>
              {link.badgeKey === 'pending' && pendingCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    active ? 'bg-white text-sky-600' : 'bg-amber-500 text-white'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-3">
        <div className="bg-sky-50 rounded-xl p-3 flex items-start gap-2 mb-2">
          <HelpCircle size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-sky-700">Need help?</p>
            <p className="text-[11px] text-sky-500">Visit our help center</p>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-[#E5EEF7]">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-xs flex-shrink-0">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{user?.fullName}</p>
            <p className="text-[10px] text-sky-500 font-medium">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;