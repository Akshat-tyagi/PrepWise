import Resume from "../models/Resume.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const data = await pdfParse(file.buffer);
    const text = data.text || "";

    if (!text.trim()) {
      return res.status(400).json({
        message: "Unable to extract text from PDF",
      });
    }

    const skillRegex =
      /(javascript|react|node|python|java|mongodb|express|html|css|jwt|rest)/gi;

    const matchedSkills = text.match(skillRegex) || [];

    const uniqueSkills = [
      ...new Set(matchedSkills.map((s) => s.toLowerCase())),
    ];

    const resume = await Resume.create({
      userId: req.user,
      fileName: file.originalname,
      rawText: text,
      extractedSkills: uniqueSkills,
    });

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeId: resume._id,
      extractedSkills: resume.extractedSkills,
    });
  } catch (err) {
    console.error("Resume Upload Error:", err);
    res.status(500).json({
      message: "Failed to parse resume",
    });
  }
};
