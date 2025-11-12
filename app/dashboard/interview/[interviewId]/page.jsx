"use client"
import { Button } from '@/components/ui/button';
import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, Webcam } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import WebcamComponent from 'react-webcam';

function Interview({ params }) {

    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(params.interviewId);
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));

        console.log(result);
        console.log(result[0]);

        setInterviewData(result[0]);
        setLoading(false);
    };

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='flex flex-col md:flex-row items-center'>

                <div className='flex flex-col items-start md:ml-10'>
                    {loading ? (
                        <p>Loading interview details...</p>
                    ) : interviewData ? (
                        <div className='flex flex-col my-5 gap-1 rounded-lg border p-10'>
                            <h2 className='text-lg'><strong>Job Position: </strong>{interviewData.jobPosition}</h2>
                            <h2 className='text-lg'><strong>Job Description: </strong>{interviewData.jobDesc}</h2>
                            <h2 className='text-lg'><strong>Job Experience: </strong>{interviewData.jobExperience}</h2>
                        </div>
                    ) : (
                        <p>No interview data found.</p>
                    )}
                    <div className='mt-5 p-5 border rounded-lg border-yellow-400 bg-yellow-100'>
                        <h2 className='pt-2 flex gap-2 items-center text-yellow-500'><Lightbulb className='mr-2' /><strong>Information</strong></h2>
                        <h2 className='p-3 mt-2 flex flex-col text-yellow-500 justify-start'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>

                <div className='p-5 flex flex-col'>
                    {webCamEnabled ? (
                        <WebcamComponent
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{
                                height: 300,
                                width: 600
                            }}
                        />
                    ) : (
                        <>
                            <Webcam className='h-96 w-full my-7 text-gray-700 p-20 bg-secondary rounded-lg border' />
                            <Button variant="ghost" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end mt-5'>
                <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                   <Button variant="ghost" className="bg-primary text-white">Start Interview</Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
