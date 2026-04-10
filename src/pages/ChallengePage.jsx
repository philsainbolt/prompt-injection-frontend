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
    try {
      const result = await challengeAPI.submit(id, prompt);
      return result.data || {};
    } catch (err) {
      console.error('Submit failed:', err);
      throw err;
    }
  };

  const handleGuess = async (password, submissionId) => {
    try {
      const result = await challengeAPI.guess(id, password, submissionId);
      return result.data || {};
    } catch (err) {
      console.error('Guess failed:', err);
      throw err;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0505] text-[#a89878] p-8 font-body">The path unfolds...</div>;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0a0505] text-rose-400 p-8 font-body">
        <p>{error || 'Challenge not found.'}</p>
        <Link to="/dashboard" className="text-[#d4a843] hover:text-[#e8c547] font-body">Return to dashboard</Link>
      </div>
    );
  }

  return <ChallengeWorkspace key={id} challenge={challenge} onSubmit={handleSubmit} onGuess={handleGuess} />;
}
