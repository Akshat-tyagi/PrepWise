import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { startInterview,submitAnswers,getInterviewHistory } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", protect, startInterview);

router.post("/submit", protect, submitAnswers);

router.get("/history", protect, getInterviewHistory);

export default router;
