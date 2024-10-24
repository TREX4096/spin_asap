"use client"
import React, { useState, useRef, useEffect } from 'react';

interface Leader {
  id: string;
  rank: number;
  username: string;
  points: number;
}

interface Scenario {
  id: number;
  scenario: string;
  easy: string;
  tough: string;
  spinCommitment: number;
  careerPoints: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    scenario: "A major project needs overtime work",
    easy: "Stick to regular hours",
    tough: "Put in extra hours",
    spinCommitment: 2,
    careerPoints: 50
  },
  {
    id: 2,
    scenario: "Team conflict arises",
    easy: "Let others handle it",
    tough: "Mediate the situation",
    spinCommitment: 1,
    careerPoints: 30
  },
  {
    id: 3,
    scenario: "New technology implementation",
    easy: "Use existing tools",
    tough: "Learn and adopt new tech",
    spinCommitment: 3,
    careerPoints: 70
  }
];

const INITIAL_LEADERS: Leader[] = [
  { id: '1', rank: 1, username: 'Alice150', points: 150 },
  { id: '2', rank: 2, username: 'Bob120', points: 120 },
  { id: '3', rank: 3, username: 'Charlie100', points: 100 },
];

const CareerDecisionGame = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [careerPoints, setCareerPoints] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(10);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [rank, setRank] = useState(4);
  const [leaders, setLeaders] = useState<Leader[]>(INITIAL_LEADERS);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchLeaderboard = async () => {
    try {
      // Simulating API call
      // In production, replace with actual API call:
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`);
      // setLeaders(response.data.leaders);
      setLeaders(INITIAL_LEADERS);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2.2;
    const segments = SCENARIOS.length;
    const anglePerSegment = (2 * Math.PI) / segments;

    ctx.clearRect(0, 0, width, height);
    ctx.translate(width/2, height/2);

    // Gold border
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Segments
    for (let i = 0; i < segments; i++) {
      const startAngle = i * anglePerSegment;
      const endAngle = (i + 1) * anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 2, startAngle, endAngle);
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#DC2626';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = i % 2 === 0 ? '#000000' : '#FFFFFF';
      ctx.font = '16px "Poppins", sans-serif';
      ctx.fillText('LOREM IPSUM', radius - 30, 0);
      ctx.restore();
    }

    // Center point
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    const spinDuration = 4000;
    const startAngle = angle;
    const spinAmount = 360 * 5 + Math.random() * 360;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentAngle = startAngle + spinAmount * easeOut(progress);
      
      setAngle(currentAngle % 360);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const selectedIndex = Math.floor((currentAngle % 360) / (360 / SCENARIOS.length));
        setCurrentScenario(SCENARIOS[selectedIndex]);
        setSpinsLeft(prev => prev - 1);
      }
    };
    
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    drawWheel();
    fetchLeaderboard();
  }, [angle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with Language Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Career Decision Game</h1>
          <div className="bg-black rounded-full p-1 flex items-center">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-white text-sm ${
                language === 'en' ? 'bg-white/20' : ''
              }`}
            >
              En
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 rounded-full text-white text-sm ${
                language === 'ar' ? 'bg-white/20' : ''
              }`}
            >
              عربي
            </button>
          </div>
        </div>

        {/* Game Container */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-8">
          {/* Stats Display */}
          <div className="flex justify-between mb-6">
            <div className="space-y-1">
              <div className="text-xl font-bold">Your Rank: {rank}</div>
              <div className="text-xl font-bold">Career points: {careerPoints}</div>
            </div>
            <div className="text-xl font-bold">
              Spin: {spinsLeft}
            </div>
          </div>

          {/* Wheel Container */}
          <div className="relative mb-6 aspect-square">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl">
              <span role="img" aria-label="pointer">📍</span>
            </div>
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="w-full h-full"
              style={{
                transform: `rotate(${angle}deg)`,
                transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={spinWheel}
              disabled={isSpinning || spinsLeft <= 0}
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full disabled:opacity-50"
            >
              Click to spin
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
              Click to get more spins
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Leader Board</h2>
          <div className="flex justify-center items-end space-x-8">
            {leaders.map((leader) => (
              <div key={leader.id} className="text-center">
                <div 
                  className={`${
                    leader.rank === 1 ? 'w-24 h-24' : 'w-20 h-20'
                  } bg-gray-200 rounded-full flex items-center justify-center mb-2`}
                >
                  <div className={`${
                    leader.rank === 1 ? 'text-2xl' : 'text-xl'
                  } font-bold`}>
                    #{leader.rank}
                  </div>
                </div>
                <div className="font-semibold">{leader.username}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario Modal */}
        {currentScenario && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">{currentScenario.scenario}</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setCurrentScenario(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded"
                >
                  {currentScenario.easy}
                </button>
                <button
                  onClick={() => {
                    setCareerPoints(prev => prev + currentScenario.careerPoints);
                    setCurrentScenario(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                  {currentScenario.tough}
                  <span className="text-sm ml-2">
                    (+{currentScenario.careerPoints} pts)
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerDecisionGame;