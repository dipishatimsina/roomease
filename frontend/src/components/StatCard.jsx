function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white/85 backdrop-blur-md rounded-xl p-3.5 text-center shadow-md border border-white/60">
      <Icon size={17} className="mx-auto text-blue-600 mb-1.5" />
      <p className="text-base font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-600">{label}</p>
    </div>
  );
}

export default StatCard;