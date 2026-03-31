export default function ResponseDisplay({ response, passed, hint }) {
  return (
    <section className="border border-slate-700 bg-slate-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold font-mono mb-3">LLM Response</h2>
      <div className="bg-slate-950 border border-slate-800 rounded p-4 min-h-[120px] text-slate-200 whitespace-pre-wrap">
        {response || 'No response yet.'}
      </div>

      {passed !== null && (
        <div
          data-testid={passed ? 'challenge-success-indicator' : 'challenge-failure-indicator'}
          className={`mt-4 p-3 rounded border ${passed ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}
        >
          <p className="font-semibold">{passed ? 'PASS' : 'FAIL'}</p>
          {hint && <p className="mt-1 text-sm">{hint}</p>}
        </div>
      )}
    </section>
  );
}
