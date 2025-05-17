import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ConnectWalletButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user, connectWallet } = useAuth();
  const navigate = useNavigate();
  const { publicKey, disconnect } = useWallet();
  
  const handleConnectWallet = async () => {
    // If user is not logged in, redirect to login page
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your wallet",
      });
      navigate("/login");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      if (publicKey) {
        await connectWallet(publicKey.toBase58());
      }
    } catch (error) {
      console.error("Failed to connect wallet", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to your wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      await connectWallet("");
    } catch (error) {
      console.error("Failed to disconnect wallet", error);
    }
  };
  
  if (user?.walletAddress) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-musicmoon text-musicmoon hover:bg-musicmoon/10"
              onClick={handleDisconnectWallet}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">
                {`${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to disconnect</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <WalletMultiButton className="flex items-center gap-2 border-musicmoon text-musicmoon hover:bg-musicmoon/10" />
  );
};

export default ConnectWalletButton;
