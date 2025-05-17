import { useState } from 'react';
import { NFT, createNFT, getNFTById, getAllNFTs, getNFTsByCategory, updateNFT, transferNFT, getUserNFTs, getUserCreatedNFTs } from '@/services/nftService';
import { toast } from 'react-hot-toast';

export const useNFT = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintNFT = async (nftData: Omit<NFT, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const nft = await createNFT(nftData);
      toast.success('NFT created successfully!');
      return nft;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create NFT';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchNFT = async (nftId: string) => {
    setLoading(true);
    setError(null);
    try {
      const nft = await getNFTById(nftId);
      if (!nft) {
        throw new Error('NFT not found');
      }
      return nft;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch NFT';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllNFTs = async () => {
    setLoading(true);
    setError(null);
    try {
      return await getAllNFTs();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch NFTs';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchNFTsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getNFTsByCategory(category);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch NFTs by category';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNFTDetails = async (nftId: string, nftData: Partial<NFT>) => {
    setLoading(true);
    setError(null);
    try {
      await updateNFT(nftId, nftData);
      toast.success('NFT updated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update NFT';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferNFTOwnership = async (nftId: string, newOwnerId: string) => {
    setLoading(true);
    setError(null);
    try {
      await transferNFT(nftId, newOwnerId);
      toast.success('NFT transferred successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to transfer NFT';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNFTs = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getUserNFTs(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user NFTs';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCreatedNFTs = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getUserCreatedNFTs(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user created NFTs';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    mintNFT,
    fetchNFT,
    fetchAllNFTs,
    fetchNFTsByCategory,
    updateNFTDetails,
    transferNFTOwnership,
    fetchUserNFTs,
    fetchUserCreatedNFTs
  };
}; 