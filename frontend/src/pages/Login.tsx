 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
 import { useAuth } from '@/contexts/AuthContext';
 import { authApi } from '@/lib/api';
 import { FileText, Loader2 } from 'lucide-react';
 
 export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { login } = useAuth();
   const navigate = useNavigate();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setIsLoading(true);
 
     try {
       const response = await authApi.login({ email, password });
       login(response.token);
       navigate('/dashboard');
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Login failed');
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <div className="auth-container">
       <Card className="w-full max-w-md animate-slide-up">
         <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
             <div className="flex items-center gap-2">
               <FileText className="h-8 w-8 text-primary" />
               <span className="text-2xl font-bold text-foreground">PrepWise</span>
             </div>
           </div>
           <CardTitle className="text-xl">Welcome back</CardTitle>
           <CardDescription>Sign in to continue your interview preparation</CardDescription>
         </CardHeader>
         <form onSubmit={handleSubmit}>
           <CardContent className="space-y-4">
             {error && (
               <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                 {error}
               </div>
             )}
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="you@example.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <Input
                 id="password"
                 type="password"
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
           </CardContent>
           <CardFooter className="flex flex-col gap-4">
             <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Sign In
             </Button>
             <p className="text-sm text-muted-foreground text-center">
               Don't have an account?{' '}
               <Link to="/register" className="text-primary hover:underline">
                 Sign up
               </Link>
             </p>
           </CardFooter>
         </form>
       </Card>
     </div>
   );
 }