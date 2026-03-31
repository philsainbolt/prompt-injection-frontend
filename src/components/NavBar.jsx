export default function NavBar({ children }) {
  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400 font-mono">Prompt Injection</h1>
        {children && <div className="flex gap-4">{children}</div>}
      </div>
    </nav>
  );
}
