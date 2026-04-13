import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    questions: [String],
    answers: [String],
    scores: [Number],
    feedback: String,
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
