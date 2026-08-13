function FormInput({ icon: Icon, label, rightElement, ...inputProps }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          {...inputProps}
          className={`w-full border border-gray-300 bg-white rounded-lg py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
            Icon ? 'pl-8' : 'pl-3'
          } ${rightElement ? 'pr-8' : 'pr-3'}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default FormInput;