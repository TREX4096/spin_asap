import { useState } from "react";
import axios from "axios";

interface Option {
  id: string;
  option: string;
}

interface QuestionProps {
  question: string;
  questionId: string;
  options: Option[];
  ismarked: Boolean;
  set_Selected_Option:(value:boolean)=>void
  userId: string | null ;
  formId: string;

}

export default function EachQuestion({ question, questionId, options, userId, formId,ismarked,set_Selected_Option}: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async () => {
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
        formId: formId,
        questionId: questionId,
        optionId: selectedOption
      };

      console.log(body);
      
      if(ismarked===true){
        setError("This Question has been already marked by You.");
      }
      else{
      const response = await axios.post(url, body);
      console.log(response);

      if (response.status === 200) {
        setSuccess("Your answer has been submitted successfully!");
        setSelectedOption(""); // Reset selection after submission
        set_Selected_Option(true)
      }
      else if (response.status === 202) {
        setSuccess("This Question has been already marked by You.");
        set_Selected_Option(true)
        setSelectedOption(""); // Reset selection after submission

      }
      else {
        console.log(response);

      }

    }
    } catch (error) {
      setError("Error submitting answer. Please try again later.");
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>{question}</p>
      <h3>Question ID: {questionId}</h3>
      <label>Select an option:</label>
      <div>
        {options.map((opt) => (
          <div key={opt.id}>
            <input
              type="radio"
              id={`option-${opt.id}`}
              name={`question-${questionId}`}
              value={opt.id}
              checked={selectedOption === opt.id}
              onChange={() => {setSelectedOption(opt.id) 
                
              }} // Update selected option
            />
            <label htmlFor={`option-${opt.id}`}>{opt.option}</label>
          </div>
        ))}
      </div>

      <button className="cursor-pointer" onClick={onSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Next"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
