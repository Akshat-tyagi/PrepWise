 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { interviewApi, InterviewHistoryItem } from '@/lib/api';
 import { FileText, Home, Loader2, ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
 
 export default function InterviewHistory() {
   const navigate = useNavigate();
   const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');
   const [selectedInterview, setSelectedInterview] = useState<InterviewHistoryItem | null>(null);
 
   useEffect(() => {
     const fetchHistory = async () => {
       try {
         const data = await interviewApi.getHistory();
         setHistory(data);
       } catch (err) {
         setError(err instanceof Error ? err.message : 'Failed to load history');
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchHistory();
   }, []);
 
   const getAverageScore = (scores: number[]) => {
     if (!scores || scores.length === 0) return 0;
     return scores.reduce((a, b) => a + b, 0) / scores.length;
   };
 
   const getScoreColorClass = (score: number) => {
     if (score >= 8) return 'text-success';
     if (score >= 5) return 'text-warning';
     return 'text-destructive';
   };
 
   const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   if (isLoading) {
     return (
       <div className="page-container">
         <div className="min-h-screen flex items-center justify-center">
           <div className="text-center">
             <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
             <p className="text-muted-foreground">Loading interview history...</p>
           </div>
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
             <Home className="h-4 w-4 mr-2" />
             Dashboard
           </Button>
         </div>
       </header>
 
       <main className="content-container">
         {selectedInterview ? (
           <>
             <Button
               variant="ghost"
               className="mb-4"
               onClick={() => setSelectedInterview(null)}
             >
               <ArrowLeft className="h-4 w-4 mr-2" />
               Back to History
             </Button>
 
             <div className="mb-8">
               <h1 className="text-3xl font-bold text-foreground mb-2">Interview Details</h1>
               <p className="text-muted-foreground flex items-center gap-2">
                 <Calendar className="h-4 w-4" />
                 {formatDate(selectedInterview.createdAt)}
               </p>
             </div>
 
             <Card className="card-elevated mb-6">
               <CardHeader>
                 <CardTitle>Overall Score</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="flex items-center gap-6">
                   <div className={`text-5xl font-bold ${getScoreColorClass(getAverageScore(selectedInterview.scores))}`}>
                     {getAverageScore(selectedInterview.scores).toFixed(1)}
                   </div>
                   <div className="flex-1">
                     <p className="text-foreground">{selectedInterview.feedback}</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
 
             <div className="space-y-4">
               {selectedInterview.questions.map((question, index) => (
                 <Card key={index} className="card-elevated">
                   <CardHeader className="pb-2">
                     <div className="flex items-start justify-between gap-4">
                       <div className="flex-1">
                         <CardTitle className="text-base">Question {index + 1}</CardTitle>
                         <CardDescription className="text-foreground mt-1">{question}</CardDescription>
                       </div>
                       <div className={`score-badge ${selectedInterview.scores[index] >= 8 ? 'score-high' : selectedInterview.scores[index] >= 5 ? 'score-medium' : 'score-low'}`}>
                         {selectedInterview.scores[index]}
                       </div>
                     </div>
                   </CardHeader>
                   {selectedInterview.answers && selectedInterview.answers[index] && (
                     <CardContent className="pt-2">
                       <p className="text-sm text-muted-foreground">
                         <span className="font-medium">Your answer: </span>
                         {selectedInterview.answers[index]}
                       </p>
                     </CardContent>
                   )}
                 </Card>
               ))}
             </div>
           </>
         ) : (
           <>
             <div className="mb-8">
               <h1 className="text-3xl font-bold text-foreground mb-2">Interview History</h1>
               <p className="text-muted-foreground">Review your past interview practice sessions.</p>
             </div>
 
             {error && (
               <div className="mb-6 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                 {error}
               </div>
             )}
 
             {history.length === 0 ? (
               <Card className="card-elevated">
                 <CardContent className="pt-6 text-center">
                   <p className="text-muted-foreground mb-4">No interview history yet. Complete your first interview to see results here.</p>
                   <Button onClick={() => navigate('/dashboard')}>
                     Start First Interview
                   </Button>
                 </CardContent>
               </Card>
             ) : (
               <div className="space-y-4">
                 {history.map((interview) => (
                   <Card
                     key={interview._id}
                     className="card-elevated cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => setSelectedInterview(interview)}
                   >
                     <CardContent className="py-4">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className={`text-2xl font-bold ${getScoreColorClass(getAverageScore(interview.scores))}`}>
                             {getAverageScore(interview.scores).toFixed(1)}
                           </div>
                           <div>
                             <p className="font-medium text-foreground">
                               {interview.questions.length} Questions
                             </p>
                             <p className="text-sm text-muted-foreground flex items-center gap-1">
                               <Calendar className="h-3 w-3" />
                               {formatDate(interview.createdAt)}
                             </p>
                           </div>
                         </div>
                         <ChevronRight className="h-5 w-5 text-muted-foreground" />
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             )}
           </>
         )}
       </main>
     </div>
   );
 }