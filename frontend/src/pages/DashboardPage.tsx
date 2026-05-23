import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, LogOut, FileText, Play, History, Check, Loader2, RefreshCw } from "lucide-react";
import { uploadResume, startInterview, getHistory, InterviewHistoryItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [startingInterview, setStartingInterview] = useState(false);
  
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch interview history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err: any) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Drag and drop handlers
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        if (file.size <= 5 * 1024 * 1024) {
          setSelectedFile(file);
          setError(null);
          setUploadSuccess(false);
        } else {
          setError("File size exceeds 5MB limit");
        }
      } else {
        setError("Only PDF files are accepted");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) {
        setSelectedFile(file);
        setError(null);
        setUploadSuccess(false);
      } else {
        setError("File size exceeds 5MB limit");
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      const data = await uploadResume(formData);
      
      setResumeId(data.resumeId);
      setExtractedSkills(data.extractedSkills);
      setUploadSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to parse resume PDF. Please check backend logs.");
    } finally {
      setUploading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!resumeId) return;

    setStartingInterview(true);
    setError(null);
    try {
      const data = await startInterview(resumeId);
      navigate("/interview", {
        state: {
          interviewId: data.interviewId,
          questions: data.questions,
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to start interview. Try again.");
    } finally {
      setStartingInterview(false);
    }
  };

  // Helper for color coding the scores
  const getScoreBadgeVariant = (avgScore: number) => {
    if (avgScore >= 8) return "success";
    if (avgScore >= 6) return "warning";
    return "errorBadge";
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary px-6 py-8 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex justify-between items-center pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Prep<span className="text-indigo-400">Wise</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back 👋 Ready for another session?</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-slate-800 text-slate-400 hover:text-white" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </header>

        {/* Global Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-slate-800 bg-slate-950/40 shadow-xl glass-panel relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Resume Assessment
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Upload your PDF resume to parse technical skills and prepare target questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Drag and Drop Box */}
                {!resumeId && (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      dragActive 
                        ? "border-indigo-500 bg-indigo-950/20 shadow-indigo-500/10 shadow-lg scale-[1.01]" 
                        : "border-slate-800 hover:border-indigo-500/50 bg-slate-950/20"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="p-4 rounded-full bg-slate-900/60 border border-slate-800 text-indigo-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        {selectedFile ? (
                          <div className="space-y-1">
                            <p className="text-white font-medium text-sm">{selectedFile.name}</p>
                            <p className="text-slate-500 text-xs">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-white font-medium text-sm">Drag and drop your PDF resume here</p>
                            <p className="text-slate-500 text-xs">or click to browse from device (max 5MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {selectedFile && !resumeId && (
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-500" 
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Parsing your resume...
                      </>
                    ) : (
                      "Upload and Extract Skills"
                    )}
                  </Button>
                )}

                {/* Skill badges & Action (only when skills exist) */}
                {resumeId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
                      <Check className="w-4 h-4" />
                      Resume parsed successfully!
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Extracted Tech Badges:</h4>
                      {extractedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {extractedSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-slate-900 border border-slate-800 text-indigo-300 font-mono capitalize">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm">No standard skills matched. Standard technical questions will be generated.</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 gap-2 h-11 text-base font-semibold"
                        onClick={handleStartInterview}
                        disabled={startingInterview}
                      >
                        {startingInterview ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Setting up simulator...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 fill-current" />
                            Start Mock Interview
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="border-slate-800 text-slate-400 hover:text-white"
                        onClick={() => {
                          setResumeId(null);
                          setSelectedFile(null);
                          setUploadSuccess(false);
                          setExtractedSkills([]);
                        }}
                        disabled={startingInterview}
                      >
                        Reset
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Platform stats or details */}
          <div className="lg:col-span-1">
            <Card className="border border-slate-800 bg-slate-950/40 glass-panel h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Guidelines</CardTitle>
                <CardDescription className="text-slate-400 text-xs">Please read before starting your interview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-400 leading-relaxed flex-1">
                <p>
                  1. **Skill Parsing:** The simulator generates questions specifically based on key badges identified in your resume PDF text.
                </p>
                <p>
                  2. **5-Question Format:** You will receive 5 tailored technical questions. Response lengths should be comprehensive.
                </p>
                <p>
                  3. **Detailed Evaluations:** After finishing, your answers are scored 0-10 on accuracy, and complete corrective feedback is given.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interview History Section */}
        <Card className="border border-slate-800 bg-slate-950/40 shadow-xl glass-panel">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                Interview History
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Track your progress, historical performance, and review previous evaluations.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-800 text-slate-500 hover:text-white"
              onClick={fetchHistory}
              disabled={loadingHistory}
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingHistory ? (
              <div className="py-12 flex flex-col justify-center items-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-slate-500 text-sm">Loading history data...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-slate-800/80 rounded-xl">
                <p className="text-slate-500 text-sm">No interviews yet. Upload your resume to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => {
                  const hasScores = item.scores && item.scores.length > 0;
                  const avgScore = hasScores 
                    ? item.scores.reduce((a, b) => a + b, 0) / item.scores.length 
                    : 0;

                  return (
                    <div 
                      key={item._id}
                      onClick={() => {
                        if (hasScores) {
                          navigate("/results", {
                            state: {
                              scores: item.scores,
                              feedback: item.feedback,
                              questions: item.questions,
                            }
                          });
                        }
                      }}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-800 bg-slate-950/20 rounded-xl gap-4 hover:border-slate-700/80 transition-all duration-200 ${
                        hasScores ? "cursor-pointer" : ""
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-slate-300 font-medium text-sm">
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                          <span className="text-xs text-slate-500">|</span>
                          <span className="text-xs text-slate-500 font-mono">ID: {item._id.substring(0, 8)}...</span>
                        </div>
                        <p className="text-slate-400 text-xs line-clamp-1">
                          {item.feedback || "Evaluation pending or incomplete."}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {hasScores ? (
                          <div className="flex items-center gap-3">
                            <Badge variant={getScoreBadgeVariant(avgScore)} className="font-mono text-xs px-2.5 py-1">
                              {avgScore.toFixed(1)} / 10
                            </Badge>
                            <span className="text-indigo-400 text-xs font-semibold group hover:underline flex items-center gap-1 select-none">
                              Review
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-slate-500 border-slate-800">
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
