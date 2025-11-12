"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@/components/ui/button';
import { Circle, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModal';
import db from '@/utils/db';
import { UserAns } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnsSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
    const [userAns, setUserAns] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (results.length > 0) {
            const combinedResults = results.map(result => result.transcript).join(' ');
            setUserAns(prevAns => prevAns + combinedResults);
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAns.length > 5) {
            updateUserAnswer();
        }
    }, [isRecording]);

    const saveUserAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    }

    const updateUserAnswer = async () => {
        setLoading(true);
        const feedbackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex].question}, User Answer: ${userAns}, Depending on the question and user answers for the given interview question, please give us a rating for the answer and feedback on areas of improvement if any in just 3 to 5 lines in JSON format with a rating field and feedback field`;

        try {
            const result = await chatSession.sendMessage(feedbackPrompt);
            const responseText = await result.response.text();
            const cleanedText = responseText.replace(/```json|```/g, '').trim();
            const mockJsonResp = JSON.parse(cleanedText);

            const resp = await db.insert(UserAns).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestions[activeQuestionIndex].question,
                correctAns: mockInterviewQuestions[activeQuestionIndex].answer,
                userAns: userAns,
                feedback: mockJsonResp?.feedback,
                rating: mockJsonResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY')
            });

            if (resp) {
                toast('User answers recorded successfully');
                setUserAns('');
                setResults([]);
            }
            setResults([]);
        } catch (error) {
            console.error('Error during feedback processing:', error);
            toast('Error while saving your answer, please try again');
        } finally {
            setLoading(false);
        }
    }

    const [webCamEnabled, setWebCamEnabled] = useState(false);

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
                <Webcam
                    onUserMedia={() => setWebCamEnabled(true)}
                    onUserMediaError={() => setWebCamEnabled(false)}
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                />
            </div>
            <Button variant="outline" className="my-10" onClick={saveUserAnswer}>
                {isRecording ? (
                    <h2 className='text-red-600 flex gap-2'>
                        <Circle /> Stop Recording
                    </h2>
                ) : (
                    <h2 className='text-purple-400 flex gap-2'>
                        <Mic /> Start Recording
                    </h2>
                )}
            </Button>
        </div>
    );
}

export default RecordAnsSection;
