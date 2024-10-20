"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import EachQuestion from "@/components/option";

interface Option {
  id: string;
  option: string;
}

interface Question {
  question: string;
  questionId: string;
  options: Option[];
}

interface Form {
  questions: Question[];
}

export default function CareerFairSurvey() {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null); // State to hold a single form
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const userId = "dac99d66-7993-44c1-ae5e-e60e7f42b67f"; // Hardcoded for now; can be dynamic

  const handleSubmit = async (selectedOption: string, questionId: string) => {
    if (!selectedOption) {
      setError("Please select an option before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/mark/${userId}`;
      console.log(url);

      const body = {
        optionId: selectedOption,
        questionId: questionId,
      };
      console.log(body);
      const response = await axios.post(url, body);

      setSuccess("Your answer has been submitted successfully!");
      console.log("Response:", response.data);

if (currentIndex < (form?.questions.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Redirect to /api/spin after the last question
        router.push('/api/spin');
      }

    } catch (error) {
      setError("Error submitting answer. Please try again later.");
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getForms = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getForm/${process.env.NEXT_PUBLIC_ADMIN_ID}`;
  
        const response = await axios.get(url);
        const data: Form[] = response.data;

        // Set form state to the first form fetched
        setForm(data[2]); // Assuming data is in the expected format

      } catch (error: any) {
        if (error.response) {
          console.error('Error fetching forms:', error.response.status, error.response.data);
        } else {
          console.error('Error fetching forms:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, []); // Empty dependency array ensures this runs once when component mounts

  if (loading) return <div>Loading...</div>;

  if (!form) return <div>No form available</div>; // Handle case when no form is available

  const currentQuestion = form.questions[currentIndex]; // Get the current question

  // Calculate progress as a percentage
  const progress = ((currentIndex + 1) / form.questions.length) * 100;

  return (
    <div>
      <EachQuestion 
        question={currentQuestion.question} 
        questionId={currentQuestion.questionId} 
        options={currentQuestion.options} 
        handleSubmit={handleSubmit} // Pass handleSubmit to EachQuestion
      />
      <div>
        {currentIndex + 1} / {form.questions.length}
      </div>
      <div className="progress-bar" style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px', marginTop: '20px' }}>
        <div 
          className="progress" 
          style={{
            width: `${progress}%`, 
            height: '10px', 
            backgroundColor: '#3b82f6', 
            borderRadius: '5px'
          }}
        />
      </div>
    </div>
  );
}
