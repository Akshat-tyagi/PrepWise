 import { useState, useEffect } from 'react';
 import { useLocation, useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Textarea } from '@/components/ui/textarea';
 import { interviewApi, StartInterviewResponse } from '@/lib/api';
 import { FileText, Loader2, Send, ArrowLeft } from 'lucide-react';
 
 export default function Interview() {
   const location = useLocation();
   const navigate = useNavigate();
   const [interviewData, setInterviewData] = useState<StartInterviewResponse | null>(null);
   const [answers, setAnswers] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState('');
 
   const resumeId = location.state?.resumeId;
 
   useEffect(() => {
     const startInterview = async () => {
       if (!resumeId) {
         setError('No resume ID found. Please upload a resume first.');
         setIsLoading(false);
         return;
       }
 
       try {
         const response = await interviewApi.start(resumeId);
         setInterviewData(response);
         setAnswers(new Array(response.questions.length).fill(''));
       } catch (err) {
         setError(err instanceof Error ? err.message : 'Failed to start interview');
       } finally {
         setIsLoading(false);
       }
     };
 
     startInterview();
   }, [resumeId]);
 
   const handleAnswerChange = (index: number, value: string) => {
     const newAnswers = [...answers];
     newAnswers[index] = value;
     setAnswers(newAnswers);
   };
 
   const handleSubmit = async () => {
     if (!interviewData) return;
 
     const unanswered = answers.filter(a => a.trim() === '').length;
     if (unanswered > 0) {
       setError(`Please answer all questions. ${unanswered} question(s) remaining.`);
       return;
     }
 
     setError('');
     setIsSubmitting(true);
 
     try {
       const response = await interviewApi.submit(interviewData.interviewId, answers);
       navigate('/results', {
         state: {
           questions: interviewData.questions,
           answers,
           scores: response.scores,
           feedback: response.feedback,
         },
       });
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to submit answers');
       setIsSubmitting(false);
     }
   };
 
   if (isLoading) {
     return (
       <div className="page-container">
         <div className="min-h-screen flex items-center justify-center">
           <div className="text-center">
             <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
             <p className="text-muted-foreground">Generating interview questions...</p>
           </div>
         </div>
       </div>
     );
   }
 
   if (error && !interviewData) {
     return (
       <div className="page-container">
         <div className="min-h-screen flex items-center justify-center">
           <Card className="max-w-md w-full mx-4">
             <CardContent className="pt-6 text-center">
               <p className="text-destructive mb-4">{error}</p>
               <Button onClick={() => navigate('/dashboard')}>
                 <ArrowLeft className="h-4 w-4 mr-2" />
                 Back to Dashboard
               </Button>
             </CardContent>
           </Card>
         </div>
       </div>
     );
   }
 
   return (
     <div className="page-container">
       <header className="border-b border-border bg-card">
         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <FileText className="h-6 w-6 text-primary" />
             <span className="text-xl font-bold text-foreground">PrepWise</span>
           </div>
           <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
             <ArrowLeft className="h-4 w-4 mr-2" />
             Exit Interview
           </Button>
         </div>
       </header>
 
       <main className="content-container">
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-foreground mb-2">Interview Session</h1>
           <p className="text-muted-foreground">Answer each question based on your experience. Take your time to provide thoughtful responses.</p>
         </div>
 
         {error && (
           <div className="mb-6 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
             {error}
           </div>
         )}
 
         <div className="space-y-6">
           {interviewData?.questions.map((question, index) => (
             <Card key={index} className="card-elevated">
               <CardHeader>
                 <CardTitle className="text-lg">
                   Question {index + 1}
                 </CardTitle>
                 <CardDescription className="text-foreground font-medium">
                   {question}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Textarea
                   placeholder="Type your answer here..."
                   value={answers[index]}
                   onChange={(e) => handleAnswerChange(index, e.target.value)}
                   rows={4}
                   className="resize-none"
                 />
               </CardContent>
             </Card>
           ))}
 
           <div className="flex justify-end pt-4">
             <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
               {isSubmitting ? (
                 <>
                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                   Submitting...
                 </>
               ) : (
                 <>
                   <Send className="h-4 w-4 mr-2" />
                   Submit Answers
                 </>
               )}
             </Button>
           </div>
         </div>
       </main>
     </div>
   );
 }