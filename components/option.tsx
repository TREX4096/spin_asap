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
  ismarked: boolean;
  set_Selected_Option: (value: boolean) => void;
  userId: string | null;
  formId: string;
}

export default function EachQuestion({
  question,
  questionId,
  options,
  userId,
  formId,
  ismarked,
  set_Selected_Option,
}: QuestionProps) {
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
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/mark/${process.env.NEXT_PUBLIC_USER_ID}`;
      const body = {
        formId: formId,
        questionId: questionId,
        optionId: selectedOption,
      };

      if (ismarked === true) {
        setError("This Question has been already marked by You.");
      } else {
        const response = await axios.post(url, body);
        if (response.status === 200) {
          setSuccess("Your answer has been submitted successfully!");
          setSelectedOption("");
          set_Selected_Option(true);
        } else if (response.status === 202) {
          setSuccess("This Question has been already marked by You.");
          set_Selected_Option(true);
          setSelectedOption("");
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
    <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen sm:p-8 lg:p-10">
      {/* Progress indicator */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm">2 out of 5 questions</p>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">{question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedOption === opt.id
                ? "border-green-400 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedOption(opt.id)}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  selectedOption === opt.id
                    ? "border-green-400 bg-green-400"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === opt.id && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <label className="flex-1 cursor-pointer text-lg">{opt.option}</label>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button className="px-6 py-3 bg-green-400 text-white rounded-full hover:bg-green-500 transition-colors text-lg">
          Prev
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-6 py-3 bg-green-400 text-white rounded-full hover:bg-green-500 transition-colors disabled:bg-gray-300 text-lg"
        >
          {loading ? "Submitting..." : "Next"}
        </button>
      </div>

      {/* Error and success messages */}
      {error && (
        <p className="mt-4 text-red-500 text-center text-sm">{error}</p>
      )}
      {success && (
        <p className="mt-4 text-green-500 text-center text-sm">{success}</p>
      )}
    </div>
  );
}
