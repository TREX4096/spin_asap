"use client";
import React, { useState, useEffect } from 'react';
import Page1 from '@/components/survey'; // Adjust the path if necessary
import { useRouter } from 'next/router';

// Define your questions here
const questions = [
  {
    question: "1. Which of the following options are acceptable for undergraduate admission to IIT Delhi - Abu Dhabi? (Select all that apply)",
    questionArabic: "1. أي من الخيارات التالية مقبولة للقبول في برامج البكالوريوس في IIT Delhi - أبوظبي؟ (اختر كل ما ينطبق)",
    options: [
      { text: "Students who have appeared for the CAET 2024.", textArabic: "الطلاب الذين ظهروا في اختبار القبول المشترك (CAET) 2024." },
      { text: "Students who have a valid EmSAT/SAT score.", textArabic: "الطلاب الذين لديهم درجة صالحة في EmSAT/SAT." },
      { text: "Students who have completed their K-12 education in an English-medium institution.", textArabic: "الطلاب الذين أكملوا تعليمهم K-12 في مؤسسة تعليمية باللغة الإنجليزية." },
      { text: "Students who haven't taken an English proficiency test yet but will provide a score in their first semester.", textArabic: "الطلاب الذين لم يخضعوا بعد لاختبار الكفاءة في اللغة الإنجليزية ولكنهم سيقدمون الدرجة في الفصل الدراسي الأول." }
    ],
    correctAnswers: [0, 1, 2, 3],
    multiSelect: true
  },
  {
    question: "2. If you haven't yet taken the EmSAT/SAT, can you still apply for admission to IIT Delhi - Abu Dhabi?",
    questionArabic: "2. إذا لم تكن قد خضعت لاختبار EmSAT/SAT حتى الآن، هل يمكنك التقديم للقبول في IIT Delhi - أبوظبي؟",
    options: [
      { text: "Yes, but you must indicate 'yet to appear' during registration and submit a valid score before selection.", textArabic: "نعم، ولكن يجب عليك تحديد 'لم أتقدم بعد' أثناء التسجيل وتقديم درجة صالحة قبل الاختيار." },
      { text: "No, you must have a valid score at the time of registration.", textArabic: "لا، يجب أن تكون لديك درجة صالحة في وقت التسجيل." },
      { text: "Yes, but the score is not required for admission.", textArabic: "نعم، لكن الدرجة غير مطلوبة للقبول." },
      { text: "No, the test score is optional for CAET.", textArabic: "لا، درجة الاختبار اختيارية لاختبار CAET." }
    ],
    correctAnswers: [0],
    multiSelect: false
  },
  {
    question: "3. Which of the following best describes student life at IIT Delhi - Abu Dhabi?",
    questionArabic: "3. أي من الخيارات التالية تصف بشكل أفضل حياة الطلاب في IIT Delhi - أبوظبي؟",
    options: [
      { text: "It is purely focused on academics without extracurricular activities.", textArabic: "يركز فقط على الجوانب الأكاديمية دون أنشطة خارج المنهج." },
      { text: "Students have access to cultural events, inter-IIT competitions, and enriching academic resources.", textArabic: "يتمتع الطلاب بإمكانية الوصول إلى الفعاليات الثقافية، والمسابقات بين IIT، والموارد الأكاديمية الغنية." },
      { text: "Only online resources are available without any on-campus engagement.", textArabic: "تتوفر الموارد عبر الإنترنت فقط دون أي تفاعل في الحرم الجامعي." },
      { text: "There are limited opportunities for social engagement.", textArabic: "توجد فرص محدودة للتفاعل الاجتماعي." }
    ],
    correctAnswers: [1],
    multiSelect: false
  },
  {
    question: "4. What makes Abu Dhabi a great place for students at IIT Delhi - Abu Dhabi?",
    questionArabic: "4. ما الذي يجعل أبوظبي مكانًا رائعًا للطلاب في IIT Delhi - أبوظبي؟",
    options: [
      { text: "It is a bustling city with limited cultural experiences.", textArabic: "إنها مدينة مزدحمة مع تجارب ثقافية محدودة." },
      { text: "Abu Dhabi is known for its safety, vibrant lifestyle, and rich cultural tapestry, making it ideal for students.", textArabic: "تُعرف أبوظبي بسلامتها وأسلوب حياتها الحيوي وثراءها الثقافي، مما يجعلها مثالية للطلاب." },
      { text: "The climate is cold and restrictive.", textArabic: "المناخ بارد ومقيد." },
      { text: "It is a secluded location with minimal international community presence.", textArabic: "إنها منطقة منعزلة مع وجود محدود للمجتمع الدولي." }
    ],
    correctAnswers: [1],
    multiSelect: false
  },
  {
    question: "5. Which courses are currently offered by IIT Delhi - Abu Dhabi? (Select all that apply)",
    questionArabic: "5. ما هي الدورات التي تقدمها حاليًا IIT Delhi - أبوظبي؟ (اختر كل ما ينطبق)",
    options: [
      { text: "M. Tech. Program in Energy Transition and Sustainability", textArabic: "برنامج ماجستير التكنولوجيا في التحول الطاقي والاستدامة." },
      { text: "4-year Bachelor's program in Computer Science and Engineering", textArabic: "برنامج بكالوريوس مدته 4 سنوات في علوم الكمبيوتر والهندسة." },
      { text: "4-year Bachelor's program in Energy Engineering", textArabic: "برنامج بكالوريوس مدته 4 سنوات في هندسة الطاقة." },
      { text: "Ph.D. in Artificial Intelligence", textArabic: "دكتوراه في الذكاء الاصطناعي." }
    ],
    correctAnswers: [0, 1, 2],
    multiSelect: true
  },
  // Other questions ...
];

const Survey1 = () => {
    const [progress, setProgress] = useState(questions.length); // Track remaining questions
    const router = useRouter(); // Initialize router for navigation
    const [isRouterReady, setIsRouterReady] = useState(false); // Router readiness state
  
    // Check if the router is ready
    useEffect(() => {
      if (!router.isReady) return; // Exit if router is not ready
  
      // Codes using router.query can be placed here
      console.log("Router is ready, current query:", router.query);
      setIsRouterReady(true); // Set the router as ready
    }, [router.isReady, router.query]); // Dependency array includes router.query
  
    const handleProgressUpdate = (remaining: number) => {
      setProgress(remaining);
    };
  
    const handleSubmit = (selectedOptions: number[][]) => {
      console.log("Form submitted with the following options:", selectedOptions);
      // Only redirect if the router is ready
      if (isRouterReady) {
        router.push('/spin');
      }
    };
  
    // If router is not ready, show a loading state
    if (!isRouterReady) {
      return <p>Loading...</p>;
    }
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Survey</h1>
        <Page1 questions={questions} onProgressUpdate={handleProgressUpdate} onSubmit={handleSubmit} />
        <p className="mt-4">Remaining questions: {progress}</p>
      </div>
    );
  };
  


export default Survey1;
