"use client"
import React, { useState, useEffect } from 'react';
import EachQuestion from './option';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  formId:string;
  onProgressUpdate: (remaining: number) => void;
  userId: string | null;
}

const Survey: React.FC<Page1Props> = ({ questions,formId, onProgressUpdate, userId }) => {
  const router = useRouter();
  const unmarkedQuestions = questions.filter(question => !question.ismarked);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState(false); // Track the selected option

  const handleNext = () => {
    if (currentQuestionIndex < unmarkedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(false); // Reset the selected option for the next question
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
          set_Selected_Option={setSelectedOption}
          userId={userId}
          formId={formId}
        />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleNext}
          className={`px-4 py-2 rounded ${currentQuestionIndex === unmarkedQuestions.length - 1 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
          disabled={selectedOption === false} // Disable until an option is selected
        >
          {currentQuestionIndex === unmarkedQuestions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Survey;
