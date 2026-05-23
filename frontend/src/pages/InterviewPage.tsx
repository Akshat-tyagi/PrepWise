import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, Loader2, Sparkles } from "lucide-react";
import { submitInterview } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { interviewId?: string; questions?: string[] } | null;

  useEffect(() => {
    if (!state || !state.interviewId || !state.questions) {
      navigate("/dashboard");
    }
  }, [state, navigate]);

  if (!state || !state.interviewId || !state.questions) {
    return null;
  }

  const { interviewId, questions } = state;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAnswer = answers[currentIdx];

  const handleAnswerChange = (val: string) => {
    const updated = [...answers];
    updated[currentIdx] = val;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    // Basic validation: verify that at least some content is typed for each question
    const emptyCount = answers.filter((a) => !a.trim()).length;
    if (emptyCount > 0) {
      setError(`Please provide responses to all questions. (${emptyCount} unanswered remaining)`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = await submitInterview(interviewId, answers);
      navigate("/results", {
        state: {
          scores: data.scores,
          feedback: data.feedback,
          questions: questions,
          answers: answers, // optional but helpful
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit answers. Please try again.");
      setSubmitting(false);
    }
  };

  const progressPercentage = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between relative">
      
      {/* Top Header & Progress Bar */}
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center text-xs text-slate-500 uppercase tracking-widest">
          <span>PrepWise Simulation Environment</span>
          <span className="font-mono">Interview In Progress</span>
        </div>
        <div className="max-w-4xl mx-auto px-6">
          <Progress value={progressPercentage} className="h-1.5 bg-slate-800" />
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        
        {/* Error notification */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-8">
          
          {/* Question Meta */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 rounded-md">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          {/* Question Text */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-relaxed"
            >
              {questions[currentIdx]}
            </motion.h2>
          </AnimatePresence>

          {/* Answer Area */}
          <div className="space-y-2">
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your structured answer here. Include code snippet syntax if helpful..."
              className="min-h-[250px] p-4 text-base bg-slate-950/40 border-slate-800 focus-visible:ring-indigo-500 rounded-xl leading-relaxed resize-none shadow-inner"
              disabled={submitting}
              autoFocus
            />
            <div className="flex justify-between items-center text-xs text-slate-500 px-1">
              <span>Supports multiline explanations</span>
              <span>{currentAnswer.length} characters</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="border-t border-slate-900 bg-slate-950/30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          
          <Button
            variant="outline"
            className="border-slate-800 text-slate-400 hover:text-white"
            onClick={handlePrevious}
            disabled={currentIdx === 0 || submitting}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentIdx === questions.length - 1 ? (
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 gap-2 px-6"
              onClick={handleSubmit}
              disabled={submitting}
            >
              Submit Answers
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="bg-slate-800 text-slate-100 hover:bg-slate-700"
              onClick={handleNext}
              disabled={submitting}
            >
              Next Question
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}

        </div>
      </div>

      {/* Submitting Loading Overlay */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 px-6 text-center"
          >
            <div className="max-w-md space-y-6 flex flex-col items-center">
              
              {/* Spinning / Glowing Loader icon */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                <div className="p-5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400">
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">AI Evaluation In Progress</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Analyzing answers against technical criteria, compiling feedback grades, and generating improvement targets. This will take up to 15 seconds...
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400/80 bg-indigo-500/5 px-3 py-1.5 rounded-full border border-indigo-500/10">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>EVALUATING CODE & CONCEPTS</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
