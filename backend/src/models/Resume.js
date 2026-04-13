import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: String,
    rawText: String,
    extractedSkills: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
