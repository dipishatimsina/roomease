import { MapPin, Wifi, Car, Heart } from 'lucide-react';

function RoomCard({ room, onSave, isSaved, onClick }) {
  const statusColors = {
    available: 'bg-green-100 text-green-700',
    occupied: 'bg-red-100 text-red-700',
    reserved: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center relative">
        <span className="text-blue-300 text-sm">No photo</span>
        {onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(room._id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition"
          >
            <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900">{room.roomType}</h3>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColors[room.availabilityStatus]}`}>
            {room.availabilityStatus}
          </span>
        </div>

        <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
          <MapPin size={12} />
          {room.property?.location || 'Location unavailable'}
        </p>

        <p className="text-lg font-bold text-blue-600 mb-2">
          Rs {room.rent?.toLocaleString()}<span className="text-xs font-normal text-gray-500">/month</span>
        </p>

        <div className="flex flex-wrap gap-1.5">
          {room.facilities?.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomCard;