import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { authAPI } from '../services/api';
import { useSubmissions } from '../hooks/useSubmissions';

function SubmissionRow({ submission, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(submission.userPrompt || '');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(submission._id || submission.id, { userPrompt: editText });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(submission._id || submission.id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete submission');
    }
    setConfirmDelete(false);
  };

  const truncatedPrompt = (submission.userPrompt || '').length > 80
    ? (submission.userPrompt || '').slice(0, 80) + '...'
    : (submission.userPrompt || '');

  const timestamp = submission.createdAt
    ? new Date(submission.createdAt).toLocaleString()
    : 'Unknown date';

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3">
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">
          Level {submission.challengeId || submission.level || '?'}
        </span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded ${
            submission.success
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}
        >
          {submission.success ? 'PASS' : 'FAIL'}
        </span>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            className="w-full border border-slate-600 bg-slate-950 text-slate-100 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 text-sm bg-cyan-500 text-slate-950 font-semibold rounded hover:bg-cyan-400 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditText(submission.userPrompt || '');
              }}
              className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 font-mono">{truncatedPrompt}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{timestamp}</span>
        <div className="flex gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 text-sm bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
            >
              Edit
            </button>
          )}
          {confirmDelete ? (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-1 text-sm bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    submissions,
    loading: subsLoading,
    error: subsError,
    deleteSubmission,
    updateSubmission,
  } = useSubmissions();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.profile();
        setProfile(res.data);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-300 p-8">Loading...</div>;
  if (!profile) return <div className="min-h-screen bg-slate-950 text-rose-400 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar>
        <button onClick={() => navigate('/dashboard')} className="text-cyan-400 hover:text-cyan-300">&larr; Back to Dashboard</button>
      </NavBar>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-4">
          <div>
            <p className="text-slate-400">Username</p>
            <p className="text-2xl font-bold text-slate-100">{profile.username}</p>
          </div>
          <div>
            <p className="text-slate-400">Email</p>
            <p className="text-lg text-slate-100">{profile.email}</p>
          </div>
          <div>
            <p className="text-slate-400">Current Level</p>
            <p className="text-lg font-semibold text-slate-100">{profile.progressLevel || 1}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6">Submission History</h2>
        {subsLoading && (
          <p className="text-slate-400">Loading submissions...</p>
        )}
        {subsError && (
          <p className="text-rose-400">Error loading submissions: {subsError}</p>
        )}
        {!subsLoading && !subsError && submissions.length === 0 && (
          <p className="text-slate-400">No submissions yet.</p>
        )}
        {!subsLoading && !subsError && submissions.length > 0 && (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <SubmissionRow
                key={sub._id || sub.id}
                submission={sub}
                onUpdate={updateSubmission}
                onDelete={deleteSubmission}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
