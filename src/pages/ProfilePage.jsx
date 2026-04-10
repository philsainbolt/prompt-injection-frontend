import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { authAPI } from '../services/api';
import { useSubmissions } from '../hooks/useSubmissions';
import SubmissionRow from '../components/SubmissionRow';

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

  if (loading) return <div className="min-h-screen bg-[#0a0505] text-[#a89878] p-8 font-body">Loading...</div>;
  if (!profile) return <div className="min-h-screen bg-[#0a0505] text-rose-400 p-8 font-body">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0a0505] text-[#f0d0b0]">
      <NavBar>
        <button onClick={() => navigate('/dashboard')} className="text-[#d4a843] hover:text-[#e8c547] font-body">&larr; Back to Dashboard</button>
      </NavBar>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-display text-[#d4a843] mb-8">My Profile</h1>
        <div className="bg-[#1a1210] border border-[#3d2d2d] rounded-lg p-6 space-y-4">
          <div>
            <p className="text-[#a89878] font-body">Username</p>
            <p className="text-2xl font-bold text-[#f0d0b0]">{profile.username}</p>
          </div>
          <div>
            <p className="text-[#a89878] font-body">Email</p>
            <p className="text-lg text-[#f0d0b0]">{profile.email}</p>
          </div>
          <div>
            <p className="text-[#a89878] font-body">Current Level</p>
            <p className="text-lg font-semibold text-[#f0d0b0]">{profile.progressLevel || 1}</p>
          </div>
        </div>

        <h2 className="text-2xl font-display text-[#d4a843] mt-12 mb-6">Submission History</h2>
        {subsLoading && (
          <p className="text-[#a89878] font-body">Loading submissions...</p>
        )}
        {subsError && (
          <p className="text-rose-400 font-body">Error loading submissions: {subsError}</p>
        )}
        {!subsLoading && !subsError && submissions.length === 0 && (
          <p className="text-[#a89878] font-body">No submissions yet.</p>
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
