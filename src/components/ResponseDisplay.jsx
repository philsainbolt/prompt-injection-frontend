export default function ResponseDisplay({ response, passed, hint, reveal }) {
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

      {passed && reveal && (
        <div className="mt-6 space-y-4">
          <div className="border border-cyan-500/30 bg-slate-950 rounded-lg p-5">
            <h3 className="text-lg font-semibold font-mono text-cyan-400 mb-2">How It Worked</h3>
            <p className="text-sm text-slate-400 mb-1">Technique: <span className="text-cyan-300">{reveal.technique}</span></p>
            <p className="text-slate-300 mt-3">{reveal.explanation}</p>
          </div>

          <div className="border border-slate-700 bg-slate-950 rounded-lg p-5">
            <h3 className="text-lg font-semibold font-mono text-amber-400 mb-2">The System Prompt</h3>
            <p className="text-sm text-slate-400 mb-2">This is what the LLM was told before your message:</p>
            <pre className="bg-slate-900 border border-slate-800 rounded p-3 text-sm text-slate-300 whitespace-pre-wrap">{reveal.systemPrompt}</pre>
          </div>

          {reveal.nextTechniqueHint && (
            <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-5">
              <h3 className="text-lg font-semibold font-mono text-emerald-400 mb-2">Next Level Hint</h3>
              <p className="text-slate-300">{reveal.nextTechniqueHint}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
