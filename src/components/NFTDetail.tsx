import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNFT } from '@/hooks/useNFT';
import { NFT } from '@/services/nftService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export const NFTDetail = () => {
  const { nftId } = useParams<{ nftId: string }>();
  const { fetchNFT, loading, error } = useNFT();
  const { user } = useAuth();
  const [nft, setNft] = useState<NFT | null>(null);

  useEffect(() => {
    const loadNFT = async () => {
      if (nftId) {
        try {
          const nftData = await fetchNFT(nftId);
          setNft(nftData);
        } catch (err) {
          console.error('Failed to load NFT:', err);
        }
      }
    };

    loadNFT();
  }, [nftId, fetchNFT]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[400px] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">{error || 'NFT not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden">
          <img
            src={nft.imageUrl}
            alt={nft.title}
            className="w-full h-[400px] object-cover"
          />
          {nft.audioUrl && (
            <div className="p-4">
              <audio controls className="w-full">
                <source src={nft.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{nft.title}</h1>
            <p className="text-gray-600 mt-2">{nft.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={nft.creator.avatarUrl} />
              <AvatarFallback>{nft.creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Created by {nft.creator.name}</p>
              <p className="text-sm text-gray-500">{nft.creator.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{nft.category}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-bold">${nft.price}</p>
          </div>

          {user && user.id !== nft.ownerId && (
            <Button className="w-full">Purchase NFT</Button>
          )}

          {user && user.id === nft.ownerId && (
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Edit NFT
              </Button>
              <Button variant="destructive" className="w-full">
                Delete NFT
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 