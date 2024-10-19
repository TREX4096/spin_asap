"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface Option {
  text: string;
  textArabic: string;
}

interface Question {
  question: string;
  questionArabic: string;
  options?: Option[];
}

const questions: Question[] = [
  {
    question: "If you could choose a nickname for yourself, what would it be?",
    questionArabic: "إذا كان بإمكانك اختيار لقب لنفسك، فما سيكون؟",
  },
  {
    question: "Imagine you’re in a classroom filled with students from different programs. Which group do you see yourself sitting with?",
    questionArabic: "تخيل أنك في فصل دراسي مليء بالطلاب من برامج مختلفة. مع أي مجموعة ترى نفسك جالسًا؟",
    options: [
      { text: "Those discussing the latest scientific discoveries.", textArabic: "الذين يناقشون أحدث الاكتشافات العلمية." },
      { text: "The ones sketching and talking about new art trends.", textArabic: "الذين يرسمون ويتحدثون عن اتجاهات الفن الجديدة." },
      { text: "The group planning a business pitch or discussing the stock market.", textArabic: "المجموعة التي تخطط لعرض تجاري أو تناقش سوق الأسهم." },
      { text: "The students working on hands-on technical projects.", textArabic: "الطلاب الذين يعملون على مشاريع فنية عملية." },
    ],
  },
  {
    question: "Picture your perfect weekend activity at school. What would you choose?",
    questionArabic: "تخيل نشاط عطلة نهاية الأسبوع المثالي في المدرسة. ماذا ستختار؟",
    options: [
      { text: "Joining a study group to prepare for an upcoming exam.", textArabic: "الانضمام إلى مجموعة دراسة للتحضير لامتحان قادم." },
      { text: "Heading to the gym or participating in a sports event.", textArabic: "الذهاب إلى صالة الألعاب الرياضية أو المشاركة في حدث رياضي." },
      { text: "Attending a local cultural event or community meetup.", textArabic: "حضور حدث ثقافي محلي أو تجمع مجتمعي." },
      { text: "Spending time reading or working on a personal project.", textArabic: "قضاء الوقت في القراءة أو العمل على مشروع شخصي." },
    ],
  },
  {
    question: "When you think about college, which scene resonates with you the most?",
    questionArabic: "عندما تفكر في الكلية، أي مشهد يبدو الأكثر تناسبًا معك؟",
    options: [
      { text: "Presenting a project with a group of classmates.", textArabic: "تقديم مشروع مع مجموعة من زملاء الدراسة." },
      { text: "Working on a solo assignment in a quiet library.", textArabic: "العمل على مهمة فردية في مكتبة هادئة." },
      { text: "Leading a team in a sports competition.", textArabic: "قيادة فريق في مسابقة رياضية." },
      { text: "Volunteering at a community service event.", textArabic: "التطوع في حدث خدمة المجتمع." },
    ],
  },
  {
    question: "You just got accepted into your dream school! What’s the first thing you’d like your new classmates to know about you?",
    questionArabic: "لقد تم قبولك للتو في مدرستك المثالية! ما هو أول شيء تود أن يعرفه زملاؤك الجدد عنك؟",
    options: [
      { text: "I love being part of team activities.", textArabic: "أحب أن أكون جزءًا من الأنشطة الجماعية." },
      { text: "I prefer working on my own.", textArabic: "أفضل العمل بمفردي." },
      { text: "I’m always up for a sports challenge.", textArabic: "أنا دائمًا مستعد لتحدي رياضي." },
      { text: "I’m passionate about helping out in the community.", textArabic: "أنا شغوف بمساعدة المجتمع." },
    ],
  },
];

export default function CareerFairSurvey() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(questions.map(() => -1)); // Initialize with -1 to indicate no selection
  const [nickname, setNickname] = useState<string>(''); // State for nickname input

  const handleAnswer = (optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex; // Set the selected option for the current question
    setSelectedOptions(newSelectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the data to be sent to the API
    const surveyData = {
      responses: questions.map((question, index) => ({
        question: question.question,
        selectedOption: index === 0 ? nickname : question.options?.[selectedOptions[index]]?.text || 'No selection',
      })),
    };

    console.log('Submitting survey:', surveyData);

    // Send the data to the API endpoint
    const response = await fetch('/api/spin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyData),
    });

    if (response.ok) {
      const result = await response.json();
      router.push('/api/spin'); // Redirect to a 'thank you' page
    } else {
      console.error('Failed to submit survey');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Career Fair Survey</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="font-semibold mb-2">{currentQuestion.question}</p>
          <p className="font-semibold mb-2 text-right">{currentQuestion.questionArabic}</p>
          {currentQuestionIndex === 0 ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter your nickname"
            />
          ) : (
            currentQuestion.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <label className="flex items-center">
                  <input 
                    type="radio"
                    checked={selectedOptions[currentQuestionIndex] === optionIndex}
                    onChange={() => handleAnswer(optionIndex)}
                    className="mr-2"
                  />
                  <span>{option.text}</span>
                </label>
                <p className="text-right">{option.textArabic}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          {currentQuestionIndex > 0 && (
            <button 
              type="button" 
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
            >
              Previous
            </button>
          )}
          {currentQuestionIndex < questions.length - 1 ? (
            <button 
              type="button" 
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
