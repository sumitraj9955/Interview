"use client"
import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {

    const { user } = useUser();
    const [InterviewList, setInterviewData] = useState([]);

    useEffect(() => {
        user && GetInterviewList();
    }, [user])

    const GetInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(MockInterview.id))

        console.log("result: ", result);
        setInterviewData(result);
    }
    return (
        <div>
            <div className='font-medium text-xl'>Previous Mock Interview</div>

            <div className='grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5'>
                {InterviewList && InterviewList.map((interview, index) => (
                    <InterviewItemCard 
                    interview={interview}
                    key={index}/>
                ))}
            </div>
        </div>

    )
}

export default InterviewList