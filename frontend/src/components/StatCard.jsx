function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl px-3 py-3 text-center shadow-sm border border-white/60">
      <Icon size={15} className="mx-auto text-blue-600 mb-1" />
      <p className="text-sm font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

export default StatCard;