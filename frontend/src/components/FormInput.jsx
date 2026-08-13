function FormInput({ icon: Icon, label, rightElement, ...inputProps }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          {...inputProps}
          className={`w-full bg-slate-50/70 border border-slate-200 rounded-xl py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'}`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default FormInput;