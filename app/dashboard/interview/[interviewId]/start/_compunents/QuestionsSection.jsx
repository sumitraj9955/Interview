import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  console.log('QuestionsSection received questions:', mockInterviewQuestions);


  const textToSpeach=(text)=>{
    if('SpeechSynthesis' in window){
      const speech= new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
    else{
      alert('Sorry,your Browser deos not support text to speech');
    }
  }

  return mockInterviewQuestions && (
    <div className='p-5 border rounded-lg my-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {mockInterviewQuestions.map((qa, index) => (
          <div
            key={index}
            className={`p-2 rounded-full cursor-pointer ${
              activeQuestionIndex === index ? 'bg-primary text-white' : 'bg-secondary'
            }`}
            onClick={() => setActiveQuestionIndex(index)}
          >
            <h2 className='text-xs md:text-sm text-center mb-2'>Question #{index + 1}</h2>
          </div>
        ))}
      </div>
      {mockInterviewQuestions[activeQuestionIndex] && (
        <div className='mt-4'>
          <h2 className='text-md my-5 md:text-lg'>{mockInterviewQuestions[activeQuestionIndex].question}</h2>
          <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestions[activeQuestionIndex].question)}/>
        </div>
      )}
      <div className='border rounded-lg p-5 bg-purple-200 mt-10'>
        <h2 className='flex gap-2 items-center text-primary'>
          <Lightbulb/>
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
