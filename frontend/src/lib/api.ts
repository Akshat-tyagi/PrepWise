const BASE_URL = "https://prepwise-unhh.onrender.com";

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "An unexpected error occurred");
  }
  return data;
};

export const register = async (payload: any) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const login = async (payload: any) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const uploadResume = async (formData: FormData) => {
  const response = await fetch(`${BASE_URL}/api/resume/upload`, {
    method: "POST",
    headers: getHeaders(true),
    body: formData,
  });
  return handleResponse(response);
};

export const startInterview = async (resumeId: string) => {
  const response = await fetch(`${BASE_URL}/api/interview/start`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ resumeId }),
  });
  return handleResponse(response);
};

export const submitInterview = async (interviewId: string, answers: string[]) => {
  const response = await fetch(`${BASE_URL}/api/interview/submit`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ interviewId, answers }),
  });
  return handleResponse(response);
};

export interface InterviewHistoryItem {
  _id: string;
  questions: string[];
  scores: number[];
  feedback: string;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  resumeId?: string;
}

export const getHistory = async (): Promise<InterviewHistoryItem[]> => {
  const response = await fetch(`${BASE_URL}/api/interview/history`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(response);
};

