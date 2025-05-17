import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { User } from '@/types';
import { getUserById } from './userService';

const nftsCollection = 'nfts';

export interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  price: number;
  category: string;
  creatorId: string;
  ownerId: string;
  mintAddress?: string;
  createdAt: string;
  creator?: User;
  owner?: User;
}

export const createNFT = async (nftData: Omit<NFT, 'id' | 'createdAt'>): Promise<NFT> => {
  try {
    const nftRef = doc(collection(db, nftsCollection));
    const newNFT: NFT = {
      id: nftRef.id,
      ...nftData,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(nftRef, newNFT);
    return newNFT;
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
};

export const getNFTById = async (nftId: string): Promise<NFT | null> => {
  try {
    const nftRef = doc(db, nftsCollection, nftId);
    const nftSnap = await getDoc(nftRef);
    
    if (nftSnap.exists()) {
      const nft = nftSnap.data() as NFT;
      // Fetch creator and owner details
      const [creator, owner] = await Promise.all([
        getUserById(nft.creatorId),
        getUserById(nft.ownerId)
      ]);
      return {
        ...nft,
        creator,
        owner
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching NFT:', error);
    throw error;
  }
};

export const getAllNFTs = async (): Promise<NFT[]> => {
  try {
    const q = query(collection(db, nftsCollection), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NFT));
    
    // Fetch creator and owner details for each NFT
    const nftsWithDetails = await Promise.all(
      nfts.map(async (nft) => {
        const [creator, owner] = await Promise.all([
          getUserById(nft.creatorId),
          getUserById(nft.ownerId)
        ]);
        return {
          ...nft,
          creator,
          owner
        };
      })
    );
    
    return nftsWithDetails;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};

export const getNFTsByCategory = async (category: string): Promise<NFT[]> => {
  try {
    const q = query(
      collection(db, nftsCollection),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NFT));
    
    // Fetch creator and owner details for each NFT
    const nftsWithDetails = await Promise.all(
      nfts.map(async (nft) => {
        const [creator, owner] = await Promise.all([
          getUserById(nft.creatorId),
          getUserById(nft.ownerId)
        ]);
        return {
          ...nft,
          creator,
          owner
        };
      })
    );
    
    return nftsWithDetails;
  } catch (error) {
    console.error('Error fetching NFTs by category:', error);
    throw error;
  }
};

export const updateNFT = async (nftId: string, nftData: Partial<NFT>): Promise<void> => {
  try {
    const nftRef = doc(db, nftsCollection, nftId);
    await updateDoc(nftRef, nftData);
  } catch (error) {
    console.error('Error updating NFT:', error);
    throw error;
  }
};

export const transferNFT = async (nftId: string, newOwnerId: string): Promise<void> => {
  try {
    const nftRef = doc(db, nftsCollection, nftId);
    await updateDoc(nftRef, { ownerId: newOwnerId });
  } catch (error) {
    console.error('Error transferring NFT:', error);
    throw error;
  }
};

export const getUserNFTs = async (userId: string): Promise<NFT[]> => {
  try {
    console.log("Fetching NFTs for owner:", userId);
    // First try with the compound query
    try {
      const q = query(
        collection(db, nftsCollection),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      console.log("Found owned NFTs:", querySnapshot.size);
      
      const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NFT));
      console.log("Mapped owned NFTs:", nfts);
      
      // Fetch creator and owner details for each NFT
      const nftsWithDetails = await Promise.all(
        nfts.map(async (nft) => {
          console.log("Fetching details for NFT:", nft.id);
          const [creator, owner] = await Promise.all([
            getUserById(nft.creatorId),
            getUserById(nft.ownerId)
          ]);
          console.log("Creator:", creator, "Owner:", owner);
          return {
            ...nft,
            creator,
            owner
          };
        })
      );
      
      console.log("Returning owned NFTs with details:", nftsWithDetails);
      return nftsWithDetails;
    } catch (error) {
      // If the compound query fails, fall back to a simple query
      console.log("Compound query failed, falling back to simple query");
      const q = query(
        collection(db, nftsCollection),
        where('ownerId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NFT));
      
      // Sort the results in memory
      nfts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const nftsWithDetails = await Promise.all(
        nfts.map(async (nft) => {
          const [creator, owner] = await Promise.all([
            getUserById(nft.creatorId),
            getUserById(nft.ownerId)
          ]);
          return {
            ...nft,
            creator,
            owner
          };
        })
      );
      
      return nftsWithDetails;
    }
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    throw error;
  }
};

export const getUserCreatedNFTs = async (userId: string): Promise<NFT[]> => {
  try {
    console.log("Fetching NFTs created by:", userId);
    // First try with the compound query
    try {
      const q = query(
        collection(db, nftsCollection),
        where('creatorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      console.log("Found created NFTs:", querySnapshot.size);
      
      const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NFT));
      console.log("Mapped created NFTs:", nfts);
      
      // Fetch creator and owner details for each NFT
      const nftsWithDetails = await Promise.all(
        nfts.map(async (nft) => {
          console.log("Fetching details for NFT:", nft.id);
          const [creator, owner] = await Promise.all([
            getUserById(nft.creatorId),
            getUserById(nft.ownerId)
          ]);
          console.log("Creator:", creator, "Owner:", owner);
          return {
            ...nft,
            creator,
            owner
          };
        })
      );
      
      console.log("Returning created NFTs with details:", nftsWithDetails);
      return nftsWithDetails;
    } catch (error) {
      // If the compound query fails, fall back to a simple query
      console.log("Compound query failed, falling back to simple query");
      const q = query(
        collection(db, nftsCollection),
        where('creatorId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NFT));
      
      // Sort the results in memory
      nfts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const nftsWithDetails = await Promise.all(
        nfts.map(async (nft) => {
          const [creator, owner] = await Promise.all([
            getUserById(nft.creatorId),
            getUserById(nft.ownerId)
          ]);
          return {
            ...nft,
            creator,
            owner
          };
        })
      );
      
      return nftsWithDetails;
    }
  } catch (error) {
    console.error('Error fetching user created NFTs:', error);
    throw error;
  }
};
