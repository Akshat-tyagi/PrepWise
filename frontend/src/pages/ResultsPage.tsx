import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, ArrowLeft, Terminal, MessageSquare, ClipboardCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    scores?: number[];
    feedback?: string;
    questions?: string[];
    answers?: string[];
  } | null;

  useEffect(() => {
    if (!state || !state.scores || !state.feedback || !state.questions) {
      navigate("/dashboard");
    }
  }, [state, navigate]);

  if (!state || !state.scores || !state.feedback || !state.questions) {
    return null;
  }

  const { scores, feedback, questions, answers } = state;

  const validScores = scores.filter((s) => typeof s === "number" && !isNaN(s));
  const averageScore = validScores.length > 0
    ? validScores.reduce((sum, s) => sum + s, 0) / validScores.length
    : 0;

  // Grade performance text
  const getGradeSubText = (score: number) => {
    if (score >= 8.5) return "Exceptional work! You demonstrated complete conceptual mastery.";
    if (score >= 7.0) return "Solid display! A few fine-tunings and you will be completely ready.";
    if (score >= 5.5) return "Good attempt. Review the suggestions below to bolster your answers.";
    return "Needs improvement. Take some time to review key documentation and practice again.";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreTextClass = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "errorBadge";
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary px-6 py-12 relative overflow-hidden">
      
      {/* Background radial accent glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 z-10 relative">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Evaluation Complete</span>
        </div>

        {/* Hero Score Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 border border-slate-800 bg-slate-950/20 rounded-2xl glass-panel relative overflow-hidden flex flex-col items-center"
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-1">Cumulative Evaluation Score</h2>
          
          <div className="flex items-baseline justify-center gap-1.5 my-2">
            <motion.span 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl md:text-7xl font-extrabold text-white tracking-tight"
            >
              {averageScore.toFixed(1)}
            </motion.span>
            <span className="text-xl md:text-2xl text-slate-500 font-medium">/ 10</span>
          </div>

          <p className="text-slate-300 text-sm max-w-md mx-auto mt-2 leading-relaxed">
            {getGradeSubText(averageScore)}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Detailed Question breakdown */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-4.5 h-4.5 text-indigo-400" />
              Question Grading
            </h3>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const score = scores[index] !== undefined ? scores[index] : 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="border border-slate-800 bg-slate-950/40 glass-panel">
                      <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-xs font-mono text-indigo-400">0{index + 1}. QUESTION</span>
                          <Badge variant={getScoreBadgeVariant(score)} className="font-mono text-xs px-2 py-0.5">
                            {score} / 10
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-medium text-slate-200 mt-2 line-clamp-2 hover:line-clamp-none transition-all duration-300 cursor-pointer">
                          {question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 space-y-4">
                        {/* Animated progress bar fill */}
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden relative border border-slate-800/40">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(score / 10) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.3 + 0.1 * index, ease: "easeOut" }}
                              className={`h-full rounded-full ${getScoreColor(score)}`}
                            />
                          </div>
                        </div>

                        {/* Answer preview collapsible if provided */}
                        {answers && answers[index] && (
                          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-900 text-xs font-mono text-slate-400 max-h-24 overflow-y-auto leading-relaxed">
                            <div className="text-slate-500 uppercase tracking-widest text-[9px] mb-1 flex items-center gap-1 font-semibold">
                              <Terminal className="w-3 h-3" /> Candidate response:
                            </div>
                            {answers[index]}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AI Comprehensive Feedback Panel */}
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
                AI Analysis
              </h3>

              <Card className="border border-slate-800 bg-slate-950/40 shadow-xl glass-panel relative">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500" />
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-semibold text-white uppercase tracking-wider">Comprehensive Report</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {feedback}
                </CardContent>
              </Card>

              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-500 gap-2 h-11 text-sm font-semibold"
                onClick={() => navigate("/dashboard")}
              >
                Start New Practice
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
