import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { challengeAPI } from '../services/api';

export default function ChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await challengeAPI.getById(id);
        setChallenge(res.data);
      } catch (err) {
        setError('Failed to load challenge');
      }
    };

    fetchChallenge();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await challengeAPI.submit(id, userInput);
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (error && !challenge) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  if (!challenge) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
        <p className="text-gray-600 mb-8">{challenge.description}</p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Challenge Details</h2>
          <p className="text-gray-700 mb-4">{challenge.explanation}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <label className="block text-lg font-semibold mb-2">Your Input:</label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your prompt injection attempt..."
            required
          />

          {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

          {response && (
            <div className={`p-4 rounded mb-4 ${response.success ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <p className="font-bold">{response.success ? 'Success! 🎉' : 'Not quite...'}</p>
              <p>{response.hint}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </main>
    </div>
  );
}
