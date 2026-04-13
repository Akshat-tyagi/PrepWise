 import { useState, useRef } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { resumeApi, ResumeUploadResponse } from '@/lib/api';
 import { Upload, FileText, Play, History, Loader2, CheckCircle, LogOut } from 'lucide-react';
 import { useAuth } from '@/contexts/AuthContext';
 
 export default function Dashboard() {
   const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
   const [resumeData, setResumeData] = useState<ResumeUploadResponse | null>(null);
   const [error, setError] = useState('');
   const fileInputRef = useRef<HTMLInputElement>(null);
   const navigate = useNavigate();
   const { logout } = useAuth();
 
   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
 
     if (file.type !== 'application/pdf') {
       setError('Please upload a PDF file');
       return;
     }
 
     setError('');
     setUploadState('uploading');
 
     try {
       const response = await resumeApi.upload(file);
       setResumeData(response);
       setUploadState('success');
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Upload failed');
       setUploadState('idle');
     }
   };
 
   const handleStartInterview = () => {
     if (resumeData?.resumeId) {
       navigate('/interview', { state: { resumeId: resumeData.resumeId } });
     } else {
       // If no resumeId, we'll handle it in the interview page
       navigate('/interview', { state: { skills: resumeData?.extractedSkills } });
     }
   };
 
   const handleLogout = () => {
     logout();
     navigate('/login');
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
             <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
               <History className="h-4 w-4 mr-2" />
               History
             </Button>
             <Button variant="ghost" size="sm" onClick={handleLogout}>
               <LogOut className="h-4 w-4 mr-2" />
               Logout
             </Button>
           </div>
         </div>
       </header>
 
       <main className="content-container">
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to PrepWise</h1>
           <p className="text-muted-foreground">Upload your resume to start practicing interview questions tailored to your skills.</p>
         </div>
 
         <div className="grid gap-6">
           {/* Upload Resume Card */}
           <Card className="card-elevated">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Upload className="h-5 w-5 text-primary" />
                 Upload Resume
               </CardTitle>
               <CardDescription>Upload your PDF resume to extract skills and generate personalized interview questions.</CardDescription>
             </CardHeader>
             <CardContent>
               {error && (
                 <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                   {error}
                 </div>
               )}
 
               <input
                 ref={fileInputRef}
                 type="file"
                 accept=".pdf"
                 onChange={handleFileSelect}
                 className="hidden"
               />
 
               {uploadState === 'idle' && (
                 <div
                   onClick={() => fileInputRef.current?.click()}
                   className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                 >
                   <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                   <p className="text-foreground font-medium mb-1">Click to upload your resume</p>
                   <p className="text-sm text-muted-foreground">PDF files only, max 10MB</p>
                 </div>
               )}
 
               {uploadState === 'uploading' && (
                 <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center bg-primary/5">
                   <Loader2 className="h-12 w-12 mx-auto text-primary mb-4 animate-spin" />
                   <p className="text-foreground font-medium">Uploading and analyzing your resume...</p>
                 </div>
               )}
 
               {uploadState === 'success' && resumeData && (
                 <div className="border-2 border-success/50 rounded-lg p-6 bg-success/5">
                   <div className="flex items-center gap-2 mb-4">
                     <CheckCircle className="h-5 w-5 text-success" />
                     <span className="font-medium text-foreground">Resume uploaded successfully!</span>
                   </div>
 
                   <div className="mb-4">
                     <p className="text-sm font-medium text-muted-foreground mb-2">Extracted Skills:</p>
                     <div className="flex flex-wrap gap-2">
                       {resumeData.extractedSkills.map((skill, index) => (
                         <span key={index} className="skill-badge">
                           {skill}
                         </span>
                       ))}
                     </div>
                   </div>
 
                   <div className="flex gap-2">
                     <Button onClick={handleStartInterview}>
                       <Play className="h-4 w-4 mr-2" />
                       Start Interview
                     </Button>
                     <Button variant="outline" onClick={() => {
                       setUploadState('idle');
                       setResumeData(null);
                     }}>
                       Upload Different Resume
                     </Button>
                   </div>
                 </div>
               )}
             </CardContent>
           </Card>
         </div>
       </main>
     </div>
   );
 }