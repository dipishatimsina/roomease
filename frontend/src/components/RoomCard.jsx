import { MapPin, Heart, ShieldCheck, ChevronRight } from 'lucide-react';
import { getRoomImage } from './roomImages';

function RoomCard({ room, onSave, isSaved, onClick }) {
  const statusStyles = {
    available: 'bg-emerald-500 text-white',
    occupied: 'bg-rose-500 text-white',
    reserved: 'bg-amber-500 text-white',
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-sky-100 overflow-hidden hover:shadow-xl hover:shadow-sky-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="h-44 relative overflow-hidden">
        <img
          src={getRoomImage(room.roomType)}
          alt={room.roomType}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(room._id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart size={16} className={isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
          </button>
        )}

        <span
          className={`absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize shadow-sm ${statusStyles[room.availabilityStatus]}`}
        >
          {room.availabilityStatus}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-bold text-gray-900 text-[15px]">{room.roomType}</h3>
          {room.isVerified && (
            <span className="flex items-center gap-0.5 text-[10px] text-sky-600 font-semibold bg-sky-50 px-1.5 py-0.5 rounded-full">
              <ShieldCheck size={11} /> Verified
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
          <MapPin size={12} className="text-sky-400" />
          {room.property?.location || 'Location unavailable'}
        </p>

        <div className="flex items-baseline gap-1 mb-3">
          <p className="text-xl font-extrabold text-sky-600">Rs {room.rent?.toLocaleString()}</p>
          <span className="text-xs font-medium text-gray-400">/month</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {room.facilities?.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-medium">
              {f}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sky-600 text-xs font-semibold group-hover:gap-1.5 gap-1 transition-all">
          View details <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

export default RoomCard;