"use client";

import React, { useState } from 'react';
import Wheel from '@/components/wheel';
import PopupGfg from '@/components/popup';
import LeaderboardPopup from '@/components/leaderboard'; // Adjust the import path as necessary
import TopBar from '@/components/topbar';
import { useSession } from 'next-auth/react';

interface Scenario {
  scenario: string;
  easy: string;
  tough: string;
  spinCommitment: number;
  careerPoints: number;  
}

const CareerDecisionPage: React.FC = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false); 
  // const { data: session, status } = useSession();// State to control the leaderboard popup

  const scenarios: Scenario[] = [
    {
      scenario: "Pursue Higher Education",
      easy: "Skip higher education",
      tough: "Enroll in a Master's program",
      spinCommitment: 3,
      careerPoints: 5,
    },
    {
      scenario: "Start a New Business",
      easy: "Work for a stable job",
      tough: "Launch a startup with risks",
      spinCommitment: 4,
      careerPoints: 8,
    },
    {
      scenario: "Relocate for a Job Opportunity",
      easy: "Stay in the current city",
      tough: "Move to a new city for a better role",
      spinCommitment: 2,
      careerPoints: 4,
    },
    {
      scenario: "Invest in Skill Development",
      easy: "Stick with current skills",
      tough: "Enroll in an intensive course",
      spinCommitment: 3,
      careerPoints: 6,
    },
    {
      scenario: "Work-Life Balance",
      easy: "Prioritize work-life balance",
      tough: "Take on a challenging project with longer hours",
      spinCommitment: 2,
      careerPoints: 3,
    },
    {
      scenario: "Career Change",
      easy: "Stay in the current field",
      tough: "Switch to a new industry",
      spinCommitment: 4,
      careerPoints: 7,
    },
    {
      scenario: "Leadership Role",
      easy: "Continue as a team member",
      tough: "Accept a leadership role",
      spinCommitment: 3,
      careerPoints: 5,
    },
    {
      scenario: "Pursue an International Internship",
      easy: "Choose a local opportunity",
      tough: "Apply for a competitive international internship",
      spinCommitment: 5,
      careerPoints: 10,
    },
    {
      scenario: "Financial Investment",
      easy: "Save money in a regular account",
      tough: "Invest in stocks or mutual funds",
      spinCommitment: 2,
      careerPoints: 4,
    },
    {
      scenario: "Community Service",
      easy: "Focus solely on career",
      tough: "Volunteer for a cause",
      spinCommitment: 1,
      careerPoints: 2,
    },
  ];

  const handleToggleLeaderboard = () => {
    setShowLeaderboard((prev) => !prev); // Toggle the leaderboard visibility
  };
  

  return (
    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
      <TopBar username={localStorage.getItem('userId')}></TopBar>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <h1 className="text-4xl font-bold text-center mb-8">Career Decision Game</h1>
        <Wheel segments={scenarios}  />
        <button
          onClick={handleToggleLeaderboard}
          className="mt-6 bg-green-500 text-white rounded px-4 py-2"
        >
          {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </button>
      </div>
      <div className='justify-left'>
      <PopupGfg  />
      </div>

      {/* Leaderboard Popup */}
      {showLeaderboard && (
        <LeaderboardPopup onClose={handleToggleLeaderboard} />
      )}
    </div>
  );
};

export default CareerDecisionPage;
