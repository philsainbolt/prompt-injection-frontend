import { useState, useEffect, useCallback } from 'react';
import { submissionAPI } from '../services/api';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionAPI.getAll();
      setSubmissions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const deleteSubmission = async (id) => {
    try {
      await submissionAPI.delete(id);
      await fetchSubmissions();
    } catch (err) {
      console.error('Delete submission failed:', err);
      throw err;
    }
  };

  const updateSubmission = async (id, data) => {
    try {
      await submissionAPI.update(id, data);
      await fetchSubmissions();
    } catch (err) {
      console.error('Update submission failed:', err);
      throw err;
    }
  };

  return { submissions, loading, error, deleteSubmission, updateSubmission, refresh: fetchSubmissions };
}
