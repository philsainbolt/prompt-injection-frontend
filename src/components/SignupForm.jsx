import { useState } from 'react';
import FormInput from './FormInput';

export default function SignupForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({ username, email, password });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="signup-form">
      {error && <div className="p-4 bg-rose-500/10 text-rose-300 border border-rose-500/40 rounded">{error}</div>}
      <FormInput
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <FormInput
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-500 text-slate-950 font-semibold py-2 rounded hover:bg-cyan-400 disabled:opacity-50"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
