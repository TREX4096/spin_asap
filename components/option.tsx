import { useState } from "react";

interface Option {
  id: string;
  option: string;
}

interface QuestionProps {
  question: string;
  questionId: string;
  options: Option[];
  ismarked: Boolean;
  handleSubmit: (optionId: string, questionId: string) => Promise<void>;
}

export default function EachQuestion({ question, questionId, options, handleSubmit }: QuestionProps) { 
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
      await handleSubmit(selectedOption, questionId); 
      setSuccess("Your answer has been submitted successfully!");
      setSelectedOption(""); // Reset selection after submission
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
              onChange={() => setSelectedOption(opt.id)} // Update selected option
            />
            <label htmlFor={`option-${opt.id}`}>{opt.option}</label>
          </div>
        ))}
      </div>

      <button onClick={onSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Next"}
      </button>
      
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
