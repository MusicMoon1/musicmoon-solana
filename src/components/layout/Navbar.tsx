
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Search, LogOut } from "lucide-react";
import ConnectWalletButton from '../ui/ConnectWalletButton';
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, signOut } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/896a2a86-ba84-4f23-9d13-62f101838d70.png" 
            alt="MusicMoon Logo" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/marketplace" className="px-4 py-2 text-sm text-foreground/80 hover:text-musicmoon transition-colors">
            Marketplace
          </Link>
          {user && (
            <Link to="/mint" className="px-4 py-2 text-sm text-foreground/80 hover:text-musicmoon transition-colors">
              Mint NFT
            </Link>
          )}
          <Link to="#" className="px-4 py-2 text-sm text-foreground/80 hover:text-musicmoon transition-colors">
            About
          </Link>
        </nav>

        {/* Search & Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>

          {user ? (
            <>
              <ConnectWalletButton />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2 text-destructive"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex justify-center py-6">
                <Link to="/" className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/896a2a86-ba84-4f23-9d13-62f101838d70.png" 
                    alt="MusicMoon Logo" 
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link to="/marketplace" className="px-4 py-2 text-foreground/80 hover:text-musicmoon transition-colors">
                  Marketplace
                </Link>
                {user && (
                  <Link to="/mint" className="px-4 py-2 text-foreground/80 hover:text-musicmoon transition-colors">
                    Mint NFT
                  </Link>
                )}
                <Link to="#" className="px-4 py-2 text-foreground/80 hover:text-musicmoon transition-colors">
                  About
                </Link>
              </div>
              
              <div className="mt-auto flex flex-col gap-2 py-4">
                {user ? (
                  <>
                    <ConnectWalletButton />
                    <Link to="/profile">
                      <Button className="w-full" variant="outline">
                        <User className="h-4 w-4 mr-2" /> Profile
                      </Button>
                    </Link>
                    <Button 
                      className="w-full flex items-center gap-2" 
                      variant="destructive"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button className="w-full" variant="outline">Login</Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
