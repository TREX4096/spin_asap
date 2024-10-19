import React, { useEffect, useState } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
}

const dummyPlayers: Player[] = [
  { id: 1, name: "Alice", score: 150 },
  { id: 2, name: "Bob", score: 120 },
  { id: 3, name: "Charlie", score: 100 },
  { id: 4, name: "You", score: 90 }, // Current user
];

const LeaderboardPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching data from the backend
    const fetchLeaderboard = async () => {
      // Replace this with your actual fetch call
      const response = await new Promise<Player[]>((resolve) => {
        setTimeout(() => resolve(dummyPlayers), 1000);
      });

      setPlayers(response);
      const currentUserIndex = response.findIndex((player) => player.name === "You");
      setUserRank(currentUserIndex !== -1 ? currentUserIndex + 1 : null); // +1 for rank
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-80">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <ul>
          {players.slice(0, 3).map((player) => (
            <li key={player.id} className="flex justify-between mb-2">
              <span>{player.name}</span>
              <span>{player.score}</span>
            </li>
          ))}
        </ul>
        {userRank && (
          <div className="mt-4">
            <h3 className="font-semibold">Your Rank: {userRank}</h3>
            <p>Score: {players[userRank - 1]?.score}</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPopup;
