import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFT } from "@/types";

interface NFTCardProps {
  nft: NFT;
  showBuyButton?: boolean;
}

const NFTCard = ({ nft, showBuyButton = true }: NFTCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(nft.audioUrl));
  
  const toggleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      audio.addEventListener('ended', () => setIsPlaying(false));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  return (
    <Link to={`/nft/${nft.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square">
          <img 
            src={nft.imageUrl} 
            alt={nft.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" size="sm">
              <Music className="h-4 w-4 mr-2" />
              Play Preview
            </Button>
          </div>
          <Badge className="absolute top-3 left-3 bg-musicmoon/80 text-background" variant="secondary">
            {nft.category}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg truncate">{nft.title}</h3>
          {nft.creator && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img 
                  src={nft.creator.profileImage || "https://api.dicebear.com/7.x/shapes/svg?seed=" + nft.creator.id} 
                  alt={nft.creator.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-muted-foreground">{nft.creator.name}</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-semibold">{nft.price} SOL</p>
          </div>
          
          {showBuyButton && (
            <Button variant="outline" size="sm" className="hover:bg-musicmoon hover:text-background border-musicmoon text-musicmoon">
              Buy Now
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default NFTCard;
