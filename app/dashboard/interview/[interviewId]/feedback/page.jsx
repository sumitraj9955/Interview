"use client";
import { Button } from '@/components/ui/button';
import db from '@/utils/db';
import { UserAns } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function FeedbackPage({ params }) {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null); // State to track which item is open

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    try {
      const result = await db.select()
        .from(UserAns)
        .where(eq(UserAns.mockIdRef, params.interviewId))
        .orderBy(UserAns.id);

      console.log(result);
      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the open state
  };

  return (
    <div className='p-10'>
      {feedbackList?.length == 0 ?
        <h2 className='font-bold text-xl text-gray-500'>No interview Feedback Found!</h2>
        :
        <>
          <h2 className='text-5xl font-bold  text-green-600 pb-5'>Congratulations!</h2>
          <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
          <h2 className='text-primary text-lg my-3'>
            Your overall interview rating: <strong>7/10</strong>
          </h2>
          <h2 className='text-sm text-gray-600 flex justify-between pb-5'>
            Find below interview question with correct answer, your answer and feedback for improvement.
          </h2>
          {feedbackList && feedbackList.map((item, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleOpen(index)}
                className="w-full text-left p-4 bg-gray-200 rounded-md focus:outline-none flex justify-between"
              >
                {item.question} <ChevronsUpDown />
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-100 border rounded-lg">
                  <p className='gap-5 p-5 mb-5  border rounded-lg bg-green-200 text-green-700'><strong>Correct Answer:</strong> {item.correctAns}</p>
                  <p className='gap-5 p-5 mb-5 border rounded-lg  bg-red-200 text-red-700'><strong>Your Answer:</strong> {item.userAns}</p>
                  <p className='gap-5 p-5 border rounded-lg  bg-blue-200 text-blue-700'><strong>Feedback:</strong> {item.feedback}</p>
                  <p className='gap-5 p-5 text-red-600 '><strong>Rating:</strong> {item.rating}</p>
                </div>
              )}
            </div>
          ))}
        </>
      }
      <Button onClick={() => router.replace('/dashboard')}>Dashboard</Button>
    </div>

  );
}

export default FeedbackPage;
