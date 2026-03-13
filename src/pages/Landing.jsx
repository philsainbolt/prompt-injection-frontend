import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CHALLENGES } from '../data/challenges';
import { progressAPI } from '../services/api';
import { isLevelUnlocked, mergeProgress, readLocalProgress, saveLocalProgress } from '../services/progress';

export default function Landing() {
  const [beatenLevels, setBeatenLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    const syncProgress = async () => {
      const local = readLocalProgress();
      setBeatenLevels(local);

      try {
        const res = await progressAPI.get();
        const remote = Array.isArray(res.data?.beatenLevels)
          ? res.data.beatenLevels
          : Array.isArray(res.data?.beaten)
            ? res.data.beaten
            : [];
        const merged = mergeProgress(local, remote);
        setBeatenLevels(merged);
        saveLocalProgress(merged);
        setSyncError('');
      } catch {
        setSyncError('Backend unavailable. Using saved local progress.');
      } finally {
        setLoading(false);
      }
    };

    syncProgress();
  }, []);

  const beatenSet = useMemo(() => new Set(beatenLevels.map(String)), [beatenLevels]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border border-cyan-500/30 bg-slate-900/80 p-6 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <p className="text-cyan-400 text-sm tracking-[0.2em] uppercase font-mono">Prompt Injection Lab</p>
          <h1 className="text-4xl font-bold font-mono mt-2">Red Team Challenge Terminal</h1>
          <p className="text-slate-300 mt-3">Clear each level in order. Next level unlocks only after previous is beaten.</p>
          {syncError && <p className="mt-4 text-amber-300">{syncError}</p>}
        </header>

        <section className="space-y-4">
          {CHALLENGES.map((challenge) => {
            const unlocked = isLevelUnlocked(challenge.id, beatenLevels);
            const beaten = beatenSet.has(String(challenge.id));

            return (
              <article
                key={challenge.id}
                className="border rounded-lg p-5 bg-slate-900/70 border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold font-mono">{challenge.title}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        beaten
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : unlocked
                            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-600'
                      }`}
                    >
                      {beaten ? 'BEATEN' : unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                  <p className="text-slate-300">{challenge.description}</p>
                </div>
                {unlocked ? (
                  <Link
                    to={`/challenge/${challenge.id}`}
                    className="inline-flex justify-center items-center px-4 py-2 bg-cyan-500 text-slate-950 rounded font-semibold hover:bg-cyan-400 transition"
                  >
                    Enter Level
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded font-semibold bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  >
                    Locked
                  </button>
                )}
              </article>
            );
          })}
        </section>

        {loading && <p className="mt-6 text-slate-400">Syncing progress...</p>}
      </div>
    </div>
  );
}
