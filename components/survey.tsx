"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';

// TopBar Component
const TopBar = ({ showBack = true }) => {
  const router = useRouter();
  const [isEnglish, setIsEnglish] = useState(true);
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
        {showBack && (
          <button 
            onClick={() => router.back()}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-medium">Monopolyonwheels</h1>
          <button
            onClick={() => setIsEnglish(!isEnglish)}
            className="text-sm px-3 py-1 rounded-full border bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {isEnglish ? 'En' : 'عربي'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-green-400 h-2.5 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

// EachQuestion Component
const EachQuestion = ({
  question,
  questionId,
  options,
  ismarked,
  onOptionSelect,
  selectedOption,
  handleNavigation,
  loading
}) => {
  const handleOptionSelect = (optionId) => {
    onOptionSelect(optionId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">{question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedOption === opt.id
                ? 'border-green-400 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                  selectedOption === opt.id
                    ? 'border-green-400 bg-green-400'
                    : 'border-gray-300'
                }`}
              >
                {selectedOption === opt.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <label className="flex-1 cursor-pointer">{opt.option}</label>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => handleNavigation('prev')}
          className="px-6 py-2 bg-green-400 text-white rounded-full hover:bg-green-500 transition-colors"
        >
          Prev
        </button>
        <button
          onClick={() => handleNavigation('next')}
          disabled={!selectedOption || loading}
          className="px-6 py-2 bg-green-400 text-white rounded-full hover:bg-green-500 transition-colors disabled:bg-gray-300"
        >
          {loading ? "Submitting..." : "Next"}
        </button>
      </div>
    </div>
  );
};

// Survey Component
const Survey = ({ questions, formId, userId }) => {
  const router = useRouter();
  const unmarkedQuestions = questions.filter(question => !question.ismarked);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (unmarkedQuestions.length === 0) {
      router.push('/api/spin'); // If all questions are marked, redirect to /api/spin
    }
  }, [unmarkedQuestions]);

  const handleNavigation = async (direction) => {
    setLoading(true);
    setError(null);

    try {
        if (direction === 'next' && selectedOption) {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/mark/${process.env.NEXT_PUBLIC_USER_ID}`;
            const body = {
                formId,
                questionId: unmarkedQuestions[currentQuestionIndex].questionId,
                optionId: selectedOption,
            };

            // Send the answer to mark the question
            const response = await axios.post(url, body);

            // Check if we reached the last question
            if (currentQuestionIndex === unmarkedQuestions.length - 1) {
                // Update points
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updatePoints/${process.env.NEXT_PUBLIC_USER_ID}`,
                    {
                        points: 0,
                        spinUpdate: -10,
                    }
                );

                // Redirect to /api/spin
                router.push('/api/spin');
            } else {
                // Move to the next question
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption("");
            }
        } else if (direction === 'prev' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setSelectedOption("");
        }
    } catch (err) {
        setError("Error submitting answer or updating points. Please try again.");
        console.error(err);
    } finally {
        setLoading(false);
    }
};

  if (unmarkedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="max-w-2xl mx-auto pt-16 px-4">
          <div className="mt-8 text-center p-6 bg-white rounded-lg shadow">
            <p className="text-gray-600">No unmarked questions available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = unmarkedQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="max-w-2xl mx-auto pt-16 px-4">
        {/* Progress Bar */}
        <ProgressBar current={currentQuestionIndex + 1} total={unmarkedQuestions.length} />

        {/* Question Component */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <EachQuestion
            question={currentQuestion.question}
            questionId={currentQuestion.questionId}
            options={currentQuestion.options}
            ismarked={currentQuestion.ismarked}
            onOptionSelect={setSelectedOption}
            selectedOption={selectedOption}
            handleNavigation={handleNavigation}
            loading={loading}
          />
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Survey;
