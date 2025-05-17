import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNFT } from '@/hooks/useNFT';
import { NFT } from '@/services/nftService';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NFTGridProps {
  category?: string;
  userId?: string;
  showCreated?: boolean;
}

export const NFTGrid = ({ category, userId, showCreated }: NFTGridProps) => {
  const {
    fetchAllNFTs,
    fetchNFTsByCategory,
    fetchUserNFTs,
    fetchUserCreatedNFTs,
    loading,
    error
  } = useNFT();
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        let nftData: NFT[];
        if (userId) {
          nftData = showCreated
            ? await fetchUserCreatedNFTs(userId)
            : await fetchUserNFTs(userId);
        } else if (category) {
          nftData = await fetchNFTsByCategory(category);
        } else {
          nftData = await fetchAllNFTs();
        }
        setNfts(nftData);
      } catch (err) {
        console.error('Failed to load NFTs:', err);
      }
    };

    loadNFTs();
  }, [category, userId, showCreated, fetchAllNFTs, fetchNFTsByCategory, fetchUserNFTs, fetchUserCreatedNFTs]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">No NFTs Found</h2>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <Link key={nft.id} to={`/nft/${nft.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={nft.imageUrl}
              alt={nft.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold truncate">{nft.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                by {nft.creator.name}
              </p>
              <p className="text-lg font-bold mt-2">${nft.price}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}; 