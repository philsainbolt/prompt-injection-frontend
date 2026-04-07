import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ChallengeCard from '../components/ChallengeCard';
import { useAuth } from '../hooks/useAuth';
import { progressAPI, challengeAPI } from '../services/api';
import { isLevelUnlocked } from '../services/progress';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [beatenLevels, setBeatenLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [challengeRes, progressRes] = await Promise.all([
          challengeAPI.getAll(),
          progressAPI.get(),
        ]);
        setChallenges(challengeRes.data || []);
        const levels = Array.isArray(progressRes.data?.beatenLevels)
          ? progressRes.data.beatenLevels
          : Array.isArray(progressRes.data?.beaten)
            ? progressRes.data.beaten
            : [];
        setBeatenLevels(levels);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar>
        <Link to="/profile" className="text-slate-300 hover:text-cyan-400">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
        >
          Logout
        </button>
      </NavBar>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Available Challenges</h2>

        {loading && <p className="text-slate-300">Loading challenges...</p>}
        {error && <p className="text-rose-400">Error loading challenges: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const level = challenge.level || challenge.id;
              const locked = !isLevelUnlocked(level, beatenLevels);
              return <ChallengeCard key={challenge.id || challenge._id} challenge={challenge} locked={locked} />;
            })}
          </div>
        )}
      </main>
    </div>
  );
}
