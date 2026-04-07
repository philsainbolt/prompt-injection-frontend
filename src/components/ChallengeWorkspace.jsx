import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ResponseDisplay from './ResponseDisplay';

export default function ChallengeWorkspace({ challenge, onSubmit, onGuess }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [passed, setPassed] = useState(null);
  const [hint, setHint] = useState('');
  const [reveal, setReveal] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [guessInput, setGuessInput] = useState('');
  const [guessing, setGuessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setPassed(null);
    setReveal(null);
    setHint('');
    setGuessInput('');

    try {
      const data = await onSubmit(prompt);
      setResponse(data.response || 'No model response returned.');
      setSubmissionId(data.submissionId || null);
    } catch {
      setError('Unable to submit prompt.');
      setResponse('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuess = async (event) => {
    event.preventDefault();
    setGuessing(true);
    setHint('');

    try {
      const data = await onGuess(guessInput, submissionId);
      if (data.correct) {
        setPassed(true);
        setReveal(data.reveal || null);
      } else {
        setPassed(false);
        setHint(data.hint || 'Incorrect password. Try again.');
      }
    } catch {
      setError('Unable to verify password.');
    } finally {
      setGuessing(false);
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

        <ResponseDisplay response={response} passed={passed} hint={hint} reveal={reveal} />

        {response && passed !== true && (
          <form onSubmit={handleGuess} className="border border-amber-500/30 bg-slate-900 rounded-lg p-6">
            <label htmlFor="password-guess" className="block mb-2 font-semibold text-amber-300">
              Extract the Password
            </label>
            <p className="text-sm text-slate-400 mb-3">
              Read the LLM response above. What is the secret password?
            </p>
            <div className="flex gap-3">
              <input
                id="password-guess"
                data-testid="password-guess-input"
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                className="flex-1 p-3 bg-slate-950 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase tracking-widest font-mono"
                placeholder="TYPE PASSWORD HERE"
                required
              />
              <button
                type="submit"
                data-testid="password-guess-submit"
                disabled={guessing}
                className="px-5 py-2 bg-amber-500 text-slate-950 font-semibold rounded hover:bg-amber-400 disabled:opacity-60"
              >
                {guessing ? 'Checking...' : 'Submit Guess'}
              </button>
            </div>
          </form>
        )}

        {passed && reveal?.nextChallengeId && (
          <button
            onClick={() => navigate(`/challenge/${reveal.nextChallengeId}`)}
            className="w-full py-3 bg-cyan-500 text-slate-950 font-semibold rounded hover:bg-cyan-400 text-lg"
          >
            Next Level &rarr;
          </button>
        )}
      </main>
    </div>
  );
}
