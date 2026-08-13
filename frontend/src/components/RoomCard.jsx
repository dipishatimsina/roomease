import { MapPin, Wifi, Heart, Home as HomeIcon } from 'lucide-react';

function RoomCard({ room, onSave, isSaved, onClick }) {
  const statusStyles = {
    available: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
    occupied: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
    reserved: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-sky-100 overflow-hidden hover:shadow-xl hover:shadow-sky-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="h-44 bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50 flex items-center justify-center relative overflow-hidden">
        <HomeIcon size={40} className="text-sky-200 group-hover:scale-110 transition-transform duration-300" />

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
          className={`absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize ${statusStyles[room.availabilityStatus]}`}
        >
          {room.availabilityStatus}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="font-bold text-gray-900 text-[15px]">{room.roomType}</h3>
        </div>

        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
          <MapPin size={12} className="text-sky-400" />
          {room.property?.location || 'Location unavailable'}
        </p>

        <div className="flex items-baseline gap-1 mb-3">
          <p className="text-xl font-extrabold text-sky-600">Rs {room.rent?.toLocaleString()}</p>
          <span className="text-xs font-medium text-gray-400">/month</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {room.facilities?.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-medium">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomCard;