import Resume from "../models/Resume.js";
import Interview from "../models/Interview.js";
import fetch from "node-fetch";

export const startInterview = async (req, res) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const skills = resume.extractedSkills.join(", ");

    // Prompt for LLM
    const prompt = `
Generate exactly 5 technical interview questions.
Each question must be a short, direct, one-liner.
Do not include scenarios, long descriptions, or multi-sentence prompts.
Each question should be on a new line.
Skills: ${skills}
`;

    // OpenRouter + StepFun (FREE)
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.5-flash",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          reasoning: { enabled: true },
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid response from LLM");
    }

    const questionsText = data.choices[0].message.content;

    // Convert text → array
    const questions = questionsText
      .split("\n")
      .map(q => q.replace(/^\d+[\).\s]+/, "").trim())
      .filter(q => q.length > 10)
      .slice(0, 5);

    // Safety fallback
    if (questions.length < 3) {
      throw new Error("LLM did not generate enough questions");
    }

    const interview = await Interview.create({
      userId: req.user,
      resumeId,
      questions,
      answers: [],
      scores: [],
    });

    res.json({
      message: "Interview started",
      interviewId: interview._id,
      questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const submitAnswers = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.userId.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const prompt = `
You are an interview evaluator.

Questions:
${interview.questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Evaluate each answer on a scale of 0 to 10.
Then give overall feedback.
Return:
Scores: comma-separated
Feedback: short paragraph
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.5-flash",
          messages: [{ role: "user", content: prompt }],
          reasoning: { enabled: true },
        }),
      }
    );

    const data = await response.json();
    const output = data.choices[0].message.content;

    // Simple parsing
    const scoresMatch = output.match(/Scores:\s*(.*)/i);
    const feedbackMatch = output.match(/Feedback:\s*([\s\S]*)/i);

    const scores = scoresMatch
      ? scoresMatch[1].split(",").map(n => Number(n.trim()))
      : [];

    const feedback = feedbackMatch ? feedbackMatch[1].trim() : "";

    interview.answers = answers;
    interview.scores = scores;
    interview.feedback = feedback;
    await interview.save();

    res.json({
      message: "Interview evaluated",
      scores,
      feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
export const getInterviewHistory = async (req, res) => {
  const interviews = await Interview.find({ userId: req.user })
    .select("-answers") // optional
    .sort({ createdAt: -1 });

  res.json(interviews);
};


