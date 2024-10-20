"use client"; // Ensure this component runs on the client

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
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
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // Ensure userId is available
  const userId = session?.user?.id;
  console.log("userId : "+userId)

  const handleSubmit = async (selectedOption: string, questionId: string) => {
    if (!selectedOption) {
      setError("Please select an option before submitting.");
      return;
    }

    if (!userId) {
      setError("User ID is not available. Please sign in again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/mark/${userId}`;
      const body = { optionId: selectedOption, questionId };

      const response = await axios.post(url, body);
      setSuccess("Your answer has been submitted successfully!");

      // Move to the next question after successful submission
      if (currentIndex < (form?.questions.length || 0) - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        router.push('/api/spin'); // Redirect after the last question
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

        if (data.length > 0) {
          setForm(data[0]); // Set the first form fetched
        } else {
          setError("No forms found.");
        }
      } catch (error: any) {
        setError(error.response?.data?.message || "Error fetching forms.");
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, []); // Runs once when component mounts

  // Handle different states for the session
  if (status === "loading") return <div>Loading session...</div>;
  if (!session) return <div>Please sign in to participate in the survey.</div>;
  if (loading) return <div>Loading...</div>;
  if (!form) return <div> {userId}        <br></br><br></br>No form available</div>; // Handle case when no form is available

  const currentQuestion = form.questions[currentIndex]; // Get the current question
  const progress = ((currentIndex + 1) / form.questions.length) * 100; // Calculate progress

  return (
    <div>
      <div>{userId}</div>
      <EachQuestion 
        question={currentQuestion.question} 
        questionId={currentQuestion.questionId} 
        options={currentQuestion.options} 
        handleSubmit={handleSubmit}
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
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
}
