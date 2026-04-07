import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { challengeAPI } from '../services/api';
import ChallengeWorkspace from '../components/ChallengeWorkspace';

export default function ChallengePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const res = await challengeAPI.getById(id);
        setChallenge(res.data);
      } catch {
        setError('Challenge not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [id]);

  const handleSubmit = async (prompt) => {
    const result = await challengeAPI.submit(id, prompt);
    return result.data || {};
  };

  const handleGuess = async (password, submissionId) => {
    const result = await challengeAPI.guess(id, password, submissionId);
    return result.data || {};
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-6">Loading challenge...</div>;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <p>{error || 'Challenge not found.'}</p>
        <Link to="/dashboard" className="text-cyan-400">Return to dashboard</Link>
      </div>
    );
  }

  return <ChallengeWorkspace key={id} challenge={challenge} onSubmit={handleSubmit} onGuess={handleGuess} />;
}
