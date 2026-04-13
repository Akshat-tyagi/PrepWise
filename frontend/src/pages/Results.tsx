 import { useLocation, useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { FileText, Home, History, ArrowLeft } from 'lucide-react';
 
 export default function Results() {
   const location = useLocation();
   const navigate = useNavigate();
   const { questions, answers, scores, feedback } = location.state || {};
 
   if (!questions || !scores) {
     return (
       <div className="page-container">
         <div className="min-h-screen flex items-center justify-center">
           <Card className="max-w-md w-full mx-4">
             <CardContent className="pt-6 text-center">
               <p className="text-muted-foreground mb-4">No results available</p>
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
 
   const averageScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
 
   const getScoreClass = (score: number) => {
     if (score >= 8) return 'score-high';
     if (score >= 5) return 'score-medium';
     return 'score-low';
   };
 
   const getOverallScoreClass = (score: number) => {
     if (score >= 8) return 'text-success';
     if (score >= 5) return 'text-warning';
     return 'text-destructive';
   };
 
   return (
     <div className="page-container">
       <header className="border-b border-border bg-card">
         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <FileText className="h-6 w-6 text-primary" />
             <span className="text-xl font-bold text-foreground">PrepWise</span>
           </div>
           <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
               <Home className="h-4 w-4 mr-2" />
               Dashboard
             </Button>
             <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
               <History className="h-4 w-4 mr-2" />
               History
             </Button>
           </div>
         </div>
       </header>
 
       <main className="content-container">
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-foreground mb-2">Interview Results</h1>
           <p className="text-muted-foreground">Here's how you performed on your interview practice session.</p>
         </div>
 
         {/* Overall Score Card */}
         <Card className="card-elevated mb-6">
           <CardHeader>
             <CardTitle>Overall Performance</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="flex items-center gap-6">
               <div className="text-center">
                 <div className={`text-5xl font-bold ${getOverallScoreClass(averageScore)}`}>
                   {averageScore.toFixed(1)}
                 </div>
                 <div className="text-sm text-muted-foreground mt-1">out of 10</div>
               </div>
               <div className="flex-1">
                 <p className="text-foreground">{feedback}</p>
               </div>
             </div>
           </CardContent>
         </Card>
 
         {/* Individual Scores */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-foreground">Question Breakdown</h2>
           {questions.map((question: string, index: number) => (
             <Card key={index} className="card-elevated">
               <CardHeader className="pb-2">
                 <div className="flex items-start justify-between gap-4">
                   <div className="flex-1">
                     <CardTitle className="text-base">Question {index + 1}</CardTitle>
                     <CardDescription className="text-foreground mt-1">{question}</CardDescription>
                   </div>
                   <div className={`score-badge ${getScoreClass(scores[index])}`}>
                     {scores[index]}
                   </div>
                 </div>
               </CardHeader>
               {answers && answers[index] && (
                 <CardContent className="pt-2">
                   <p className="text-sm text-muted-foreground">
                     <span className="font-medium">Your answer: </span>
                     {answers[index]}
                   </p>
                 </CardContent>
               )}
             </Card>
           ))}
         </div>
 
         <div className="flex gap-4 pt-8">
           <Button onClick={() => navigate('/dashboard')}>
             <Home className="h-4 w-4 mr-2" />
             New Interview
           </Button>
           <Button variant="outline" onClick={() => navigate('/history')}>
             <History className="h-4 w-4 mr-2" />
             View History
           </Button>
         </div>
       </main>
     </div>
   );
 }