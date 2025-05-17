
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthFormProps {
  type: 'login' | 'signup';
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const formSchema = type === 'login' ? loginSchema : signupSchema;
  const form = useForm<LoginForm | SignupForm>({
    resolver: zodResolver(formSchema),
    defaultValues: type === 'login' 
      ? { email: "", password: "" } 
      : { name: "", email: "", password: "", phone: "" },
  });
  
  const onSubmit = async (data: LoginForm | SignupForm) => {
    setIsLoading(true);
    
    try {
      if (type === 'login') {
        const loginData = data as LoginForm;
        await signIn(loginData.email, loginData.password);
        navigate('/profile');
      } else {
        const signupData = data as SignupForm;
        await signUp(signupData.email, signupData.password, signupData.name, signupData.phone);
        // Auto login after signup
        await signIn(signupData.email, signupData.password);
        navigate('/profile');
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Error toasts are handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {type === 'signup' && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {type === 'signup' && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="loader inline-block h-4 w-4 border-2 border-current border-b-transparent"></span>
            ) : type === 'login' ? 'Login' : 'Create account'}
          </Button>
          
          <div className="flex items-center gap-4 py-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          
          <Button type="button" variant="outline" className="w-full flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>Continue with Wallet</span>
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            {type === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
