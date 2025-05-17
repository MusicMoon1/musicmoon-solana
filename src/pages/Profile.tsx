import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import NFTCard from "@/components/ui/NFTCard";
import { 
  Edit, 
  Upload, 
  User,
  Plus,
  Twitter,
  Instagram,
  Globe,
  Loader
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NFT } from "@/types";
import { useNFT } from '@/hooks/useNFT';
import { uploadFile } from "@/services/storageService";

const Profile = () => {
  const { toast } = useToast();
  const { user, isLoading, updateProfile } = useAuth();
  const { fetchUserNFTs, fetchUserCreatedNFTs, loading: isLoadingNfts } = useNFT();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    bio: "",
    walletAddress: "",
    profileImage: user?.profileImage || '',
    coverImage: user?.coverImage || 'https://api.dicebear.com/7.x/shapes/svg?seed=JosepGarces@gmail.com',
    twitterHandle: "",
    instagramHandle: "",
    website: ""
  });
  const [nfts, setNfts] = useState<NFT[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      navigate('/login');
    } else if (user) {
      // Set initial profile data
      setUserProfile(prevState => ({
        ...prevState,
        name: user.name,
        walletAddress: user.walletAddress || "",
        profileImage: user.profileImage || prevState.profileImage,
        coverImage: user.coverImage || prevState.coverImage,
      }));
      
      // Fetch user's NFTs
      fetchUserNfts();
    }
  }, [user, isLoading, navigate]);
  
  const fetchUserNfts = async () => {
    if (!user) {
      console.error("No user found when trying to fetch NFTs");
      return;
    }
    
    console.log("Fetching NFTs for user:", user.id);
    
    try {
      // Use the hook functions instead of direct service calls
      console.log("Fetching owned NFTs...");
      const userOwnedNfts = await fetchUserNFTs(user.id);
      console.log("Owned NFTs:", userOwnedNfts);
      
      console.log("Fetching created NFTs...");
      const userCreatedNfts = await fetchUserCreatedNFTs(user.id);
      console.log("Created NFTs:", userCreatedNfts);
      
      // Combine both lists, removing duplicates
      const allUserNfts = [...userOwnedNfts];
      
      // Add created NFTs that aren't already in the owned list
      userCreatedNfts.forEach(createdNft => {
        if (!allUserNfts.some(nft => nft.id === createdNft.id)) {
          allUserNfts.push(createdNft);
        }
      });
      
      console.log("Combined NFTs:", allUserNfts);
      setNfts(allUserNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast({
        title: "Error",
        description: "Failed to load your NFTs. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      await updateProfile({
        name: userProfile.name,
        profileImage: userProfile.profileImage,
        coverImage: userProfile.coverImage,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  
  const handleFileChange = async (type: 'profile' | 'cover', e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    
    try {
      // Use the uploadFile service to handle the upload
      const imageUrl = await uploadFile(file, 'user-images');
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
      
      // Update the userProfile state with the new image URL
      if (type === 'profile') {
        setUserProfile({...userProfile, profileImage: imageUrl});
      } else {
        setUserProfile({...userProfile, coverImage: imageUrl});
      }
      
      toast({
        title: `${type === 'profile' ? 'Profile' : 'Cover'} image updated`,
        description: "Your image has been successfully uploaded.",
      });
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast({
        title: "Upload failed",
        description: `Failed to upload ${type} image. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Cover Image */}
        <div className="relative h-60 md:h-80 overflow-hidden">
          <img 
            src={userProfile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          
          {isEditing && (
            <div className="absolute bottom-4 right-4">
              <label htmlFor="cover-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-md px-3 py-2 text-sm">
                  <Upload className="h-4 w-4" />
                  <span>Change Cover</span>
                </div>
                <input 
                  id="cover-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange('cover', e)}
                />
              </label>
            </div>
          )}
        </div>
        
        <div className="container px-4">
          {/* Profile Section */}
          <div className="relative flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 mb-8">
            {/* Profile Image */}
            <div className="relative z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background">
                <img 
                  src={userProfile.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {isEditing && (
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 cursor-pointer">
                  <div className="bg-primary rounded-full p-2">
                    <Edit className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <input 
                    id="profile-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange('profile', e)}
                  />
                </label>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 pt-2">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                  {isEditing ? (
                    <div className="mb-4">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        className="max-w-md"
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{userProfile.name}</h1>
                  )}
                  
                  {userProfile.walletAddress && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <User className="h-4 w-4" />
                      <span>
                        {userProfile.walletAddress.slice(0, 6)}...{userProfile.walletAddress.slice(-6)}
                      </span>
                    </div>
                  )}
                  
                  {isEditing ? (
                    <div className="mb-4">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={userProfile.bio}
                        onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                        className="max-w-md"
                        placeholder="Tell others about yourself..."
                      />
                    </div>
                  ) : (
                    userProfile.bio ? (
                      <p className="text-muted-foreground max-w-2xl">{userProfile.bio}</p>
                    ) : (
                      <p className="text-muted-foreground max-w-2xl italic">No bio available</p>
                    )
                  )}
                </div>
                
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} className="bg-musicmoon hover:bg-musicmoon/90 text-primary-foreground">
                        Save Profile
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Social Links */}
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-2xl">
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="flex items-center">
                      <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input h-10">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        id="twitter" 
                        value={userProfile.twitterHandle}
                        onChange={(e) => setUserProfile({...userProfile, twitterHandle: e.target.value})}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="flex items-center">
                      <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input h-10">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        id="instagram" 
                        value={userProfile.instagramHandle}
                        onChange={(e) => setUserProfile({...userProfile, instagramHandle: e.target.value})}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <div className="flex items-center">
                      <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input h-10">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        id="website" 
                        value={userProfile.website}
                        onChange={(e) => setUserProfile({...userProfile, website: e.target.value})}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 mt-4">
                  {userProfile.twitterHandle && (
                    <a href={`https://twitter.com/${userProfile.twitterHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {userProfile.instagramHandle && (
                    <a href={`https://instagram.com/${userProfile.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {userProfile.website && (
                    <a href={`https://${userProfile.website}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* NFT Gallery */}
          <div className="pb-16">
            <Tabs defaultValue="owned" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="owned">Owned NFTs</TabsTrigger>
                  <TabsTrigger value="created">Created NFTs</TabsTrigger>
                </TabsList>
                
                <Button className="flex items-center gap-2 bg-musicmoon hover:bg-musicmoon/90 text-primary-foreground" asChild>
                  <a href="/mint">
                    <Plus className="h-4 w-4" />
                    <span>Create NFT</span>
                  </a>
                </Button>
              </div>
              
              <TabsContent value="owned" className="mt-0">
                {isLoadingNfts ? (
                  <div className="flex justify-center py-16">
                    <Loader className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : nfts.filter(nft => nft.ownerId === user.id).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts
                      .filter(nft => nft.ownerId === user.id)
                      .map(nft => (
                        <NFTCard key={nft.id} nft={nft} showBuyButton={false} />
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <p>You don't own any NFTs yet.</p>
                    <p className="mt-2">Explore the marketplace to find unique music NFTs.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="created" className="mt-0">
                {isLoadingNfts ? (
                  <div className="flex justify-center py-16">
                    <Loader className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : nfts.filter(nft => nft.creatorId === user.id).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts
                      .filter(nft => nft.creatorId === user.id)
                      .map(nft => (
                        <NFTCard key={nft.id} nft={nft} showBuyButton={false} />
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <p>You haven't created any NFTs yet.</p>
                    <Button 
                      className="mt-4 bg-musicmoon hover:bg-musicmoon/90 text-primary-foreground"
                      asChild
                    >
                      <a href="/mint">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First NFT
                      </a>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
