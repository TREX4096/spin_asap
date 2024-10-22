"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Survey from "@/components/survey";
import { useSession } from "next-auth/react";

interface Option {
  id: string;
  option: string;
}

interface Question {
  question: string;
  questionId: string;
  options: Option[];
  ismarked: boolean; // Changed to boolean (lowercase)
}

interface Form {
  questions: Question[];
}

export default function CareerFairSurvey() {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id; // Ensure this is set correctly

  useEffect(() => {
    const getForms = async () => {
      setLoading(true); // Set loading true before fetching
      try {
        const uncompletedResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getFormid/${process.env.NEXT_PUBLIC_ADMIN_ID}/${userId}`);
        const uncompleted: string[] = uncompletedResponse.data; // Adjusted to correctly type the response
        let index = 1
        if(uncompleted.length<2){
          index=0
        }
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getForm/${uncompleted[index]}/${userId}`;
        const response = await axios.get(url);
        const data: Form = response.data;

        // Set form state to the fetched form
        setForm(data); 

      } catch (error: any) {
        console.error('Error fetching forms:', error.response ? `${error.response.status}: ${error.response.data}` : error.message);
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, [userId]); // Runs once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>No form available</div>;

  return (
    <div>
      <Survey 
        questions={form.questions} // Pass the questions to the Survey component
        onProgressUpdate={(remaining) => {
          // Handle progress updates if needed
          console.log(`Remaining questions: ${remaining}`);
        }}
        userId={userId} // Pass userId to the Survey component
      />
    </div>
  );
}
