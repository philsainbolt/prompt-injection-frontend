import { Link } from 'react-router-dom';

export default function ChallengeCard({ challenge, locked = false }) {
  return (
    <div className={`border rounded-lg p-6 transition ${locked ? 'border-slate-700 bg-slate-800 opacity-60' : 'border-slate-700 hover:border-cyan-500/50 bg-slate-900'}`}>
      <h3 className="text-xl font-bold mb-2 text-slate-100">{challenge.title}</h3>
      <p className="text-slate-300 mb-4">{challenge.description}</p>
      <div className="flex justify-between items-center">
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Level {challenge.level || challenge.id}
        </span>

        {locked ? (
          <button disabled className="bg-slate-700 text-slate-400 px-4 py-2 rounded cursor-not-allowed">Locked</button>
        ) : (
          <Link
            to={`/challenge/${challenge._id || challenge.id}`}
            className="bg-cyan-500 text-slate-950 px-4 py-2 rounded font-semibold hover:bg-cyan-400"
          >
            Start
          </Link>
        )}
      </div>
    </div>
  );
}
