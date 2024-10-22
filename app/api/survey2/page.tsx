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
  const userId = session?.user?.id; // Ensure this is set correctly

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

      if (currentIndex < (form?.questions.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // After the last question, update completed forms and redirect
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updateCompletedForms/${userId}`, { form_no: 2 });
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
      setLoading(true); // Set loading true before fetching
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getForm/${process.env.NEXT_PUBLIC_ADMIN_ID}`;
        const response = await axios.get(url);
        const data: Form[] = response.data;

        // Set form state to the second form fetched (data[2])
        setForm(data[2]); // Adjust this if needed based on your data structure

      } catch (error: any) {
        console.error('Error fetching forms:', error.response ? `${error.response.status}: ${error.response.data}` : error.message);
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, []); // Runs once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>No form available</div>;

  const currentQuestion = form.questions[currentIndex];
  const progress = ((currentIndex + 1) / form.questions.length) * 100;

  return (
    <div>
      <TopBar username={session?.user?.id} />
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
      {error && <div className="error-message">{error}</div>} {/* Display error message */}
      {success && <div className="success-message">{success}</div>} {/* Display success message */}
    </div>
  );
}
