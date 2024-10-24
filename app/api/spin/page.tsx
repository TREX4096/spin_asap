"use client"
import axios from 'axios';
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
  },
  {
    id: 4,
    scenario: "New technology implementation",
    easy: "Use existing tools",
    tough: "Learn and adopt new tech",
    spinCommitment: 3,
    careerPoints: 70
  },
  {
    id: 5,
    scenario: "New technology implementation",
    easy: "Use existing tools",
    tough: "Learn and adopt new tech",
    spinCommitment: 3,
    careerPoints: 70
  },
  {
    id: 6,
    scenario: "New technology implementation",
    easy: "Use existing tools",
    tough: "Learn and adopt new tech",
    spinCommitment: 3,
    careerPoints: 70
  },
  {
    id: 7,
    scenario: "New technology implementation",
    easy: "Use existing tools",
    tough: "Learn and adopt new tech",
    spinCommitment: 3,
    careerPoints: 70
  },
  {
    id: 8,
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
  const [showGetSpinsModal, setShowGetSpinsModal] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, spins: 10, title: 'Task 1' },
    { id: 2, spins: 10, title: 'Task 2' }
  ]);

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
      ctx.font = '14px "Poppins", sans-serif';
      const scenarioText = SCENARIOS[i].scenario;
      const truncatedText = scenarioText.length > 20 ? scenarioText.substring(0, 17) + '...' : scenarioText;
      ctx.fillText(truncatedText, radius - 20, 5);
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
      
        // Proceed to update the points and spins left after the animation finishes
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updatePoints/${process.env.NEXT_PUBLIC_USER_ID}`,
          {
            points: 0,
            spinUpdate: 1
          }
        )
        .then((response) => {
          // Assuming response.data.user.spinleft contains the updated spins left
          const updatedSpinsLeft = response.data.user.spinLeft;
          console.log(updatedSpinsLeft)
          
          // Update the spins left based on the server response
          setSpinsLeft(updatedSpinsLeft);
        })
        .catch((error) => {
          console.error("Error updating spins left:", error);
          // Handle the error, e.g., show a message to the user
        });
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
  <div className="bg-white/30 backdrop-blur-sm rounded-full p-1 flex items-center">
    <button
      onClick={() => setLanguage('en')}
      className={`px-3 py-1 rounded-full text-gray-800 text-sm ${
        language === 'en' ? 'bg-white' : ''
      }`}
    >
      En
    </button>
    <button
      onClick={() => setLanguage('ar')}
      className={`px-3 py-1 rounded-full text-gray-800 text-sm ${
        language === 'ar' ? 'bg-white' : ''
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
              <div className="text-xl font-bold">Global Rank: {rank}</div>
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
            <button 
  onClick={() => setShowGetSpinsModal(true)} 
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
>
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
                    axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updatePoints/${process.env.NEXT_PUBLIC_USER_ID}`,
          {
            points: currentScenario.careerPoints,
            spinUpdate: 0
          }
        )
        .then((response) => {
          // Assuming response.data.user.spinleft contains the updated spins left
          const updatedCareerIncrease = response.data.user.CareerPoints;
          
          // Update the spins left based on the server response
          setCareerPoints(updatedCareerIncrease);
        })
        .catch((error) => {
          console.error("Error updating spins left:", error);
          // Handle the error, e.g., show a message to the user
        });
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
        {showGetSpinsModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Get More Spins</h2>
        <button
          onClick={() => setShowGetSpinsModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {tasks.map(task => (
          <div 
            key={task.id}
            className="bg-blue-50 rounded-xl p-4 border border-blue-200 hover:border-blue-400 transition-colors cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="relative w-16 h-16 mx-auto mb-2">
            <svg width="80" height="90" viewBox="0 0 134 174" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_144_558)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M54.0462 29.9465C51.3584 22.0227 48.9379 14.0099 46.8953 5.87172C54.5128 -2.48299 83.9541 -1.37267 92.4212 5.74121L84.5819 24.3664C88.7978 18.8315 90.215 16.5599 92.73 13.4764C93.7849 14.1695 94.7841 14.9438 95.7185 15.7921C97.9486 17.8095 99.9399 20.0387 100.343 23.146C100.604 25.161 100.028 27.2079 98.2332 29.3011L80.2473 50.2346C77.9322 49.8553 75.6699 49.3 73.4745 48.5204C74.4945 46.1217 75.7246 43.4827 76.7446 41.0836L70.1966 48.1509C63.3749 46.7127 57.889 47.5708 52.777 50.2723L34.5366 28.3971C33.4531 27.0924 32.9599 25.7877 32.964 24.483C32.9814 19.1951 40.8605 14.6315 45.0022 12.904L54.0462 29.9465Z" fill="#3E7D52"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M47.3744 7.7508L46.8956 5.87139C48.6345 3.96445 51.5118 2.55133 55.0158 1.59021C57.0547 9.27302 59.3861 16.8593 61.9348 24.3732L51.9022 5.46696C50.6221 6.00019 49.0195 6.77949 47.3744 7.7508ZM84.4747 45.3145L80.2469 50.235C77.9322 49.8553 75.6695 49.3004 73.4748 48.5204C74.104 47.0393 74.8135 45.4674 75.5046 43.916C76.9007 44.0363 78.3465 44.2518 79.8507 44.5689L87.1166 36.7284C85.9845 39.3898 84.6193 42.318 83.4888 44.9787C83.8163 45.0953 84.1448 45.2071 84.4747 45.3145ZM74.1986 43.831L70.1963 48.151C63.3748 46.713 57.8893 47.5712 52.7773 50.2727L34.5366 28.3968C33.4534 27.0921 32.9599 25.788 32.9643 24.483C32.9745 21.3366 35.7691 18.4468 38.9035 16.2581C38.6763 16.929 38.5491 17.6151 38.5467 18.3125C38.5423 19.76 39.0892 21.2068 40.2908 22.6542L60.5268 46.9224C64.7152 44.7096 69.1294 43.6111 74.1986 43.831Z" fill="#366F49"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M77.4203 69.4698L73.8605 53.2005C89.1079 56.0342 113.547 87.0278 121.444 101.12C125.475 108.312 129.006 116.237 131.896 125.095C137.654 146.533 132.108 166.589 108.835 171.26C94.2523 174.188 67.0575 174.395 51.7216 173.602C35.2348 172.75 9.7211 172.776 3.05647 155.86C-7.70026 128.557 12.0076 96.0303 29.9772 76.1222C32.3416 73.5026 34.7866 71.061 37.3163 68.8078C43.8527 63.0608 50.9009 56.2412 59.3147 53.4058L51.188 68.5277L62.9912 52.8906H69.211L77.4203 69.4698Z" fill="#3E7D52"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M77.4207 69.4695L73.8608 53.2002C108.206 65.8993 167.197 156.49 99.6303 157.233C-15.1699 158.496 6.89791 143.139 37.3166 68.8078C43.853 63.0612 50.9016 56.2412 59.3147 53.4055L51.1876 68.5277L62.9915 52.8909H69.211L77.4207 69.4695Z" fill="#499560"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M77.4207 69.4695L75.8783 62.4209C102.703 82.8289 137.041 139.262 111.163 155.861C107.867 156.711 104.033 156.805 99.6303 157.233C-17.0061 168.59 5.73581 149.717 37.3166 68.8078C41.588 65.0524 46.078 60.8388 51.0244 57.5786L43.3735 71.8152L55.1774 56.1787H57.8241L51.1877 68.5278L60.5098 56.1787H61.3968L69.6065 72.7569L66.0467 56.4876C68.1999 57.3838 70.4894 58.6637 72.8593 60.258L77.4207 69.4695Z" fill="#3E7D52"/>
<path d="M95.5685 130.809C104.233 114.543 98.0612 94.3385 81.7839 85.6804C65.5066 77.0224 45.2875 83.1896 36.6233 99.4551C27.959 115.721 34.1306 135.925 50.4079 144.583C66.6851 153.241 86.9042 147.074 95.5685 130.809Z" fill="#68BE7C"/>
<path d="M91.5 122.625C91.5 122.901 91.2761 123.125 91 123.125H90.9888H78.6751C77.4184 123.125 76.3822 122.875 75.621 122.311L75.6149 122.306L75.6149 122.306C74.6735 121.586 74.2498 120.44 74.2498 119.012C74.2498 118.218 74.2996 117.375 74.3826 116.484C74.4661 115.589 74.5914 114.665 74.7624 113.746C74.8049 113.518 74.9984 113.35 75.23 113.338L76.3505 113.285C76.5984 113.273 76.8175 113.445 76.8651 113.688C76.9051 113.893 76.9898 114.088 77.1148 114.262C77.2377 114.432 77.3969 114.578 77.5836 114.689C78.0494 114.929 78.5741 115.047 79.1049 115.032L79.1195 115.032H87.8349C87.414 112.796 86.7454 111.023 85.8476 109.691C84.9685 108.42 83.8074 107.348 82.4454 106.553C82.2545 106.442 82.1594 106.218 82.2116 106.003L84.1873 97.868C84.2265 97.7067 84.3432 97.5754 84.4987 97.5174C84.6543 97.4595 84.8284 97.4826 84.9635 97.5789C87.3474 99.2792 89.1438 101.632 90.1142 104.332C91.0409 106.86 91.4913 110.176 91.4888 114.254M91.5 122.625L91.4888 114.254M91.5 122.625C91.5 122.589 91.4961 122.553 91.4888 122.519M91.5 122.625L91.4888 122.519M91.4888 114.254V122.519M91.4888 114.254V122.519M54.8945 131.523C54.8632 131.283 54.6649 131.1 54.4235 131.088C54.3127 131.083 54.2074 131.114 54.1205 131.172C53.563 131.31 52.996 131.411 52.4236 131.474C52.3241 131.469 52.1471 131.431 51.8744 131.327C51.5903 131.218 51.2382 131.05 50.8182 130.82C50.44 130.612 50.1653 130.441 49.9816 130.302C50.0199 130.279 50.059 130.258 50.0989 130.238C50.3283 130.125 50.5825 130.065 50.8419 130.061C50.9172 130.062 51.084 130.091 51.374 130.192C51.655 130.29 52.0128 130.441 52.4511 130.65C52.6753 130.756 52.9437 130.682 53.0816 130.476C53.2868 130.168 53.467 129.846 53.6206 129.512C53.6254 129.501 53.6298 129.491 53.6339 129.48C53.7415 129.195 53.7932 128.893 53.786 128.59C53.8004 128.154 53.6433 127.732 53.3511 127.407C53.3451 127.401 53.3388 127.394 53.3324 127.388C53.176 127.232 52.9884 127.111 52.7824 127.031C52.5795 126.953 52.3626 126.916 52.1452 126.923C50.7681 126.927 49.4853 127.819 48.2785 129.36C48.0457 129.647 47.8447 129.957 47.6791 130.285C47.5123 130.583 47.4134 130.913 47.3901 131.253C47.3888 131.271 47.3885 131.29 47.3894 131.309C47.4078 131.726 47.5796 132.12 47.8689 132.421C48.0037 132.567 48.1472 132.704 48.2985 132.832C48.0659 132.957 47.8436 133.1 47.6339 133.26C47.6117 133.277 47.591 133.296 47.572 133.316C47.1633 133.754 46.8203 134.245 46.5534 134.775C46.4639 134.953 46.4884 135.167 46.6159 135.32C46.7434 135.473 46.9495 135.536 47.1406 135.48L52.9603 133.775C53.3719 133.672 53.7539 133.477 54.074 133.203C54.0902 133.189 54.1054 133.174 54.1196 133.158C54.4637 132.778 54.7139 132.327 54.8505 131.838C54.8932 131.752 54.9115 131.653 54.8982 131.552L54.8945 131.523ZM49.7565 130.095C49.7566 130.095 49.7574 130.096 49.7585 130.098C49.7571 130.096 49.7565 130.095 49.7565 130.095ZM54.9696 115.049C54.9694 115.008 54.9642 114.968 54.9546 114.929C54.9505 113.131 54.8563 111.251 54.6725 109.302C54.4368 106.713 54.0113 103.659 53.3973 100.142L53.397 100.14L51.7499 90.9121C51.7127 90.7035 51.548 90.541 51.3389 90.5066C51.1298 90.4722 50.9217 90.5734 50.8196 90.7591C49.8029 92.6078 49.0141 94.1844 48.4416 95.5186C48.1559 96.1842 47.9375 96.7553 47.7897 97.2344C47.6442 97.7061 47.557 98.1207 47.557 98.4622C47.557 98.4744 47.5574 98.4865 47.5583 98.4985C47.6095 99.2026 47.7223 99.9013 47.8955 100.587C48.5125 103.335 48.9497 105.71 49.2198 107.7C49.4916 109.703 49.7296 111.735 49.9043 113.766C50.0792 115.8 50.1709 117.32 50.1713 118.371C50.1181 120.16 49.8934 121.94 49.5 123.69C49.4456 123.932 49.577 124.177 49.8087 124.266L51.4594 124.9C51.6943 124.99 51.9595 124.892 52.0788 124.67C52.9832 122.992 53.7438 121.245 54.3531 119.448C54.3554 119.441 54.3577 119.434 54.3597 119.427C54.7735 118.002 54.9789 116.528 54.9696 115.049ZM59.9118 130.252C59.9118 130.528 60.1356 130.752 60.4118 130.752H68.0196C68.2957 130.752 68.5196 130.528 68.5196 130.252V122.947C68.5196 122.671 68.2957 122.447 68.0196 122.447H60.4118C60.1356 122.447 59.9118 122.671 59.9118 122.947V130.252Z" fill="white" stroke="#3E7D52" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_144_558">
<rect width="134" height="174" fill="white"/>
</clipPath>
</defs>
</svg>

              <div className="absolute inset-0 flex items-center justify-center text-green-700 font-bold">
                {task.spins}
              </div>
            </div>
            <div className=" text-center text-gray-700 font-medium">
              {task.title}: {task.spins} spins
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default CareerDecisionGame;