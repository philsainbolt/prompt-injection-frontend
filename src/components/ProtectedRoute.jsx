import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-300">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
