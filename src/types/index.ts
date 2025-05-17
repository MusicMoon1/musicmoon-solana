// User type representing a profile from Supabase
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  walletAddress?: string;
  profileImage?: string;
  coverImage?: string;
  createdAt: string;
}

// NFT type representing an NFT from Firebase
export interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  price: number;
  category: string;
  creatorId: string;
  creator?: User;
  ownerId: string;
  owner?: User;
  mintAddress?: string;
  createdAt: string;
}
