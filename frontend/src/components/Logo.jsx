import { Home } from 'lucide-react';

function Logo({ variant = 'dark' }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
          <Home size={18} className="text-white" />
        </div>
        <span className={`text-xl font-bold ${variant === 'dark' ? 'text-gray-900' : 'text-white'}`}>
          Room<span className="text-blue-600">Ease</span>
        </span>
      </div>
      <p className="text-xs text-blue-700 font-semibold ml-11">Find. Rent. Live easy.</p>
    </div>
  );
}

export default Logo;