import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useSession } from 'next-auth/react'; // Import useSession to access session data

interface Scenario {
  scenario: string;
  easy: string;
  tough: string;
  spinCommitment: number;
  careerPoints: number;
}

interface WheelProps {
  segments: Scenario[];
  // increaseSpinleft: () => void;
}

const Wheel: React.FC<WheelProps> = ({ segments }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: session } = useSession(); // Access session data
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [careerPoints, setCareerPoints] = useState(0); // Holds fetched career points
  const [spinsLeft, setSpinsLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  // Fetch the user's career points
  const fetchCareerPoints = async () => {
    if (session) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updatePoints/${localStorage.getItem('userId')}`,{
          points: 0,
          spinUpdate: 0,
        });
        setCareerPoints(response.data.user.CareerPoints);
        setSpinsLeft(response.data.user.spinLeft) // Adjust based on your response structure
      } catch (error) {
        console.error('Error fetching career points:', error);
      }
    }
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (canvas && segments.length > 0) {
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const radius = width / 2;
      const anglePerSegment = (2 * Math.PI) / segments.length;

      ctx?.clearRect(0, 0, width, height);

      segments.forEach((segment, index) => {
        const startAngle = index * anglePerSegment;
        const endAngle = (index + 1) * anglePerSegment;

        ctx?.beginPath();
        ctx?.moveTo(radius, radius);
        ctx?.arc(radius, radius, radius, startAngle, endAngle);
        ctx!.fillStyle = `hsl(${(index * 360) / segments.length}, 70%, 50%)`;
        ctx?.fill();
        ctx?.stroke();

        ctx?.save();
        ctx?.translate(radius, radius);
        ctx?.rotate(startAngle + anglePerSegment / 2);
        ctx!.textAlign = 'right';
        ctx!.fillStyle = 'white';
        ctx!.font = 'bold 14px Arial';
        ctx?.fillText(segment.scenario.slice(0, 15) + '...', radius - 10, 5);
        ctx?.restore();
      });
    }
  };

  const easeOut = (t: number) => {
    return 1 - Math.pow(1 - t, 3);
  };

  const spinWheel = async () => {
    if (isSpinning || spinsLeft <= 0) return;

    setCurrentScenario(null);
    const duration = 4000;
    const start = performance.now();
    const numSegments = segments.length;
    const randomAngle = Math.random() * 360 + 360 * numSegments;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentAngle = randomAngle * easedProgress;

      setAngle((prevAngle) => (prevAngle + currentAngle) % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        calculateResult();
      }
    };

    setIsSpinning(true);
    setSpinsLeft((prevSpins) => prevSpins - 1);

    // No need to update points here; it's handled after choices are made
    requestAnimationFrame(animate);
  };

  const calculateResult = () => {
    if (segments.length > 0) {
      const totalAngle = (angle % 360 + 360) % 360;
      const anglePerSegment = 360 / segments.length;
      const winningIndex = Math.floor(totalAngle / anglePerSegment);
      const correctedWinningIndex = (segments.length - winningIndex - 1 + segments.length) % segments.length;
      setCurrentScenario(segments[correctedWinningIndex]);

      // // Save to database (you may need to adjust this based on your API)
      // axios.post('/api/save', {
      //   scenario: segments[correctedWinningIndex].scenario,
      //   result: 'Not chosen yet',
      // }).catch((error) => {
      //   console.error('Error saving data:', error);
      // });
    }
  };

  const makeChoice = async (isTough: boolean) => {
    if (currentScenario) {
      if (isTough) {
        const newCareerPoints = careerPoints + currentScenario.careerPoints;
        const newSpinsLeft = spinsLeft - currentScenario.spinCommitment;

        try {
          if (session) {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updatePoints/${localStorage.getItem('userId')}`, {
              points: currentScenario.careerPoints,
              spinUpdate: currentScenario.spinCommitment,
            });
          }
        } catch (error) {
          console.error('Error updating user points:', error);
        }

        setCareerPoints(newCareerPoints); // Update local state for the UI
        setSpinsLeft(newSpinsLeft);
      }
      setCurrentScenario(null);

      if (spinsLeft <= 0) {
        setGameOver(true);
      }

      // // Update the database with the choice (you may need to adjust this based on your API)
      // axios.post('/api/update', {
      //   scenario: currentScenario.scenario,
      //   choice: isTough ? 'tough' : 'easy',
      // }).catch((error) => {
      //   console.error('Error updating data:', error);
      // });
    }
  };

  const resetGame = () => {
    setCareerPoints(0); // You might want to keep this as is if points are fetched
    setSpinsLeft(10);
    setCurrentScenario(null);
    setGameOver(false);
    setAngle(0);
  };

  useEffect(() => {
    fetchCareerPoints(); // Fetch career points when the session is available
  }, [session]);

  useEffect(() => {
    drawWheel();
  }, [segments, angle]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-2xl font-bold text-center">Career Decision Wheel</CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <p className="text-lg">Career Points: {careerPoints}</p>
          <p className="text-lg">Spins Left: {spinsLeft}</p>
        </div>
        <div className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-2xl">▼</div>
          <canvas ref={canvasRef} width="300" height="300" className="mx-auto" style={{ transform: `rotate(${angle}deg)` }}></canvas>
        </div>
        {currentScenario ? (
          <div className="mt-4 space-y-4">
            <h3 className="text-xl font-semibold">{currentScenario.scenario}</h3>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => makeChoice(false)} variant="outline">
                {currentScenario.easy}
              </Button>
              <Button onClick={() => makeChoice(true)} variant="default">
                {currentScenario.tough} (+{currentScenario.careerPoints} points, +{currentScenario.spinCommitment} spins)
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={spinWheel} disabled={isSpinning || spinsLeft === 0 || gameOver} className="w-full mt-4">
            {gameOver ? "Game Over" : "Spin"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {gameOver && (
          <div className="text-center">
            <p className="text-xl mb-2">Game Over! Final Score: {careerPoints}</p>
            <Button onClick={resetGame} variant="destructive">
              Play Again
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Wheel;
