
import { v4 as uuidv4 } from 'uuid';
import { NFT } from '@/types';

// Mock user data
const mockUser = {
  id: "user-123",
  name: "Demo User",
  email: "demo@example.com",
  profileImage: "https://api.dicebear.com/7.x/shapes/svg?seed=1",
  createdAt: new Date().toISOString()
};

// Mock NFT data
const mockNFTs: NFT[] = [
  {
    id: "nft-1",
    title: "Cosmic Journey",
    description: "A trip through the galaxy with ambient electronic sounds.",
    imageUrl: "https://picsum.photos/id/1019/800/800",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    price: 1.5,
    category: "Electronic",
    creatorId: mockUser.id,
    creator: mockUser,
    ownerId: mockUser.id,
    owner: mockUser,
    mintAddress: "7dD3MkVhKChenBB34n5QpWYjzQ23v3D2qX3exAcXwd6h",
    createdAt: new Date().toISOString()
  },
  {
    id: "nft-2",
    title: "Summer Breeze",
    description: "Chill lofi beats perfect for relaxation and focus.",
    imageUrl: "https://picsum.photos/id/1039/800/800",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    price: 0.8,
    category: "Lo-Fi",
    creatorId: mockUser.id,
    creator: mockUser,
    ownerId: mockUser.id,
    owner: mockUser,
    mintAddress: "9eF5MkVhKChenBB34n5QpWYjzQ23v3D2qX3exAcXwd8j",
    createdAt: new Date().toISOString()
  }
];

// Mock functions for NFT operations
export const getNFT = async (id: string): Promise<NFT | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const nft = mockNFTs.find(nft => nft.id === id);
  return nft || null;
};

export const getAllNFTs = async (): Promise<NFT[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...mockNFTs];
};

export const getUserNFTs = async (userId: string): Promise<NFT[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockNFTs.filter(nft => nft.ownerId === userId);
};

export const getUserCreatedNFTs = async (userId: string): Promise<NFT[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockNFTs.filter(nft => nft.creatorId === userId);
};

export const createNFT = async (
  title: string, 
  description: string, 
  price: number,
  category: string,
  imageUrl: string,
  audioUrl: string,
  creatorId: string
): Promise<NFT | null> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newNFT: NFT = {
    id: uuidv4(),
    title,
    description,
    imageUrl,
    audioUrl,
    price,
    category,
    creatorId,
    creator: { ...mockUser, id: creatorId },
    ownerId: creatorId,
    owner: { ...mockUser, id: creatorId },
    mintAddress: `mint_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
    createdAt: new Date().toISOString()
  };
  
  mockNFTs.push(newNFT);
  return newNFT;
};
