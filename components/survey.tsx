import React, { useState, useEffect } from 'react';

interface Option {
  text: string;
  textArabic: string;
}

interface Question {
  question: string;
  questionArabic: string;
  options: Option[];
  correctAnswers: number[];
  multiSelect: boolean;
}

interface Page1Props {
  questions: Question[];
  onProgressUpdate: (remaining: number) => void;
  onSubmit: (responses: number[][]) => void;
}

const Page1: React.FC<Page1Props> = ({ questions, onProgressUpdate, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[][]>(questions.map(() => []));

  const handleAnswer = (optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.multiSelect) {
      const index = newSelectedOptions[currentQuestionIndex].indexOf(optionIndex);
      if (index > -1) {
        newSelectedOptions[currentQuestionIndex].splice(index, 1);
      } else {
        newSelectedOptions[currentQuestionIndex].push(optionIndex);
      }
    } else {
      newSelectedOptions[currentQuestionIndex] = [optionIndex];
    }

    setSelectedOptions(newSelectedOptions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedOptions);
  };

  useEffect(() => {
    const answeredQuestions = selectedOptions.filter(option => option.length > 0).length;
    onProgressUpdate(questions.length - answeredQuestions);
  }, [selectedOptions, onProgressUpdate, questions.length]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">IIT Delhi - Abu Dhabi Admission Questions</h2>
      <p className="mb-4">{currentQuestionIndex + 1} out of {questions.length} questions</p>

      <div className="mb-6">
        <p className="font-semibold mb-2">{currentQuestion.question}</p>
        <p className="font-semibold mb-2 text-right">{currentQuestion.questionArabic}</p>
        {currentQuestion.options.map((option, optionIndex) => (
          <div key={optionIndex} className="mb-2">
            <label className="flex items-center">
              <input 
                type={currentQuestion.multiSelect ? "checkbox" : "radio"}
                checked={selectedOptions[currentQuestionIndex].includes(optionIndex)}
                onChange={() => handleAnswer(optionIndex)}
                className="mr-2"
              />
              <span>{option.text}</span>
            </label>
            <p className="text-right">{option.textArabic}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {currentQuestionIndex > 0 && (
          <button 
            type="button" 
            onClick={handlePrev} 
            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
          >
            Previous
          </button>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <button 
            type="button" 
            onClick={handleNext} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Page1;
