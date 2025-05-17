import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MusicPlayer from "@/components/ui/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Tag, 
  Music,
  ShoppingBag,
  Share2,
  FileText,
  Loader
} from "lucide-react";
import { NFT } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import ConnectWalletButton from "@/components/ui/ConnectWalletButton";
import { useNFT } from "@/hooks/useNFT";
import { useAuth } from "@/contexts/AuthContext";

const NFTDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchNFT } = useNFT();
  const { user } = useAuth();
  const [nft, setNft] = useState<NFT | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const loadNFT = async () => {
      try {
        if (id) {
          const fetchedNFT = await fetchNFT(id);
          if (isMounted) setNft(fetchedNFT);
        }
      } catch (error) {
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load NFT details. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadNFT();
    return () => { isMounted = false; };
  }, [id]);
  
  const handlePurchase = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to make a purchase.",
      });
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Purchase Successful!",
        description: `You are now the proud owner of "${nft?.title}"`,
      });
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "NFT link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg">Loading NFT details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!nft) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">NFT Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The NFT you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* NFT Image and Audio Player */}
            <div>
              <div className="rounded-lg overflow-hidden shadow-lg mb-6">
                <img 
                  src={nft.imageUrl} 
                  alt={nft.title} 
                  className="w-full h-auto"
                />
              </div>
              
              <MusicPlayer audioUrl={nft.audioUrl} />
            </div>
            
            {/* NFT Details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{nft.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={nft.creator?.profileImage} alt={nft.creator?.name} />
                    <AvatarFallback>{nft.creator?.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Creator</p>
                    <p className="font-medium">{nft.creator?.name || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="h-10 border-l border-border mx-2"></div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{nft.category}</p>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-3xl font-bold">{nft.price} SOL</p>
                    <p className="text-sm text-muted-foreground">≈ ${(nft.price * 100).toFixed(2)} USD</p>
                  </div>
                  
                  <div className="space-y-3">
                    {walletConnected ? (
                      <Button 
                        className="w-full sm:w-auto flex items-center gap-2"
                        onClick={handlePurchase}
                        disabled={isPurchasing}
                      >
                        {isPurchasing ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" />
                            Buy Now
                          </>
                        )}
                      </Button>
                    ) : (
                      <ConnectWalletButton />
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted rounded-md p-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Token ID</p>
                      <p className="truncate w-20">{nft.mintAddress?.slice(0, 8)}...</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-md p-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Minted</p>
                      <p>{new Date(nft.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-md p-3 flex items-center gap-2">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Audio</p>
                      <p>MP3 320kbps</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-md p-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Chain</p>
                      <p>Solana</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="description">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-4">
                  <p className="text-muted-foreground">{nft.description}</p>
                </TabsContent>
                <TabsContent value="details" className="py-4">
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">Owner</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={nft.owner?.profileImage} alt={nft.owner?.name} />
                          <AvatarFallback>{nft.owner?.name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <span>{nft.owner?.name || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Token Address</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {nft.mintAddress || 'Not minted yet'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Token Standard</p>
                      <p className="text-sm text-muted-foreground">
                        Solana SPL NFT
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">File Properties</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Audio Format</p>
                          <p>MP3</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quality</p>
                          <p>320kbps</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p>{new Date(nft.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">License</p>
                          <p>Standard NFT License</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NFTDetail;
