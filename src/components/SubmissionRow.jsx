import { useState } from 'react';

export default function SubmissionRow({ submission, onUpdate, onDelete }) {
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
    <div className="bg-[#1a1210] border border-[#3d2d2d] rounded-lg p-4 space-y-3">
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medieval font-semibold text-[#d4a843]">
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
            className="w-full border border-[#3d2d2d] bg-[#0a0505] text-[#f0d0b0] rounded-lg p-2 text-sm font-code focus:outline-none focus:ring-2 focus:ring-[#d4953a]"
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 text-sm bg-[#d4953a] text-[#1a1210] font-medieval font-semibold rounded-lg hover:bg-[#e8c547] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditText(submission.userPrompt || '');
              }}
              className="px-3 py-1 text-sm bg-[#2a2020] text-[#a89878] rounded-lg hover:bg-[#3d2d2d] font-body"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#a89878] font-code">{truncatedPrompt}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6b5040]">{timestamp}</span>
        <div className="flex gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 text-sm bg-[#2a2020] text-[#a89878] rounded-lg hover:bg-[#3d2d2d] font-body"
            >
              Edit
            </button>
          )}
          {confirmDelete ? (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 text-sm bg-[#2a2020] text-[#a89878] rounded-lg hover:bg-[#3d2d2d] font-body"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-1 text-sm bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
