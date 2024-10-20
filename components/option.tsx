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
  handleSubmit: (optionId: string, questionId: string) => Promise<void>; // Define the prop type
}

export default function EachQuestion({ question, questionId, options, handleSubmit }: QuestionProps) {
  const userId = "dac99d66-7993-44c1-ae5e-e60e7f42b67f"; // Hardcoded for now; can be dynamic
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
      await handleSubmit(selectedOption, questionId); // Call the handleSubmit function passed as a prop
      setSuccess("Your answer has been submitted successfully!");
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
      <label htmlFor={`question-${questionId}`}>Select an option:</label>
      <select
        id={`question-${questionId}`}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.option}
          </option>
        ))}
      </select>
      <button onClick={onSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Next"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
