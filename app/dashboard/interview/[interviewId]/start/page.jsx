"use client";

import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { chatSession } from '@/utils/GeminiAIModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import QuestionsSection from './_compunents/QuestionsSection';
import RecordAnsSection from './_compunents/RecordAnsSection';

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            if (result.length === 0) {
                throw new Error("No interview found with the given ID.");
            }

            const inputPrompt = `Job position: ${result[0].jobPosition}, Job Description: ${result[0].jobDesc}, Years of Experience: ${result[0].jobExperience}. Based on Job Position, Job Description & Years of Experience, give us 5 Interview questions along with Answers in JSON format. Give us question and answer fields in JSON.`;

            const result1 = await chatSession.sendMessage(inputPrompt);
            const text = await result1.response.text();

            const cleanedText = text.replace(/```json|```/g, '').trim();

            try {
                const jsonResponse = JSON.parse(cleanedText);
                setInterviewData(result[0]);
                setMockInterviewQuestions(jsonResponse);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                throw new Error("Invalid JSON response from AI.");
            }

        } catch (error) {
            console.error("Error getting interview details:", error);
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionsSection
                    mockInterviewQuestions={mockInterviewQuestions} 
                    activeQuestionIndex={activeQuestionIndex}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                />
                <RecordAnsSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex justify-end gap-6 pb-5'>
                {activeQuestionIndex > 0 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
                        Previous Question
                    </Button>
                )}
                {activeQuestionIndex !== mockInterviewQuestions?.length - 1 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
                        Next Question
                    </Button>
                )}
                {activeQuestionIndex === mockInterviewQuestions?.length - 1 && (
                    <Link href={'/dashboard/interview/'+interviewData.mockId+'/feedback'}>
                        <Button>End Interview</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
