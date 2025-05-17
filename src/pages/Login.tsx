
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { Music } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container max-w-5xl px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="mb-6 flex justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Music className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-gradient">MusicMoon</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Welcome back</h1>
              <p className="text-muted-foreground mb-6">
                Log in to your account to access your NFTs, manage your profile, and continue your music journey.
              </p>
              
              <div className="hidden md:block">
                <h3 className="font-medium mb-3">Why join MusicMoon?</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    "Create and manage your music NFTs on Solana",
                    "Connect directly with your audience",
                    "Earn royalties on secondary sales",
                    "Join a community of music creators and collectors"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-center">Login to your account</h2>
              <AuthForm type="login" />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
