export default function FormInput({ type, placeholder, value, onChange, required, ...rest }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
      {...rest}
    />
  );
}
