import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Hero() {
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["confident", "prepared", "unstoppable", "impressive", "ready"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full min-h-[85vh] flex items-center" style={{ background: "var(--bg-primary)" }}>
      <div className="container mx-auto px-6">
        <div className="flex gap-8 py-20 items-center justify-center flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="secondary" size="sm" className="gap-2 rounded-full border border-slate-800">
              <Sparkles className="w-3 h-3 text-indigo-400" /> AI-Powered Interview Coaching
            </Button>
          </motion.div>
          
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-bold text-white leading-tight">
              Ace your next interview feeling
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 h-[1.3em]">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold text-gradient"
                    style={{ color: "var(--accent)" }}
                    initial={{ opacity: 0, y: 80 }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -80 : 80, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl text-center leading-relaxed mt-4">
              Upload your resume, get AI-generated questions tailored to your skills, and receive instant expert feedback. Practice smarter, not harder.
            </p>
          </div>
          
          <motion.div 
            className="flex flex-row gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-500" onClick={() => navigate("/register")}>
              Start Practicing <MoveRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
