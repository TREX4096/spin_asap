"use client";
import React, { useState } from 'react';
import Page1 from '@/components/survey'; // Adjust the path if necessary
import { useRouter } from 'next/navigation'; 

// Define your questions here
const questions = [
    {
      question: "Which headline catches your attention the most when flipping through a college brochure?",
      questionArabic: "أي عنوان يجذب انتباهك أكثر عندما تتصفح كتيب الكلية؟",
      options: [
        { text: "Explore the World of Science and Innovation!", textArabic: "استكشف عالم العلوم والابتكار!" },
        { text: "Unleash Your Creativity with Our Design Programs!", textArabic: "أطلق العنان لإبداعك مع برامج التصميم لدينا!" },
        { text: "Become a Business Leader with Our Management Courses!", textArabic: "كن قائدًا في الأعمال مع دورات الإدارة لدينا!" },
        { text: "Delve into Culture and Society with Our Humanities Studies!", textArabic: "تعرف على الثقافة والمجتمع من خلال دراسات العلوم الإنسانية لدينا!" }
      ],
      correctAnswers: [],  // No correct answers for aspiration questions
      multiSelect: false
    },
    {
      question: "If you have a free afternoon at college, where are you most likely to spend your time?",
      questionArabic: "إذا كان لديك فترة بعد الظهر خالية في الكلية، أين من المرجح أن تقضي وقتك؟",
      options: [
        { text: "In a high-tech lab, experimenting with new ideas.", textArabic: "في مختبر عالي التقنية، تجربة أفكار جديدة." },
        { text: "In the art studio, creating something unique.", textArabic: "في استوديو الفن، ابتكار شيء فريد." },
        { text: "In a networking session with entrepreneurs.", textArabic: "في جلسة تواصل مع رواد الأعمال." },
        { text: "In a study circle discussing global history.", textArabic: "في حلقة دراسة تناقش التاريخ العالمي." }
      ],
      correctAnswers: [],
      multiSelect: false
    },
    {
      question: "As a first-year college student, what excites you the most about exploring new horizons?",
      questionArabic: "أنت في سنتك الأولى في الكلية، ما الذي يحمسك أكثر لاستكشاف آفاق جديدة؟",
      options: [
        { text: "A research internship at a top firm.", textArabic: "تدريب بحثي في شركة رائدة." },
        { text: "Participating in a student-run club or society.", textArabic: "المشاركة في نادٍ أو جمعية يديرها الطلاب." },
        { text: "A semester exchange program in another country.", textArabic: "برنامج تبادل دراسي في بلد آخر." },
        { text: "Working closely with professors on an exciting project.", textArabic: "العمل بشكل وثيق مع الأساتذة على مشروع مثير." }
      ],
      correctAnswers: [],
      multiSelect: false
    },
    {
      question: "Which scene outside of classes best reflects your college life?",
      questionArabic: "أي مشهد خارج الفصول الدراسية يعكس حياتك الجامعية بشكل أفضل؟",
      options: [
        { text: "Attending college festivals and bonding with peers.", textArabic: "حضور مهرجانات الكلية والتواصل مع الزملاء." },
        { text: "Engaging in workshops that help you learn new skills.", textArabic: "المشاركة في ورش عمل تساعدك على تعلم مهارات جديدة." },
        { text: "Discovering new cafes and hidden spots around campus.", textArabic: "اكتشاف مقاهي وأماكن مخفية جديدة حول الحرم الجامعي." },
        { text: "Relaxing in your dorm room with a good book or game.", textArabic: "الاسترخاء في غرفة السكن الخاصة بك مع كتاب جيد أو لعبة." }
      ],
      correctAnswers: [],
      multiSelect: false
    },
    {
      question: "If your college offers an extra opportunity to enhance your journey, which one would you choose?",
      questionArabic: "إذا كانت كليتك تقدم فرصة إضافية لتعزيز رحلتك، أي منها ستختار؟",
      options: [
        { text: "A certification course that complements your studies.", textArabic: "دورة شهادة تكمل دراستك." },
        { text: "A short course that allows you to explore a new interest.", textArabic: "دورة قصيرة تسمح لك باستكشاف اهتمام جديد." },
        { text: "An intensive workshop that provides hands-on experience.", textArabic: "ورشة عمل مكثفة توفر تجربة عملية." },
        { text: "An in-depth project that lets you dive deeper into your major.", textArabic: "مشروع معمق يسمح لك بالتعمق أكثر في تخصصك." }
      ],
      correctAnswers: [],
      multiSelect: false
    }
  ];
  

  const Survey2 = () => {
    const [progress, setProgress] = useState(questions.length); // Track remaining questions
    const router = useRouter(); // Initialize router for navigation
  
    const handleProgressUpdate = (remaining: number) => {
      setProgress(remaining);
    };
  
    const handleSubmit = (selectedOptions: number[][]) => {
      console.log("Form submitted with the following options:", selectedOptions);
      // Redirect to /spin after submission
      router.push('/api/spin');
    };
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Survey</h1>
        <Page1 questions={questions} onProgressUpdate={handleProgressUpdate} onSubmit={handleSubmit} />
        <p className="mt-4">Remaining questions: {progress}</p>
      </div>
    );
  };
export default Survey2;
