"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import EachQuestion from "@/components/option";
import { useSession } from "next-auth/react";
import TopBar from "@/components/topbar";

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
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // New state to hold points
  const [points, setPoints] = useState<number | null>(null);

  // Fetch points from API
  const fetchPoints = async () => {
    if (userId) {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getPoints/${userId}`);
        setPoints(response.data.points); // Assuming response contains a points field
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    }
  };

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
      const body = {
        optionId: selectedOption,
        questionId: questionId,
      };

      const response = await axios.post(url, body);
      setSuccess("Your answer has been submitted successfully!");

      // Move to the next question after successful submission
      if (currentIndex < (form?.questions.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // After the last question, update completed forms and redirect
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updateCompletedForms/${userId}`, { form_no: 1 });
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

        setForm(data[1]); // Adjust if needed based on your data structure
      } catch (error: any) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    getForms();
    fetchPoints(); // Fetch user points when the component mounts
  }, []); // Empty dependency array ensures this runs once when component mounts

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>No form available <br /><br />{userId}</div>;

  const currentQuestion = form.questions[currentIndex];
  const progress = ((currentIndex + 1) / form.questions.length) * 100;

  return (
    <div>
      <TopBar username={session?.user?.id}></TopBar>
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
      {/* Display user points if available */}
      {points !== null && <div>Your Points: {points}</div>}
    </div>
  );
}
