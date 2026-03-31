import { useState, useEffect } from 'react';
import { challengeAPI } from '../services/api';

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await challengeAPI.getAll();
        setChallenges(response.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, loading, error };
}
