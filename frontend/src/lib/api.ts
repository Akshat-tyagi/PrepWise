 const API_BASE_URL = 'http://localhost:5000/api';
 
 class ApiClient {
   private getToken(): string | null {
     return localStorage.getItem('token');
   }
 
   private getAuthHeaders(): HeadersInit {
     const token = this.getToken();
     const headers: HeadersInit = {};
     if (token) {
       headers['Authorization'] = `Bearer ${token}`;
     }
     return headers;
   }
 
   async post<T>(endpoint: string, data?: unknown, isFormData = false): Promise<T> {
     const headers: HeadersInit = {
       ...this.getAuthHeaders(),
     };
 
     if (!isFormData) {
       headers['Content-Type'] = 'application/json';
     }
 
     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
       method: 'POST',
       headers,
       body: isFormData ? (data as FormData) : JSON.stringify(data),
     });
 
     if (!response.ok) {
       const error = await response.json().catch(() => ({ message: 'Request failed' }));
       throw new Error(error.message || 'Request failed');
     }
 
     return response.json();
   }
 
   async get<T>(endpoint: string): Promise<T> {
     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
       method: 'GET',
       headers: {
         ...this.getAuthHeaders(),
         'Content-Type': 'application/json',
       },
     });
 
     if (!response.ok) {
       const error = await response.json().catch(() => ({ message: 'Request failed' }));
       throw new Error(error.message || 'Request failed');
     }
 
     return response.json();
   }
 }
 
 export const api = new ApiClient();
 
 // Auth API
 export interface AuthResponse {
   token: string;
 }
 
 export const authApi = {
   register: (data: { name: string; email: string; password: string }) =>
     api.post<AuthResponse>('/auth/register', data),
   
   login: (data: { email: string; password: string }) =>
     api.post<AuthResponse>('/auth/login', data),
 };
 
 // Resume API
 export interface ResumeUploadResponse {
   message: string;
   extractedSkills: string[];
   resumeId?: string;
 }
 
 export const resumeApi = {
   upload: (file: File) => {
     const formData = new FormData();
     formData.append('resume', file);
     return api.post<ResumeUploadResponse>('/resume/upload', formData, true);
   },
 };
 
 // Interview API
 export interface StartInterviewResponse {
   message: string;
   interviewId: string;
   questions: string[];
 }
 
 export interface SubmitAnswersResponse {
   message: string;
   scores: number[];
   feedback: string;
 }
 
 export interface InterviewHistoryItem {
   _id: string;
   questions: string[];
   answers?: string[];
   scores: number[];
   feedback: string;
   createdAt: string;
 }
 
 export const interviewApi = {
   start: (resumeId: string) =>
     api.post<StartInterviewResponse>('/interview/start', { resumeId }),
   
   submit: (interviewId: string, answers: string[]) =>
     api.post<SubmitAnswersResponse>('/interview/submit', { interviewId, answers }),
   
   getHistory: () =>
     api.get<InterviewHistoryItem[]>('/interview/history'),
 };