import React from 'react';
import { Link } from 'react-router-dom';

export default function ChallengeCard({ challenge }) {
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
      <p className="text-gray-600 mb-4">{challenge.description}</p>
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <Link
          to={`/challenge/${challenge._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start
        </Link>
      </div>
    </div>
  );
}
