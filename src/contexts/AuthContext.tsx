import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { createUser, getUserByEmail, updateUser } from '@/services/userService';

const USER_STORAGE_KEY = 'musicmoon_user';

function saveUserToStorage(user: User) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function getUserFromStorage(): User | null {
  const data = localStorage.getItem(USER_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function removeUserFromStorage() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  connectWallet: (walletAddress: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const now = new Date().toISOString();
      const newUser = await createUser({
        email,
        name,
        phone,
        profileImage: `https://api.dicebear.com/7.x/shapes/svg?seed=${email}`,
        createdAt: now,
        updatedAt: now
      });
      setUser(newUser);
      saveUserToStorage(newUser);
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      setUser(user);
      saveUserToStorage(user);
      toast({
        title: "Login successful",
        description: "Welcome back to MusicMoon!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      removeUserFromStorage();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (walletAddress: string) => {
    if (!user) return;
    try {
      await updateUser(user.id, { walletAddress });
      const updatedUser = { ...user, walletAddress };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    try {
      await updateUser(user.id, userData);
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signUp,
      signIn,
      signOut,
      connectWallet,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
