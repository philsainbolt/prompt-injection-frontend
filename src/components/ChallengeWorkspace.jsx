import { useState } from 'react';
import { Link } from 'react-router-dom';
import ResponseDisplay from './ResponseDisplay';

export default function ChallengeWorkspace({ challenge, onSubmit }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [passed, setPassed] = useState(null);
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = await onSubmit(prompt);
      setResponse(data.response || 'No model response returned.');
      setPassed(Boolean(data.pass || data.success));
      setHint(data.hint || '');
    } catch {
      setError('Unable to submit prompt.');
      setPassed(false);
      setResponse('');
      setHint('No verdict available.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 sm:px-6 py-10">
      <main className="mx-auto max-w-4xl space-y-6">
        <Link to="/dashboard" className="text-cyan-400 hover:text-cyan-300">&larr; Back to levels</Link>

        <section className="border border-cyan-500/30 bg-slate-900/80 rounded-lg p-6">
          <h1 className="text-3xl font-bold font-mono">{challenge.title}</h1>
          <p className="mt-3 text-slate-300">{challenge.description}</p>
        </section>

        <form onSubmit={handleSubmit} className="border border-slate-700 bg-slate-900 rounded-lg p-6" data-testid="challenge-form">
          <label htmlFor="prompt" className="block mb-2 font-semibold">Prompt Payload</label>
          <textarea
            id="prompt"
            data-testid="challenge-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 sm:h-40 p-3 bg-slate-950 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Craft your injection prompt..."
            required
          />
          <button
            type="submit"
            data-testid="challenge-submit-button"
            disabled={submitting}
            className="mt-4 px-5 py-2 bg-cyan-500 text-slate-950 font-semibold rounded hover:bg-cyan-400 disabled:opacity-60"
          >
            {submitting ? 'Executing...' : 'Run Attack'}
          </button>
        </form>

        {error && <div className="p-4 border border-amber-500/40 bg-amber-500/10 text-amber-200 rounded">{error}</div>}

        <ResponseDisplay response={response} passed={passed} hint={hint} />
      </main>
    </div>
  );
}
