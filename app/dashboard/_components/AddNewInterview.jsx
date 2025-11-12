"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment'; 
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExperience);

        const inputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on Job Position, Job Description & Years of Experience, give us 5 Interview questions along with Answers in JSON format. Give us question and answer fields in JSON.`;

        try {
            const result = await chatSession.sendMessage(inputPrompt);
            const text = await result.response.text();

            console.log('Raw response text:', text);

            // Ensure the text is properly formatted as JSON
            const cleanedText = text.replace(/```json|```/g, '').trim();
            console.log('Cleaned response text:', cleanedText);

            // Validate if the cleaned text is a valid JSON string
            let jsonResponse;
            try {
                jsonResponse = JSON.parse(cleanedText);
                console.log('Parsed JSON Response:', jsonResponse);
                setJsonResponse(jsonResponse);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                throw new Error("Invalid JSON response from AI.");
            }

            if (jsonResponse) {
                const resp = await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: jsonResponse,
                        jobPosition: jobPosition,
                        jobDesc: jobDesc,
                        jobExperience: jobExperience,
                        createdBy: user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD-MM-YYYY')
                    }).returning({ mockId: MockInterview.mockId });

                console.log("Inserted Id:", resp);
                if(resp){
                    setOpenDialog(false);
                    router.push('/dashboard/interview/'+resp[0]?.mockId)
                }
            } else {
                console.log("Error: Parsed JSON response is empty or invalid");
            }
        } catch (error) {
            console.error("Error processing request:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tell us more about your job profile</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add some details about your job description.</h2>
                                    <div className='mt-7 my-5'>
                                        <label>Job Role/Job Position</label>
                                        <Input
                                            placeholder="e.g. Full Stack Developer"
                                            required
                                            value={jobPosition}
                                            onChange={(event) => setJobPosition(event.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description/Tech Stack (In short)</label>
                                        <Textarea
                                            placeholder="e.g. ReactJs, NextJs"
                                            required
                                            value={jobDesc}
                                            onChange={(event) => setJobDesc(event.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of Experience</label>
                                        <Input
                                            placeholder="e.g. 5"
                                            type="number"
                                            required
                                            value={jobExperience}
                                            onChange={(event) => setJobExperience(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <LoaderCircle className='animate-spin' /> Generating from AI
                                            </>
                                        ) : 'Start Interview'}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
