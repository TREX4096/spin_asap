import React, { useState, useEffect } from 'react';
import EachQuestion from './option';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Option {
  id: string;
  option: string;
}

interface Question {
  question: string;
  questionId: string;
  options: Option[];
  ismarked: boolean;
}

interface Page1Props {
  questions: Question[];
  onProgressUpdate: (remaining: number) => void;
  userId: string;
}

const Survey: React.FC<Page1Props> = ({ questions, onProgressUpdate, userId }) => {
  const router = useRouter();
  const unmarkedQuestions = questions.filter(question => !question.ismarked);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Track the selected option

  const handleAnswer = async (optionIndex: string, questionId: string) => {
    setSelectedOption(optionIndex); // Set the selected option

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/mark/${userId}`;
      const body = {
        optionId: optionIndex,
        questionId: questionId,
      };

      await axios.post(url, body); // Send the response to the backend
      console.log("Response submitted successfully");
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < unmarkedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset the selected option for the next question
    } else {
      // Redirect to the API endpoint after the last question
      router.push('/api/spin'); // Adjust the URL as necessary
    }
  };

  useEffect(() => {
    const answeredQuestions = unmarkedQuestions.filter((_, index) => selectedOption !== null && index <= currentQuestionIndex).length;
    onProgressUpdate(unmarkedQuestions.length - answeredQuestions);
  }, [selectedOption, currentQuestionIndex, onProgressUpdate, unmarkedQuestions.length]);

  if (unmarkedQuestions.length === 0) {
    return <div>No unmarked questions available</div>;
  }

  const currentQuestion = unmarkedQuestions[currentQuestionIndex];

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / unmarkedQuestions.length) * 100;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">IIT Delhi - Abu Dhabi Admission Questions</h2>
      <p className="mb-4">{currentQuestionIndex + 1} out of {unmarkedQuestions.length} unmarked questions</p>
      
      {/* Progress Bar */}
      <div className="h-4 bg-gray-200 rounded mb-4">
        <div className="h-full bg-blue-500 rounded" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="mb-6">
        <EachQuestion
          question={currentQuestion.question}
          questionId={currentQuestion.questionId}
          options={currentQuestion.options}
          ismarked={currentQuestion.ismarked}
          handleSubmit={handleAnswer} // Pass handleAnswer to EachQuestion
        />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleNext}
          className={`px-4 py-2 rounded ${currentQuestionIndex === unmarkedQuestions.length - 1 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
          disabled={selectedOption === null} // Disable until an option is selected
        >
          {currentQuestionIndex === unmarkedQuestions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Survey;
