import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    const response = await authAPI.login(email, password);
    login(response.data.user, response.data.token);
    navigate('/dashboard');
  };

  const handleSignup = async ({ username, email, password }) => {
    await authAPI.register(username, email, password);
    const loginResponse = await authAPI.login(email, password);
    login(loginResponse.data.user, loginResponse.data.token);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="border border-cyan-500/30 bg-slate-900/80 p-6 rounded-lg">
          <p className="text-cyan-400 text-sm tracking-[0.2em] uppercase font-mono">Prompt Injection Lab</p>
          <h1 className="text-4xl font-bold font-mono mt-2">Red Team Challenge Terminal</h1>
          <p className="text-slate-300 mt-3">Register or log in to start the 5-level challenge ladder.</p>
          <Link to="/dashboard" className="inline-block mt-4 text-cyan-300 underline">Already signed in? Go to dashboard</Link>
        </section>

        <section className="space-y-6">
          <div className="border border-slate-700 bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <LoginForm onSubmit={handleLogin} />
          </div>
          <div className="border border-slate-700 bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create Account</h2>
            <SignupForm onSubmit={handleSignup} />
          </div>
        </section>
      </div>
    </div>
  );
}
